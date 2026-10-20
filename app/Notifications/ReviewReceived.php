<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Notifications\Notification;

class ReviewReceived extends Notification
{
    public function __construct(public Review $review) {}

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
            'review_id' => $this->review->id,
            'order_number' => $this->review->order->order_number,
            'message' => 'Anda menerima ulasan baru untuk pesanan '.$this->review->order->order_number.'.',
            'url' => route('vendor.reviews.index', absolute: false),
        ];
    }
}
