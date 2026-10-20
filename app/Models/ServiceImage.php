<?php

namespace App\Models;

use App\Support\VendoriaMedia;
use Database\Factories\ServiceImageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceImage extends Model
{
    /** @use HasFactory<ServiceImageFactory> */
    use HasFactory;

    protected $appends = ['url'];

    protected $fillable = ['service_id', 'path', 'caption', 'is_cover', 'sort_order'];

    protected function casts(): array
    {
        return [
            'is_cover' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function getUrlAttribute(): ?string
    {
        return VendoriaMedia::url($this->path);
    }
}
