<?php

namespace App\Http\Requests;

use App\Models\Service;
use App\Support\WhatsApp;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreOrderDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'package_id' => ['nullable', 'integer', 'exists:service_packages,id'],
            'event_name' => ['required', 'string', 'max:160'],
            'event_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:tomorrow'],
            'event_location' => ['required', 'string', 'max:255'],
            'event_city' => ['required', 'string', 'max:100'],
            'contact_name' => ['required', 'string', 'max:120'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'quantity' => ['required', 'integer', 'min:1', 'max:100000'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'extras' => ['nullable', 'array', 'max:20'],
            'extras.*' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (! $validator->errors()->has('contact_phone')
                    && WhatsApp::normalize((string) $this->input('contact_phone')) === null) {
                    $validator->errors()->add('contact_phone', 'Masukkan nomor WhatsApp Indonesia yang valid.');
                }

                if ($validator->errors()->hasAny(['service_id', 'package_id', 'event_date', 'quantity'])) {
                    return;
                }

                $service = Service::query()
                    ->with(['vendorProfile', 'category'])
                    ->where('is_active', true)
                    ->find($this->integer('service_id'));

                if ($service === null || ! $service->vendorProfile->is_active) {
                    $validator->errors()->add('service_id', 'Layanan ini tidak lagi tersedia.');

                    return;
                }

                $quantity = $this->integer('quantity');

                if ($quantity < $service->min_quantity || ($service->max_quantity !== null && $quantity > $service->max_quantity)) {
                    $validator->errors()->add('quantity', 'Jumlah di luar batas minimum atau maksimum layanan.');
                }

                if ($this->filled('package_id') && ! $service->packages()
                    ->whereKey($this->integer('package_id'))
                    ->where('is_active', true)
                    ->exists()) {
                    $validator->errors()->add('package_id', 'Paket yang dipilih tidak tersedia untuk layanan ini.');
                }

                $allowedExtraFields = collect(config('vendoria.category_extra_fields.'.$service->category->slug, []))
                    ->pluck('name')
                    ->all();

                foreach (array_keys($this->input('extras', [])) as $extraField) {
                    if (! in_array($extraField, $allowedExtraFields, true)) {
                        $validator->errors()->add('extras.'.$extraField, 'Isian tambahan tidak sesuai dengan kategori layanan.');
                    }
                }

                if ($service->vendorProfile->blockedDates()->whereDate('date', $this->input('event_date'))->exists()) {
                    $validator->errors()->add('event_date', 'Tanggal tersebut tidak tersedia untuk vendor ini.');
                }
            },
        ];
    }

    protected function prepareForValidation(): void
    {
        $normalizedPhone = WhatsApp::normalize((string) $this->input('contact_phone', ''));

        if ($normalizedPhone !== null) {
            $this->merge(['contact_phone' => $normalizedPhone]);
        }
    }
}
