<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["logado" => false]);
    exit;
}

echo json_encode(["logado" => true]);