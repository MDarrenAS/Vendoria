<?php

namespace App\Models;

use Database\Factories\VendorBlockedDateFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorBlockedDate extends Model
{
    /** @use HasFactory<VendorBlockedDateFactory> */
    use HasFactory;

    protected $fillable = ['vendor_profile_id', 'date', 'reason'];

    protected function casts(): array
    {
        return ['date' => 'date'];
    }

    public function vendorProfile(): BelongsTo
    {
        return $this->belongsTo(VendorProfile::class);
    }
}
