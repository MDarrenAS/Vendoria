<?php

return [
    'category_styles' => [
        'katering' => ['bg' => '#FFEDD5', 'fg' => '#C2410C', 'icon' => 'utensils'],
        'dekorasi' => ['bg' => '#FCE7F3', 'fg' => '#BE185D', 'icon' => 'flower-2'],
        'sound-system-lighting' => ['bg' => '#EDE9FE', 'fg' => '#6D28D9', 'icon' => 'speaker'],
        'dokumentasi-foto-video' => ['bg' => '#E0F2FE', 'fg' => '#0369A1', 'icon' => 'camera'],
        'mc-hiburan' => ['bg' => '#FEF9C3', 'fg' => '#A16207', 'icon' => 'mic'],
        'sewa-perlengkapan' => ['bg' => '#DCFCE7', 'fg' => '#15803D', 'icon' => 'armchair'],
        'percetakan-merchandise' => ['bg' => '#CCFBF1', 'fg' => '#0F766E', 'icon' => 'printer'],
        'transportasi' => ['bg' => '#E0E7FF', 'fg' => '#4338CA', 'icon' => 'bus'],
        'venue-tempat' => ['bg' => '#FFE4E6', 'fg' => '#BE123C', 'icon' => 'building-2'],
    ],

    'storage' => [
        'public_url' => env('SUPABASE_STORAGE_PUBLIC_URL'),
    ],

    'category_quantity_labels' => [
        'katering' => 'Jumlah porsi (orang)',
        'dekorasi' => 'Jumlah paket / area',
        'sound-system-lighting' => 'Jumlah paket / set',
        'dokumentasi-foto-video' => 'Jumlah paket / tim',
        'mc-hiburan' => 'Jumlah sesi / talent',
        'sewa-perlengkapan' => 'Jumlah unit / set',
        'percetakan-merchandise' => 'Jumlah cetak (pcs)',
        'transportasi' => 'Jumlah armada / unit',
        'venue-tempat' => 'Jumlah sesi / hari',
    ],

    'category_extra_fields' => [
        'katering' => [
            [
                'name' => 'service_style',
                'label' => 'Gaya penyajian',
                'type' => 'select',
                'options' => [
                    'Prasmanan (Buffet)',
                    'Nasi Box / Bento',
                    'Pondokan / Stall',
                    'Coffee Break / Snack',
                ],
            ],
            [
                'name' => 'serving_time',
                'label' => 'Jam penyajian / makan',
                'type' => 'time',
            ],
            [
                'name' => 'menu',
                'label' => 'Pilihan menu utama / tema masakan',
                'type' => 'text',
                'placeholder' => 'Contoh: Masakan Nusantara, Ayam Bakar, Rendang, Soto',
            ],
            [
                'name' => 'equipment_needed',
                'label' => 'Kebutuhan peralatan makan',
                'type' => 'select',
                'options' => [
                    'Disediakan Vendor',
                    'Sudah Ada di Lokasi',
                    'Kemasan Sekali Pakai',
                ],
            ],
            [
                'name' => 'allergies',
                'label' => 'Alergi, pantangan, atau kebutuhan khusus',
                'type' => 'textarea',
                'placeholder' => 'Contoh: 5 porsi vegetarian, tanpa kacang, wajib sertifikat halal',
            ],
        ],
        'dekorasi' => [
            [
                'name' => 'theme_concept',
                'label' => 'Tema & palet warna',
                'type' => 'text',
                'placeholder' => 'Contoh: Rustic Sage Green, Modern Minimalist Putih-Gold',
            ],
            [
                'name' => 'venue_type',
                'label' => 'Tipe lokasi',
                'type' => 'select',
                'options' => [
                    'Indoor (Gedung/Ballroom)',
                    'Outdoor (Taman/Pantai)',
                    'Semi-Outdoor / Tenda',
                ],
            ],
            [
                'name' => 'area_dimension',
                'label' => 'Perkiraan ukuran area / panggung',
                'type' => 'text',
                'placeholder' => 'Contoh: 6m x 4m, tinggi backdrop 3m',
            ],
            [
                'name' => 'loading_time',
                'label' => 'Jadwal loading / pemasangan & bongkar',
                'type' => 'text',
                'placeholder' => 'Contoh: Pasang H-1 jam 20.00, bongkar H+0 jam 22.00',
            ],
            [
                'name' => 'reference_link',
                'label' => 'Link referensi desain (opsional)',
                'type' => 'text',
                'placeholder' => 'https://pinterest.com/... atau Google Drive',
            ],
        ],
        'sound-system-lighting' => [
            [
                'name' => 'duration',
                'label' => 'Durasi acara / pemakaian',
                'type' => 'text',
                'placeholder' => 'Contoh: 6 jam (09.00 - 15.00 WIB)',
            ],
            [
                'name' => 'guest_count',
                'label' => 'Perkiraan jumlah tamu / audiens',
                'type' => 'number',
                'placeholder' => 'Contoh: 250',
            ],
            [
                'name' => 'venue_acoustics',
                'label' => 'Kondisi akustik lokasi',
                'type' => 'select',
                'options' => [
                    'Indoor Tertutup',
                    'Outdoor Terbuka',
                    'Semi-Outdoor',
                ],
            ],
            [
                'name' => 'power_source',
                'label' => 'Ketersediaan listrik lokasi',
                'type' => 'select',
                'options' => [
                    'Listrik Gedung/Venue Memadai',
                    'Perlu Genset dari Vendor',
                    'Belum Diketahui',
                ],
            ],
            [
                'name' => 'check_sound_time',
                'label' => 'Jadwal check sound',
                'type' => 'time',
            ],
            [
                'name' => 'mic_needs',
                'label' => 'Kebutuhan mikrofon & input audio',
                'type' => 'text',
                'placeholder' => 'Contoh: 4 Mic Wireless, 2 Stand Mic, Input Band/DJ',
            ],
        ],
        'dokumentasi-foto-video' => [
            [
                'name' => 'coverage_duration',
                'label' => 'Durasi liputan',
                'type' => 'text',
                'placeholder' => 'Contoh: 8 jam (08.00 - 16.00 WIB)',
            ],
            [
                'name' => 'deliverable_type',
                'label' => 'Output yang dibutuhkan',
                'type' => 'select',
                'options' => [
                    'Foto Saja',
                    'Video Saja',
                    'Foto + Video Highlight',
                    'Foto + Video Full + Drone',
                ],
            ],
            [
                'name' => 'editing_style',
                'label' => 'Gaya editing / referensi tone',
                'type' => 'text',
                'placeholder' => 'Contoh: Warm & Candid, Cinematic, Clean & Bright',
            ],
            [
                'name' => 'delivery_format',
                'label' => 'Media pengiriman hasil',
                'type' => 'select',
                'options' => [
                    'Google Drive / Cloud',
                    'Flashdisk + Cloud',
                    'Album Cetak + Cloud',
                ],
            ],
            [
                'name' => 'shot_list',
                'label' => 'Momen wajib / shot list khusus (opsional)',
                'type' => 'textarea',
                'placeholder' => 'Contoh: Foto bersama VIP, sambutan rektor, sesi potong tumpeng',
            ],
        ],
        'mc-hiburan' => [
            [
                'name' => 'event_vibe',
                'label' => 'Nuansa / gaya pembawaan',
                'type' => 'select',
                'options' => [
                    'Formal / Resmi',
                    'Semi-Formal',
                    'Santai & Interaktif',
                    'Adat / Tradisional',
                ],
            ],
            [
                'name' => 'language',
                'label' => 'Bahasa utama',
                'type' => 'select',
                'options' => [
                    'Bahasa Indonesia',
                    'Bilingual (Indonesia - Inggris)',
                    'Bahasa Inggris',
                    'Bahasa Daerah',
                ],
            ],
            [
                'name' => 'dresscode',
                'label' => 'Dresscode talent / MC',
                'type' => 'text',
                'placeholder' => 'Contoh: Jas Hitam, Batik Formal, Smart Casual',
            ],
            [
                'name' => 'entertainment_genre',
                'label' => 'Genre musik / jenis hiburan (opsional)',
                'type' => 'text',
                'placeholder' => 'Contoh: Akustik Pop/Jazz, Dangdut, DJ, Stand-up Comedy',
            ],
            [
                'name' => 'rundown_notes',
                'label' => 'Ringkasan susunan acara / segmen penting',
                'type' => 'textarea',
                'placeholder' => 'Contoh: Pembukaan 09.00, Talkshow 10.00, Doorprize 12.00',
            ],
        ],
        'sewa-perlengkapan' => [
            [
                'name' => 'rental_days',
                'label' => 'Durasi sewa (hari)',
                'type' => 'number',
                'placeholder' => 'Contoh: 2',
            ],
            [
                'name' => 'item_list',
                'label' => 'Daftar rincian barang & jumlahnya',
                'type' => 'textarea',
                'placeholder' => 'Contoh: 100 Kursi Tiffany Putih, 10 Meja Bulat, 2 Tenda Sarnafil 5x5m',
            ],
            [
                'name' => 'delivery_time',
                'label' => 'Jadwal pengiriman barang',
                'type' => 'text',
                'placeholder' => 'Contoh: H-1 pukul 14.00 WIB',
            ],
            [
                'name' => 'pickup_time',
                'label' => 'Jadwal pengambilan / bongkar barang',
                'type' => 'text',
                'placeholder' => 'Contoh: H+0 pukul 22.00 WIB',
            ],
            [
                'name' => 'access_notes',
                'label' => 'Catatan akses lokasi (opsional)',
                'type' => 'text',
                'placeholder' => 'Contoh: Lantai 2 tanpa lift, akses truk engkel masuk',
            ],
        ],
        'percetakan-merchandise' => [
            [
                'name' => 'item_spec',
                'label' => 'Jenis produk & ukuran',
                'type' => 'text',
                'placeholder' => 'Contoh: Totebag Kanvas 30x40cm, Spanduk Flexy 3x1m',
            ],
            [
                'name' => 'material_finishing',
                'label' => 'Bahan & finishing',
                'type' => 'text',
                'placeholder' => 'Contoh: Art Carton 260gsm, Laminasi Doff, Mata Ayam',
            ],
            [
                'name' => 'design_status',
                'label' => 'Status file desain',
                'type' => 'select',
                'options' => [
                    'File Siap Cetak (PDF/AI/CDR)',
                    'Butuh Jasa Desain dari Vendor',
                    'Revisi Desain Ringan',
                ],
            ],
            [
                'name' => 'design_link',
                'label' => 'Link file desain / referensi (opsional)',
                'type' => 'text',
                'placeholder' => 'https://drive.google.com/... atau link Canva',
            ],
            [
                'name' => 'production_deadline',
                'label' => 'Batas waktu barang harus diterima',
                'type' => 'text',
                'placeholder' => 'Contoh: Maksimal H-2 acara (Kamis sore)',
            ],
        ],
        'transportasi' => [
            [
                'name' => 'trip_type',
                'label' => 'Jenis perjalanan',
                'type' => 'select',
                'options' => [
                    'Sekali Jalan (Drop Off)',
                    'Pulang-Pergi (PP) Sehari',
                    'Sewa Harian / Multi-hari',
                ],
            ],
            [
                'name' => 'vehicle_type',
                'label' => 'Jenis / tipe kendaraan yang dibutuhkan',
                'type' => 'text',
                'placeholder' => 'Contoh: Hiace Commuter 14 Seat, Bus Pariwisata 45 Seat',
            ],
            [
                'name' => 'passenger_count',
                'label' => 'Total jumlah penumpang',
                'type' => 'number',
                'placeholder' => 'Contoh: 40',
            ],
            [
                'name' => 'pickup_point',
                'label' => 'Titik penjemputan & jam berangkat',
                'type' => 'text',
                'placeholder' => 'Contoh: Kampus Utama Gerbang Timur, pukul 06.30 WIB',
            ],
            [
                'name' => 'destination_point',
                'label' => 'Titik tujuan & rute perjalanan',
                'type' => 'text',
                'placeholder' => 'Contoh: Taman Safari Bogor via Tol Jagorawi',
            ],
        ],
        'venue-tempat' => [
            [
                'name' => 'time_slot',
                'label' => 'Jam pemakaian venue',
                'type' => 'text',
                'placeholder' => 'Contoh: 08.00 - 17.00 WIB (termasuk persiapan)',
            ],
            [
                'name' => 'guest_capacity',
                'label' => 'Perkiraan jumlah tamu',
                'type' => 'number',
                'placeholder' => 'Contoh: 300',
            ],
            [
                'name' => 'seating_layout',
                'label' => 'Tata letak ruangan (layout)',
                'type' => 'select',
                'options' => [
                    'Theater',
                    'Classroom',
                    'Round Table / Banquet',
                    'U-Shape',
                    'Standing / Cocktail',
                ],
            ],
            [
                'name' => 'catering_policy',
                'label' => 'Rencana konsumsi',
                'type' => 'select',
                'options' => [
                    'Gunakan Katering dari Venue',
                    'Bawa Katering dari Luar',
                    'Tidak Ada Konsumsi',
                ],
            ],
            [
                'name' => 'facilities_needed',
                'label' => 'Fasilitas tambahan yang dibutuhkan',
                'type' => 'text',
                'placeholder' => 'Contoh: Proyektor, Ruang VIP/Make-up, Area Parkir Luas',
            ],
        ],
    ],

    'uploads' => [
        'max_image_kilobytes' => 2048,
        'max_service_images' => 8,
    ],

    'business' => [
        'draft_expiry_hours' => 24,
        'admin_fee_rate' => (float) env('ADMIN_FEE_RATE', 0.03),
    ],

    'admin' => [
        'email' => env('VENDORIA_ADMIN_EMAIL'),
        'password' => env('VENDORIA_ADMIN_PASSWORD'),
    ],
];
