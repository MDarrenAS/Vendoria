<?php

namespace App\Http\Controllers\Public;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->role === UserRole::Vendor) {
            return to_route('vendor.dashboard');
        }

        $catalog = Cache::remember('marketplace.home.v3', now()->addMinutes(10), function (): array {
            $categories = Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'icon']);

            $vendorCounts = Service::query()
                ->join('vendor_profiles', 'services.vendor_profile_id', '=', 'vendor_profiles.id')
                ->join('users', 'vendor_profiles.user_id', '=', 'users.id')
                ->where('services.is_active', true)
                ->whereNull('vendor_profiles.deleted_at')
                ->where('vendor_profiles.is_active', true)
                ->where('users.is_active', true)
                ->select('services.category_id')
                ->selectRaw('count(distinct services.vendor_profile_id) as vendor_count')
                ->groupBy('services.category_id')
                ->pluck('vendor_count', 'services.category_id');

            $categories->each(fn (Category $category) => $category->setAttribute(
                'vendor_count',
                (int) ($vendorCounts[$category->id] ?? 0),
            ));

            $baseQuery = Service::query()
                ->where('is_active', true)
                ->whereHas('vendorProfile', fn ($query) => $query
                    ->where('is_active', true)
                    ->whereHas('user', fn ($userQuery) => $userQuery->where('is_active', true)))
                ->whereHas('category', fn ($query) => $query->where('is_active', true))
                ->with([
                    'vendorProfile:id,business_name,slug,city,is_verified,rating_avg,rating_count',
                    'category:id,name,slug',
                    'images:id,service_id,path,is_cover,sort_order',
                    'packages' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
                ]);

            $featuredServices = (clone $baseQuery)
                ->whereHas('vendorProfile', fn ($query) => $query->where('is_verified', true))
                ->orderByDesc('rating_avg')
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->limit(4)
                ->get();

            $newestServices = (clone $baseQuery)
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->limit(8)
                ->get();

            return [
                'categories' => $categories->toArray(),
                'featuredServices' => $featuredServices->toArray(),
                'newestServices' => $newestServices->toArray(),
            ];
        });

        return Inertia::render('welcome', $catalog);
    }
}
