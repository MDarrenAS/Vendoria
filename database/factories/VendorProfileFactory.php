<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<VendorProfile>
 */
class VendorProfileFactory extends Factory
{
    public function definition(): array
    {
        $businessName = fake()->company();

        return [
            'user_id' => User::factory()->vendor(),
            'business_name' => $businessName,
            'slug' => Str::slug($businessName).'-'.fake()->unique()->numberBetween(100, 9999),
            'description' => fake()->paragraph(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'address' => fake()->address(),
            'whatsapp_number' => '628123456789',
            'contact_email' => fake()->safeEmail(),
            'logo_path' => null,
            'cover_path' => null,
            'instagram' => null,
            'is_verified' => false,
            'is_active' => true,
            'rating_avg' => 0,
            'rating_count' => 0,
        ];
    }
}
