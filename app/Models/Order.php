<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'order_number', 'idempotency_key', 'customer_id', 'vendor_profile_id',
        'service_id', 'package_id', 'service_name_snapshot', 'package_name_snapshot',
        'unit_price_snapshot', 'event_name', 'event_date', 'event_location',
        'event_city', 'contact_name', 'contact_phone', 'quantity', 'notes',
        'extras', 'price_estimate', 'price_final', 'price_note', 'status',
        'payment_status', 'paid_at', 'payment_method',
        'vendor_note', 'cancel_reason', 'confirmed_at', 'completed_at',
        'cancelled_at', 'rejected_at',
    ];

    protected $hidden = ['idempotency_key'];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'extras' => 'array',
            'quantity' => 'integer',
            'unit_price_snapshot' => 'decimal:2',
            'price_estimate' => 'decimal:2',
            'price_final' => 'decimal:2',
            'status' => OrderStatus::class,
            'paid_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'order_number';
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function vendorProfile(): BelongsTo
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class)->withTrashed();
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class)->withTrashed();
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(OrderMessage::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
