<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';

$ano = isset($_GET['ano']) && $_GET['ano'] !== '' ? intval($_GET['ano']) : null;

try {
    if ($ano !== null) {
        $sql = "SELECT nome_evento, SUM(quantidades_respostas) AS total_respostas
                FROM respostas_origem
                WHERE ano = ?
                GROUP BY nome_evento
                ORDER BY total_respostas DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$ano]);
    } else {

        $sql = "SELECT nome_evento, SUM(quantidades_respostas) AS total_respostas
                FROM respostas_origem
                GROUP BY nome_evento
                ORDER BY total_respostas DESC";

        $stmt = $pdo->query($sql);
    }

    $ranking = $stmt->fetchAll();

    echo json_encode($ranking);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
    ]);
}
