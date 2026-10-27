<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Service;
use App\Models\ServiceImage;
use App\Models\ServicePackage;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MarketplaceCatalogSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $categories = [
                ['Katering', 'katering', 'utensils', 'Katering dan konsumsi untuk berbagai acara.'],
                ['Dekorasi', 'dekorasi', 'flower', 'Dekorasi acara dan tata ruang.'],
                ['Sound System & Lighting', 'sound-system-lighting', 'speaker', 'Tata suara dan pencahayaan acara.'],
                ['Dokumentasi (Foto/Video)', 'dokumentasi-foto-video', 'camera', 'Fotografi dan videografi acara.'],
                ['MC & Hiburan', 'mc-hiburan', 'mic', 'Pembawa acara dan hiburan.'],
                ['Sewa Perlengkapan', 'sewa-perlengkapan', 'armchair', 'Sewa tenda, kursi, meja, dan perlengkapan.'],
                ['Percetakan & Merchandise', 'percetakan-merchandise', 'printer', 'Percetakan dan merchandise acara.'],
                ['Transportasi', 'transportasi', 'car', 'Transportasi untuk kebutuhan acara.'],
                ['Venue/Tempat', 'venue-tempat', 'building', 'Lokasi dan tempat penyelenggaraan acara.'],
            ];

            foreach ($categories as $index => [$name, $slug, $icon, $description]) {
                Category::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $name,
                        'icon' => $icon,
                        'description' => $description,
                        'sort_order' => $index + 1,
                        'is_active' => true,
                    ],
                );
            }

            $cities = [
                ['Jakarta Selatan', 'DKI Jakarta'],
                ['Bandung', 'Jawa Barat'],
                ['Surabaya', 'Jawa Timur'],
                ['Yogyakarta', 'DI Yogyakarta'],
                ['Semarang', 'Jawa Tengah'],
                ['Denpasar', 'Bali'],
                ['Medan', 'Sumatera Utara'],
                ['Makassar', 'Sulawesi Selatan'],
                ['Bogor', 'Jawa Barat'],
                ['Malang', 'Jawa Timur'],
                ['Tangerang', 'Banten'],
                ['Bekasi', 'Jawa Barat'],
                ['Palembang', 'Sumatera Selatan'],
                ['Solo', 'Jawa Tengah'],
                ['Depok', 'Jawa Barat'],
            ];

            $vendors = [];

            foreach ($cities as $index => [$city, $province]) {
                $email = 'vendor-demo-'.($index + 1).'@example.test';
                $user = User::query()->firstOrCreate(
                    ['email' => $email],
                    [
                        'name' => 'Vendor Demo '.($index + 1),
                        'password' => Hash::make(Str::random(48)),
                        'role' => UserRole::Vendor,
                        'is_active' => true,
                        'email_verified_at' => now(),
                    ],
                );

                $vendors[] = VendorProfile::query()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'business_name' => 'Vendoria '.['Kreasi', 'Nusantara', 'Bersama'][($index % 3)],
                        'slug' => 'vendor-demo-'.($index + 1),
                        'description' => 'Penyedia kebutuhan acara profesional di '.$city.' dan sekitarnya.',
                        'city' => $city,
                        'province' => $province,
                        'address' => 'Pusat kota '.$city,
                        'whatsapp_number' => '628123456789',
                        'contact_email' => $email,
                        'cover_path' => 'placeholder:stock-event-venue.jpg',
                        'is_verified' => $index < 8,
                        'is_active' => true,
                    ],
                );
            }

            $categoryModels = Category::query()->orderBy('sort_order')->get();
            $serviceNames = [
                'Paket Acara Premium', 'Layanan Lengkap', 'Paket Spesial', 'Paket Intimate',
                'Paket Elegan', 'Paket Hemat', 'Paket Eksklusif', 'Paket Keluarga',
            ];
            $serviceRows = [];
            $serviceImagePaths = [];

            for ($index = 0; $index < 40; $index++) {
                $vendor = $vendors[$index % count($vendors)];
                $category = $categoryModels[$index % $categoryModels->count()];
                $name = $category->name.' '.$serviceNames[$index % count($serviceNames)];
                $slug = Str::slug($name).'-'.str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT);
                $price = (100_000 + (($index * 37_000) % 2_000_000));
                $serviceRows[] = [
                    'vendor_profile_id' => $vendor->id,
                    'category_id' => $category->id,
                    'name' => $name,
                    'slug' => $slug,
                    'description' => 'Pilihan '.$category->name.' dengan pelayanan profesional dan fleksibel untuk kebutuhan acara Anda.',
                    'base_price' => $price,
                    'price_unit' => $index % 3 === 0 ? 'per_pax' : 'per_event',
                    'min_quantity' => 1,
                    'city_coverage' => $vendor->city,
                    'terms' => 'Jadwal dan kebutuhan akhir dikonfirmasi bersama vendor.',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                $serviceImagePaths[$slug] = 'placeholder:services/service-'.str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT).'.jpg';
            }

            Service::query()->upsert(
                $serviceRows,
                ['slug'],
                ['vendor_profile_id', 'category_id', 'name', 'description', 'base_price', 'price_unit', 'min_quantity', 'city_coverage', 'terms', 'is_active', 'updated_at'],
            );

            $serviceModels = Service::query()->whereIn('slug', array_column($serviceRows, 'slug'))->get(['id', 'slug', 'base_price']);
            $packageRows = [];
            $imageRows = [];

            foreach ($serviceModels as $service) {
                foreach (['Paket Hemat', 'Paket Lengkap'] as $packageIndex => $packageName) {
                    $packageRows[] = [
                        'service_id' => $service->id,
                        'name' => $packageName,
                        'description' => $packageIndex === 0 ? 'Pilihan praktis untuk acara Anda.' : 'Pilihan lengkap dengan fasilitas tambahan.',
                        'price' => (float) $service->base_price + ($packageIndex * 250_000),
                        'features' => json_encode($packageIndex === 0
                            ? ['Konsultasi kebutuhan', 'Layanan profesional']
                            : ['Konsultasi kebutuhan', 'Layanan profesional', 'Fasilitas tambahan'], JSON_THROW_ON_ERROR),
                        'sort_order' => $packageIndex + 1,
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                $imageRows[] = [
                    'service_id' => $service->id,
                    'path' => $serviceImagePaths[$service->slug],
                    'caption' => $service->slug,
                    'is_cover' => true,
                    'sort_order' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            ServicePackage::query()->upsert(
                $packageRows,
                ['service_id', 'name'],
                ['description', 'price', 'features', 'sort_order', 'is_active', 'updated_at'],
            );
            ServiceImage::query()->upsert(
                $imageRows,
                ['service_id', 'sort_order'],
                ['path', 'caption', 'is_cover', 'updated_at'],
            );
        });
    }
}
