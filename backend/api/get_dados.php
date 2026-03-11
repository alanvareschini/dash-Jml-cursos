<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/db.php';

$ano = isset($_GET['ano']) ? intval($_GET['ano']) : 2024;
$evento = isset($_GET['curso']) && !empty($_GET['curso']) ? $_GET['curso'] : '';

if (empty($evento)) {
    echo json_encode(["error" => "O parâmetro 'curso' é obrigatório."]);
    exit;
}

$sql = "SELECT nome_evento, tipo_evento, origem, local_evento,
               SUM(quantidades_respostas) AS total
        FROM respostas_origem
        WHERE TRIM(nome_evento) = TRIM(?) AND ano = ?
        GROUP BY nome_evento, tipo_evento, origem, local_evento";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit;
}

$stmt->bind_param("si", $evento, $ano);
$stmt->execute();
$result = $stmt->get_result();
$dados = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
$stmt->close();

echo json_encode([
    "evento" => $evento,
    "ano" => $ano,
    "dados" => $dados
]);
