<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\VendorProfile;
use App\Support\WhatsApp;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function show(VendorProfile $vendor): Response
    {
        abort_unless(
            $vendor->is_active && $vendor->user()->where('is_active', true)->exists(),
            404,
        );

        $whatsappUrl = WhatsApp::normalize($vendor->whatsapp_number) === null
            ? null
            : WhatsApp::link(
                $vendor->whatsapp_number,
                'Halo '.$vendor->business_name.', saya tertarik dengan layanan Anda di Vendoria. Apakah tanggal yang saya inginkan masih tersedia?',
            );

        $vendor->load([
            'services' => fn ($query) => $query
                ->where('is_active', true)
                ->whereHas('category', fn ($categoryQuery) => $categoryQuery->where('is_active', true))
                ->with(['category:id,name,slug', 'images:id,service_id,path,is_cover,sort_order', 'packages' => fn ($packageQuery) => $packageQuery->where('is_active', true)->orderBy('sort_order')])
                ->orderByDesc('created_at'),
        ]);
        $reviews = $vendor->reviews()
            ->where('is_visible', true)
            ->with('customer:id,name')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('vendors/show', [
            'vendor' => $vendor->makeHidden(['whatsapp_number', 'contact_email', 'user_id']),
            'reviews' => $reviews,
            'whatsappUrl' => $whatsappUrl,
        ]);
    }
}
