<?php

namespace App\Actions\Orders;

use App\Models\Service;
use App\Models\ServicePackage;
use Illuminate\Validation\ValidationException;

class CalculateOrderPrice
{
    /**
     * @return array{unit_price: string, total: string, package: ServicePackage|null}
     */
    public function handle(Service $service, ?int $packageId, int $quantity): array
    {
        $package = $packageId === null
            ? null
            : $service->packages()->whereKey($packageId)->where('is_active', true)->first();

        if ($packageId !== null && $package === null) {
            throw ValidationException::withMessages([
                'package_id' => 'Paket yang dipilih tidak tersedia untuk layanan ini.',
            ]);
        }

        $unitPrice = $package?->price ?? $service->base_price;
        $totalCents = (int) round((float) $unitPrice * 100) * $quantity;

        return [
            'unit_price' => number_format((float) $unitPrice, 2, '.', ''),
            'total' => number_format($totalCents / 100, 2, '.', ''),
            'package' => $package,
        ];
    }
}
