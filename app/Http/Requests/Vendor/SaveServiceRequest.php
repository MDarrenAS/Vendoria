<?php

namespace App\Http\Requests\Vendor;

use App\Enums\PriceUnit;
use App\Models\Service;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class SaveServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $service = $this->route('service');

        return $service instanceof Service
            ? $this->user()?->can('update', $service) ?? false
            : $this->user()?->can('create', Service::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id,is_active,1'],
            'name' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:5000'],
            'base_price' => ['required', 'numeric', 'min:0', 'max:999999999999.99'],
            'price_unit' => ['required', Rule::enum(PriceUnit::class)],
            'min_quantity' => ['required', 'integer', 'min:1', 'max:100000'],
            'max_quantity' => ['nullable', 'integer', 'min:1', 'max:100000', 'gte:min_quantity'],
            'city_coverage' => ['nullable', 'string', 'max:255'],
            'terms' => ['nullable', 'string', 'max:5000'],
            'is_active' => ['nullable', 'boolean'],
            'packages' => ['nullable', 'array', 'max:20'],
            'packages.*.id' => ['nullable', 'integer', 'exists:service_packages,id'],
            'packages.*.name' => ['required', 'string', 'max:120'],
            'packages.*.description' => ['nullable', 'string', 'max:2000'],
            'packages.*.price' => ['required', 'numeric', 'min:0', 'max:999999999999.99'],
            'packages.*.features_text' => ['nullable', 'string', 'max:2000'],
            'packages.*.features' => ['array', 'max:20'],
            'packages.*.features.*' => ['string', 'max:100'],
            'packages.*.sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'packages.*.is_active' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'delete_image_ids' => ['nullable', 'array', 'max:8'],
            'delete_image_ids.*' => ['integer', 'exists:service_images,id'],
            'cover_image_id' => ['nullable', 'integer', 'exists:service_images,id'],
            'cover_image_index' => ['nullable', 'integer', 'min:0', 'max:7'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $service = $this->route('service');

                if (! $service instanceof Service) {
                    return;
                }

                $packages = $this->input('packages', []);

                foreach (is_array($packages) ? $packages : [] as $index => $package) {
                    if (is_array($package) && isset($package['id']) && ! $service->packages()->whereKey($package['id'])->exists()) {
                        $validator->errors()->add('packages.'.$index.'.id', 'Paket tidak termasuk layanan ini.');
                    }
                }

                $deleteImageIds = $this->input('delete_image_ids', []);
                $imageIds = array_merge(
                    is_array($deleteImageIds) ? $deleteImageIds : [],
                    array_filter([$this->input('cover_image_id')]),
                );

                foreach ($imageIds as $imageId) {
                    if (! $service->images()->whereKey($imageId)->exists()) {
                        $validator->errors()->add('cover_image_id', 'Foto tidak termasuk layanan ini.');
                        break;
                    }
                }
            },
        ];
    }

    protected function prepareForValidation(): void
    {
        $packages = $this->input('packages', []);

        if (is_array($packages)) {
            foreach ($packages as $index => $package) {
                if (! is_array($package)) {
                    continue;
                }

                $packages[$index]['features'] = array_values(array_filter(
                    array_map('trim', preg_split('/\r\n|\r|\n/', (string) ($package['features_text'] ?? '')) ?: []),
                    fn (string $feature): bool => $feature !== '',
                ));
            }
        }

        $this->merge(['packages' => $packages]);
    }
}
