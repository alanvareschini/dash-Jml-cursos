<?php
header('Content-Type: application/json');

require_once '../config/db.php';

$ano = $_GET['ano'] ?? '';

if ($ano !== '') {

    $sql = "SELECT origem, SUM(quantidades_respostas) AS total_respostas
            FROM respostas_origem
            WHERE ano = ?
            GROUP BY origem
            ORDER BY total_respostas DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$ano]);

} else {

    $sql = "SELECT origem, SUM(quantidades_respostas) AS total_respostas
            FROM respostas_origem
            GROUP BY origem
            ORDER BY total_respostas DESC";

    $stmt = $pdo->query($sql);
}

$ranking = $stmt->fetchAll();

echo json_encode($ranking);