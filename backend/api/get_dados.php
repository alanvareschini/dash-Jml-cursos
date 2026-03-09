<?php
header('Content-Type: application/json');

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

$stmt = $pdo->prepare($sql);

$stmt->execute([$evento, $ano]);

$dados = $stmt->fetchAll();

echo json_encode([
    "evento" => $evento,
    "ano" => $ano,
    "dados" => $dados
]);
