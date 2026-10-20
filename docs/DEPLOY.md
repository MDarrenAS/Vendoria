# Deploy Vendoria ke Vercel dan Supabase

## Persiapan Supabase

1. Buat bucket Storage publik untuk gambar vendor, layanan, serta avatar.
2. Ambil URL, username, dan password **transaction pooler** dari Supabase. Gunakan port `6543`.
3. Jalankan migration aplikasi pada proyek baru setelah meninjau dampaknya. Jangan gunakan `migrate:fresh` pada database yang sudah berisi data.
4. Dari pengaturan S3 Storage Supabase, salin endpoint, region, dan buat pasangan S3 access key. Gunakan endpoint `https://<project_ref>.storage.supabase.co/storage/v1/s3`, region persis dari dashboard, `AWS_USE_PATH_STYLE_ENDPOINT=true`, dan `FILESYSTEM_DISK=s3`.
5. Atur `SUPABASE_STORAGE_PUBLIC_URL` ke `https://<project_ref>.supabase.co/storage/v1/object/public/<bucket>`. Aplikasi menambahkan path objek ke URL ini saat menampilkan gambar.

S3 access key Supabase memberikan akses penuh ke semua bucket dan melewati policy Storage. Simpan hanya sebagai secret backend di `.env` lokal atau secret manager Vercel; jangan kirim ke frontend, chat, atau repository. Untuk uji upload lokal, isi `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET`, `AWS_ENDPOINT`, dan `SUPABASE_STORAGE_PUBLIC_URL` dengan nilai proyek yang sama.

Laravel mengakses database secara langsung dari backend; frontend tidak menggunakan Supabase Data API. Migration `enable_rls_for_public_tables` mengaktifkan RLS untuk tabel di schema `public` dan mencabut privilege tabel/sequences dari role `anon` dan `authenticated`. Migration `remove_supabase_api_default_privileges` juga mencabut `USAGE` pada schema `public` dari `PUBLIC`, `anon`, dan `authenticated`, sehingga default grant Supabase tidak membuka tabel baru ke client API. Role backend Laravel harus memiliki hak pemilik atau `BYPASSRLS`. Sebagai lapisan tambahan, nonaktifkan **Automatically expose new tables** pada pengaturan Data API. Jika kelak frontend perlu membaca tabel melalui Data API, pulihkan `USAGE` dan berikan grant per tabel hanya setelah policy RLS yang sesuai dibuat.

`service_role` tetap merupakan role server berprivilege tinggi. Jangan pernah mengekspos secret/service-role key ke frontend; Laravel memakai koneksi database backend, bukan key tersebut.

## Konfigurasi Vercel

1. Impor repository ke Vercel dan gunakan Root Directory repository.
2. Biarkan Framework Preset menggunakan konfigurasi repository. Output Directory harus `public` (atau kosong agar `vercel.json` yang menentukan `public` dipakai), bukan `dist`.
3. Tambahkan variabel environment berikut di semua environment yang diperlukan:
   - `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY` (buat dengan `php artisan key:generate --show` secara lokal), `APP_URL`.
   - `DB_CONNECTION=pgsql`, `DB_URL` transaction pooler Supabase, `DB_SCHEMA=public`, `DB_EMULATE_PREPARES=true`.
   - `SESSION_DRIVER=database`, `CACHE_STORE=database`, `QUEUE_CONNECTION=sync`, `LOG_CHANNEL=stderr`.
   - `FILESYSTEM_DISK=s3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET`, `AWS_ENDPOINT`, `AWS_USE_PATH_STYLE_ENDPOINT=true`, `SUPABASE_STORAGE_PUBLIC_URL`.
   - `VENDORIA_ADMIN_EMAIL` dan `VENDORIA_ADMIN_PASSWORD` untuk membuat akun admin pertama.
4. Deploy, lalu jalankan migration produksi satu kali dari lingkungan tepercaya yang memakai kredensial database yang sama: `php artisan migrate --force`.
5. Jalankan seeder admin dari lingkungan tepercaya setelah secret admin dipasang: `php artisan db:seed --class=AdminUserSeeder --force`. Seeder katalog hanya diperlukan bila katalog produksi belum diisi.
6. Verifikasi `/up`, halaman katalog, login admin, upload S3, dan log deployment. Jangan menjalankan seeder contoh pada database produksi yang sudah memiliki data.

Vercel menyediakan filesystem runtime yang tidak persisten. Storage aplikasi, cache bootstrap Laravel, dan hasil kompilasi view diarahkan ke `/tmp` lewat konfigurasi `vercel.json`. Route helper Wayfinder dibuat saat pengembangan dan disimpan dalam repository; build Vercel melewati generator agar tidak memerlukan PHP CLI pada tahap build Node.

Aplikasi mempercayai header `X-Forwarded-Proto` dari proxy untuk menghasilkan URL HTTPS yang benar saat TLS dihentikan di edge Vercel. Ini mencegah browser memblokir CSS, JavaScript, dan font sebagai mixed content.
