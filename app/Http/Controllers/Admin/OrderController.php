<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:24'],
            'status' => ['nullable', Rule::enum(OrderStatus::class)],
        ]);

        $orders = Order::query()
            ->with(['customer:id,name,email', 'vendorProfile:id,business_name'])
            ->when($filters['q'] ?? null, fn ($query, $number) => $query->where('order_number', 'like', '%'.$number.'%'))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'filters' => $filters,
            'statuses' => array_map(
                fn (OrderStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
                OrderStatus::cases(),
            ),
        ]);
    }
}
