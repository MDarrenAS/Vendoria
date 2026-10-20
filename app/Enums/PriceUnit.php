<?php

namespace App\Enums;

enum PriceUnit: string
{
    case PerEvent = 'per_event';
    case PerPax = 'per_pax';
    case PerDay = 'per_day';
    case PerHour = 'per_hour';
    case PerItem = 'per_item';

    public function label(): string
    {
        return match ($this) {
            self::PerEvent => 'acara',
            self::PerPax => 'orang',
            self::PerDay => 'hari',
            self::PerHour => 'jam',
            self::PerItem => 'item',
        };
    }
}
