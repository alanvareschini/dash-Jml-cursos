<?php
session_start();
header('Content-Type: application/json');

// Limpa variáveis de sessão
$_SESSION = [];

// Remove cookie da sessão
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destrói sessão
session_destroy();

echo json_encode([
    "success" => true
]);
exit;