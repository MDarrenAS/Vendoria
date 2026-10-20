<?php

namespace App\Http\Requests\Vendor;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:tomorrow'],
            'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->hasAny(['start_date', 'end_date'])) {
                    return;
                }

                $startDate = CarbonImmutable::parse($this->input('start_date'));
                $endDate = CarbonImmutable::parse($this->input('end_date'));

                if ($startDate->diffInDays($endDate) > 89) {
                    $validator->errors()->add('end_date', 'Rentang tanggal tidak boleh lebih dari 90 hari.');
                }
            },
        ];
    }
}
