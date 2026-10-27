<?php

namespace App\Http\Controllers\Vendor;

use App\Actions\Orders\ChangeOrderStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\ChangeOrderStatusRequest;
use App\Models\Order;
use App\Models\OrderMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::enum(OrderStatus::class)],
            'q' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $orders = Order::query()
            ->where('vendor_profile_id', $request->user()->vendorProfile->id)
            ->with(['customer:id,name', 'service:id,name'])
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['q'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search): void {
                $query->where('order_number', 'like', '%'.$search.'%')
                    ->orWhere('contact_name', 'like', '%'.$search.'%');
            }))
            ->when($filters['event_date'] ?? null, fn ($query, $date) => $query->whereDate('event_date', $date))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('vendor/orders/index', [
            'orders' => $orders,
            'filters' => $filters,
            'statuses' => array_map(
                fn (OrderStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
                OrderStatus::cases(),
            ),
        ]);
    }

    public function show(Order $order): Response
    {
        Gate::authorize('view', $order);
        $order->load(['customer:id,name', 'vendorProfile:id,business_name', 'statusHistories.changedBy:id,name']);

        $dateConflict = Order::query()
            ->where('vendor_profile_id', $order->vendor_profile_id)
            ->whereDate('event_date', $order->event_date)
            ->whereIn('status', [OrderStatus::Confirmed, OrderStatus::InProgress])
            ->where('id', '!=', $order->id)
            ->exists();

        $initialMessages = $order->messages()
            ->with('sender:id,name')
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->reverse()
            ->values()
            ->map(fn (OrderMessage $message): array => [
                'id' => $message->id,
                'body' => $message->body,
                'created_at' => $message->created_at->toIso8601String(),
                'sender_id' => $message->sender_id,
                'sender_name' => $message->sender->name,
            ]);

        $order->makeHidden(['id', 'idempotency_key', 'customer_id', 'vendor_profile_id', 'service_id', 'package_id']);
        if ($order->payment_status !== 'paid') {
            $order->makeHidden('contact_phone');
        }
        $order->vendorProfile->makeHidden(['id', 'whatsapp_number']);
        $order->statusHistories->each(fn ($history) => $history->makeHidden(['order_id', 'changed_by']));

        return Inertia::render('vendor/orders/show', [
            'order' => $order,
            'dateConflict' => $dateConflict,
            'initialMessages' => $initialMessages,
            'currentUserId' => auth()->id(),
            'canSendMessages' => ! in_array($order->status, [
                OrderStatus::Completed,
                OrderStatus::Rejected,
                OrderStatus::Cancelled,
            ], true),
            'statuses' => array_map(
                fn (OrderStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
                OrderStatus::cases(),
            ),
        ]);
    }

    public function changeStatus(
        ChangeOrderStatusRequest $request,
        Order $order,
        ChangeOrderStatus $changeOrderStatus,
    ): RedirectResponse {
        $data = $request->validated();
        $changeOrderStatus->handle(
            $order,
            $request->user(),
            OrderStatus::from($data['status']),
            $data,
        );

        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}
