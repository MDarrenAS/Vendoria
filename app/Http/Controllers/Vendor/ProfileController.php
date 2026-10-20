<?php

namespace App\Http\Controllers\Vendor;

use App\Actions\Vendor\SaveVendorProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\SaveVendorProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $profile = $request->user()->vendorProfile;
        Gate::authorize('update', $profile);

        return Inertia::render('vendor/profile', ['profile' => $profile]);
    }

    public function update(
        SaveVendorProfileRequest $request,
        SaveVendorProfile $saveVendorProfile,
    ): RedirectResponse {
        $vendorProfile = $request->user()->vendorProfile;
        Gate::authorize('update', $vendorProfile);
        $saveVendorProfile->handle($request->user(), $request->validated());

        return redirect()->route('vendor.profile.edit')->with('success', 'Profil usaha berhasil diperbarui.');
    }
}
