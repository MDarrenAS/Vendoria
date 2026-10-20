<?php

namespace App\Http\Controllers\Vendor;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $vendorProfile = $request->user()->vendorProfile;
        $monthStart = now()->startOfMonth();
        $monthEnd = now()->endOfMonth();
        $pendingOrders = Order::query()
            ->where('vendor_profile_id', $vendorProfile->id)
            ->where('status', OrderStatus::Pending)
            ->with(['customer:id,name', 'service:id,name,slug'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('vendor/dashboard', [
            'stats' => [
                'pendingOrders' => Order::query()
                    ->where('vendor_profile_id', $vendorProfile->id)
                    ->where('status', OrderStatus::Pending)
                    ->count(),
                'monthlyOrders' => Order::query()
                    ->where('vendor_profile_id', $vendorProfile->id)
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->count(),
                'activeServices' => Service::query()
                    ->where('vendor_profile_id', $vendorProfile->id)
                    ->where('is_active', true)
                    ->count(),
                'monthlyRevenue' => Order::query()
                    ->where('vendor_profile_id', $vendorProfile->id)
                    ->where('status', OrderStatus::Completed)
                    ->whereBetween('completed_at', [$monthStart, $monthEnd])
                    ->sum('price_final'),
                'ratingAverage' => $vendorProfile->rating_avg,
                'ratingCount' => $vendorProfile->rating_count,
                'staleOrders' => Order::query()
                    ->where('vendor_profile_id', $vendorProfile->id)
                    ->where('status', OrderStatus::Pending)
                    ->where('created_at', '<=', now()->subHours(24))
                    ->count(),
            ],
            'pendingOrders' => $pendingOrders,
            'services' => $vendorProfile->services()
                ->with('category:id,name')
                ->latest()
                ->limit(6)
                ->get(['id', 'category_id', 'name', 'slug', 'is_active', 'base_price']),
            'notifications' => $request->user()->notifications()->latest()->limit(5)->get(),
        ]);
    }
}
