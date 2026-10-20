<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->role === UserRole::Admin, 403);

        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', Rule::enum(UserRole::class)],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'is_active', 'created_at'])
            ->when($filters['q'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search): void {
                $query->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');
            }))
            ->when($filters['role'] ?? null, fn ($query, $role) => $query->where('role', $role))
            ->when(array_key_exists('is_active', $filters), fn ($query) => $query->where('is_active', $filters['is_active']))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/users', [
            'users' => $users,
            'filters' => $filters,
            'roles' => array_map(
                fn (UserRole $role): array => ['value' => $role->value, 'label' => $role->label()],
                UserRole::cases(),
            ),
        ]);
    }

    public function updateStatus(UpdateUserStatusRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());

        if (! $user->is_active) {
            $user->vendorProfile?->update(['is_active' => false]);
            Cache::forget('marketplace.home.v2');
        }

        return back()->with('success', $user->is_active
            ? 'Akun pengguna berhasil diaktifkan.'
            : 'Akun pengguna berhasil dinonaktifkan.');
    }
}
