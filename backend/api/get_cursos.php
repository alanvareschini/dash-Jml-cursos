<?php
require_once __DIR__ . '/../config/db.php';
header('Content-Type: application/json');

$ano = isset($_GET['ano']) ? intval($_GET['ano']) : 2024;

try {
    $sql = "SELECT DISTINCT nome_evento
            FROM respostas_origem
            WHERE ano = ?
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
        $cursos[] = $row['nome_evento'];
    }

    $stmt->close();

    echo json_encode($cursos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
