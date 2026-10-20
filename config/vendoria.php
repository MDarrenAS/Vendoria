<?php

return [
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
