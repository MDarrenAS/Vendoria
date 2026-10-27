<?php

use App\Enums\UserRole;
use App\Models\Service;
use Database\Seeders\MarketplaceCatalogSeeder;

test('every demo service has a unique cover and belongs to a vendor account', function () {
    $this->seed(MarketplaceCatalogSeeder::class);

    $services = Service::query()
        ->with(['vendorProfile.user', 'images'])
        ->get();

    expect($services)->toHaveCount(40);
    expect($services->pluck('images.0.path')->unique())->toHaveCount(40);

    foreach ($services as $service) {
        expect($service->vendorProfile->user->role)->toBe(UserRole::Vendor);
    }
});
