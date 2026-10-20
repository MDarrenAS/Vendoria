<?php

use App\Models\Category;
use App\Models\Service;
use App\Models\ServiceImage;
use App\Models\ServicePackage;
use App\Models\VendorBlockedDate;
use App\Models\VendorProfile;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('the public homepage displays active categories and verified services', function () {
    Cache::flush();

    $category = Category::factory()->create(['name' => 'Dekorasi']);
    $verifiedVendor = VendorProfile::factory()->create(['is_verified' => true]);
    $featuredService = Service::factory()
        ->for($verifiedVendor)
        ->for($category)
        ->create(['is_active' => true]);
    ServicePackage::factory()->for($featuredService)->create();
    ServiceImage::factory()->for($featuredService)->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('categories.0.name', 'Dekorasi')
            ->where('featuredServices.0.slug', $featuredService->slug)
            ->has('newestServices', 1));

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('categories', 1)
            ->has('featuredServices', 1)
            ->has('newestServices', 1));
});

test('vendor search applies keyword category city and availability filters', function () {
    $category = Category::factory()->create(['name' => 'Katering', 'slug' => 'katering']);
    $vendor = VendorProfile::factory()->create([
        'business_name' => 'Dapur Nusantara',
        'city' => 'Bandung',
        'is_active' => true,
    ]);
    $availableService = Service::factory()->for($vendor)->for($category)->create([
        'name' => 'Katering Acara',
        'base_price' => 1500000,
        'is_active' => true,
    ]);
    ServicePackage::factory()->for($availableService)->create();
    ServiceImage::factory()->for($availableService)->create();

    $blockedVendor = VendorProfile::factory()->create(['city' => 'Bandung']);
    $blockedService = Service::factory()->for($blockedVendor)->for($category)->create([
        'name' => 'Katering Penuh',
        'is_active' => true,
    ]);
    VendorBlockedDate::factory()->for($blockedVendor)->create(['date' => '2027-02-10']);

    $this->get(route('vendors.index', [
        'q' => 'katering',
        'category' => 'katering',
        'city' => 'Bandung',
        'date' => '2027-02-10',
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendors/index')
            ->where('resultCount', 1)
            ->where('services.data.0.id', $availableService->id)
            ->missing('services.data.1'));

    expect($blockedService->is_active)->toBeTrue();
});

test('vendor and service details resolve by slug without exposing raw whatsapp numbers', function () {
    $category = Category::factory()->create();
    $vendor = VendorProfile::factory()->create([
        'whatsapp_number' => '081234567890',
        'is_verified' => true,
    ]);
    $service = Service::factory()->for($vendor)->for($category)->create([
        'is_active' => true,
    ]);
    ServicePackage::factory()->for($service)->create();
    ServiceImage::factory()->for($service)->create();

    $this->get(route('vendors.show', $vendor))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendors/show')
            ->where('vendor.slug', $vendor->slug)
            ->where('whatsappUrl', fn (string $url) => str_starts_with($url, 'https://wa.me/6281234567890'))
            ->missing('vendor.whatsapp_number'));

    $this->get(route('services.show', $service))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/show')
            ->where('service.slug', $service->slug)
            ->where('service.packages.0.id', $service->packages->first()->id)
            ->missing('service.vendor_profile.whatsapp_number')
            ->where('whatsappUrl', fn (string $url) => str_starts_with($url, 'https://wa.me/6281234567890')));
});

test('inactive services and inactive vendors are not publicly discoverable', function () {
    $category = Category::factory()->create();
    $inactiveVendor = VendorProfile::factory()->create(['is_active' => false]);
    $inactiveVendorService = Service::factory()->for($inactiveVendor)->for($category)->create(['is_active' => true]);
    $inactiveService = Service::factory()->for(VendorProfile::factory())->for($category)->create(['is_active' => false]);

    $this->get(route('vendors.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('resultCount', 0)
            ->missing('services.data.0'));

    $this->get(route('services.show', $inactiveVendorService))->assertNotFound();
    $this->get(route('services.show', $inactiveService))->assertNotFound();
});
