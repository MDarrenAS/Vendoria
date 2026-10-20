<?php

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Service;
use App\Models\ServiceImage;
use App\Models\ServicePackage;
use App\Models\User;
use App\Models\VendorBlockedDate;
use App\Models\VendorProfile;
use App\Notifications\OrderCreated;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createOrderableService(array $attributes = []): array
{
    $category = Category::factory()->create();
    $vendorProfile = VendorProfile::factory()->create();
    $service = Service::factory()->for($vendorProfile)->for($category)->create([
        'is_active' => true,
        ...$attributes,
    ]);
    $package = ServicePackage::factory()->for($service)->create([
        'name' => 'Paket Utama',
        'price' => 500000,
        'is_active' => true,
    ]);
    ServiceImage::factory()->for($service)->create();

    return [$vendorProfile, $service, $package];
}

function validOrderDraft(Service $service, ServicePackage $package): array
{
    return [
        'service_id' => $service->id,
        'package_id' => $package->id,
        'event_name' => 'Acara Keluarga',
        'event_date' => today()->addDays(3)->toDateString(),
        'event_location' => 'Gedung Serbaguna',
        'event_city' => 'Bandung',
        'contact_name' => 'Panitia Contoh',
        'contact_phone' => '081234567890',
        'quantity' => 3,
        'notes' => 'Mohon hubungi sebelum datang.',
    ];
}

test('guests can open the public order form for an active service', function () {
    [, $service, $package] = createOrderableService();

    $this->get(route('order.create', ['service' => $service->id, 'package' => $package->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/create')
            ->where('service.id', $service->id)
            ->where('selectedPackageId', $package->id));
});

test('guest draft is saved and restored after signing in', function () {
    [, $service, $package] = createOrderableService();
    $customer = User::factory()->create();

    $this->post(route('order.draft'), validOrderDraft($service, $package))
        ->assertRedirect(route('login'));

    $this->assertGuest();
    $this->assertSame($service->id, session('draft_order.service_id'));

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('draftOrderSummary.service', $service->name)
            ->where('draftOrderSummary.package', $package->name));

    $this->post(route('login.store'), [
        'email' => $customer->email,
        'password' => 'password',
    ])->assertRedirect(route('order.review', absolute: false));

    $this->assertAuthenticatedAs($customer);

    $this->get(route('order.review'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orders/review')
            ->where('service.id', $service->id)
            ->where('priceEstimate', '1500000.00'));
});

test('expired order drafts are cleared and cannot be reviewed', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->withSession(['draft_order' => [
            'service_id' => 1,
            'created_at' => now()->subHours(25)->toIso8601String(),
        ]])
        ->get(route('order.review'))
        ->assertRedirect(route('vendors.index'))
        ->assertSessionHas('error', 'Draft pesanan sudah kedaluwarsa. Silakan pilih layanan kembali.');

    expect(session()->has('draft_order'))->toBeFalse();
});

test('vendor accounts cannot create a guest order draft', function () {
    [, $service, $package] = createOrderableService();
    $vendor = User::factory()->vendor()->create();

    $this->actingAs($vendor)
        ->post(route('order.draft'), validOrderDraft($service, $package))
        ->assertRedirect(route('vendor.dashboard'))
        ->assertSessionHas('error', 'Akun non-Panitia tidak dapat membuat pesanan.');

    expect(session()->has('draft_order'))->toBeFalse();
});

test('order submission calculates price on the server and is idempotent', function () {
    [$vendorProfile, $service, $package] = createOrderableService(['name' => 'Layanan Asli']);
    $customer = User::factory()->create();
    Notification::fake([OrderCreated::class]);
    $draft = [
        ...validOrderDraft($service, $package),
        'idempotency_key' => (string) Str::uuid(),
        'created_at' => now()->toIso8601String(),
        'price_estimate' => '1.00',
    ];

    $this->actingAs($customer)
        ->withSession(['draft_order' => $draft])
        ->post(route('orders.store'), [
            'idempotency_key' => $draft['idempotency_key'],
            'terms_accepted' => '1',
        ])
        ->assertRedirect(route('orders.index'))
        ->assertSessionHas('success');

    $order = Order::query()->sole();

    expect($order->order_number)->toMatch('/^VND-\d{8}-\d{5}$/')
        ->and($order->price_estimate)->toBe('1500000.00')
        ->and($order->service_name_snapshot)->toBe('Layanan Asli')
        ->and($order->status)->toBe(OrderStatus::Pending)
        ->and($order->vendor_profile_id)->toBe($vendorProfile->id);

    $service->update(['name' => 'Nama Baru']);
    $package->update(['name' => 'Paket Baru', 'price' => 900000]);

    expect($order->fresh()->service_name_snapshot)->toBe('Layanan Asli')
        ->and($order->fresh()->package_name_snapshot)->toBe('Paket Utama')
        ->and($order->fresh()->price_estimate)->toBe('1500000.00');

    $this->withSession(['draft_order' => $draft])
        ->post(route('orders.store'), [
            'idempotency_key' => $draft['idempotency_key'],
            'terms_accepted' => '1',
        ])
        ->assertRedirect(route('orders.index'));

    expect(Order::query()->count())->toBe(1)
        ->and(OrderStatusHistory::query()->where('order_id', $order->id)->count())->toBe(1);

    Notification::assertSentTo($vendorProfile->user, OrderCreated::class);
});

test('draft validation rejects blocked dates and packages from another service', function () {
    [$vendorProfile, $service, $package] = createOrderableService();
    [, $otherService, $otherPackage] = createOrderableService();
    $blockedDate = today()->addDays(5)->toDateString();
    VendorBlockedDate::factory()->for($vendorProfile)->create(['date' => $blockedDate]);

    $this->post(route('order.draft'), [
        ...validOrderDraft($service, $otherPackage),
        'event_date' => $blockedDate,
    ])->assertSessionHasErrors(['event_date', 'package_id']);

    expect(session()->has('draft_order'))->toBeFalse();
    expect($otherService->id)->not->toBe($service->id)
        ->and($package->service_id)->toBe($service->id);
});
