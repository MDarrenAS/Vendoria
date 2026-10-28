<?php

namespace App\Actions\Vendor;

use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SaveVendorProfile
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(User $user, array $data): VendorProfile
    {
        $profile = $user->vendorProfile;
        $oldPaths = [
            'logo' => $profile?->logo_path,
            'cover' => $profile?->cover_path,
        ];
        $attributes = collect($data)->only([
            'business_name', 'description', 'city', 'province', 'address',
            'whatsapp_number', 'contact_email', 'instagram',
        ])->all();

        foreach (['logo', 'cover'] as $imageField) {
            if (! ($data[$imageField] ?? null) instanceof UploadedFile) {
                continue;
            }

            try {
                $path = $data[$imageField]->storePublicly('vendors/'.$user->id, 's3');
            } catch (\Throwable $exception) {
                throw ValidationException::withMessages([
                    $imageField => 'Gagal mengunggah foto ke penyimpanan cloud: '.$exception->getMessage(),
                ]);
            }

            if (! is_string($path)) {
                throw ValidationException::withMessages([
                    $imageField => 'Foto profil usaha gagal disimpan ke penyimpanan cloud.',
                ]);
            }

            $attributes[$imageField.'_path'] = $path;
        }

        $businessNameChanged = $profile === null || $profile->business_name !== $attributes['business_name'];

        if ($businessNameChanged) {
            $attributes['slug'] = Str::slug($attributes['business_name']).'-'.$user->id.'-'.Str::lower(Str::random(5));
        }

        $profile ??= new VendorProfile(['user_id' => $user->id]);
        $profile->fill($attributes);
        $profile->save();

        foreach (['logo', 'cover'] as $imageField) {
            $newPath = $profile->{$imageField.'_path'};

            if ($oldPaths[$imageField] !== null && $newPath !== $oldPaths[$imageField]) {
                Storage::disk('s3')->delete($oldPaths[$imageField]);
            }
        }

        return $profile;
    }
}
