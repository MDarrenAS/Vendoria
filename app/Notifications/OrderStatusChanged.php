<?php

namespace App\Notifications;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\User;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification
{
    public function __construct(
        public Order $order,
        public OrderStatus $status,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, int|string>
     */
    public function toDatabase(object $notifiable): array
    {
        $url = $notifiable instanceof User && $notifiable->role === UserRole::Vendor
            ? route('vendor.orders.show', $this->order, absolute: false)
            : route('orders.show', $this->order, absolute: false);

        return [
            'order_number' => $this->order->order_number,
            'status' => $this->status->value,
            'message' => 'Status pesanan '.$this->order->order_number.' berubah menjadi '.$this->status->label().'.',
            'url' => $url,
        ];
    }
}
