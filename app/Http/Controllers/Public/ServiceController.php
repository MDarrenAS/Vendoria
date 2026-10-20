<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Support\WhatsApp;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function show(Service $service): Response
    {
        abort_unless(
            $service->is_active
                && $service->category()->where('is_active', true)->exists()
                && $service->vendorProfile()
                    ->where('is_active', true)
                    ->whereHas('user', fn ($query) => $query->where('is_active', true))
                    ->exists(),
            404,
        );

        $service->load([
            'vendorProfile:id,business_name,slug,city,province,whatsapp_number,is_verified,rating_avg,rating_count,cover_path',
            'category:id,name,slug',
            'packages' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order'),
            'images:id,service_id,path,caption,is_cover,sort_order',
            'vendorProfile.blockedDates' => fn ($query) => $query->whereDate('date', '>=', today())->orderBy('date'),
        ]);
        $reviews = $service->reviews()
            ->where('is_visible', true)
            ->with('customer:id,name')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $whatsappPhone = $service->vendorProfile->whatsapp_number;
        $service->vendorProfile->makeHidden('whatsapp_number');

        return Inertia::render('services/show', [
            'service' => $service,
            'reviews' => $reviews,
            'extraFields' => config('vendoria.category_extra_fields.'.$service->category->slug, []),
            'whatsappUrl' => WhatsApp::normalize($whatsappPhone) === null
                ? null
                : WhatsApp::link(
                    $whatsappPhone,
                    'Halo '.$service->vendorProfile->business_name.', saya tertarik dengan layanan "'.$service->name.'" di Vendoria. Apakah tanggal yang saya inginkan masih tersedia?',
                ),
        ]);
    }
}
