<?php

namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class ChangeOrderStatus
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function handle(Order $order, User $actor, OrderStatus $target, array $details = []): Order
    {
        return DB::transaction(function () use ($order, $actor, $target, $details): Order {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);
            $order = $lockedOrder;

            if ($actor->role === UserRole::Customer) {
                abort_if($target !== OrderStatus::Cancelled, 403);
                Gate::forUser($actor)->authorize('cancel', $order);
            } elseif ($actor->role === UserRole::Vendor) {
                Gate::forUser($actor)->authorize('update', $order);
                abort_if($target === OrderStatus::Cancelled && $order->status !== OrderStatus::Confirmed, 403);
            } else {
                abort(403);
            }

            if (! $order->status->canTransitionTo($target)) {
                throw ValidationException::withMessages([
                    'status' => 'Transisi status pesanan ini tidak diizinkan.',
                ]);
            }

            $attributes = ['status' => $target];
            $note = null;

            if ($target === OrderStatus::Cancelled) {
                if ($actor->role === UserRole::Vendor && blank($details['cancel_reason'] ?? null)) {
                    throw ValidationException::withMessages([
                        'cancel_reason' => 'Alasan pembatalan wajib diisi.',
                    ]);
                }

                $attributes['cancel_reason'] = $details['cancel_reason'] ?? null;
                $attributes['cancelled_at'] = now();
                $note = $details['cancel_reason'] ?? null;
            } elseif ($target === OrderStatus::Rejected) {
                if (blank($details['vendor_note'] ?? null)) {
                    throw ValidationException::withMessages([
                        'vendor_note' => 'Alasan penolakan wajib diisi.',
                    ]);
                }

                $attributes['vendor_note'] = $details['vendor_note'];
                $attributes['rejected_at'] = now();
                $note = $details['vendor_note'];
            } elseif ($target === OrderStatus::Confirmed) {
                if ($order->vendorProfile->blockedDates()->whereDate('date', $order->event_date)->exists()) {
                    throw ValidationException::withMessages([
                        'status' => 'Tanggal acara telah diblokir dan pesanan tidak dapat dikonfirmasi.',
                    ]);
                }

                if (! isset($details['price_final']) || ! is_numeric($details['price_final']) || (float) $details['price_final'] < 0) {
                    throw ValidationException::withMessages([
                        'price_final' => 'Harga final wajib diisi dengan nilai yang valid.',
                    ]);
                }

                $attributes['price_final'] = $details['price_final'];
                $attributes['price_note'] = $details['price_note'] ?? null;
                $attributes['confirmed_at'] = now();
                $note = $details['price_note'] ?? null;
            } elseif ($target === OrderStatus::Completed) {
                $attributes['completed_at'] = now();
            }

            $fromStatus = $order->status;
            $order->update($attributes);

            OrderStatusHistory::query()->create([
                'order_id' => $order->id,
                'from_status' => $fromStatus,
                'to_status' => $target,
                'changed_by' => $actor->id,
                'note' => $note,
            ]);

            $order->loadMissing(['customer', 'vendorProfile.user']);
            $recipient = $actor->role === UserRole::Customer
                ? $order->vendorProfile->user
                : $order->customer;

            $recipient->notify(new OrderStatusChanged($order, $target));

            return $order;
        });
    }
}
