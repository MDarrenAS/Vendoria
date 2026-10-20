<?php

namespace App\Models;

use App\Support\VendoriaMedia;
use Database\Factories\VendorProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class VendorProfile extends Model
{
    /** @use HasFactory<VendorProfileFactory> */
    use HasFactory, SoftDeletes;

    protected $appends = ['logo_url', 'cover_url'];

    protected $fillable = [
        'user_id', 'business_name', 'slug', 'description', 'city', 'province',
        'address', 'whatsapp_number', 'contact_email', 'logo_path', 'cover_path',
        'instagram', 'is_verified', 'is_active', 'rating_avg', 'rating_count',
    ];

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'rating_avg' => 'decimal:1',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function blockedDates(): HasMany
    {
        return $this->hasMany(VendorBlockedDate::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getLogoUrlAttribute(): ?string
    {
        return VendoriaMedia::url($this->logo_path);
    }

    public function getCoverUrlAttribute(): ?string
    {
        return VendoriaMedia::url($this->cover_path);
    }
}
