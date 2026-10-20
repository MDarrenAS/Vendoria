<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('REVOKE ALL PRIVILEGES ON SCHEMA public FROM PUBLIC');
        DB::statement('REVOKE ALL PRIVILEGES ON SCHEMA public FROM anon, authenticated');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        throw new LogicException('This API access migration cannot be rolled back automatically.');
    }
};
