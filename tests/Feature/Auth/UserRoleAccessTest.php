<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('vendors can register and are sent to their dashboard', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Vendor Contoh',
        'email' => 'vendor@example.com',
        'role' => 'vendor',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('vendor.dashboard', absolute: false));
    $this->assertDatabaseHas('users', [
        'email' => 'vendor@example.com',
        'role' => 'vendor',
    ]);
});

test('registration cannot assign the admin role', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Admin Palsu',
        'email' => 'not-admin@example.com',
        'role' => 'admin',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('role');
    $this->assertDatabaseMissing('users', [
        'email' => 'not-admin@example.com',
    ]);
});

test('customers cannot access the vendor dashboard', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('vendor.dashboard'))
        ->assertForbidden();
});

test('vendors cannot access the admin dashboard or customer orders', function () {
    $vendor = User::factory()->vendor()->create();

    $this->actingAs($vendor)
        ->get(route('admin.dashboard'))
        ->assertForbidden();

    $this->get(route('orders.index'))
        ->assertForbidden();
});

test('admin can access the admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk();
});

test('vendors are redirected from the storefront to their workspace', function () {
    $vendor = User::factory()->vendor()->create();

    $this->actingAs($vendor)
        ->get(route('home'))
        ->assertRedirect(route('vendor.dashboard', absolute: false));
});

test('admins can return to the public homepage', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('home'))
        ->assertOk();
});

test('vendor registration entry preselects the vendor role', function () {
    $this->get(route('register', ['role' => 'vendor']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/register')
            ->where('selectedRole', 'vendor'));
});

test('login redirects users to the dashboard for their role', function (string $role, string $destination) {
    $user = User::factory()->create(['role' => $role]);

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect($destination);
})->with([
    'customer' => ['customer', '/'],
    'vendor' => ['vendor', '/vendor/dashboard'],
    'admin' => ['admin', '/admin'],
]);

test('inactive users cannot authenticate', function () {
    $inactiveUser = User::factory()->inactive()->create();

    $response = $this->post(route('login'), [
        'email' => $inactiveUser->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('registration is rate limited by client IP', function () {
    for ($attempt = 1; $attempt <= 5; $attempt++) {
        $this->post(route('register.store'), [
            'name' => 'Panitia '.$attempt,
            'email' => "panitia{$attempt}@example.com",
            'role' => 'customer',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertRedirect(route('home', absolute: false));

        $this->post(route('logout'));
    }

    $this->post(route('register.store'), [
        'name' => 'Panitia Keenam',
        'email' => 'panitia6@example.com',
        'role' => 'customer',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertTooManyRequests();
});
