<?php
session_start();
header('Content-Type: application/json');

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