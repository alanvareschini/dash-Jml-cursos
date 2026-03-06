<?php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

$ano = isset($_GET['ano']) ? intval($_GET['ano']) : 2024;

try {

    $sql = "SELECT DISTINCT nome_evento
            FROM respostas_origem
            WHERE ano = ?
            ORDER BY nome_evento";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$ano]);

    $cursos = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($cursos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}