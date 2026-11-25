<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Notification;

class OrderAttachmentRequested extends Notification
{
    public function __construct(
        public Order $order,
        public string $slotLabel,
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
        return [
            'order_number' => $this->order->order_number,
            'service_name' => $this->order->service_name_snapshot,
            'message' => "Vendor meminta Anda mengunggah lampiran \"{$this->slotLabel}\" untuk pesanan {$this->order->order_number}.",
            'url' => route('orders.show', $this->order, absolute: false),
        ];
    }
}
