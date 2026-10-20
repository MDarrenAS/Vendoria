<?php

namespace App\Http\Controllers\Vendor;

use App\Actions\Vendor\SaveVendorService;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\SaveServiceRequest;
use App\Models\Category;
use App\Models\Order;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Service::class);

        return Inertia::render('vendor/services/index', [
            'services' => $request->user()->vendorProfile->services()
                ->with(['category:id,name', 'packages:id,service_id,name,price,is_active', 'images:id,service_id,path,is_cover,sort_order'])
                ->latest()
                ->paginate(12),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Service::class);

        return Inertia::render('vendor/services/form', [
            'service' => null,
            'categories' => Category::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    public function store(SaveServiceRequest $request, SaveVendorService $saveVendorService): RedirectResponse
    {
        $service = $saveVendorService->handle(
            $request->user()->vendorProfile,
            $request->validated(),
        );

        return redirect()->route('vendor.services.edit', $service)->with('success', 'Layanan berhasil dibuat.');
    }

    public function edit(Service $service): Response
    {
        Gate::authorize('update', $service);

        return Inertia::render('vendor/services/form', [
            'service' => $service->load(['packages', 'images']),
            'categories' => Category::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    public function update(
        SaveServiceRequest $request,
        SaveVendorService $saveVendorService,
        Service $service,
    ): RedirectResponse {
        $service = $saveVendorService->handle(
            $request->user()->vendorProfile,
            $request->validated(),
            $service,
        );

        return redirect()->route('vendor.services.edit', $service)->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        Gate::authorize('delete', $service);

        if (Order::query()
            ->where('service_id', $service->id)
            ->whereIn('status', [OrderStatus::Pending, OrderStatus::Confirmed, OrderStatus::InProgress])
            ->exists()) {
            throw ValidationException::withMessages([
                'service' => 'Layanan memiliki pesanan aktif. Nonaktifkan layanan, jangan hapus.',
            ]);
        }

        $service->update(['is_active' => false]);
        $service->packages()->update(['is_active' => false]);
        $service->images()->get()->each(function ($image): void {
            if (! str_starts_with($image->path, 'placeholder:')) {
                Storage::disk('s3')->delete($image->path);
            }

            $image->delete();
        });
        $service->delete();

        return redirect()->route('vendor.services.index')->with('success', 'Layanan berhasil dihapus.');
    }
}
