<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateServiceStatusRequest;
use App\Http\Requests\Admin\UpdateVendorRequest;
use App\Models\Service;
use App\Models\VendorProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->role === UserRole::Admin, 403);

        $vendors = VendorProfile::query()
            ->with('user:id,name,email')
            ->withCount('services')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/vendors', ['vendors' => $vendors]);
    }

    public function services(Request $request): Response
    {
        abort_unless($request->user()->role === UserRole::Admin, 403);

        $services = Service::query()
            ->with('vendorProfile:id,business_name,slug')
            ->with('category:id,name')
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/services', ['services' => $services]);
    }

    public function update(UpdateVendorRequest $request, VendorProfile $vendor): RedirectResponse
    {
        $vendor->update($request->validated());
        Cache::forget('marketplace.home');

        return back()->with('success', 'Status vendor berhasil diperbarui.');
    }

    public function updateServiceStatus(
        UpdateServiceStatusRequest $request,
        Service $service,
    ): RedirectResponse {
        Gate::authorize('manage', $service);
        $attributes = $request->validated();

        if ($request->boolean('is_active')) {
            $service->loadMissing(['vendorProfile.user', 'category']);

            if (! $service->vendorProfile->is_active || ! $service->vendorProfile->user->is_active) {
                throw ValidationException::withMessages([
                    'is_active' => 'Aktifkan akun dan profil vendor sebelum mengaktifkan layanan.',
                ]);
            }

            if (! $service->category->is_active) {
                throw ValidationException::withMessages([
                    'is_active' => 'Aktifkan kategori layanan sebelum mengaktifkan layanan.',
                ]);
            }

            if (! $service->packages()->where('is_active', true)->exists()
                || ! $service->images()->where('is_cover', true)->exists()) {
                throw ValidationException::withMessages([
                    'is_active' => 'Layanan harus memiliki paket aktif dan foto cover sebelum dipublikasikan.',
                ]);
            }
        }

        $service->update($attributes);
        Cache::forget('marketplace.home');

        return back()->with('success', 'Status layanan berhasil diperbarui.');
    }
}
