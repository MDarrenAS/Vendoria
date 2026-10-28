<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->safe()->except(['avatar', 'remove_avatar']);
        $oldAvatarPath = $user->avatar_path;

        if ($request->hasFile('avatar')) {
            try {
                $avatarPath = $request->file('avatar')->storePublicly('avatars/'.$user->id, 's3');
            } catch (\Throwable $exception) {
                return back()->withErrors(['avatar' => 'Gagal mengunggah foto profil ke penyimpanan cloud: '.$exception->getMessage()]);
            }

            if (! is_string($avatarPath)) {
                return back()->withErrors(['avatar' => 'Foto profil gagal disimpan ke penyimpanan cloud.']);
            }

            $data['avatar_path'] = $avatarPath;
        } elseif ($request->boolean('remove_avatar')) {
            $data['avatar_path'] = null;
        }

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($oldAvatarPath !== null && $user->avatar_path !== $oldAvatarPath) {
            Storage::disk('s3')->delete($oldAvatarPath);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();
        $oldAvatarPath = $user->avatar_path;

        Auth::logout();

        $user->update([
            'name' => 'Akun dihapus',
            'email' => 'deleted-'.Str::uuid().'@example.invalid',
            'email_verified_at' => null,
            'password' => Str::random(64),
            'phone' => null,
            'avatar_path' => null,
            'is_active' => false,
        ]);

        $user->vendorProfile?->services()->update(['is_active' => false]);
        $user->vendorProfile?->update(['is_active' => false]);

        if ($oldAvatarPath !== null) {
            Storage::disk('s3')->delete($oldAvatarPath);
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
