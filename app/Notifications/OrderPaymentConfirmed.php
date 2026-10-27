<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Notification;

class OrderPaymentConfirmed extends Notification
{
    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, string>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'order_number' => $this->order->order_number,
            'status' => $this->order->payment_status,
            'message' => 'Pembayaran pesanan '.$this->order->order_number.' telah dikonfirmasi.',
            'url' => route('vendor.orders.show', $this->order, absolute: false),
        ];
    }
}
