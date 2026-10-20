<?php

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use App\Notifications\OrderStatusChanged;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createNotifiableOrder(User $customer): Order
{
    $vendorProfile = VendorProfile::factory()->create();
    $service = Service::factory()
        ->for($vendorProfile)
        ->for(Category::factory())
        ->create();

    return Order::factory()
        ->for($customer, 'customer')
        ->for($vendorProfile)
        ->for($service)
        ->create(['status' => OrderStatus::Pending]);
}

test('customer can view notifications and mark a notification as read', function () {
    $customer = User::factory()->create();
    $order = createNotifiableOrder($customer);
    $customer->notify(new OrderStatusChanged($order, OrderStatus::Confirmed));
    $notification = $customer->notifications()->sole();

    $this->actingAs($customer)
        ->get(route('notifications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('notifications/index')
            ->where('unreadCount', 1)
            ->where('notifications.data.0.data.order_number', $order->order_number));

    $this->patch(route('notifications.read', $notification->id))
        ->assertRedirect();

    expect($notification->fresh()->read_at)->not->toBeNull();
});

test('customer cannot mark another user notification as read', function () {
    $recipient = User::factory()->create();
    $otherCustomer = User::factory()->create();
    $order = createNotifiableOrder($otherCustomer);
    $otherCustomer->notify(new OrderStatusChanged($order, OrderStatus::Confirmed));
    $notification = $otherCustomer->notifications()->sole();

    $this->actingAs($recipient)
        ->patch(route('notifications.read', $notification->id))
        ->assertNotFound();

    expect($notification->fresh()->read_at)->toBeNull();
});

test('customer can mark all notifications as read', function () {
    $customer = User::factory()->create();
    $order = createNotifiableOrder($customer);
    $customer->notify(new OrderStatusChanged($order, OrderStatus::Confirmed));

    $this->actingAs($customer)
        ->post(route('notifications.read-all'))
        ->assertRedirect();

    expect($customer->unreadNotifications()->count())->toBe(0);
});
