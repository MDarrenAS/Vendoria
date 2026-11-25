<?php

use App\Actions\Orders\CreateOrder;
use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\OrderAttachment;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use App\Notifications\OrderAttachmentAdded;
use App\Notifications\OrderAttachmentRequested;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->withoutVite();
    Storage::fake('local');
    config(['vendoria.attachments.disk' => 'local']);
});

test('all nine categories define attachment slots', function () {
    $categorySlugs = array_keys(config('vendoria.category_styles'));

    foreach ($categorySlugs as $slug) {
        expect(config('vendoria.category_attachment_slots.'.$slug))
            ->toBeArray()
            ->not->toBeEmpty();
    }
});

test('draft attachment upload validates file type and enforces required slots on order draft', function () {
    $customer = User::factory()->create();
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create([
        'name' => 'Dekorasi',
        'slug' => 'dekorasi',
        'is_active' => true,
    ]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create([
        'base_price' => 1500000,
        'is_active' => true,
        'min_quantity' => 1,
    ]);

    // Rejects unsupported file extension/mime for foto_lokasi (images only)
    $this->actingAs($customer)
        ->postJson(route('order.draft.attachments.store'), [
            'service_id' => $service->id,
            'slot_key' => 'foto_lokasi',
            'file' => UploadedFile::fake()->create('lokasi.pdf', 100, 'application/pdf'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('file');

    // Submitting draft without required layout_acara fails
    $this->actingAs($customer)
        ->post(route('order.draft'), [
            'service_id' => $service->id,
            'event_name' => 'Pernikahan Budi',
            'event_date' => now()->addDays(10)->toDateString(),
            'event_location' => 'Gedung Serbaguna',
            'event_city' => 'Jakarta',
            'contact_name' => 'Budi',
            'contact_phone' => '081234567890',
            'quantity' => 1,
        ])
        ->assertSessionHasErrors('attachments.layout_acara');

    // Upload valid layout_acara image
    $uploadResponse = $this->actingAs($customer)
        ->postJson(route('order.draft.attachments.store'), [
            'service_id' => $service->id,
            'slot_key' => 'layout_acara',
            'file' => UploadedFile::fake()->image('denah-aula.png', 800, 600),
        ])
        ->assertOk();

    $tempId = $uploadResponse->json('attachment.temp_id');
    expect($tempId)->toBeString()->not->toBeEmpty();

    // Submitting draft with required layout_acara succeeds
    $this->actingAs($customer)
        ->post(route('order.draft'), [
            'service_id' => $service->id,
            'event_name' => 'Pernikahan Budi',
            'event_date' => now()->addDays(10)->toDateString(),
            'event_location' => 'Gedung Serbaguna',
            'event_city' => 'Jakarta',
            'contact_name' => 'Budi',
            'contact_phone' => '081234567890',
            'quantity' => 1,
            'attachment_ids' => [$tempId],
        ])
        ->assertRedirect(route('order.review'));

    $draft = session('draft_order');
    $order = app(CreateOrder::class)->handle($customer, $draft);

    expect($order->attachments)->toHaveCount(1)
        ->and($order->attachments->first()->slot_key)->toBe('layout_acara')
        ->and($order->attachments->first()->original_name)->toBe('denah-aula.png');

    Storage::disk('local')->assertExists($order->attachments->first()->stored_path);
});

test('customer can add and delete attachments, vendor can view, download zip, and request missing attachments, unauthorized users are blocked', function () {
    Notification::fake();

    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();
    $vendor = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($vendor)->create(['is_active' => true]);
    $category = Category::factory()->create([
        'name' => 'Dekorasi',
        'slug' => 'dekorasi',
        'is_active' => true,
    ]);
    $service = Service::factory()->for($vendorProfile)->for($category)->create([
        'base_price' => 1500000,
        'is_active' => true,
        'min_quantity' => 1,
    ]);

    $order = app(CreateOrder::class)->handle($customer, [
        'idempotency_key' => (string) Str::uuid(),
        'service_id' => $service->id,
        'event_name' => 'Seminar Nasional',
        'event_date' => now()->addDays(12)->toDateString(),
        'event_location' => 'Balai Kartini',
        'event_city' => 'Jakarta',
        'contact_name' => 'Ani',
        'contact_phone' => '6281234567890',
        'quantity' => 1,
    ]);

    // Vendor requests missing required layout_acara
    $this->actingAs($vendor)
        ->post(route('orders.attachments.request', $order), [
            'slot_key' => 'layout_acara',
        ])
        ->assertRedirect();

    Notification::assertSentTo($customer, OrderAttachmentRequested::class);

    // Customer uploads attachment post-submission
    $this->actingAs($customer)
        ->post(route('orders.attachments.store', $order), [
            'slot_key' => 'layout_acara',
            'file' => UploadedFile::fake()->create('layout-revisi.pdf', 200, 'application/pdf'),
        ])
        ->assertRedirect();

    Notification::assertSentTo($vendor, OrderAttachmentAdded::class);

    $attachment = OrderAttachment::query()->where('order_id', $order->id)->firstOrFail();
    expect($attachment->is_post_submission)->toBeTrue();

    // Authorized customer and vendor can view/download
    $this->actingAs($customer)
        ->get(route('orders.attachments.show', [$order, $attachment]))
        ->assertOk();

    $this->actingAs($vendor)
        ->get(route('orders.attachments.show', [$order, $attachment]))
        ->assertOk();

    $this->actingAs($vendor)
        ->get(route('orders.attachments.zip', $order))
        ->assertOk();

    // Unauthorized user is blocked
    $this->actingAs($otherCustomer)
        ->get(route('orders.attachments.show', [$order, $attachment]))
        ->assertForbidden();

    $this->actingAs($otherCustomer)
        ->get(route('orders.attachments.zip', $order))
        ->assertForbidden();

    // Customer can delete while pending
    $this->actingAs($customer)
        ->delete(route('orders.attachments.destroy', [$order, $attachment]))
        ->assertRedirect();

    expect(OrderAttachment::query()->find($attachment->id))->toBeNull();
    Storage::disk('local')->assertMissing($attachment->stored_path);

    // Once confirmed, customer cannot delete attachment
    $this->actingAs($customer)
        ->post(route('orders.attachments.store', $order), [
            'slot_key' => 'layout_acara',
            'file' => UploadedFile::fake()->image('layout-final.jpg'),
        ])
        ->assertRedirect();

    $finalAttachment = OrderAttachment::query()->where('order_id', $order->id)->firstOrFail();
    $order->update(['status' => OrderStatus::Confirmed]);

    $this->actingAs($customer)
        ->delete(route('orders.attachments.destroy', [$order, $finalAttachment]))
        ->assertSessionHasErrors('attachment');
});
