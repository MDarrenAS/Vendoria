<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\VendorProfile;

class VendorProfilePolicy
{
    public function update(User $user, VendorProfile $vendorProfile): bool
    {
        return $user->role === UserRole::Vendor
            && $vendorProfile->user_id === $user->id;
    }
}
