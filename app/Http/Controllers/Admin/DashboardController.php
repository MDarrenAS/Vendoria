<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $period = $request->string('period')->toString();
        if (! in_array($period, ['all', 'month', '30d', '7d', 'today'], true)) {
            $period = 'all';
        }

        $ordersByStatus = Order::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $paidOrdersBaseQuery = Order::query()
            ->where('payment_status', 'paid')
            ->whereNotIn('status', [OrderStatus::Cancelled, OrderStatus::Rejected]);

        $filteredPaidQuery = (clone $paidOrdersBaseQuery)
            ->when($period === 'today', fn ($query) => $query->whereDate('paid_at', today()))
            ->when($period === '7d', fn ($query) => $query->where('paid_at', '>=', now()->subDays(7)))
            ->when($period === '30d', fn ($query) => $query->where('paid_at', '>=', now()->subDays(30)))
            ->when($period === 'month', fn ($query) => $query->whereBetween('paid_at', [now()->startOfMonth(), now()->endOfMonth()]));

        $totalEarnings = (float) (clone $paidOrdersBaseQuery)->sum('admin_fee');
        $periodEarnings = (float) (clone $filteredPaidQuery)->sum('admin_fee');
        $periodPaidOrders = (clone $filteredPaidQuery)->count();
        $periodTransactionVolume = (float) (clone $filteredPaidQuery)
            ->selectRaw('COALESCE(SUM(COALESCE(price_final, price_estimate)), 0) as volume')
            ->value('volume');

        return Inertia::render('admin/dashboard', [
            'period' => $period,
            'stats' => [
                'users' => User::query()->count(),
                'vendors' => VendorProfile::query()->count(),
                'orders' => Order::query()->count(),
                'totalEarnings' => $totalEarnings,
                'periodEarnings' => $periodEarnings,
                'periodPaidOrders' => $periodPaidOrders,
                'periodTransactionVolume' => $periodTransactionVolume,
                'ordersByStatus' => array_map(
                    fn (OrderStatus $status): array => [
                        'value' => $status->value,
                        'label' => $status->label(),
                        'total' => (int) ($ordersByStatus[$status->value] ?? 0),
                    ],
                    OrderStatus::cases(),
                ),
            ],
        ]);
    }
}
