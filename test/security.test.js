'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(repoRoot, 'script.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
const nginxConf = fs.readFileSync(path.join(repoRoot, 'nginx.conf'), 'utf8');
const securityHeaders = fs.readFileSync(path.join(repoRoot, 'security-headers.conf'), 'utf8');

// A sink assignment is `innerHTML = ...`, `outerHTML = ...`, etc. Return the
// right-hand side of every assignment, expanding template literals so the
// whole multi-line RHS is captured.
function sinkRhs(src, sinkPattern) {
    const results = [];
    const re = new RegExp(sinkPattern, 'g');
    let m;
    while ((m = re.exec(src)) !== null) {
        let i = m.index + m[0].length;
        while (i < src.length && /\s/.test(src[i])) i++;
        const rest = src.slice(i);
        let end;
        if (rest[0] === '`') {
            const close = rest.indexOf('`', 1);
            end = i + (close >= 0 ? close + 1 : rest.length);
        } else {
            const semi = rest.indexOf(';');
            end = i + (semi >= 0 ? semi : rest.length);
        }
        results.push(src.slice(i, end));
    }
    return results;
}

test('no HTML sink assignment carries quote or filename data', () => {
    const sinks = [
        ...sinkRhs(script, /innerHTML\s*=/),
        ...sinkRhs(script, /outerHTML\s*=/),
        ...sinkRhs(script, /insertAdjacentHTML\s*=/),
        ...sinkRhs(script, /document\.write\s*=/),
        ...sinkRhs(script, /eval\s*=/)
    ];
    assert.ok(sinks.length > 0, 'expected at least one sink assignment to guard');
    for (const rhs of sinks) {
        const lower = rhs.toLowerCase();
        assert.ok(
            !(lower.includes('quote') || lower.includes('filename')),
            `sink RHS must not reference quote/filename, got: ${rhs.trim().slice(0, 40)}`
        );
    }
});

test('JSZip script tag carries integrity and crossorigin', () => {
    const m = indexHtml.match(/<script[^>]*jszip[^>]*>/i);
    assert.ok(m, 'JSZip <script> tag not found');
    assert.ok(/integrity="sha512-/i.test(m[0]), 'JSZip script tag missing integrity="sha512-"');
    assert.ok(/crossorigin=/i.test(m[0]), 'JSZip script tag missing crossorigin');
});

test('CSP is declared and keeps unsafe-inline out of script-src', () => {
    const combined = nginxConf + '\n' + securityHeaders;
    assert.ok(combined.includes('Content-Security-Policy'), 'CSP not declared');
    assert.ok(combined.includes('default-src'), 'CSP missing default-src');
    assert.ok(combined.includes('script-src'), 'CSP missing script-src');
    const scriptSrc = combined.match(/script-src[^;]*/);
    assert.ok(scriptSrc, 'CSP missing script-src value');
    assert.ok(!scriptSrc[0].includes("'unsafe-inline'"), 'script-src must not allow unsafe-inline');
    // The style exception is intentional and must remain documented in the snippet.
    assert.ok(securityHeaders.includes('style-src'), 'CSP missing style-src');
});

// Parse nginx's nested { } blocks. Each block records the text that introduces
// it (e.g. `location /`), its own directives excluding nested blocks, and its
// children -- because add_header inheritance is decided per level, the check
// below has to look at a block's *own* directives, not its descendants'.
function parseBlocks(src) {
    const blocks = [];
    const stack = [];
    let headerStart = 0;
    for (let i = 0; i < src.length; i++) {
        if (src[i] === '{') {
            const node = {
                header: src.slice(headerStart, i).trim().split('\n').pop().trim(),
                openIndex: i,
                bodyStart: i + 1,
                closeIndex: -1,
                children: []
            };
            if (stack.length) stack[stack.length - 1].children.push(node);
            stack.push(node);
            headerStart = i + 1;
        } else if (src[i] === '}') {
            const node = stack.pop();
            if (!node) continue;
            node.closeIndex = i;
            let body = '';
            let cursor = node.bodyStart;
            for (const child of node.children) {
                body += src.slice(cursor, child.openIndex);
                cursor = child.closeIndex + 1;
            }
            body += src.slice(cursor, i);
            node.body = body;
            blocks.push(node);
            headerStart = i + 1;
        }
    }
    assert.equal(stack.length, 0, 'unbalanced braces in nginx.conf');
    return blocks;
}

test('every nginx block that declares add_header also includes the security headers', () => {
    assert.ok(nginxConf.includes('include security-headers.conf;'), 'security include missing');
    const blocks = parseBlocks(nginxConf);
    assert.ok(blocks.length >= 5, `expected >= 5 nginx blocks, got ${blocks.length}`);
    const withAddHeader = blocks.filter((b) => /(^|\n)\s*add_header\s/.test(b.body));
    assert.ok(withAddHeader.length > 0, 'expected at least one block to declare add_header');
    for (const block of withAddHeader) {
        assert.ok(
            block.body.includes('include security-headers.conf;'),
            `nginx block "${block.header}" declares add_header (which drops the inherited ones) ` +
                'but does not include security-headers.conf'
        );
    }
});

test('every Dockerfile that installs nginx.conf also installs the snippet it includes', () => {
    const dockerfiles = fs
        .readdirSync(repoRoot)
        .filter((f) => f === 'Dockerfile' || f.startsWith('Dockerfile.'));
    assert.ok(dockerfiles.length > 0, 'no Dockerfile found');
    for (const file of dockerfiles) {
        const contents = fs.readFileSync(path.join(repoRoot, file), 'utf8');
        if (!contents.includes('nginx.conf /etc/nginx/nginx.conf')) continue;
        assert.ok(
            contents.includes('security-headers.conf /etc/nginx/security-headers.conf'),
            `${file} installs nginx.conf but not security-headers.conf, so nginx will fail to start`
        );
    }
});

test('preview zoom state stays a number and the element stays separate', () => {
    // Card #56: this.zoomLevel was overwritten with #zoom-level, so
    // `this.zoomLevel + delta` produced NaN and `this.zoomLevel.textContent`
    // threw. Neither line may come back.
    assert.ok(
        !/this\.zoomLevel\s*=\s*document\.getElementById/.test(script),
        'this.zoomLevel must never be assigned a DOM element'
    );
    assert.ok(
        !/this\.zoomLevel\.textContent/.test(script),
        'this.zoomLevel is a number; write the label to this.zoomLevelEl'
    );
    assert.ok(/this\.zoomLevelEl\s*=\s*document\.getElementById\('zoom-level'\)/.test(script),
        'this.zoomLevelEl must hold the #zoom-level element');
    for (const name of ['ZOOM_MIN', 'ZOOM_MAX', 'ZOOM_DEFAULT']) {
        assert.ok(new RegExp(`const ${name}\\s*=`).test(script), `${name} must be declared`);
    }
    assert.ok(/Math\.max\(ZOOM_MIN,\s*Math\.min\(ZOOM_MAX/.test(script),
        'adjustZoom must clamp with ZOOM_MIN/ZOOM_MAX');
});
