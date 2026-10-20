<?php

namespace App\Support;

use Illuminate\Support\Number;

class Rupiah
{
    public static function format(int|float|string $amount): string
    {
        return 'Rp '.Number::format((float) $amount, locale: 'id_ID', precision: 0);
    }
}
