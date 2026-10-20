<?php

use Illuminate\Support\Facades\Route;

test('assets use https when the request is forwarded by a tls proxy', function () {
    Route::get('/_test/asset-url', fn (): string => asset('test.css'));

    $response = $this
        ->withHeader('X-Forwarded-Proto', 'https')
        ->get('/_test/asset-url');

    $response->assertOk()
        ->assertSee('https://localhost:8000/test.css');
});
