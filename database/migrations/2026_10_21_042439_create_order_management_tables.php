<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->string('order_number', 24)->unique();
            $table->string('idempotency_key', 64)->unique();
            $table->foreignId('customer_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('vendor_profile_id')->constrained()->restrictOnDelete();
            $table->foreignId('service_id')->constrained()->restrictOnDelete();
            $table->foreignId('package_id')->nullable()->constrained('service_packages')->nullOnDelete();
            $table->string('service_name_snapshot');
            $table->string('package_name_snapshot')->nullable();
            $table->decimal('unit_price_snapshot', 14, 2);
            $table->string('event_name');
            $table->date('event_date')->index();
            $table->string('event_location');
            $table->string('event_city');
            $table->string('contact_name');
            $table->string('contact_phone', 20);
            $table->unsignedInteger('quantity');
            $table->text('notes')->nullable();
            $table->jsonb('extras')->nullable();
            $table->decimal('price_estimate', 14, 2);
            $table->decimal('price_final', 14, 2)->nullable();
            $table->text('price_note')->nullable();
            $table->string('status', 20)->default('pending')->index();
            $table->text('vendor_note')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
            $table->index(['customer_id', 'status', 'created_at']);
            $table->index(['vendor_profile_id', 'status', 'created_at']);
            $table->index(['vendor_profile_id', 'event_date', 'status']);
        });

        Schema::create('order_status_histories', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20);
            $table->foreignId('changed_by')->constrained('users')->restrictOnDelete();
            $table->text('note')->nullable();
            $table->timestamps();
            $table->index(['order_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_histories');
        Schema::dropIfExists('orders');
    }
};
