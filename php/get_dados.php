<?php
$host = "db";
$user = "root";
$pass = "root";
$db   = "jml_cursos";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

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
    echo json_encode(["error" => "Erro ao preparar a consulta SQL: " . $conn->error]);
    exit;
}

$stmt->bind_param("si", $evento, $ano);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Erro ao executar a consulta SQL: " . $stmt->error]);
    exit;
}

$result = $stmt->get_result();

$dados = [];
while ($row = $result->fetch_assoc()) {
    $dados[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    "evento" => $evento,
    "ano" => $ano,
    "dados" => $dados
]);error_log("Curso recebido: '" . $evento . "'");

?>
