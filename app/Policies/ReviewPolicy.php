<?php

namespace App\Policies;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Vendor, UserRole::Admin], true);
    }

    public function create(User $user, Order $order): bool
    {
        return $user->role === UserRole::Customer
            && $order->customer_id === $user->id
            && $order->status === OrderStatus::Completed
            && ! $order->review()->exists();
    }

    public function moderate(User $user, Review $review): bool
    {
        return $user->role === UserRole::Admin;
    }
}
