export function resolveApiBase() {
    // Optional manual override (useful for debugging/proxies).
    if (typeof window.__API_BASE__ === 'string' && window.__API_BASE__.trim() !== '') {
        return new URL(window.__API_BASE__, window.location.origin).toString();
    }

    const path = window.location.pathname;
    const frontendMarker = '/frontend/';
    const idx = path.indexOf(frontendMarker);

    // Local/XAMPP style: /project/frontend/index.html -> /project/backend/api/
    if (idx !== -1) {
        const root = path.slice(0, idx + 1);
        return new URL(`${root}backend/api/`, window.location.origin).toString();
    }

    // Railway/Docker style: frontend at web root and backend mounted to /api/
    return new URL('/api/', window.location.origin).toString();
}
