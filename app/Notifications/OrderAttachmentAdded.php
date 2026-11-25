<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Notification;

class OrderAttachmentAdded extends Notification
{
    public function __construct(
        public Order $order,
        public string $slotLabel,
        public string $fileName,
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
            'message' => "Lampiran baru ({$this->slotLabel}: {$this->fileName}) ditambahkan pada pesanan {$this->order->order_number}.",
            'url' => route('vendor.orders.show', $this->order, absolute: false),
        ];
    }
}
