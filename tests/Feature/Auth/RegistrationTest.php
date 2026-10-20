<?php

use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'role' => 'customer',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home', absolute: false));
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'role' => 'customer',
        'is_active' => true,
    ]);
});

test('registration requires a password of at least eight characters', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'short-password@example.com',
        'role' => 'customer',
        'password' => 'short',
        'password_confirmation' => 'short',
    ]);

    $response->assertSessionHasErrors('password');
    $this->assertDatabaseMissing('users', [
        'email' => 'short-password@example.com',
    ]);
});
