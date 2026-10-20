<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Response;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\RegisterResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse;
use LogicException;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class RoleBasedAuthResponse implements LoginResponse, RegisterResponse, TwoFactorLoginResponse
{
    public function toResponse($request): SymfonyResponse
    {
        if ($request->wantsJson()) {
            if ($request->routeIs('register.store')) {
                return response()->json('', Response::HTTP_CREATED);
            }

            if ($request->routeIs('two-factor.login')) {
                return response()->noContent();
            }

            return response()->json(['two_factor' => false]);
        }

        $user = $request->user();

        if (! $user instanceof User) {
            throw new LogicException('Respons autentikasi dipanggil tanpa pengguna yang terautentikasi.');
        }

        if ($user->role === UserRole::Vendor && $request->session()->has('draft_order')) {
            $request->session()->forget('draft_order');

            return redirect('/vendor/dashboard')
                ->with('error', 'Akun vendor tidak dapat membuat pesanan. Draft pesanan telah dihapus.');
        }

        $destination = match ($user->role) {
            UserRole::Customer => $request->session()->has('draft_order')
                ? route('order.review', absolute: false)
                : '/',
            UserRole::Vendor => '/vendor/dashboard',
            UserRole::Admin => '/admin',
        };

        return redirect()->to($destination);
    }
}
