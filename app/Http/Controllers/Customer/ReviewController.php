<?php

namespace App\Http\Controllers\Customer;

use App\Actions\Orders\RecordReview;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreReviewRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, Order $order, RecordReview $recordReview): RedirectResponse
    {
        $recordReview->handle($order, $request->user(), $request->validated());

        return redirect()->route('orders.show', $order)
            ->with('success', 'Terima kasih, ulasan Anda berhasil dikirim.');
    }
}
