<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $catalog = Cache::remember('marketplace.home.v2', now()->addMinutes(10), function (): array {
            $categories = Category::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'icon']);

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
