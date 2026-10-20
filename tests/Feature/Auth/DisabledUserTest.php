<?php

use App\Models\User;

test('disabled accounts receive a clear message when attempting to sign in', function () {
    $user = User::factory()->create(['is_active' => false]);

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertSessionHasErrors([
        'email' => 'Akun Anda dinonaktifkan. Hubungi administrator.',
    ]);
});

test('an authenticated user is signed out after the account is disabled', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $user->update(['is_active' => false]);

    $this->get(route('dashboard'))
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors([
            'email' => 'Akun Anda dinonaktifkan. Hubungi administrator.',
        ]);
});
