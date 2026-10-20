<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceImage>
 */
class ServiceImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'path' => 'placeholder:VendoriaLogo.png',
            'caption' => null,
            'is_cover' => true,
            'sort_order' => 0,
        ];
    }
}
