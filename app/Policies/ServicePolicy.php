<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::Vendor;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Vendor && $user->vendorProfile !== null;
    }

    public function update(User $user, Service $service): bool
    {
        return $user->role === UserRole::Vendor
            && $user->vendorProfile?->id === $service->vendor_profile_id;
    }

    public function delete(User $user, Service $service): bool
    {
        return $this->update($user, $service);
    }

    public function manage(User $user, Service $service): bool
    {
        return $user->role === UserRole::Admin;
    }
}
