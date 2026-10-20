<?php

namespace App\Http\Requests\Customer;

use App\Models\Review;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', [Review::class, $this->route('order')]) ?? false;
    }

    /**
     * @return array<string, array<mixed>|string|ValidationRule>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'rating.required' => 'Pilih nilai ulasan dari 1 sampai 5.',
            'rating.integer' => 'Nilai ulasan harus berupa angka bulat.',
            'rating.between' => 'Nilai ulasan harus antara 1 sampai 5.',
            'comment.max' => 'Ulasan tidak boleh lebih dari 2.000 karakter.',
        ];
    }
}
