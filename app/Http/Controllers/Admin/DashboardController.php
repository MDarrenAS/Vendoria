<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $ordersByStatus = Order::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'users' => User::query()->count(),
                'vendors' => VendorProfile::query()->count(),
                'orders' => Order::query()->count(),
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
