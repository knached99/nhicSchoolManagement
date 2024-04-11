<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        // Use $this->auth() instead of Auth()
        // $user = $this->auth()->user();
        $user = Auth::guard('web')->user();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                // Rule::unique('users')->ignore($user->email, 'email')
            ],
            'phone' => [
                'nullable',
                'string',
                'regex:/^\(\d{3}\) \d{3}-\d{4}$/',
                // Rule::unique('users')->ignore($user->phone, 'phone')
            ],
            'address' => ['nullable', 'regex:/^[a-zA-Z0-9\s,.-]+$/'],
            'address_2' => ['nullable', 'regex:/^[a-zA-Z0-9\s]+$/'],
            'city' => ['nullable', 'string'],
            'state' => ['nullable', 'string'],
            'zip' => ['nullable', 'regex:/^\d{5}$/']
        ];
    }
}
