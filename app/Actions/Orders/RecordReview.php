<?php

namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use App\Notifications\ReviewReceived;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class RecordReview
{
    public function __construct(private RecalculateReviewRatings $recalculateReviewRatings) {}

    /**
     * @param  array{rating: int, comment?: string|null}  $data
     */
    public function handle(Order $order, User $customer, array $data): Review
    {
        return DB::transaction(function () use ($order, $customer, $data): Review {
            $lockedOrder = Order::query()
                ->with('vendorProfile.user')
                ->lockForUpdate()
                ->findOrFail($order->id);

            Gate::forUser($customer)->authorize('create', [Review::class, $lockedOrder]);

            if ($lockedOrder->status !== OrderStatus::Completed) {
                throw ValidationException::withMessages([
                    'order' => 'Ulasan hanya dapat diberikan untuk pesanan yang selesai.',
                ]);
            }

            if ($lockedOrder->review()->exists()) {
                throw ValidationException::withMessages([
                    'order' => 'Pesanan ini sudah memiliki ulasan.',
                ]);
            }

            $review = Review::query()->create([
                'order_id' => $lockedOrder->id,
                'customer_id' => $customer->id,
                'vendor_profile_id' => $lockedOrder->vendor_profile_id,
                'service_id' => $lockedOrder->service_id,
                ...$data,
            ]);

            $this->recalculateReviewRatings->handle($review);
            $lockedOrder->vendorProfile->user->notify(new ReviewReceived($review));
            Cache::forget('marketplace.home.v2');

            return $review;
        });
    }
}
