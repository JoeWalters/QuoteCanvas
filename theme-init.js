// Applied before the app boots so a saved dark preference never flashes a
// light first paint. This must be an external file in <head>: the CSP
// (security-headers.conf) allows script-src 'self' only, never 'unsafe-inline'.
(function () {
    'use strict';
    try {
        var theme = 'dark'; // dark is the app default
        var raw = localStorage.getItem('quotecanvas-settings');
        if (raw) {
            var parsed = JSON.parse(raw);
            if (parsed && typeof parsed.theme === 'string') {
                theme = parsed.theme;
            }
        }
        if (theme !== 'light') {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.style.colorScheme = 'dark';
        }
    } catch (error) {
        // localStorage can throw in private mode; dark is the app default.
        document.documentElement.classList.add('dark-theme');
        document.documentElement.style.colorScheme = 'dark';
    }
})();
