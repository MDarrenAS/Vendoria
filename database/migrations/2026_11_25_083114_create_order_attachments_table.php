<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('slot_key', 80);
            $table->string('original_name', 255);
            $table->string('stored_path', 500);
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size_bytes');
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_post_submission')->default(false);
            $table->timestamps();

            $table->index(['order_id', 'slot_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_attachments');
    }
};
