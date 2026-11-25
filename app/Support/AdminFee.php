<?php

namespace App\Support;

class AdminFee
{
    public static function rate(): float
    {
        return (float) config('vendoria.business.admin_fee_rate', 0.03);
    }

    public static function ratePercentLabel(): string
    {
        $percent = self::rate() * 100;

        return rtrim(rtrim(number_format($percent, 2, '.', ''), '0'), '.').'%';
    }

    public static function calculate(int|float|string $amount): string
    {
        $fee = round((float) $amount * self::rate(), 0, PHP_ROUND_HALF_UP);

        return number_format($fee, 2, '.', '');
    }

    public static function totalPayable(int|float|string $amount, int|float|string|null $adminFee = null): string
    {
        $fee = $adminFee !== null ? (float) $adminFee : (float) self::calculate($amount);
        $total = round((float) $amount + $fee, 0, PHP_ROUND_HALF_UP);

        return number_format($total, 2, '.', '');
    }
}
