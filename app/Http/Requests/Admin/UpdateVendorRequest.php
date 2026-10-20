<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use App\Models\VendorProfile;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateVendorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Admin;
    }

    /**
     * @return array<string, array<mixed>|string|ValidationRule>
     */
    public function rules(): array
    {
        return [
            'is_verified' => ['sometimes', 'required', 'boolean'],
            'is_active' => ['sometimes', 'required', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (! $this->exists('is_verified') && ! $this->exists('is_active')) {
                    $validator->errors()->add('is_active', 'Pilih status vendor yang ingin diperbarui.');
                }

                $vendor = $this->route('vendor');

                if ($this->boolean('is_active')
                    && $vendor instanceof VendorProfile
                    && ! $vendor->user()->where('is_active', true)->exists()) {
                    $validator->errors()->add('is_active', 'Akun pengguna vendor harus aktif sebelum profil dapat ditampilkan.');
                }
            },
        ];
    }
}
