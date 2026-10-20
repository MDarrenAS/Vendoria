<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Service;
use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'vendor_profile_id' => VendorProfile::factory(),
            'category_id' => Category::factory(),
            'name' => Str::title($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(100, 9999),
            'description' => fake()->paragraph(),
            'base_price' => fake()->numberBetween(100_000, 5_000_000),
            'price_unit' => 'per_event',
            'min_quantity' => 1,
            'max_quantity' => null,
            'city_coverage' => fake()->city(),
            'terms' => fake()->sentence(),
            'is_active' => false,
            'rating_avg' => 0,
            'rating_count' => 0,
        ];
    }
}
