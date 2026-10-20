<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VendorSearchController extends Controller
{
    public function __invoke(Request $request): Response
    {
        if (is_string($request->input('category')) && $request->input('category') !== '') {
            $request->merge(['category' => [$request->input('category')]]);
        }

        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'array'],
            'category.*' => ['string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'price_min' => ['nullable', 'numeric', 'min:0'],
            'price_max' => ['nullable', 'numeric', 'min:0', 'gte:price_min'],
            'rating_min' => ['nullable', 'numeric', 'between:0,5'],
            'date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:today'],
            'sort' => ['nullable', Rule::in(['relevance', 'price_asc', 'price_desc', 'rating', 'newest'])],
        ]);

        $search = trim((string) ($filters['q'] ?? ''));

        $services = Service::query()
            ->where('services.is_active', true)
            ->whereHas('vendorProfile', fn ($query) => $query
                ->where('is_active', true)
                ->whereHas('user', fn ($userQuery) => $userQuery->where('is_active', true)))
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->with([
                'vendorProfile:id,business_name,slug,city,is_verified,rating_avg,rating_count',
                'category:id,name,slug',
                'images:id,service_id,path,is_cover,sort_order',
                'packages' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
            ])
            ->when($search !== '', function ($query) use ($search): void {
                $term = mb_strtolower($search);
                $pattern = '%'.$term.'%';

                $query->where(function ($query) use ($pattern): void {
                    $query->whereRaw('LOWER(services.name) LIKE ?', [$pattern])
                        ->orWhereHas('vendorProfile', fn ($vendorQuery) => $vendorQuery->whereRaw('LOWER(business_name) LIKE ?', [$pattern]))
                        ->orWhereHas('category', fn ($categoryQuery) => $categoryQuery->whereRaw('LOWER(name) LIKE ?', [$pattern]));
                });
            })
            ->when(! empty($filters['category']), function ($query) use ($filters): void {
                $query->whereHas('category', fn ($categoryQuery) => $categoryQuery->whereIn('slug', $filters['category']));
            })
            ->when(! empty($filters['city']), function ($query) use ($filters): void {
                $city = mb_strtolower($filters['city']);
                $query->whereHas('vendorProfile', fn ($vendorQuery) => $vendorQuery->whereRaw('LOWER(city) LIKE ?', ['%'.$city.'%']));
            })
            ->when(isset($filters['price_min']), fn ($query) => $query->where('base_price', '>=', $filters['price_min']))
            ->when(isset($filters['price_max']), fn ($query) => $query->where('base_price', '<=', $filters['price_max']))
            ->when(isset($filters['rating_min']), fn ($query) => $query->where('rating_avg', '>=', $filters['rating_min']))
            ->when(! empty($filters['date']), function ($query) use ($filters): void {
                $query->whereDoesntHave('vendorProfile.blockedDates', fn ($dateQuery) => $dateQuery->whereDate('date', $filters['date']));
            });

        match ($filters['sort'] ?? 'relevance') {
            'price_asc' => $services->orderBy('base_price')->orderBy('id'),
            'price_desc' => $services->orderByDesc('base_price')->orderByDesc('id'),
            'rating' => $services->orderByDesc('rating_avg')->orderByDesc('rating_count')->orderByDesc('id'),
            'newest' => $services->orderByDesc('created_at')->orderByDesc('id'),
            default => $services->orderByDesc('rating_avg')->orderByDesc('created_at')->orderByDesc('id'),
        };

        $resultCount = (clone $services)->count();

        return Inertia::render('vendors/index', [
            'services' => $services->paginate(12)->withQueryString(),
            'categories' => Category::query()->where('is_active', true)->orderBy('sort_order')->get(['name', 'slug']),
            'filters' => [
                'q' => $filters['q'] ?? '',
                'category' => $filters['category'] ?? [],
                'city' => $filters['city'] ?? '',
                'price_min' => $filters['price_min'] ?? '',
                'price_max' => $filters['price_max'] ?? '',
                'rating_min' => $filters['rating_min'] ?? '',
                'date' => $filters['date'] ?? '',
                'sort' => $filters['sort'] ?? 'relevance',
            ],
            'resultCount' => $resultCount,
        ]);
    }
}
