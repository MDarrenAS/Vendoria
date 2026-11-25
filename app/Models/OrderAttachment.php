<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'slot_key',
        'original_name',
        'stored_path',
        'mime_type',
        'size_bytes',
        'uploaded_by',
        'is_post_submission',
    ];

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
            'is_post_submission' => 'boolean',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
