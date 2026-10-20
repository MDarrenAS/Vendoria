<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Review::class);

        $reviews = $request->user()->vendorProfile->reviews()
            ->with(['customer:id,name', 'service:id,name,slug'])
            ->latest()
            ->paginate(15);

        return Inertia::render('vendor/reviews', ['reviews' => $reviews]);
    }
}
