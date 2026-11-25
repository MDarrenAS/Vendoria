<?php

namespace App\Http\Controllers\Customer;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderDraftRequest;
use App\Models\Service;
use App\Support\OrderAttachments;
use App\Support\Rupiah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderDraftController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user() !== null && $request->user()->role !== UserRole::Customer) {
            return redirect()->route($request->user()->role === UserRole::Vendor ? 'vendor.dashboard' : 'admin.dashboard')
                ->with('error', 'Akun vendor tidak dapat memesan. Gunakan akun Panitia.');
        }

        $selection = Validator::validate($request->query(), [
            'service' => ['required', 'integer', 'exists:services,id'],
            'package' => ['nullable', 'integer', 'exists:service_packages,id'],
        ]);

        $service = Service::query()
            ->where('is_active', true)
            ->whereHas('vendorProfile', fn ($query) => $query->where('is_active', true))
            ->with([
                'vendorProfile:id,business_name,slug,city,whatsapp_number',
                'category:id,name,slug',
                'packages' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
            ])
            ->findOrFail($selection['service']);

        $selectedPackage = null;

        if (isset($selection['package'])) {
            $selectedPackage = $service->packages->firstWhere('id', (int) $selection['package']);

            abort_if($selectedPackage === null, 404);
        }

        $service->vendorProfile->makeHidden('whatsapp_number');

        $initialDraftAttachments = collect($request->session()->get('draft_attachments', []))
            ->where('service_id', $service->id)
            ->map(fn (array $item): array => [
                'temp_id' => $item['temp_id'],
                'slot_key' => $item['slot_key'],
                'original_name' => $item['original_name'],
                'mime_type' => $item['mime_type'],
                'size_bytes' => $item['size_bytes'],
                'preview_url' => route('order.draft.attachments.preview', $item['temp_id'], absolute: false),
            ])
            ->values()
            ->all();

        return Inertia::render('orders/create', [
            'service' => $service,
            'selectedPackageId' => $selectedPackage?->id,
            'contactName' => $request->user()?->name ?? '',
            'contactPhone' => $request->user()?->phone ?? '',
            'minimumDate' => today()->addDay()->toDateString(),
            'extraFields' => config('vendoria.category_extra_fields.'.$service->category->slug, []),
            'quantityLabel' => config('vendoria.category_quantity_labels.'.$service->category->slug, 'Jumlah'),
            'attachmentSlots' => OrderAttachments::slotsForCategory($service->category->slug),
            'initialDraftAttachments' => $initialDraftAttachments,
            'currencyHint' => Rupiah::format($selectedPackage?->price ?? $service->base_price),
        ]);
    }

    public function store(StoreOrderDraftRequest $request): RedirectResponse
    {
        if ($request->user() !== null && $request->user()->role !== UserRole::Customer) {
            return redirect()->route($request->user()->role === UserRole::Vendor ? 'vendor.dashboard' : 'admin.dashboard')
                ->with('error', 'Akun non-Panitia tidak dapat membuat pesanan.');
        }

        $draft = $request->validated();
        $attachmentIds = $draft['attachment_ids'] ?? [];
        unset($draft['attachment_ids']);

        $draft['attachments'] = collect($request->session()->get('draft_attachments', []))
            ->where('service_id', (int) $draft['service_id'])
            ->filter(fn (array $item): bool => in_array($item['temp_id'], $attachmentIds, true))
            ->map(fn (array $item): array => [
                'slot_key' => $item['slot_key'],
                'original_name' => $item['original_name'],
                'stored_path' => $item['stored_path'],
                'mime_type' => $item['mime_type'],
                'size_bytes' => $item['size_bytes'],
                'preview_url' => route('order.draft.attachments.preview', $item['temp_id'], absolute: false),
            ])
            ->values()
            ->all();

        $draft['idempotency_key'] = (string) Str::uuid();
        $draft['created_at'] = now()->toIso8601String();
        $request->session()->put('draft_order', $draft);

        if ($request->user() !== null) {
            return redirect()->route('order.review');
        }

        $request->session()->put('url.intended', route('order.review', absolute: false));

        return redirect()->route('login')
            ->with('status', 'Silakan login atau daftar sebagai Panitia untuk melanjutkan pesanan Anda.');
    }

    public function review(Request $request): Response|RedirectResponse
    {
        if ($request->user()->role !== UserRole::Customer) {
            $request->session()->forget('draft_order');

            return redirect()->route($request->user()->role === UserRole::Vendor ? 'vendor.dashboard' : 'admin.dashboard')
                ->with('error', 'Akun non-Panitia tidak dapat membuat pesanan.');
        }

        $draft = $request->session()->get('draft_order');

        if (! is_array($draft) || ! isset($draft['created_at'], $draft['service_id'])) {
            $request->session()->forget('draft_order');

            return redirect()->route('vendors.index')->with('error', 'Draft pesanan tidak ditemukan. Silakan pilih layanan kembali.');
        }

        $expiresAt = Carbon::parse($draft['created_at'])->addHours((int) config('vendoria.business.draft_expiry_hours'));

        if ($expiresAt->isPast()) {
            $request->session()->forget('draft_order');

            return redirect()->route('vendors.index')->with('error', 'Draft pesanan sudah kedaluwarsa. Silakan pilih layanan kembali.');
        }

        $service = Service::query()
            ->where('is_active', true)
            ->whereHas('vendorProfile', fn ($query) => $query->where('is_active', true))
            ->with([
                'vendorProfile:id,business_name,slug,city',
                'category:id,name,slug',
                'packages' => fn ($query) => $query->where('is_active', true),
            ])
            ->find($draft['service_id']);

        if ($service === null) {
            $request->session()->forget('draft_order');

            return redirect()->route('vendors.index')->with('error', 'Layanan tidak lagi tersedia. Silakan pilih layanan lain.');
        }

        $selectedPackage = isset($draft['package_id'])
            ? $service->packages->firstWhere('id', (int) $draft['package_id'])
            : null;

        if (isset($draft['package_id']) && $selectedPackage === null) {
            $request->session()->forget('draft_order');

            return redirect()->route('services.show', $service)->with('error', 'Paket tidak lagi tersedia. Silakan pilih paket lain.');
        }

        $unitPrice = $selectedPackage?->price ?? $service->base_price;
        $priceEstimate = number_format((int) round((float) $unitPrice * 100) * (int) $draft['quantity'] / 100, 2, '.', '');

        $categorySlug = $service->category?->slug;

        return Inertia::render('orders/review', [
            'draft' => $draft,
            'service' => $service,
            'package' => $selectedPackage,
            'unitPrice' => (string) $unitPrice,
            'priceEstimate' => $priceEstimate,
            'categorySlug' => $categorySlug,
            'categoryName' => $service->category?->name,
            'quantityLabel' => config('vendoria.category_quantity_labels.'.$categorySlug, 'Jumlah'),
            'extraFields' => config('vendoria.category_extra_fields.'.$categorySlug, []),
            'attachmentSlots' => OrderAttachments::slotsForCategory($categorySlug),
        ]);
    }
}
