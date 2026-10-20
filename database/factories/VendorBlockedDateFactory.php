<?php

namespace Database\Factories;

use App\Models\VendorBlockedDate;
use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VendorBlockedDate>
 */
class VendorBlockedDateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'vendor_profile_id' => VendorProfile::factory(),
            'date' => fake()->dateTimeBetween('+1 day', '+6 months')->format('Y-m-d'),
            'reason' => null,
        ];
    }
}
