<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Notification;

class OrderCreated extends Notification
{
    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, int|string>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'order_number' => $this->order->order_number,
            'service_name' => $this->order->service_name_snapshot,
            'event_date' => $this->order->event_date->toDateString(),
            'message' => 'Pesanan baru menunggu konfirmasi Anda.',
            'url' => route('vendor.orders.show', $this->order, absolute: false),
        ];
    }
}
