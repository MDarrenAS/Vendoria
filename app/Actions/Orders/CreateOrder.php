<?php

namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Service;
use App\Models\User;
use App\Notifications\OrderCreated as OrderCreatedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class CreateOrder
{
    public function __construct(private CalculateOrderPrice $calculateOrderPrice) {}

    /**
     * @param  array<string, mixed>  $draft
     */
    public function handle(User $customer, array $draft): Order
    {
        if ($customer->role !== UserRole::Customer) {
            throw ValidationException::withMessages([
                'order' => 'Hanya akun Panitia yang dapat mengajukan pesanan.',
            ]);
        }

        return DB::transaction(function () use ($customer, $draft): Order {
            $existingOrder = Order::query()
                ->where('idempotency_key', $draft['idempotency_key'])
                ->first();

            if ($existingOrder !== null) {
                return $this->existingOrderForCustomer($existingOrder, $customer);
            }

            $service = Service::query()
                ->with('vendorProfile.user')
                ->lockForUpdate()
                ->findOrFail($draft['service_id']);

            $existingOrder = Order::query()
                ->where('idempotency_key', $draft['idempotency_key'])
                ->first();

            if ($existingOrder !== null) {
                return $this->existingOrderForCustomer($existingOrder, $customer);
            }

            if (! $service->is_active || ! $service->vendorProfile->is_active) {
                throw ValidationException::withMessages([
                    'service_id' => 'Layanan ini tidak lagi tersedia.',
                ]);
            }

            $eventDate = now()->parse($draft['event_date'])->toDateString();

            if ($eventDate < today()->addDay()->toDateString()) {
                throw ValidationException::withMessages([
                    'event_date' => 'Tanggal acara harus minimal satu hari dari hari ini.',
                ]);
            }

            if ($service->vendorProfile->blockedDates()->whereDate('date', $eventDate)->exists()) {
                throw ValidationException::withMessages([
                    'event_date' => 'Tanggal tersebut tidak tersedia untuk vendor ini.',
                ]);
            }

            $quantity = (int) $draft['quantity'];

            if ($quantity < $service->min_quantity || ($service->max_quantity !== null && $quantity > $service->max_quantity)) {
                throw ValidationException::withMessages([
                    'quantity' => 'Jumlah di luar batas minimum atau maksimum layanan.',
                ]);
            }

            $pricing = $this->calculateOrderPrice->handle(
                $service,
                isset($draft['package_id']) ? (int) $draft['package_id'] : null,
                $quantity,
            );

            $order = Order::query()->create([
                'order_number' => $this->uniqueOrderNumber($eventDate),
                'idempotency_key' => $draft['idempotency_key'],
                'customer_id' => $customer->id,
                'vendor_profile_id' => $service->vendor_profile_id,
                'service_id' => $service->id,
                'package_id' => $pricing['package']?->id,
                'service_name_snapshot' => $service->name,
                'package_name_snapshot' => $pricing['package']?->name,
                'unit_price_snapshot' => $pricing['unit_price'],
                'event_name' => $draft['event_name'],
                'event_date' => $eventDate,
                'event_location' => $draft['event_location'],
                'event_city' => $draft['event_city'],
                'contact_name' => $draft['contact_name'],
                'contact_phone' => $draft['contact_phone'],
                'quantity' => $quantity,
                'notes' => $draft['notes'] ?? null,
                'extras' => $draft['extras'] ?? null,
                'price_estimate' => $pricing['total'],
                'status' => OrderStatus::Pending,
            ]);

            OrderStatusHistory::query()->create([
                'order_id' => $order->id,
                'from_status' => null,
                'to_status' => OrderStatus::Pending,
                'changed_by' => $customer->id,
                'note' => 'Pesanan diajukan.',
            ]);

            $service->vendorProfile->user->notify(new OrderCreatedNotification($order));

            return $order;
        });
    }

    private function existingOrderForCustomer(Order $order, User $customer): Order
    {
        abort_if($order->customer_id !== $customer->id, 403);

        return $order;
    }

    private function uniqueOrderNumber(string $eventDate): string
    {
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $orderNumber = 'VND-'.str_replace('-', '', $eventDate).'-'.str_pad((string) random_int(0, 99_999), 5, '0', STR_PAD_LEFT);

            if (! Order::query()->where('order_number', $orderNumber)->exists()) {
                return $orderNumber;
            }
        }

        throw new RuntimeException('Nomor pesanan unik tidak dapat dibuat. Silakan coba kembali.');
    }
}
