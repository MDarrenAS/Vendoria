<?php

namespace App\Http\Controllers\Customer;

use App\Actions\Orders\ChangeOrderStatus;
use App\Actions\Orders\ConfirmOrderPayment;
use App\Actions\Orders\CreateOrder;
use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\Customer\CancelOrderRequest;
use App\Http\Requests\Customer\ConfirmOrderPaymentRequest;
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
            'q' => ['nullable', 'string', 'max:24'],
        ]);

        $orders = Order::query()
            ->whereBelongsTo($request->user(), 'customer')
            ->with('vendorProfile:id,business_name')
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['q'] ?? null, fn ($query, $number) => $query->where('order_number', 'like', '%'.$number.'%'))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $orders->getCollection()->each(function (Order $order): void {
            $order->makeHidden(['id', 'idempotency_key', 'customer_id', 'vendor_profile_id', 'service_id', 'package_id']);
            $order->vendorProfile?->makeHidden('id');
        });

        return Inertia::render('customer/orders', [
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
        $order->load([
            'vendorProfile:id,business_name,slug,city',
            'statusHistories.changedBy:id,name',
            'review:id,order_id,rating,comment,created_at',
        ]);

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

        $order->makeHidden(['id', 'customer_id', 'vendor_profile_id', 'service_id', 'package_id']);
        $order->vendorProfile->makeHidden(['id', 'user_id', 'whatsapp_number', 'logo_path', 'cover_path']);
        $order->statusHistories->each(fn ($history) => $history->makeHidden(['order_id', 'changed_by']));
        $order->review?->makeHidden(['order_id', 'customer_id', 'vendor_profile_id', 'service_id']);

        return Inertia::render('customer/order-show', [
            'order' => $order,
            'initialMessages' => $initialMessages,
            'currentUserId' => auth()->id(),
            'canSendMessages' => ! in_array($order->status, [
                OrderStatus::Completed,
                OrderStatus::Rejected,
                OrderStatus::Cancelled,
            ], true),
        ]);
    }

    public function cancel(CancelOrderRequest $request, Order $order, ChangeOrderStatus $changeOrderStatus): RedirectResponse
    {
        $changeOrderStatus->handle(
            $order,
            $request->user(),
            OrderStatus::Cancelled,
            $request->validated(),
        );

        return back()->with('success', 'Pesanan berhasil dibatalkan.');
    }

    public function confirmPayment(
        ConfirmOrderPaymentRequest $request,
        Order $order,
        ConfirmOrderPayment $confirmOrderPayment,
    ): RedirectResponse {
        $confirmOrderPayment->handle(
            $order,
            $request->user(),
            $request->validated('payment_method'),
        );

        return back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
    }

    public function store(CreateOrderRequest $request, CreateOrder $createOrder): RedirectResponse
    {
        if ($request->user()->role !== UserRole::Customer) {
            $request->session()->forget('draft_order');

            return redirect()->route($request->user()->role === UserRole::Vendor ? 'vendor.dashboard' : 'admin.dashboard')
                ->with('error', 'Akun non-Panitia tidak dapat membuat pesanan.');
        }

        Gate::authorize('create', Order::class);

        $draft = $request->session()->get('draft_order');

        if (! is_array($draft)
            || ! isset($draft['idempotency_key'])
            || ! hash_equals((string) $draft['idempotency_key'], (string) $request->validated('idempotency_key'))) {
            $request->session()->forget('draft_order');

            return redirect()->route('vendors.index')
                ->with('error', 'Draft pesanan sudah tidak valid. Silakan mulai kembali.');
        }

        $order = $createOrder->handle($request->user(), $draft);
        $request->session()->forget('draft_order');

        return redirect()->route('orders.index')
            ->with('success', 'Pesanan '.$order->order_number.' berhasil diajukan.');
    }
}
