<?php

namespace App\Http\Middleware;

use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() instanceof User
                    ? $request->user()->only(['id', 'name', 'email', 'email_verified_at']) + [
                        'role' => $request->user()->role->value,
                        'phone' => $request->user()->phone,
                        'avatar_url' => $request->user()->avatar_url,
                    ]
                    : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'status' => fn () => $request->session()->get('status'),
            ],
            'draftOrderSummary' => fn () => $this->draftOrderSummary($request),
            'unreadNotificationCount' => fn (): int => $request->user()?->unreadNotifications()->count() ?? 0,
        ];
    }

    /**
     * @return array{service: string, package: string|null, event_date: string}|null
     */
    private function draftOrderSummary(Request $request): ?array
    {
        $draft = $request->session()->get('draft_order');

        if (! is_array($draft) || ! isset($draft['service_id'], $draft['created_at'])) {
            return null;
        }

        if (Carbon::parse($draft['created_at'])->addHours((int) config('vendoria.business.draft_expiry_hours'))->isPast()) {
            $request->session()->forget('draft_order');

            return null;
        }

        $service = Service::query()
            ->with(['packages' => fn ($query) => $query->where('is_active', true)])
            ->find($draft['service_id']);

        if ($service === null) {
            $request->session()->forget('draft_order');

            return null;
        }

        $package = isset($draft['package_id'])
            ? $service->packages->firstWhere('id', (int) $draft['package_id'])
            : null;

        return [
            'service' => $service->name,
            'package' => $package?->name,
            'event_date' => (string) ($draft['event_date'] ?? ''),
        ];
    }
}
