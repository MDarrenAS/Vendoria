<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServicePackage>
 */
class ServicePackageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'price' => fake()->numberBetween(100_000, 3_000_000),
            'features' => fake()->words(4),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
