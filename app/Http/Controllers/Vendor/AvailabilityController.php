<?php

namespace App\Http\Controllers\Vendor;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\StoreAvailabilityRequest;
use App\Models\Order;
use App\Models\VendorBlockedDate;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvailabilityController extends Controller
{
    public function index(Request $request): Response
    {
        $vendorProfile = $request->user()->vendorProfile;

        return Inertia::render('vendor/availability', [
            'blockedDates' => $vendorProfile->blockedDates()->orderBy('date')->paginate(30),
            'bookedDates' => Order::query()
                ->where('vendor_profile_id', $vendorProfile->id)
                ->whereIn('status', [OrderStatus::Confirmed, OrderStatus::InProgress])
                ->orderBy('event_date')
                ->get(['order_number', 'event_date', 'status']),
        ]);
    }

    public function store(StoreAvailabilityRequest $request): RedirectResponse
    {
        $vendorProfile = $request->user()->vendorProfile;
        $startDate = CarbonImmutable::parse($request->validated('start_date'));
        $endDate = CarbonImmutable::parse($request->validated('end_date'));
        $blockedDates = [];

        for ($date = $startDate; $date->lte($endDate); $date = $date->addDay()) {
            $blockedDates[] = [
                'vendor_profile_id' => $vendorProfile->id,
                'date' => $date->toDateString(),
                'reason' => $request->validated('reason'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        VendorBlockedDate::query()->upsert(
            $blockedDates,
            ['vendor_profile_id', 'date'],
            ['reason', 'updated_at'],
        );

        return back()->with('success', 'Tanggal ketersediaan berhasil diperbarui.');
    }

    public function destroy(Request $request, int $blockedDate): RedirectResponse
    {
        $request->user()->vendorProfile->blockedDates()->whereKey($blockedDate)->firstOrFail()->delete();

        return back()->with('success', 'Tanggal tidak tersedia berhasil dihapus.');
    }
}
