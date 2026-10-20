<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('admin can verify a vendor and deactivate a service', function () {
    $admin = User::factory()->admin()->create();
    $profile = VendorProfile::factory()->create(['is_verified' => false]);
    $service = Service::factory()->for($profile)->for(Category::factory())->create(['is_active' => true]);

    $this->actingAs($admin)
        ->patch(route('admin.vendors.update', $profile), ['is_verified' => true])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $this->patch(route('admin.services.status', $service), ['is_active' => false])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($profile->fresh()->is_verified)->toBeTrue()
        ->and($service->fresh()->is_active)->toBeFalse();
});

test('admin can create and update a category but cannot delete one used by a service', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Dekorasi Baru',
            'slug' => 'dekorasi-baru',
            'icon' => 'flower',
            'description' => 'Dekorasi acara.',
            'sort_order' => 4,
            'is_active' => true,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $category = Category::query()->where('slug', 'dekorasi-baru')->sole();
    $service = Service::factory()->for(VendorProfile::factory())->for($category)->create();

    $this->patch(route('admin.categories.update', $category), [
        'name' => 'Dekorasi Acara',
        'slug' => 'dekorasi-acara',
        'icon' => 'flower',
        'description' => 'Dekorasi untuk acara.',
        'sort_order' => 5,
        'is_active' => false,
    ])->assertRedirect()->assertSessionHasNoErrors();

    $this->delete(route('admin.categories.destroy', $category))
        ->assertSessionHasErrors([
            'category' => 'Kategori yang sudah digunakan layanan tidak dapat dihapus. Nonaktifkan kategori saja.',
        ]);

    expect($category->fresh()->name)->toBe('Dekorasi Acara')
        ->and($service->fresh())->not->toBeNull();
});

test('admin can search orders and open the operational dashboard', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create(['order_number' => 'VND-20261021-12345']);
    Order::factory()->create(['order_number' => 'VND-20261021-54321']);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.orders', 2));

    $this->get(route('admin.orders.index', ['q' => '12345']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders')
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', $order->order_number));
});

test('admin deactivation also removes a vendor profile from the public catalog', function () {
    $admin = User::factory()->admin()->create();
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);

    $this->actingAs($admin)
        ->patch(route('admin.users.status', $vendor), ['is_active' => false])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($vendor->fresh()->is_active)->toBeFalse()
        ->and($profile->fresh()->is_active)->toBeFalse();
});

test('admin cannot deactivate their own account', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch(route('admin.users.status', $admin), ['is_active' => false])
        ->assertSessionHasErrors([
            'is_active' => 'Anda tidak dapat menonaktifkan akun sendiri.',
        ]);

    expect($admin->fresh()->is_active)->toBeTrue();
});

test('admin moderation updates the service and vendor rating aggregates', function () {
    $admin = User::factory()->admin()->create();
    $review = Review::factory()->create(['rating' => 5]);
    $service = $review->service;
    $profile = $review->vendorProfile;

    $this->actingAs($admin)
        ->patch(route('admin.reviews.update', $review), ['is_visible' => false])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($review->fresh()->is_visible)->toBeFalse()
        ->and($service->fresh()->rating_count)->toBe(0)
        ->and($profile->fresh()->rating_count)->toBe(0);

    $this->patch(route('admin.reviews.update', $review), ['is_visible' => true])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($service->fresh()->rating_count)->toBe(1)
        ->and($service->fresh()->rating_avg)->toBe('5.0')
        ->and($profile->fresh()->rating_count)->toBe(1)
        ->and($profile->fresh()->rating_avg)->toBe('5.0');
});

test('customer cannot access admin operations', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});
