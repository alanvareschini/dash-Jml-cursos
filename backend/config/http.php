<?php

function applyApiCors(): void
{
    static $alreadyApplied = false;
    if ($alreadyApplied) {
        return;
    }
    $alreadyApplied = true;

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

    // Optional restriction via environment variable:
    // ALLOWED_ORIGINS=https://frontend1.up.railway.app,https://frontend2.up.railway.app
    $allowedRaw = getenv('ALLOWED_ORIGINS');
    $allowed = array_values(array_filter(array_map('trim', explode(',', (string)$allowedRaw))));

    $allowOrigin = '';
    if ($origin !== '' && filter_var($origin, FILTER_VALIDATE_URL)) {
        if (empty($allowed) || in_array($origin, $allowed, true)) {
            $allowOrigin = $origin;
        }
    }

    if ($allowOrigin !== '') {
        header("Access-Control-Allow-Origin: {$allowOrigin}");
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    if ($method === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function startApiSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $forwardedProto = strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    $https = (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || $forwardedProto === 'https'
    );

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $https,
        'httponly' => true,
        'samesite' => $https ? 'None' : 'Lax',
    ]);

    session_start();
}
