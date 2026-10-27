<?php

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorBlockedDate;
use App\Models\VendorProfile;
use App\Notifications\OrderStatusChanged;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function vendorServicePayload(Category $category, array $overrides = []): array
{
    return [
        'category_id' => $category->id,
        'name' => 'Dekorasi Pernikahan',
        'description' => 'Dekorasi untuk berbagai acara keluarga.',
        'base_price' => 750000,
        'price_unit' => 'per_event',
        'min_quantity' => 1,
        'max_quantity' => 100,
        'city_coverage' => 'Bandung',
        'terms' => 'Konfirmasi detail sebelum acara.',
        'is_active' => '1',
        'packages' => [[
            'name' => 'Paket Inti',
            'description' => 'Paket layanan utama.',
            'price' => 900000,
            'features_text' => "Dekorasi utama\nKonsultasi",
            'sort_order' => 0,
            'is_active' => '1',
        ]],
        'images' => [UploadedFile::fake()->image('cover.jpg')],
        'cover_image_index' => 0,
        ...$overrides,
    ];
}

test('vendor without a complete profile is redirected to onboarding', function () {
    $vendor = User::factory()->vendor()->create();

    $this->actingAs($vendor)
        ->get(route('vendor.dashboard'))
        ->assertRedirect(route('vendor.onboarding'));

    $this->actingAs($vendor)
        ->get(route('vendor.onboarding'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('vendor/onboarding'));
});

test('vendor can save profile details and upload its logo to s3', function () {
    Storage::fake('s3');
    $vendor = User::factory()->vendor()->create();
    VendorProfile::factory()->for($vendor)->create();

    $this->actingAs($vendor)
        ->patch(route('vendor.profile.update'), [
            'business_name' => 'Vendor Baru',
            'description' => 'Penyedia layanan acara.',
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'address' => 'Jalan Merdeka',
            'whatsapp_number' => '081234567890',
            'contact_email' => 'kontak@example.test',
            'instagram' => '@vendorbaru',
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])
        ->assertRedirect(route('vendor.profile.edit'))
        ->assertSessionHasNoErrors();

    $profile = $vendor->fresh()->vendorProfile;

    expect($profile->slug)->toStartWith('vendor-baru-'.$vendor->id)
        ->and($profile->whatsapp_number)->toBe('6281234567890');
    Storage::disk('s3')->assertExists($profile->logo_path);
});

test('vendor can create an active service with an active package and cover stored in s3', function () {
    Storage::fake('s3');
    $vendor = User::factory()->vendor()->create();
    VendorProfile::factory()->for($vendor)->create();
    $category = Category::factory()->create(['is_active' => true]);

    $this->actingAs($vendor)
        ->post(route('vendor.services.store'), vendorServicePayload($category))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $service = Service::query()->with(['packages', 'images'])->sole();

    expect($service->is_active)->toBeTrue()
        ->and($service->packages)->toHaveCount(1)
        ->and($service->packages->first()->features)->toBe(['Dekorasi utama', 'Konsultasi'])
        ->and($service->images->first()->is_cover)->toBeTrue();
    Storage::disk('s3')->assertExists($service->images->first()->path);
});

test('vendor can replace the cover by uploading a new first photo', function () {
    Storage::fake('s3');
    $vendor = User::factory()->vendor()->create();
    VendorProfile::factory()->for($vendor)->create();
    $category = Category::factory()->create(['is_active' => true]);

    $this->actingAs($vendor)
        ->post(route('vendor.services.store'), vendorServicePayload($category, [
            'images' => [
                UploadedFile::fake()->image('cover-lama.jpg'),
                UploadedFile::fake()->image('foto-tambahan.jpg'),
            ],
        ]))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $service = Service::query()->with(['packages', 'images'])->sole();
    $oldCover = $service->images->firstWhere('is_cover', true);
    $additionalImage = $service->images->firstWhere('is_cover', false);
    $package = $service->packages->sole();

    $this->actingAs($vendor)
        ->patch(route('vendor.services.update', $service), vendorServicePayload($category, [
            'packages' => [[
                'id' => $package->id,
                'name' => $package->name,
                'description' => $package->description,
                'price' => $package->price,
                'features_text' => implode("\n", $package->features),
                'sort_order' => $package->sort_order,
                'is_active' => '1',
            ]],
            'images' => [UploadedFile::fake()->image('cover-baru.jpg')],
            'cover_image_index' => 0,
            'delete_image_ids' => [$oldCover->id],
        ]))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $service->refresh()->load('images');

    expect($service->images)->toHaveCount(2)
        ->and($service->images->firstWhere('is_cover', true)?->id)->not->toBe($oldCover->id)
        ->and($service->images->firstWhere('is_cover', false)?->id)->toBe($additionalImage->id);
    Storage::disk('s3')->assertMissing($oldCover->path);
    Storage::disk('s3')->assertExists($additionalImage->path);
    Storage::disk('s3')->assertExists($service->images->firstWhere('is_cover', true)->path);
});

test('deleting the cover promotes the first remaining service photo', function () {
    Storage::fake('s3');
    $vendor = User::factory()->vendor()->create();
    VendorProfile::factory()->for($vendor)->create();
    $category = Category::factory()->create(['is_active' => true]);

    $this->actingAs($vendor)
        ->post(route('vendor.services.store'), vendorServicePayload($category, [
            'images' => [
                UploadedFile::fake()->image('cover.jpg'),
                UploadedFile::fake()->image('foto-tambahan.jpg'),
            ],
        ]))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $service = Service::query()->with(['packages', 'images'])->sole();
    $oldCover = $service->images->firstWhere('is_cover', true);
    $remainingImage = $service->images->firstWhere('is_cover', false);
    $package = $service->packages->sole();

    $this->actingAs($vendor)
        ->patch(route('vendor.services.update', $service), vendorServicePayload($category, [
            'packages' => [[
                'id' => $package->id,
                'name' => $package->name,
                'description' => $package->description,
                'price' => $package->price,
                'features_text' => implode("\n", $package->features),
                'sort_order' => $package->sort_order,
                'is_active' => '1',
            ]],
            'images' => [],
            'cover_image_index' => null,
            'delete_image_ids' => [$oldCover->id],
        ]))
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($service->fresh()->images()->where('is_cover', true)->value('id'))->toBe($remainingImage->id)
        ->and($service->images()->count())->toBe(1);
    Storage::disk('s3')->assertMissing($oldCover->path);
    Storage::disk('s3')->assertExists($remainingImage->path);
});

test('service cannot be activated without a package and a cover image', function () {
    $vendor = User::factory()->vendor()->create();
    VendorProfile::factory()->for($vendor)->create();
    $category = Category::factory()->create(['is_active' => true]);

    $this->actingAs($vendor)
        ->from(route('vendor.services.create'))
        ->post(route('vendor.services.store'), vendorServicePayload($category, [
            'packages' => [],
            'images' => [],
            'cover_image_index' => null,
        ]))
        ->assertRedirect(route('vendor.services.create'))
        ->assertSessionHasErrors([
            'packages' => 'Tambahkan minimal satu paket aktif sebelum mengaktifkan layanan.',
        ]);

    expect(Service::query()->count())->toBe(0);
});

test('vendor cannot access another vendor service', function () {
    $service = Service::factory()->for(VendorProfile::factory())->create();
    $otherVendor = User::factory()->vendor()->create();
    VendorProfile::factory()->for($otherVendor)->create();

    $this->actingAs($otherVendor)
        ->get(route('vendor.services.edit', $service))
        ->assertForbidden();
});

test('vendor can block a date range and see confirmed order dates as booked', function () {
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create();
    $service = Service::factory()->for($profile)->for(Category::factory())->create();
    $order = Order::factory()
        ->for(User::factory(), 'customer')
        ->for($profile)
        ->for($service)
        ->create([
            'status' => OrderStatus::Confirmed,
            'event_date' => today()->addDays(10),
        ]);
    $startDate = today()->addDays(2)->toDateString();
    $endDate = today()->addDays(3)->toDateString();

    $this->actingAs($vendor)
        ->post(route('vendor.availability.store'), [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'reason' => 'Libur usaha',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect(VendorBlockedDate::query()->where('vendor_profile_id', $profile->id)->count())->toBe(2);

    $this->get(route('vendor.availability.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/availability')
            ->has('blockedDates.data', 2)
            ->where('bookedDates.0.order_number', $order->order_number));
});

test('vendor cannot block a range longer than ninety days', function () {
    $vendor = User::factory()->vendor()->create();
    VendorProfile::factory()->for($vendor)->create();

    $this->actingAs($vendor)
        ->post(route('vendor.availability.store'), [
            'start_date' => today()->addDay()->toDateString(),
            'end_date' => today()->addDays(91)->toDateString(),
        ])
        ->assertSessionHasErrors(['end_date' => 'Rentang tanggal tidak boleh lebih dari 90 hari.']);

    expect(VendorBlockedDate::query()->count())->toBe(0);
});

test('vendor cannot delete a service with an active order', function () {
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create();
    $service = Service::factory()->for($profile)->for(Category::factory())->create();
    Order::factory()
        ->for(User::factory(), 'customer')
        ->for($profile)
        ->for($service)
        ->create(['status' => OrderStatus::Pending]);

    $this->actingAs($vendor)
        ->delete(route('vendor.services.destroy', $service))
        ->assertSessionHasErrors(['service' => 'Layanan memiliki pesanan aktif. Nonaktifkan layanan, jangan hapus.']);

    expect($service->fresh())->not->toBeNull();
});

test('vendor can confirm an order with a final price and notifies the customer', function () {
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create();
    $service = Service::factory()->for($profile)->for(Category::factory())->create();
    $customer = User::factory()->create();
    $order = Order::factory()->for($customer, 'customer')->for($profile)->for($service)->create();
    Notification::fake([OrderStatusChanged::class]);

    $this->actingAs($vendor)
        ->patch(route('vendor.orders.status', $order), [
            'status' => OrderStatus::Confirmed->value,
            'price_final' => '1250000.00',
            'price_note' => 'Termasuk biaya pengiriman.',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($order->fresh()->status)->toBe(OrderStatus::Confirmed)
        ->and($order->fresh()->price_final)->toBe('1250000.00')
        ->and($order->fresh()->confirmed_at)->not->toBeNull()
        ->and(OrderStatusHistory::query()->where('order_id', $order->id)->sole()->to_status)->toBe(OrderStatus::Confirmed);

    Notification::assertSentTo($customer, OrderStatusChanged::class);
});

test('vendor cannot reject an order without a reason', function () {
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create();
    $service = Service::factory()->for($profile)->for(Category::factory())->create();
    $order = Order::factory()->for(User::factory(), 'customer')->for($profile)->for($service)->create();

    $this->actingAs($vendor)
        ->patch(route('vendor.orders.status', $order), ['status' => OrderStatus::Rejected->value])
        ->assertSessionHasErrors('vendor_note');

    expect($order->fresh()->status)->toBe(OrderStatus::Pending)
        ->and(OrderStatusHistory::query()->where('order_id', $order->id)->count())->toBe(0);
});

test('vendor cannot confirm an order on a blocked date', function () {
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create();
    $service = Service::factory()->for($profile)->for(Category::factory())->create();
    $order = Order::factory()->for(User::factory(), 'customer')->for($profile)->for($service)->create();
    VendorBlockedDate::factory()->for($profile)->create(['date' => $order->event_date]);

    $this->actingAs($vendor)
        ->patch(route('vendor.orders.status', $order), [
            'status' => OrderStatus::Confirmed->value,
            'price_final' => '500000',
        ])
        ->assertSessionHasErrors([
            'status' => 'Tanggal acara telah diblokir dan pesanan tidak dapat dikonfirmasi.',
        ]);

    expect($order->fresh()->status)->toBe(OrderStatus::Pending);
});

test('vendor can move a confirmed order through processing to completion', function () {
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create();
    $service = Service::factory()->for($profile)->for(Category::factory())->create();
    $order = Order::factory()->for(User::factory(), 'customer')->for($profile)->for($service)->create([
        'status' => OrderStatus::Confirmed,
        'price_final' => 700000,
    ]);

    $this->actingAs($vendor)
        ->patch(route('vendor.orders.status', $order), ['status' => OrderStatus::InProgress->value])
        ->assertSessionHasNoErrors();

    $this->patch(route('vendor.orders.status', $order), ['status' => OrderStatus::Completed->value])
        ->assertSessionHasNoErrors();

    expect($order->fresh()->status)->toBe(OrderStatus::Completed)
        ->and($order->fresh()->completed_at)->not->toBeNull()
        ->and(OrderStatusHistory::query()->where('order_id', $order->id)->count())->toBe(2);
});

test('vendor can see the confirmed payment status on the order detail page', function () {
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create();
    $service = Service::factory()->for($profile)->for(Category::factory())->create();
    $order = Order::factory()
        ->for(User::factory(), 'customer')
        ->for($profile)
        ->for($service)
        ->create([
            'status' => OrderStatus::Confirmed,
            'price_final' => 700000,
            'payment_status' => 'paid',
            'paid_at' => now(),
            'payment_method' => 'mandiri',
        ]);

    $this->actingAs($vendor)
        ->get(route('vendor.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendor/orders/show')
            ->where('order.payment_status', 'paid')
            ->where('order.payment_method', 'mandiri')
            ->where('order.paid_at', fn ($paidAt) => $paidAt !== null));
});
