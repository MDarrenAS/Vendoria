<?php

namespace App\Actions\Vendor;

use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\VendorProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class SaveVendorService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(VendorProfile $vendorProfile, array $data, ?Service $service = null): Service
    {
        $packageData = $data['packages'] ?? [];
        $uploadFiles = $data['images'] ?? [];
        $deleteImageIds = array_map('intval', $data['delete_image_ids'] ?? []);
        $coverImageId = isset($data['cover_image_id']) ? (int) $data['cover_image_id'] : null;
        $currentImages = $service?->images()->get() ?? collect();
        $remainingImages = $currentImages->whereNotIn('id', $deleteImageIds);
        $newCoverIndex = isset($data['cover_image_index']) ? (int) $data['cover_image_index'] : null;
        $selectedCoverId = $coverImageId !== null && ! in_array($coverImageId, $deleteImageIds, true)
            ? $coverImageId
            : ($remainingImages->firstWhere('is_cover', true)?->id ?? $remainingImages->first()?->id);

        if ($service === null && $newCoverIndex === null && count($uploadFiles) > 0) {
            $newCoverIndex = 0;
        }

        if ($service !== null && $selectedCoverId === null && $newCoverIndex === null && count($uploadFiles) > 0) {
            $newCoverIndex = 0;
        }

        $activePackageExists = count($packageData) > 0
            ? collect($packageData)->contains(fn (array $package): bool => (bool) ($package['is_active'] ?? false))
            : ($service?->packages()->where('is_active', true)->exists() ?? false);

        if ((bool) ($data['is_active'] ?? false) && ! $activePackageExists) {
            throw ValidationException::withMessages([
                'packages' => 'Tambahkan minimal satu paket aktif sebelum mengaktifkan layanan.',
            ]);
        }

        if (count($currentImages) - count($deleteImageIds) + count($uploadFiles) > (int) config('vendoria.uploads.max_service_images')) {
            throw ValidationException::withMessages([
                'images' => 'Jumlah foto layanan tidak boleh lebih dari '.config('vendoria.uploads.max_service_images').' foto.',
            ]);
        }

        $hasCover = ($selectedCoverId !== null && $remainingImages->contains('id', $selectedCoverId))
            || ($newCoverIndex !== null && isset(array_values($uploadFiles)[$newCoverIndex]));

        if ((bool) ($data['is_active'] ?? false) && ! $hasCover) {
            throw ValidationException::withMessages([
                'images' => 'Tambahkan atau pilih foto cover sebelum mengaktifkan layanan.',
            ]);
        }

        $deletedImagePaths = [];
        $savedService = DB::transaction(function () use (
            $vendorProfile,
            $service,
            $data,
            $packageData,
            $uploadFiles,
            $deleteImageIds,
            $selectedCoverId,
            $newCoverIndex,
            &$deletedImagePaths,
        ): Service {
            $service ??= new Service(['vendor_profile_id' => $vendorProfile->id]);
            $service->fill([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'description' => $data['description'],
                'base_price' => $data['base_price'],
                'price_unit' => $data['price_unit'],
                'min_quantity' => $data['min_quantity'],
                'max_quantity' => $data['max_quantity'] ?? null,
                'city_coverage' => $data['city_coverage'] ?? null,
                'terms' => $data['terms'] ?? null,
                'is_active' => (bool) ($data['is_active'] ?? false),
                'slug' => $this->slugFor($service, $vendorProfile, $data['name']),
            ]);
            $vendorProfile->services()->save($service);

            $submittedPackageIds = [];

            foreach ($packageData as $packageAttributes) {
                $package = isset($packageAttributes['id'])
                    ? $service->packages()->whereKey($packageAttributes['id'])->firstOrFail()
                    : new ServicePackage(['service_id' => $service->id]);
                $package->fill([
                    'name' => $packageAttributes['name'],
                    'description' => $packageAttributes['description'] ?? null,
                    'price' => $packageAttributes['price'],
                    'features' => $packageAttributes['features'] ?? [],
                    'sort_order' => $packageAttributes['sort_order'] ?? 0,
                    'is_active' => (bool) ($packageAttributes['is_active'] ?? false),
                ]);
                $service->packages()->save($package);
                $submittedPackageIds[] = $package->id;
            }

            if (array_key_exists('packages', $data)) {
                $obsoletePackages = $service->packages();

                if ($submittedPackageIds === []) {
                    $obsoletePackages->delete();
                } else {
                    $obsoletePackages->whereNotIn('id', $submittedPackageIds)->delete();
                }
            }

            $deletedImages = $service->images()->whereIn('id', $deleteImageIds)->get();

            foreach ($deletedImages as $image) {
                if (! str_starts_with($image->path, 'placeholder:')) {
                    $deletedImagePaths[] = $image->path;
                }

                $image->delete();
            }

            $service->images()->update(['is_cover' => false]);
            $nextSortOrder = (int) $service->images()->max('sort_order') + 1;

            foreach (array_values($uploadFiles) as $index => $imageFile) {
                if (! $imageFile instanceof UploadedFile) {
                    continue;
                }

                $path = $imageFile->storePublicly('services/'.$service->id, 's3');

                if (! is_string($path)) {
                    throw new RuntimeException('Foto layanan gagal disimpan ke penyimpanan cloud.');
                }

                $service->images()->create([
                    'path' => $path,
                    'caption' => $service->name,
                    'is_cover' => $newCoverIndex === $index,
                    'sort_order' => $nextSortOrder + $index,
                ]);
            }

            if ($newCoverIndex === null && $selectedCoverId !== null) {
                $service->images()->whereKey($selectedCoverId)->update(['is_cover' => true]);
            }

            return $service->load(['packages', 'images']);
        });

        foreach ($deletedImagePaths as $path) {
            Storage::disk('s3')->delete($path);
        }

        return $savedService;
    }

    private function slugFor(Service $service, VendorProfile $vendorProfile, string $name): string
    {
        if ($service->exists && $service->name === $name) {
            return $service->slug;
        }

        do {
            $slug = Str::slug($name).'-'.$vendorProfile->id.'-'.Str::lower(Str::random(5));
        } while (Service::withTrashed()->where('slug', $slug)->exists());

        return $slug;
    }
}
