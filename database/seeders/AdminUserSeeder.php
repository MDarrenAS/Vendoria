<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = config('vendoria.admin.email');
        $password = config('vendoria.admin.password');

        if (! is_string($email)) {
            throw new RuntimeException('Atur VENDORIA_ADMIN_EMAIL dengan alamat email yang valid sebelum menjalankan seeder admin.');
        }

        $email = Str::lower(trim($email));

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new RuntimeException('Atur VENDORIA_ADMIN_EMAIL dengan alamat email yang valid sebelum menjalankan seeder admin.');
        }

        if (! is_string($password) || mb_strlen($password) < 12) {
            throw new RuntimeException('Atur VENDORIA_ADMIN_PASSWORD minimal 12 karakter sebelum menjalankan seeder admin.');
        }

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Admin Vendoria',
                'password' => $password,
                'role' => UserRole::Admin,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
