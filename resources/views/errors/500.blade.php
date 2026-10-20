<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Terjadi kesalahan · Vendoria</title>
        <style>
            body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f8fafc; color: #0f172a; font: 16px system-ui, sans-serif; }
            main { max-width: 32rem; padding: 2rem; text-align: center; }
            img { width: 12rem; height: auto; }
            a { color: #0f172a; }
        </style>
    </head>
    <body>
        <main>
            <img src="{{ asset('images/VendoriaLogo.png') }}" alt="Vendoria">
            <h1>500 · Terjadi kesalahan</h1>
            <p>Maaf, permintaan Anda belum dapat diproses. Silakan coba lagi beberapa saat.</p>
            <a href="{{ route('home') }}">Kembali ke beranda</a>
        </main>
    </body>
</html>
