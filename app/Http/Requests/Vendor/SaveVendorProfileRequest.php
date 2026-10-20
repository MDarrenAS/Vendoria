<?php

namespace App\Http\Requests\Vendor;

use App\Support\WhatsApp;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SaveVendorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'business_name' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:5000'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'whatsapp_number' => ['required', 'string', 'max:20'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (! $validator->errors()->has('whatsapp_number')
                    && WhatsApp::normalize((string) $this->input('whatsapp_number')) === null) {
                    $validator->errors()->add('whatsapp_number', 'Masukkan nomor WhatsApp Indonesia yang valid.');
                }
            },
        ];
    }

    protected function prepareForValidation(): void
    {
        $number = WhatsApp::normalize((string) $this->input('whatsapp_number', ''));

        if ($number !== null) {
            $this->merge(['whatsapp_number' => $number]);
        }
    }
}
