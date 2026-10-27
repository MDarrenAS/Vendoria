<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class ConfirmOrderPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('pay', $this->route('order')) ?? false;
    }

    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'string', 'in:bca,mandiri,bri,bni'],
        ];
    }
}
