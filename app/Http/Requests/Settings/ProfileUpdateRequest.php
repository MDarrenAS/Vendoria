<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use App\Support\WhatsApp;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            ...$this->profileRules($this->user()->id),
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_avatar' => ['nullable', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $phone = $this->input('phone');

                if ($phone !== null && trim((string) $phone) !== '' && WhatsApp::normalize((string) $phone) === null) {
                    $validator->errors()->add('phone', 'Masukkan nomor WhatsApp Indonesia yang valid.');
                }
            },
        ];
    }

    protected function prepareForValidation(): void
    {
        $phone = $this->input('phone');

        if ($phone !== null && trim((string) $phone) !== '') {
            $normalizedPhone = WhatsApp::normalize((string) $phone);

            if ($normalizedPhone !== null) {
                $this->merge(['phone' => $normalizedPhone]);
            }
        }
    }
}
