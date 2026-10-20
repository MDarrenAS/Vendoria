<?php

use App\Support\Rupiah;

test('it formats Indonesian rupiah without fractional digits', function () {
    expect(Rupiah::format(1500000))->toBe('Rp 1.500.000');
});
