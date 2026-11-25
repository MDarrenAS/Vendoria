<?php

namespace App\Http\Requests;

use App\Models\Service;
use App\Support\OrderAttachments;
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
            'attachment_ids' => ['nullable', 'array', 'max:30'],
            'attachment_ids.*' => ['string', 'uuid'],
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

                $categoryExtraFields = collect(config('vendoria.category_extra_fields.'.$service->category->slug, []))
                    ->keyBy('name');

                foreach ($this->input('extras', []) as $extraField => $value) {
                    $definition = $categoryExtraFields->get($extraField);

                    if ($definition === null) {
                        $validator->errors()->add('extras.'.$extraField, 'Isian tambahan tidak sesuai dengan kategori layanan.');

                        continue;
                    }

                    if ($value === null || $value === '') {
                        continue;
                    }

                    if (($definition['type'] ?? null) === 'select'
                        && isset($definition['options'])
                        && ! in_array($value, $definition['options'], true)) {
                        $validator->errors()->add('extras.'.$extraField, 'Pilihan '.$definition['label'].' tidak valid.');
                    }

                    if (($definition['type'] ?? null) === 'number' && ! is_numeric($value)) {
                        $validator->errors()->add('extras.'.$extraField, $definition['label'].' harus berupa angka.');
                    }
                }

                if ($service->vendorProfile->blockedDates()->whereDate('date', $this->input('event_date'))->exists()) {
                    $validator->errors()->add('event_date', 'Tanggal tersebut tidak tersedia untuk vendor ini.');
                }

                $attachmentIds = $this->input('attachment_ids', []);
                $draftAttachments = collect($this->session()->get('draft_attachments', []))
                    ->where('service_id', $service->id)
                    ->filter(fn (array $item): bool => in_array($item['temp_id'], $attachmentIds, true));

                foreach (OrderAttachments::slotsForCategory($service->category?->slug) as $slot) {
                    if (($slot['required'] ?? false) && $draftAttachments->where('slot_key', $slot['key'])->isEmpty()) {
                        $validator->errors()->add('attachments.'.$slot['key'], $slot['label'].' wajib diunggah.');
                    }
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
