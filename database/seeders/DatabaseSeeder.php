<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(MarketplaceCatalogSeeder::class);

        User::factory()->create([
            'name' => 'Panitia Contoh',
            'email' => 'panitia@example.com',
        ]);
    }
}
