# Asumsi Implementasi

## Fase 1: autentikasi dan role

- Role disimpan sebagai string (`customer`, `vendor`, `admin`) dan di-cast ke PHP enum. Nilai string menjaga kompatibilitas dengan PostgreSQL maupun SQLite.
- Pengguna lama dan pendaftaran tanpa role yang valid menggunakan role `customer`. Form pendaftaran hanya menerima `customer` atau `vendor`; akun `admin` dibuat melalui seeder agar pengguna tidak dapat menaikkan role sendiri.
- Kredensial admin disediakan melalui `VENDORIA_ADMIN_EMAIL` dan `VENDORIA_ADMIN_PASSWORD`. Seeder gagal dengan pesan eksplisit jika keduanya tidak valid; tidak ada kredensial default.
- Konfigurasi database aplikasi tidak diubah. Karena contoh konfigurasi lokal memakai SQLite sementara spesifikasi menargetkan Supabase/PostgreSQL, migrasi dan seeder hanya diverifikasi menggunakan SQLite in-memory. Pastikan lingkungan deployment menetapkan koneksi Supabase/PostgreSQL sebelum migrasi produksi.
