<?php

namespace App\Support;

use InvalidArgumentException;

class WhatsApp
{
    public static function normalize(string $phone): ?string
    {
        $digits = preg_replace('/[\s()+.-]/', '', trim($phone));

        if (! is_string($digits) || ! preg_match('/^\d{8,15}$/', $digits)) {
            return null;
        }

        if (str_starts_with($digits, '08')) {
            $digits = '628'.substr($digits, 2);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62'.$digits;
        } elseif (str_starts_with($digits, '62')) {
            // Already in international Indonesian format.
        } else {
            return null;
        }

        return preg_match('/^628\d{7,11}$/', $digits) === 1 ? $digits : null;
    }

    public static function link(string $phone, string $message): string
    {
        $normalizedPhone = self::normalize($phone);

        if ($normalizedPhone === null) {
            throw new InvalidArgumentException('Nomor WhatsApp tidak valid.');
        }

        return 'https://wa.me/'.$normalizedPhone.'?text='.rawurlencode($message);
    }
}
