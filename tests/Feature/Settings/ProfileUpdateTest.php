<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh()->name)->toBe('Akun dihapus')
        ->and($user->fresh()->is_active)->toBeFalse();
});

test('profile can update the phone number and upload an avatar to cloud storage', function () {
    Storage::fake('s3');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '081234567890',
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->phone)->toBe('6281234567890')
        ->and($user->avatar_path)->toStartWith('avatars/'.$user->id.'/');
    Storage::disk('s3')->assertExists($user->avatar_path);
});

test('profile rejects an invalid WhatsApp number', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => 'not-a-phone',
        ])
        ->assertSessionHasErrors(['phone' => 'Masukkan nomor WhatsApp Indonesia yang valid.']);
});

test('account deletion keeps order history and disables the vendor profile', function () {
    $user = User::factory()->vendor()->create();
    $vendorProfile = VendorProfile::factory()->for($user)->create();
    $customer = User::factory()->create();
    $service = Service::factory()->for($vendorProfile)->for(Category::factory())->create();
    $order = Order::factory()->for($customer, 'customer')->for($vendorProfile)->for($service)->create();

    $this->actingAs($user)
        ->delete(route('profile.destroy'), ['password' => 'password'])
        ->assertRedirect(route('home'));

    expect($user->fresh()->is_active)->toBeFalse()
        ->and($vendorProfile->fresh()->is_active)->toBeFalse()
        ->and($order->fresh()->vendor_profile_id)->toBe($vendorProfile->id);
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
