<?php

namespace App\Models;

use App\Enums\PriceUnit;
use App\Support\VendoriaMedia;
use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory, SoftDeletes;

    protected $appends = ['cover_url'];

    protected $fillable = [
        'vendor_profile_id', 'category_id', 'name', 'slug', 'description',
        'base_price', 'price_unit', 'min_quantity', 'max_quantity',
        'city_coverage', 'terms', 'is_active', 'rating_avg', 'rating_count',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'price_unit' => PriceUnit::class,
            'is_active' => 'boolean',
            'rating_avg' => 'decimal:1',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function vendorProfile(): BelongsTo
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(ServicePackage::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ServiceImage::class)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getCoverUrlAttribute(): string
    {
        $coverPath = $this->images->firstWhere('is_cover', true)?->path;

        return VendoriaMedia::url($coverPath) ?? asset('images/event-placeholder.jpg');
    }
}
