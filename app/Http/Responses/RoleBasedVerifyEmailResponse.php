<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse;
use LogicException;
use Symfony\Component\HttpFoundation\Response;

class RoleBasedVerifyEmailResponse implements VerifyEmailResponse
{
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', Response::HTTP_NO_CONTENT);
        }

        $user = $request->user();

        if (! $user instanceof User) {
            throw new LogicException('Respons verifikasi email dipanggil tanpa pengguna yang terautentikasi.');
        }

        $destination = match ($user->role) {
            UserRole::Customer => '/',
            UserRole::Vendor => '/vendor/dashboard',
            UserRole::Admin => '/admin',
        };

        return redirect()->intended($destination.'?verified=1');
    }
}
