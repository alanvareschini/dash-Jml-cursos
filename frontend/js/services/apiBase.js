function ensureTrailingSlash(url) {
    return url.endsWith('/') ? url : `${url}/`;
}

export function resolveApiBase() {
    // Optional manual override (useful for debugging/proxies).
    if (typeof window.__API_BASE__ === 'string' && window.__API_BASE__.trim() !== '') {
        return ensureTrailingSlash(new URL(window.__API_BASE__, window.location.origin).toString());
    }

    const metaApiBase = document.querySelector('meta[name="api-base"]')?.getAttribute('content')?.trim();
    if (metaApiBase) {
        return ensureTrailingSlash(new URL(metaApiBase, window.location.origin).toString());
    }

    const path = window.location.pathname;
    const frontendMarker = '/frontend/';
    const idx = path.indexOf(frontendMarker);

    // Local/XAMPP style: /project/frontend/index.html -> /project/backend/api/
    if (idx !== -1) {
        const root = path.slice(0, idx + 1);
        return ensureTrailingSlash(new URL(`${root}backend/api/`, window.location.origin).toString());
    }

    // Railway/Docker style: frontend at web root and backend mounted to /api/
    return ensureTrailingSlash(new URL('/api/', window.location.origin).toString());
}
