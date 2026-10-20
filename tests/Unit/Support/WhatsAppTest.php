<?php

use App\Support\WhatsApp;
use InvalidArgumentException;

test('it normalizes valid Indonesian mobile numbers', function (string $input, string $expected) {
    expect(WhatsApp::normalize($input))->toBe($expected);
})->with([
    'local leading zero' => ['081234567890', '6281234567890'],
    'local without leading zero' => ['81234567890', '6281234567890'],
    'international prefix' => ['+62 812-3456-7890', '6281234567890'],
]);

test('it rejects invalid or non-Indonesian phone numbers', function (string $input) {
    expect(WhatsApp::normalize($input))->toBeNull();
})->with([
    'too short' => ['0812'],
    'landline' => ['0215551212'],
    'letters' => ['08abc'],
]);

test('it creates an encoded whatsapp link', function () {
    expect(WhatsApp::link('081234567890', 'Halo Vendoria!'))
        ->toBe('https://wa.me/6281234567890?text=Halo%20Vendoria%21');
});

test('it raises an explicit exception for an invalid number', function () {
    expect(fn () => WhatsApp::link('nomor-invalid', 'Halo'))
        ->toThrow(InvalidArgumentException::class);
});
