<?php

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorBlockedDate;
use App\Models\VendorProfile;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('public service and vendor pages strip private details from availability calendar', function () {
    $customer = User::factory()->create(['name' => 'Rahasia Customer']);
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create(['is_active' => true]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create(['is_active' => true]);

    $bookedDate = now()->addDays(5)->toDateString();
    $dayOffDate = now()->addDays(7)->toDateString();

    Order::factory()->create([
        'order_number' => 'VND-SECRET-001',
        'customer_id' => $customer->id,
        'vendor_profile_id' => $vendorProfile->id,
        'service_id' => $service->id,
        'event_date' => $bookedDate,
        'status' => OrderStatus::Confirmed,
    ]);

    VendorBlockedDate::query()->create([
        'vendor_profile_id' => $vendorProfile->id,
        'date' => $dayOffDate,
        'reason' => 'Acara keluarga pribadi',
    ]);

    $this->get(route('services.show', $service))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/show')
            ->has('availabilityDates', 2)
            ->where('availabilityDates.0', ['date' => $bookedDate, 'type' => 'booked'])
            ->where('availabilityDates.1', ['date' => $dayOffDate, 'type' => 'day_off'])
            ->missing('availabilityDates.0.order_id')
            ->missing('availabilityDates.0.order_details')
            ->missing('availabilityDates.1.note')
            ->missing('availabilityDates.1.reason')
        );

    $this->get(route('vendors.show', $vendorProfile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendors/show')
            ->has('availabilityDates', 2)
            ->where('availabilityDates.0', ['date' => $bookedDate, 'type' => 'booked'])
            ->where('availabilityDates.1', ['date' => $dayOffDate, 'type' => 'day_off'])
        );
});

test('vendor availability calendar includes order details and day off notes', function () {
    $customer = User::factory()->create(['name' => 'Siti Panitia']);
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create(['is_active' => true]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create(['is_active' => true]);

    $bookedDate = now()->addDays(4)->toDateString();
    $dayOffDate = now()->addDays(6)->toDateString();

    Order::factory()->create([
        'order_number' => 'VND-2026-888',
        'customer_id' => $customer->id,
        'vendor_profile_id' => $vendorProfile->id,
        'service_id' => $service->id,
        'service_name_snapshot' => 'Paket Katering A',
        'event_date' => $bookedDate,
        'status' => OrderStatus::Confirmed,
    ]);

    $blocked = VendorBlockedDate::query()->create([
        'vendor_profile_id' => $vendorProfile->id,
        'date' => $dayOffDate,
        'reason' => 'Libur tahunan',
    ]);

    $this->actingAs($vendor)
        ->get(route('vendor.availability.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/availability')
            ->has('calendarDates', 2)
            ->where('calendarDates.0.type', 'booked')
            ->where('calendarDates.0.order_id', 'VND-2026-888')
            ->where('calendarDates.0.order_details.customer_name', 'Siti Panitia')
            ->where('calendarDates.1.type', 'day_off')
            ->where('calendarDates.1.note', 'Libur tahunan')
            ->where('calendarDates.1.blocked_date_id', $blocked->id)
        );
});
