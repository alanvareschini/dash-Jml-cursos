<?php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$ano = isset($_GET['ano']) ? intval($_GET['ano']) : 2024;

try {
    $sql = "SELECT
                nome_evento,
                GROUP_CONCAT(DISTINCT tipo_evento ORDER BY tipo_evento SEPARATOR ' | ') AS tipos_evento
            FROM respostas_origem
            WHERE ano = ?
            GROUP BY nome_evento
            ORDER BY nome_evento";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("i", $ano);
    $stmt->execute();
    $result = $stmt->get_result();

    $cursos = [];
    while ($row = $result->fetch_assoc()) {
        $cursos[] = [
            'nome_evento' => $row['nome_evento'],
            'tipos_evento' => $row['tipos_evento'] ?? '',
        ];
    }

    $stmt->close();

    echo json_encode($cursos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
