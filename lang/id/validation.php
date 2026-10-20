<?php

return [
    'accepted' => ':attribute harus disetujui.',
    'boolean' => ':attribute harus berupa pilihan ya atau tidak.',
    'confirmed' => 'Konfirmasi :attribute tidak cocok.',
    'current_password' => 'Kata sandi yang diberikan salah.',
    'email' => ':attribute harus berupa alamat email yang valid.',
    'in' => 'Pilihan :attribute tidak valid.',
    'max' => [
        'file' => ':attribute tidak boleh lebih besar dari :max kilobita.',
        'numeric' => ':attribute tidak boleh lebih dari :max.',
        'string' => ':attribute tidak boleh lebih dari :max karakter.',
    ],
    'min' => [
        'file' => ':attribute minimal harus berukuran :min kilobita.',
        'numeric' => ':attribute minimal harus bernilai :min.',
        'string' => ':attribute minimal harus terdiri dari :min karakter.',
    ],
    'password' => [
        'letters' => ':attribute harus mengandung setidaknya satu huruf.',
        'mixed' => ':attribute harus mengandung huruf besar dan huruf kecil.',
        'numbers' => ':attribute harus mengandung setidaknya satu angka.',
        'symbols' => ':attribute harus mengandung setidaknya satu simbol.',
        'uncompromised' => ':attribute ditemukan dalam kebocoran data. Silakan pilih kata sandi lain.',
    ],
    'required' => ':attribute wajib diisi.',
    'string' => ':attribute harus berupa teks.',
    'unique' => ':attribute sudah digunakan.',
    'attributes' => [
        'email' => 'alamat email',
        'name' => 'nama',
        'password' => 'kata sandi',
        'password_confirmation' => 'konfirmasi kata sandi',
        'role' => 'jenis akun',
    ],
];
