<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Category::class);

        return Inertia::render('admin/categories', [
            'categories' => Category::query()->orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::query()->create($request->validated());
        Cache::forget('marketplace.home.v2');

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());
        Cache::forget('marketplace.home.v2');

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        Gate::authorize('delete', $category);

        if (Service::withTrashed()->where('category_id', $category->id)->exists()) {
            throw ValidationException::withMessages([
                'category' => 'Kategori yang sudah digunakan layanan tidak dapat dihapus. Nonaktifkan kategori saja.',
            ]);
        }

        $category->delete();
        Cache::forget('marketplace.home.v2');

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
