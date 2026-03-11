<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/db.php';

$ano = $_GET['ano'] ?? '';

if ($ano !== '') {

    $sql = "SELECT origem, SUM(quantidades_respostas) AS total_respostas
            FROM respostas_origem
            WHERE ano = ?
            GROUP BY origem
            ORDER BY total_respostas DESC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => $conn->error]);
        exit;
    }

    $anoInt = intval($ano);
    $stmt->bind_param("i", $anoInt);
    $stmt->execute();
    $result = $stmt->get_result();
    $ranking = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    $stmt->close();

} else {

    $sql = "SELECT origem, SUM(quantidades_respostas) AS total_respostas
            FROM respostas_origem
            GROUP BY origem
            ORDER BY total_respostas DESC";

    $result = $conn->query($sql);
    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => $conn->error]);
        exit;
    }

    $ranking = $result->fetch_all(MYSQLI_ASSOC);
}

echo json_encode($ranking);
