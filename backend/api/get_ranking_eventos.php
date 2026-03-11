<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/db.php';

$ano = isset($_GET['ano']) && $_GET['ano'] !== '' ? intval($_GET['ano']) : null;

try {
    if ($ano !== null) {
        $sql = "SELECT nome_evento, SUM(quantidades_respostas) AS total_respostas
                FROM respostas_origem
                WHERE ano = ?
                GROUP BY nome_evento
                ORDER BY total_respostas DESC";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception($conn->error);
        }

        $stmt->bind_param("i", $ano);
        $stmt->execute();
        $result = $stmt->get_result();
        $ranking = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $stmt->close();
    } else {

        $sql = "SELECT nome_evento, SUM(quantidades_respostas) AS total_respostas
                FROM respostas_origem
                GROUP BY nome_evento
                ORDER BY total_respostas DESC";

        $result = $conn->query($sql);
        if ($result === false) {
            throw new Exception($conn->error);
        }

        $ranking = $result->fetch_all(MYSQLI_ASSOC);
    }

    echo json_encode($ranking);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
    ]);
}
