<?php

namespace App\Policies;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Customer, UserRole::Vendor, UserRole::Admin], true);
    }

    public function view(User $user, Order $order): bool
    {
        return $user->role === UserRole::Admin
            || ($user->role === UserRole::Customer && $order->customer_id === $user->id)
            || ($user->role === UserRole::Vendor && $user->vendorProfile?->id === $order->vendor_profile_id);
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Customer;
    }

    public function update(User $user, Order $order): bool
    {
        return $user->role === UserRole::Vendor
            && $user->vendorProfile?->id === $order->vendor_profile_id;
    }

    public function delete(User $user, Order $order): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function cancel(User $user, Order $order): bool
    {
        return $user->role === UserRole::Customer
            && $order->customer_id === $user->id
            && $order->status === OrderStatus::Pending;
    }

    public function pay(User $user, Order $order): bool
    {
        return $user->role === UserRole::Customer
            && $order->customer_id === $user->id
            && in_array($order->status, [OrderStatus::Confirmed, OrderStatus::InProgress], true)
            && $order->price_final !== null;
    }
}
