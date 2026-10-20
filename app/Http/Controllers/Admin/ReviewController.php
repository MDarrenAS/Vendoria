<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Orders\RecalculateReviewRatings;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Review::class);

        $reviews = Review::query()
            ->with([
                'order:id,order_number',
                'customer:id,name,email',
                'vendorProfile:id,business_name',
                'service:id,name,slug',
            ])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/reviews', ['reviews' => $reviews]);
    }

    public function update(
        UpdateReviewRequest $request,
        Review $review,
        RecalculateReviewRatings $recalculateReviewRatings,
    ): RedirectResponse {
        Gate::authorize('moderate', $review);

        DB::transaction(function () use ($request, $review, $recalculateReviewRatings): void {
            $review->update($request->validated());
            $recalculateReviewRatings->handle($review);
        });
        Cache::forget('marketplace.home.v2');

        return back()->with('success', 'Visibilitas ulasan berhasil diperbarui.');
    }
}
