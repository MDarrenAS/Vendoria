<?php

namespace App\Actions\Orders;

use App\Models\Review;
use App\Models\Service;
use App\Models\VendorProfile;
use Illuminate\Support\Facades\DB;

class RecalculateReviewRatings
{
    public function handle(Review $review): void
    {
        DB::transaction(function () use ($review): void {
            $service = Service::query()->lockForUpdate()->findOrFail($review->service_id);
            $vendorProfile = VendorProfile::query()->lockForUpdate()->findOrFail($review->vendor_profile_id);

            $serviceAggregate = $this->aggregateFor('service_id', $service->id);
            $vendorAggregate = $this->aggregateFor('vendor_profile_id', $vendorProfile->id);

            $service->update($serviceAggregate);
            $vendorProfile->update($vendorAggregate);
        });
    }

    /**
     * @return array{rating_count: int, rating_avg: float}
     */
    private function aggregateFor(string $foreignKey, int $id): array
    {
        $aggregate = Review::query()
            ->where($foreignKey, $id)
            ->where('is_visible', true)
            ->selectRaw('COUNT(*) as rating_count, COALESCE(AVG(rating), 0) as rating_avg')
            ->firstOrFail();

        return [
            'rating_count' => (int) $aggregate->rating_count,
            'rating_avg' => round((float) $aggregate->rating_avg, 1),
        ];
    }
}
