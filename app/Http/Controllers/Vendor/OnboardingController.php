<?php

namespace App\Http\Controllers\Vendor;

use App\Actions\Vendor\SaveVendorProfile;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\SaveVendorProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('vendor/onboarding', [
            'profile' => $request->user()->vendorProfile,
        ]);
    }

    public function update(SaveVendorProfileRequest $request, SaveVendorProfile $saveVendorProfile): RedirectResponse
    {
        $saveVendorProfile->handle($request->user(), $request->validated());

        return redirect()->route('vendor.dashboard')->with('success', 'Profil usaha berhasil disimpan.');
    }
}
