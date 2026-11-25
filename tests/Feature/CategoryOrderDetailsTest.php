<?php

use App\Actions\Orders\CreateOrder;
use App\Models\Category;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('all nine categories define quantity labels and extra fields', function () {
    $categorySlugs = array_keys(config('vendoria.category_styles'));

    expect($categorySlugs)->toHaveCount(9);

    foreach ($categorySlugs as $slug) {
        expect(config('vendoria.category_quantity_labels.'.$slug))->toBeString()->not->toBeEmpty()
            ->and(config('vendoria.category_extra_fields.'.$slug))->toBeArray()->not->toBeEmpty();
    }
});

test('order draft validates category specific select options and stores extras', function () {
    $customer = User::factory()->create();
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create([
        'name' => 'Transportasi',
        'slug' => 'transportasi',
        'is_active' => true,
    ]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create([
        'base_price' => 500000,
        'is_active' => true,
        'min_quantity' => 1,
    ]);

    $this->actingAs($customer)
        ->post(route('order.draft'), [
            'service_id' => $service->id,
            'event_name' => 'Kunjungan Industri',
            'event_date' => now()->addDays(7)->toDateString(),
            'event_location' => 'Kampus Utama',
            'event_city' => 'Jakarta',
            'contact_name' => 'Siti',
            'contact_phone' => '081234567890',
            'quantity' => 2,
            'extras' => [
                'trip_type' => 'Opsi Tidak Valid',
            ],
        ])
        ->assertSessionHasErrors('extras.trip_type');

    $this->actingAs($customer)
        ->post(route('order.draft'), [
            'service_id' => $service->id,
            'event_name' => 'Kunjungan Industri',
            'event_date' => now()->addDays(7)->toDateString(),
            'event_location' => 'Kampus Utama',
            'event_city' => 'Jakarta',
            'contact_name' => 'Siti',
            'contact_phone' => '081234567890',
            'quantity' => 2,
            'extras' => [
                'trip_type' => 'Pulang-Pergi (PP) Sehari',
                'vehicle_type' => 'Hiace Commuter 14 Seat',
                'passenger_count' => '24',
                'pickup_point' => 'Gerbang Timur pukul 07.00',
                'destination_point' => 'Kawasan Industri Cikarang',
            ],
        ])
        ->assertRedirect(route('order.review'));
});

test('customer and vendor order detail pages receive category metadata and extra fields', function () {
    $customer = User::factory()->create();
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create([
        'name' => 'Venue/Tempat',
        'slug' => 'venue-tempat',
        'is_active' => true,
    ]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create([
        'base_price' => 2000000,
        'is_active' => true,
        'min_quantity' => 1,
    ]);

    $order = app(CreateOrder::class)->handle($customer, [
        'idempotency_key' => (string) Str::uuid(),
        'service_id' => $service->id,
        'event_name' => 'Wisuda Fakultas',
        'event_date' => now()->addDays(14)->toDateString(),
        'event_location' => 'Jakarta Selatan',
        'event_city' => 'Jakarta Selatan',
        'contact_name' => 'Rina',
        'contact_phone' => '6281234567890',
        'quantity' => 1,
        'extras' => [
            'time_slot' => '08.00 - 16.00 WIB',
            'seating_layout' => 'Theater',
            'guest_capacity' => '300',
        ],
    ]);

    $this->actingAs($customer)
        ->get(route('orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/order-show')
            ->where('categorySlug', 'venue-tempat')
            ->where('categoryName', 'Venue/Tempat')
            ->where('quantityLabel', 'Jumlah sesi / hari')
            ->has('extraFields', 5)
        );

    $this->actingAs($vendor)
        ->get(route('vendor.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/orders/show')
            ->where('categorySlug', 'venue-tempat')
            ->where('categoryName', 'Venue/Tempat')
            ->where('quantityLabel', 'Jumlah sesi / hari')
            ->has('extraFields', 5)
        );
});
