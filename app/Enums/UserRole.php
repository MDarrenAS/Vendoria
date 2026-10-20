<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Vendor = 'vendor';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Customer => 'Panitia',
            self::Vendor => 'Vendor',
            self::Admin => 'Admin',
        };
    }
}
