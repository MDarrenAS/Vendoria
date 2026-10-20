<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendorProfileComplete
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $profile = $request->user()?->vendorProfile;

        if ($profile === null
            || blank($profile->business_name)
            || blank($profile->description)
            || blank($profile->city)
            || blank($profile->province)
            || blank($profile->whatsapp_number)) {
            return redirect()->route('vendor.onboarding');
        }

        return $next($request);
    }
}
