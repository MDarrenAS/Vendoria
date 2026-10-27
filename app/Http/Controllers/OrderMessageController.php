<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderMessageRequest;
use App\Models\Order;
use App\Models\OrderMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class OrderMessageController extends Controller
{
    public function index(Request $request, Order $order): JsonResponse
    {
        Gate::authorize('chat', $order);

        $filters = $request->validate([
            'after_id' => ['nullable', 'integer', 'min:0'],
        ]);

        $messagesQuery = $order->messages()
            ->with('sender:id,name')
            ->orderBy('id');

        if (array_key_exists('after_id', $filters)) {
            $messagesQuery->where('id', '>', $filters['after_id']);
        }

        $messages = $messagesQuery
            ->limit(100)
            ->get()
            ->map(fn (OrderMessage $message): array => [
                'id' => $message->id,
                'body' => $message->body,
                'created_at' => $message->created_at->toIso8601String(),
                'sender_id' => $message->sender_id,
                'sender_name' => $message->sender->name,
            ]);

        return response()->json(['messages' => $messages]);
    }

    public function store(
        StoreOrderMessageRequest $request,
        Order $order,
    ): RedirectResponse {
        $order->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => trim($request->validated('body')),
        ]);

        return back();
    }
}
