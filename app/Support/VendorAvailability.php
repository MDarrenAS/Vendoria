<?php

namespace App\Support;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\VendorBlockedDate;
use App\Models\VendorProfile;

class VendorAvailability
{
    /**
     * Public calendar entries with all private details stripped server-side.
     *
     * @return list<array{date: string, type: 'booked'|'day_off'}>
     */
    public static function publicDatesFor(VendorProfile $vendorProfile): array
    {
        $entries = [];

        $blockedDates = $vendorProfile->blockedDates()
            ->whereDate('date', '>=', today())
            ->orderBy('date')
            ->get(['date']);

        foreach ($blockedDates as $blockedDate) {
            $dateKey = $blockedDate->date->toDateString();
            $entries[$dateKey] = [
                'date' => $dateKey,
                'type' => 'day_off',
            ];
        }

        $bookedOrders = Order::query()
            ->where('vendor_profile_id', $vendorProfile->id)
            ->whereIn('status', [OrderStatus::Confirmed, OrderStatus::InProgress])
            ->whereDate('event_date', '>=', today())
            ->orderBy('event_date')
            ->get(['event_date']);

        foreach ($bookedOrders as $order) {
            $dateKey = $order->event_date->toDateString();
            $entries[$dateKey] = [
                'date' => $dateKey,
                'type' => 'booked',
            ];
        }

        ksort($entries);

        return array_values($entries);
    }

    /**
     * Vendor calendar entries including order details and day-off notes.
     *
     * @return list<array{
     *     date: string,
     *     type: 'booked'|'day_off',
     *     order_id: string|null,
     *     note: string|null,
     *     blocked_date_id: int|null,
     *     order_details: array{
     *         order_number: string,
     *         customer_name: string,
     *         service_name: string,
     *         package_name: string|null,
     *         status: string
     *     }|null
     * }>
     */
    public static function vendorDatesFor(VendorProfile $vendorProfile): array
    {
        $entries = [];

        $blockedDates = VendorBlockedDate::query()
            ->where('vendor_profile_id', $vendorProfile->id)
            ->orderBy('date')
            ->get(['id', 'date', 'reason']);

        foreach ($blockedDates as $blockedDate) {
            $dateKey = $blockedDate->date->toDateString();
            $entries[$dateKey] = [
                'date' => $dateKey,
                'type' => 'day_off',
                'order_id' => null,
                'note' => $blockedDate->reason,
                'blocked_date_id' => $blockedDate->id,
                'order_details' => null,
            ];
        }

        $bookedOrders = Order::query()
            ->where('vendor_profile_id', $vendorProfile->id)
            ->whereIn('status', [OrderStatus::Confirmed, OrderStatus::InProgress])
            ->with('customer:id,name')
            ->orderBy('event_date')
            ->get([
                'id',
                'order_number',
                'customer_id',
                'service_name_snapshot',
                'package_name_snapshot',
                'event_date',
                'status',
            ]);

        foreach ($bookedOrders as $order) {
            $dateKey = $order->event_date->toDateString();
            $entries[$dateKey] = [
                'date' => $dateKey,
                'type' => 'booked',
                'order_id' => $order->order_number,
                'note' => null,
                'blocked_date_id' => null,
                'order_details' => [
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer?->name ?? '-',
                    'service_name' => $order->service_name_snapshot,
                    'package_name' => $order->package_name_snapshot,
                    'status' => $order->status->label(),
                ],
            ];
        }

        ksort($entries);

        return array_values($entries);
    }
}
