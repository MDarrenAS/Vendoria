<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use App\Notifications\ReviewReceived;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function makeReviewEligibleOrder(?User $customer = null): array
{
    $vendor = User::factory()->vendor()->create();
    $profile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $service = Service::factory()
        ->for($profile)
        ->for(Category::factory(['is_active' => true]))
        ->create(['is_active' => true]);
    $customer ??= User::factory()->create();
    $order = Order::factory()
        ->for($customer, 'customer')
        ->for($profile)
        ->for($service)
        ->completed()
        ->create();

    return [$order, $service, $profile, $customer];
}

test('customer can review a completed order and the rating is aggregated', function () {
    [$order, $service, $profile, $customer] = makeReviewEligibleOrder();
    Notification::fake([ReviewReceived::class]);

    $this->actingAs($customer)
        ->post(route('orders.review.store', $order), [
            'rating' => 4,
            'comment' => 'Layanan sangat membantu.',
        ])
        ->assertRedirect(route('orders.show', $order))
        ->assertSessionHas('success', 'Terima kasih, ulasan Anda berhasil dikirim.');

    $review = Review::query()->sole();

    expect($review->rating)->toBe(4)
        ->and($review->comment)->toBe('Layanan sangat membantu.')
        ->and($service->fresh()->rating_count)->toBe(1)
        ->and($service->fresh()->rating_avg)->toBe('4.0')
        ->and($profile->fresh()->rating_count)->toBe(1)
        ->and($profile->fresh()->rating_avg)->toBe('4.0');

    Notification::assertSentTo($profile->user, ReviewReceived::class);
});

test('customer can submit only one review for an order', function () {
    [$order, , , $customer] = makeReviewEligibleOrder($customer = User::factory()->create());

    $this->actingAs($customer)
        ->post(route('orders.review.store', $order), ['rating' => 5])
        ->assertRedirect();

    $this->post(route('orders.review.store', $order), ['rating' => 3])
        ->assertForbidden();

    expect(Review::query()->where('order_id', $order->id)->count())->toBe(1);
});

test('customer cannot review an incomplete or another customer order', function () {
    [$order, , , $customer] = makeReviewEligibleOrder();
    $pendingOrder = Order::factory()->create(['customer_id' => $customer->id]);
    $anotherCustomer = User::factory()->create();

    $this->actingAs($customer)
        ->post(route('orders.review.store', $pendingOrder), ['rating' => 5])
        ->assertForbidden();

    $this->actingAs($anotherCustomer)
        ->post(route('orders.review.store', $order), ['rating' => 5])
        ->assertForbidden();

    expect(Review::query()->count())->toBe(0);
});

test('customer receives an error for a rating outside the one-to-five range', function () {
    [$order, , , $customer] = makeReviewEligibleOrder();

    $this->actingAs($customer)
        ->from(route('orders.show', $order))
        ->post(route('orders.review.store', $order), ['rating' => 6])
        ->assertRedirect(route('orders.show', $order))
        ->assertSessionHasErrors([
            'rating' => 'Nilai ulasan harus antara 1 sampai 5.',
        ]);

    expect(Review::query()->count())->toBe(0);
});

test('public service detail only includes visible reviews', function () {
    [$order, $service, , $customer] = makeReviewEligibleOrder();
    Review::factory()->for($order)->create([
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'vendor_profile_id' => $order->vendor_profile_id,
        'is_visible' => false,
    ]);

    $this->get(route('services.show', $service))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/show')
            ->has('reviews.data', 0));
});

test('public service and vendor reviews are paginated', function () {
    [, $service, $profile] = makeReviewEligibleOrder();

    foreach (range(1, 11) as $index) {
        $order = Order::factory()
            ->for(User::factory()->create(), 'customer')
            ->for($profile)
            ->for($service)
            ->completed()
            ->create();

        Review::factory()->create([
            'order_id' => $order->id,
            'customer_id' => $order->customer_id,
            'service_id' => $service->id,
            'vendor_profile_id' => $profile->id,
        ]);
    }

    $this->get(route('services.show', $service))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('services/show')
            ->has('reviews.data', 10)
            ->where('reviews.last_page', 2));

    $this->get(route('vendors.show', $profile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('vendors/show')
            ->has('reviews.data', 10)
            ->where('reviews.last_page', 2));
});
