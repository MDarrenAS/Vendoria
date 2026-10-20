<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'VND-'.today()->addDays(2)->format('Ymd').'-'.fake()->unique()->numerify('#####'),
            'idempotency_key' => (string) Str::uuid(),
            'customer_id' => User::factory(),
            'service_id' => Service::factory(),
            'vendor_profile_id' => fn (array $attributes): int => Service::query()
                ->whereKey($attributes['service_id'])
                ->value('vendor_profile_id'),
            'package_id' => null,
            'service_name_snapshot' => fake()->words(3, true),
            'package_name_snapshot' => null,
            'unit_price_snapshot' => 500000,
            'event_name' => fake()->sentence(3),
            'event_date' => today()->addDays(2),
            'event_location' => fake()->address(),
            'event_city' => fake()->city(),
            'contact_name' => fake()->name(),
            'contact_phone' => '628123456789',
            'quantity' => 1,
            'price_estimate' => 500000,
            'status' => 'pending',
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::Completed,
            'completed_at' => now(),
        ]);
    }
}
