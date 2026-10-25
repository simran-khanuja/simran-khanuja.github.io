// Light/dark toggle. The page follows the system setting until the visitor
// picks a theme here; the choice is remembered in localStorage. A tiny inline
// script in each page's <head> applies a saved choice before first paint.
(function () {
    var root = document.documentElement;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');

    var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';

    function current() {
        var t = root.getAttribute('data-theme');
        return t === 'dark' || t === 'light' ? t : (mq.matches ? 'dark' : 'light');
    }

    // Keep the giscus comments widget (blog posts) in the same theme.
    function syncGiscus() {
        var frame = document.querySelector('iframe.giscus-frame');
        if (frame) {
            frame.contentWindow.postMessage({ giscus: { setConfig: { theme: current() } } }, 'https://giscus.app');
        }
    }
    var giscusSynced = false;
    window.addEventListener('message', function (e) {
        if (e.origin === 'https://giscus.app' && !giscusSynced) {
            giscusSynced = true;
            syncGiscus();
        }
    });

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';

    function render() {
        var dark = current() === 'dark';
        btn.innerHTML = dark ? SUN : MOON;
        var label = dark ? 'Switch to light theme' : 'Switch to dark theme';
        btn.setAttribute('aria-label', label);
        btn.title = label;
    }

    btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        render();
        syncGiscus();
    });

    if (mq.addEventListener) {
        mq.addEventListener('change', function () { render(); syncGiscus(); });
    }

    document.body.appendChild(btn);
    render();
})();
