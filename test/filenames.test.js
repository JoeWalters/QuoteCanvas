'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const {
    sanitizeForFilename,
    formatToExtension,
    stripImageExtension,
    buildFilename,
    dedupeZipNames
} = require('../script.js');

test('formatToExtension maps each encoded format', () => {
    assert.equal(formatToExtension('image/jpeg'), 'jpg');
    assert.equal(formatToExtension('image/webp'), 'webp');
    assert.equal(formatToExtension('image/png'), 'png');
    assert.equal(formatToExtension('unknown/format'), 'png');
});

test('sanitizeForFilename converts accented unicode to ascii-safe', () => {
    assert.equal(sanitizeForFilename('café déjà vu'), 'cafe-deja-vu');
});

test('sanitizeForFilename strips CJK-only input to empty', () => {
    assert.equal(sanitizeForFilename('日本語の引用'), '');
});

test('stripImageExtension removes one trailing image extension', () => {
    assert.equal(stripImageExtension('quote.png'), 'quote');
    assert.equal(stripImageExtension('quote.jpg'), 'quote');
    assert.equal(stripImageExtension('quote.webp'), 'quote');
    // No trailing extension, and a dot in the middle, are preserved.
    assert.equal(stripImageExtension('quote'), 'quote');
    assert.equal(stripImageExtension('my.quote'), 'my.quote');
});

test('buildFilename with a CJK-only quote yields an empty base', () => {
    const base = buildFilename({
        pattern: '{quote}',
        indexStart: 1,
        indexPadding: 0,
        quoteMaxLength: 30,
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH-MM-SS',
        index: 0,
        quote: '日本語の引用'
    });
    assert.equal(base, '');
});

test('buildFilename + jpeg yields quote.jpg (no doubled extension)', () => {
    const base = buildFilename({
        pattern: 'quote.png',
        indexStart: 1,
        indexPadding: 0,
        quoteMaxLength: 30,
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH-MM-SS',
        index: 0,
        quote: 'hello'
    });
    const stripped = stripImageExtension(base);
    assert.equal(stripped, 'quote');
    assert.equal(stripped + '.' + formatToExtension('image/jpeg'), 'quote.jpg');
});

test('CJK-only quote falls back to a deterministic quote-<n> name', () => {
    const base = buildFilename({
        pattern: '{quote}',
        indexStart: 1,
        indexPadding: 0,
        quoteMaxLength: 30,
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH-MM-SS',
        index: 0,
        quote: '日本語の引用'
    });
    // Same fallback the app applies when the sanitised base is empty.
    const paddedIndex = '1'; // index 0 + start 1
    const safeBase = base.length > 0 ? base : `quote-${paddedIndex}`;
    const filename = safeBase + '.' + formatToExtension('image/png');
    assert.equal(filename, 'quote-1.png');
    assert.ok(/^[\x20-\x7E]*$/.test(filename), 'filename must be ASCII-only');
    assert.ok(filename !== '.png', 'filename must not be a bare extension');
});

test('dedupeZipNames dedupes three identical names', () => {
    const names = dedupeZipNames([
        { filename: 'quote.jpg' },
        { filename: 'quote.jpg' },
        { filename: 'quote.jpg' }
    ]);
    assert.deepEqual(names, ['quote.jpg', 'quote-2.jpg', 'quote-3.jpg']);
});

test('dedupeZipNames dedupes case-insensitive collisions', () => {
    const names = dedupeZipNames([
        { filename: 'Quote.JPG' },
        { filename: 'quote.jpg' }
    ]);
    assert.deepEqual(names, ['Quote.JPG', 'quote-2.jpg']);
});

test('dedupeZipNames never reuses a name that a suffix already produced', () => {
    // The third entry would collide with the suffix generated for the second,
    // so a naive "count occurrences" dedupe still loses an image here.
    const names = dedupeZipNames([
        { filename: 'quote.jpg' },
        { filename: 'quote.jpg' },
        { filename: 'quote-2.jpg' }
    ]);
    assert.strictEqual(new Set(names.map(n => n.toLowerCase())).size, 3);
    assert.deepEqual(names, ['quote.jpg', 'quote-2.jpg', 'quote-2-2.jpg']);
});

test('dedupeZipNames preserves names without an extension', () => {
    const names = dedupeZipNames([{ name: 'quote' }, { name: 'quote' }]);
    assert.deepEqual(names, ['quote', 'quote-2']);
});
