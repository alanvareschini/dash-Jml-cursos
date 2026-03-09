<?php
require_once __DIR__ . '/../config/http.php';
applyApiCors();
startApiSession();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(["authenticated" => false]);
    exit;
}

echo json_encode([
    "authenticated" => true,
    "usuario_id" => $_SESSION['usuario_id'],
    "nome" => $_SESSION['usuario_nome'] ?? "Admin"
]);
