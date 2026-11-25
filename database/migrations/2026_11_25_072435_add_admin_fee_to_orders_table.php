<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->decimal('admin_fee', 14, 2)->default(0)->after('price_final');
        });

        $rate = (float) config('vendoria.business.admin_fee_rate', 0.03);

        DB::table('orders')->update([
            'admin_fee' => DB::raw('ROUND(COALESCE(price_final, price_estimate) * '.number_format($rate, 6, '.', '').', 0)'),
        ]);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropColumn('admin_fee');
        });
    }
};
