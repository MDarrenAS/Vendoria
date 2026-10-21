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

    'category_extra_fields' => [
        'katering' => [
            ['name' => 'menu', 'label' => 'Jenis menu', 'type' => 'text'],
            ['name' => 'allergies', 'label' => 'Alergi atau pantangan', 'type' => 'textarea'],
        ],
        'sound-system-lighting' => [
            ['name' => 'duration', 'label' => 'Durasi', 'type' => 'text'],
            ['name' => 'guest_count', 'label' => 'Perkiraan jumlah tamu', 'type' => 'number'],
        ],
        'dokumentasi-foto-video' => [
            ['name' => 'coverage_duration', 'label' => 'Durasi liputan', 'type' => 'text'],
        ],
    ],

    'uploads' => [
        'max_image_kilobytes' => 2048,
        'max_service_images' => 8,
    ],

    'business' => [
        'draft_expiry_hours' => 24,
    ],

    'admin' => [
        'email' => env('VENDORIA_ADMIN_EMAIL'),
        'password' => env('VENDORIA_ADMIN_PASSWORD'),
    ],
];
