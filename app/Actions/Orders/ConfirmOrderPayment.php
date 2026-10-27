<?php

namespace App\Actions\Orders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ConfirmOrderPayment
{
    public function handle(Order $order, User $customer, string $paymentMethod): Order
    {
        return DB::transaction(function () use ($order, $customer, $paymentMethod): Order {
            $order = Order::query()->lockForUpdate()->findOrFail($order->id);

            Gate::forUser($customer)->authorize('pay', $order);

            if ($order->payment_status === 'paid') {
                return $order;
            }

            $order->forceFill([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $paymentMethod,
            ])->save();

            return $order;
        });
    }
}
