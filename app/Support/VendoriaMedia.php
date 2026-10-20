<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class VendoriaMedia
{
    public static function url(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (str_starts_with($path, 'placeholder:')) {
            return asset('images/'.substr($path, strlen('placeholder:')));
        }

        $publicBaseUrl = config('vendoria.storage.public_url');

        if (is_string($publicBaseUrl) && $publicBaseUrl !== '') {
            return rtrim($publicBaseUrl, '/').'/'.ltrim($path, '/');
        }

        return Storage::disk('s3')->url($path);
    }
}
