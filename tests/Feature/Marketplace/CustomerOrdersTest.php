<?php

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use App\Notifications\OrderPaymentConfirmed;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function makeCustomerOrder(User $customer, OrderStatus $status = OrderStatus::Pending): array
{
    $vendorProfile = VendorProfile::factory()->create();
    $service = Service::factory()
        ->for($vendorProfile)
        ->for(Category::factory())
        ->create(['is_active' => true]);
    $order = Order::factory()
        ->for($customer, 'customer')
        ->for($vendorProfile)
        ->for($service)
        ->create(['status' => $status]);

    return [$order, $vendorProfile];
}

test('customer order list only includes their own paginated orders', function () {
    $customer = User::factory()->create();
    [$ownOrder] = makeCustomerOrder($customer);
    [$anotherOrder] = makeCustomerOrder(User::factory()->create());

    $this->actingAs($customer)
        ->get(route('orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/orders')
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', $ownOrder->order_number)
            ->missing('orders.data.1')
            ->missing('orders.data.0.id'));

    expect($anotherOrder->customer_id)->not->toBe($customer->id);
});

test('customer can view order timeline and use the order chat without exposing the vendor phone', function () {
    $customer = User::factory()->create();
    [$order] = makeCustomerOrder($customer);
    OrderStatusHistory::factory()->for($order)->for($customer, 'changedBy')->create();

    $this->actingAs($customer)
        ->get(route('orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/order-show')
            ->where('order.order_number', $order->order_number)
            ->has('order.status_histories', 1)
            ->where('currentUserId', $customer->id)
            ->has('initialMessages', 0)
            ->missing('whatsAppUrl')
            ->missing('order.vendor_profile.whatsapp_number'));
});

test('customer can send a message and the vendor can retrieve it from the order chat', function () {
    $customer = User::factory()->create();
    [$order] = makeCustomerOrder($customer);

    $this->actingAs($customer)
        ->post(route('orders.messages.store', $order), [
            'body' => 'Apakah paket ini tersedia untuk acara keluarga?',
        ])
        ->assertRedirect();

    $this->actingAs($order->vendorProfile->user)
        ->getJson(route('orders.messages.index', $order))
        ->assertOk()
        ->assertJsonPath('messages.0.body', 'Apakah paket ini tersedia untuk acara keluarga?')
        ->assertJsonPath('messages.0.sender_id', $customer->id)
        ->assertJsonPath('messages.0.sender_name', $customer->name);

    $this->assertDatabaseHas('order_messages', [
        'order_id' => $order->id,
        'sender_id' => $customer->id,
        'body' => 'Apakah paket ini tersedia untuk acara keluarga?',
    ]);
});

test('customer cannot read or send messages on another customer order', function () {
    [$order] = makeCustomerOrder(User::factory()->create());
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->getJson(route('orders.messages.index', $order))
        ->assertForbidden();

    $this->actingAs($customer)
        ->post(route('orders.messages.store', $order), ['body' => 'Pesan tidak sah'])
        ->assertForbidden();

    $this->assertDatabaseCount('order_messages', 0);
});

test('customer cannot send an empty order chat message', function () {
    $customer = User::factory()->create();
    [$order] = makeCustomerOrder($customer);

    $this->actingAs($customer)
        ->post(route('orders.messages.store', $order), ['body' => '   '])
        ->assertSessionHasErrors('body');

    $this->assertDatabaseCount('order_messages', 0);
});

test('customer cannot send a message after the order is closed', function () {
    $customer = User::factory()->create();
    [$order] = makeCustomerOrder($customer, OrderStatus::Cancelled);

    $this->actingAs($customer)
        ->post(route('orders.messages.store', $order), ['body' => 'Apakah masih bisa dilanjutkan?'])
        ->assertForbidden();

    $this->assertDatabaseCount('order_messages', 0);
});

test('customer payment confirmation is persisted separately from the order status', function () {
    $customer = User::factory()->create();
    [$order, $vendorProfile] = makeCustomerOrder($customer, OrderStatus::Confirmed);
    $order->update(['price_final' => 750000]);
    Notification::fake([OrderPaymentConfirmed::class]);

    $this->actingAs($customer)
        ->post(route('orders.payment', $order), ['payment_method' => 'bca'])
        ->assertRedirect()
        ->assertSessionHas('success', 'Pembayaran berhasil dikonfirmasi.');

    $order->refresh();

    expect($order->payment_status)->toBe('paid')
        ->and($order->paid_at)->not->toBeNull()
        ->and($order->payment_method)->toBe('bca')
        ->and($order->status)->toBe(OrderStatus::Confirmed);

    $paidAt = $order->paid_at;

    $this->actingAs($customer)
        ->post(route('orders.payment', $order), ['payment_method' => 'bca'])
        ->assertRedirect();

    expect($order->fresh()->paid_at)->toEqual($paidAt);
    Notification::assertSentToTimes($vendorProfile->user, OrderPaymentConfirmed::class);
    Notification::assertSentTo(
        $vendorProfile->user,
        OrderPaymentConfirmed::class,
        function (OrderPaymentConfirmed $notification) use ($order, $vendorProfile): bool {
            $data = $notification->toDatabase($vendorProfile->user);

            return $notification->order->is($order)
                && $data['status'] === 'paid'
                && $data['order_number'] === $order->order_number;
        },
    );

    $this->actingAs($customer)
        ->get(route('orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/order-show')
            ->where('order.payment_method', 'bca'));
});

test('customer payment confirmation requires a supported bank', function () {
    $customer = User::factory()->create();
    [$order] = makeCustomerOrder($customer, OrderStatus::Confirmed);
    $order->update(['price_final' => 750000]);

    $this->actingAs($customer)
        ->post(route('orders.payment', $order), ['payment_method' => 'unknown'])
        ->assertSessionHasErrors('payment_method');

    expect($order->fresh()->payment_status)->toBe('unpaid')
        ->and($order->fresh()->payment_method)->toBeNull();
});

test('customer cannot confirm payment for another customer order', function () {
    $customer = User::factory()->create();
    [$anotherCustomersOrder] = makeCustomerOrder(User::factory()->create(), OrderStatus::Confirmed);
    $anotherCustomersOrder->update(['price_final' => 750000]);

    $this->actingAs($customer)
        ->post(route('orders.payment', $anotherCustomersOrder))
        ->assertForbidden();

    expect($anotherCustomersOrder->fresh()->payment_status)->toBe('unpaid');
});

test('customer cannot confirm payment before vendor confirmation', function () {
    $customer = User::factory()->create();
    [$pendingOrder] = makeCustomerOrder($customer);

    $this->actingAs($customer)
        ->post(route('orders.payment', $pendingOrder))
        ->assertForbidden();

    expect($pendingOrder->fresh()->payment_status)->toBe('unpaid');
});

test('customer cannot view another customer order', function () {
    [$order] = makeCustomerOrder(User::factory()->create());
    $otherCustomer = User::factory()->create();

    $this->actingAs($otherCustomer)
        ->get(route('orders.show', $order))
        ->assertForbidden();
});

test('customer can cancel a pending order and the vendor is notified', function () {
    $customer = User::factory()->create();
    [$order, $vendorProfile] = makeCustomerOrder($customer);
    Notification::fake([OrderStatusChanged::class]);

    $this->actingAs($customer)
        ->delete(route('orders.cancel', $order), ['cancel_reason' => 'Perubahan jadwal acara'])
        ->assertRedirect()
        ->assertSessionHas('success', 'Pesanan berhasil dibatalkan.');

    expect($order->fresh()->status)->toBe(OrderStatus::Cancelled)
        ->and($order->fresh()->cancel_reason)->toBe('Perubahan jadwal acara')
        ->and(OrderStatusHistory::query()->where('order_id', $order->id)->sole()->to_status)
        ->toBe(OrderStatus::Cancelled);

    Notification::assertSentTo($vendorProfile->user, OrderStatusChanged::class);
});

test('customer cannot cancel a confirmed order', function () {
    $customer = User::factory()->create();
    [$order] = makeCustomerOrder($customer, OrderStatus::Confirmed);

    $this->actingAs($customer)
        ->delete(route('orders.cancel', $order))
        ->assertForbidden();

    expect($order->fresh()->status)->toBe(OrderStatus::Confirmed)
        ->and(OrderStatusHistory::query()->where('order_id', $order->id)->count())->toBe(0);
});
