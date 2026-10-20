<?php

namespace App\Models;

use Database\Factories\ServicePackageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServicePackage extends Model
{
    /** @use HasFactory<ServicePackageFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_id', 'name', 'description', 'price', 'features', 'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'features' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
