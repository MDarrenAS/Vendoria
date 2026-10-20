<?php

namespace App\Http\Requests\Vendor;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');

        return $order instanceof Order
            && ($this->user()?->can('update', $order) ?? false);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in([
                OrderStatus::Confirmed->value,
                OrderStatus::Rejected->value,
                OrderStatus::InProgress->value,
                OrderStatus::Completed->value,
                OrderStatus::Cancelled->value,
            ])],
            'price_final' => ['nullable', 'numeric', 'min:0', 'max:999999999999.99', 'required_if:status,confirmed'],
            'price_note' => ['nullable', 'string', 'max:2000'],
            'vendor_note' => ['nullable', 'string', 'max:2000', 'required_if:status,rejected'],
            'cancel_reason' => ['nullable', 'string', 'max:2000', 'required_if:status,cancelled'],
        ];
    }
}
