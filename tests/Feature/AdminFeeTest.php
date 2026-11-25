<?php

use App\Actions\Orders\ChangeOrderStatus;
use App\Actions\Orders\ConfirmOrderPayment;
use App\Actions\Orders\CreateOrder;
use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('new order stores 3 percent admin fee and updates it when final price is confirmed', function () {
    $customer = User::factory()->create();
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create(['is_active' => true]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create([
        'base_price' => 100000,
        'is_active' => true,
        'min_quantity' => 1,
    ]);

    $order = app(CreateOrder::class)->handle($customer, [
        'idempotency_key' => (string) Str::uuid(),
        'service_id' => $service->id,
        'event_name' => 'Seminar Kampus',
        'event_date' => now()->addDays(10)->toDateString(),
        'event_location' => 'Aula Utama',
        'event_city' => 'Bandung',
        'contact_name' => 'Budi',
        'contact_phone' => '6281234567890',
        'quantity' => 1,
    ]);

    expect((float) $order->price_estimate)->toBe(100000.0)
        ->and((float) $order->admin_fee)->toBe(3000.0)
        ->and((float) $order->total_payable)->toBe(103000.0);

    $confirmed = app(ChangeOrderStatus::class)->handle($order, $vendor, OrderStatus::Confirmed, [
        'price_final' => 250000,
    ]);

    expect((float) $confirmed->price_final)->toBe(250000.0)
        ->and((float) $confirmed->admin_fee)->toBe(7500.0)
        ->and((float) $confirmed->total_payable)->toBe(257500.0);
});

test('customer payment page exposes service price, admin fee, and total payable', function () {
    $customer = User::factory()->create();
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create(['is_active' => true]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create(['is_active' => true]);

    $order = Order::factory()->create([
        'customer_id' => $customer->id,
        'vendor_profile_id' => $vendorProfile->id,
        'service_id' => $service->id,
        'price_estimate' => 100000,
        'price_final' => 100000,
        'admin_fee' => 3000,
        'status' => OrderStatus::Confirmed,
        'payment_status' => 'unpaid',
    ]);

    $this->actingAs($customer)
        ->get(route('orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/order-show')
            ->where('adminFeeLabel', '3%')
            ->where('order.price_final', '100000.00')
            ->where('order.admin_fee', '3000.00')
            ->where('order.total_payable', '103000.00')
        );
});

test('admin dashboard counts only 3 percent admin fee from paid non-cancelled orders', function () {
    $admin = User::factory()->admin()->create();
    $customer = User::factory()->create();
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create(['is_active' => true]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create(['is_active' => true]);

    // Paid & confirmed order: Rp 100.000 -> admin_fee Rp 3.000
    $paidOrder = Order::factory()->create([
        'customer_id' => $customer->id,
        'vendor_profile_id' => $vendorProfile->id,
        'service_id' => $service->id,
        'price_estimate' => 100000,
        'price_final' => 100000,
        'admin_fee' => 3000,
        'status' => OrderStatus::Confirmed,
        'payment_status' => 'unpaid',
    ]);
    app(ConfirmOrderPayment::class)->handle($paidOrder, $customer, 'bca');

    // Unpaid confirmed order: must NOT count
    Order::factory()->create([
        'customer_id' => $customer->id,
        'vendor_profile_id' => $vendorProfile->id,
        'service_id' => $service->id,
        'price_estimate' => 500000,
        'price_final' => 500000,
        'admin_fee' => 15000,
        'status' => OrderStatus::Confirmed,
        'payment_status' => 'unpaid',
    ]);

    // Cancelled order even if paid_at was set: must NOT count
    Order::factory()->create([
        'customer_id' => $customer->id,
        'vendor_profile_id' => $vendorProfile->id,
        'service_id' => $service->id,
        'price_estimate' => 200000,
        'price_final' => 200000,
        'admin_fee' => 6000,
        'status' => OrderStatus::Cancelled,
        'payment_status' => 'paid',
        'paid_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.totalEarnings', 3000)
            ->where('stats.periodEarnings', 3000)
            ->where('stats.periodPaidOrders', 1)
            ->where('stats.periodTransactionVolume', 100000)
        );
});
