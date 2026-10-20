<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $order = Order::factory()->completed();

        return [
            'order_id' => $order,
            'customer_id' => fn (array $attributes): int => Order::query()->findOrFail($attributes['order_id'])->customer_id,
            'vendor_profile_id' => fn (array $attributes): int => Order::query()->findOrFail($attributes['order_id'])->vendor_profile_id,
            'service_id' => fn (array $attributes): int => Order::query()->findOrFail($attributes['order_id'])->service_id,
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->optional()->sentence(),
            'is_visible' => true,
        ];
    }
}
