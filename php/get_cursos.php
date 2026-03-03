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

$sql = "SELECT DISTINCT nome_evento 
        FROM respostas_origem 
        WHERE ano = ? 
        ORDER BY nome_evento";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "Erro ao preparar a consulta SQL: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $ano);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Erro ao executar a consulta SQL: " . $stmt->error]);
    exit;
}

$result = $stmt->get_result();

$cursos = [];
while ($row = $result->fetch_assoc()) {
    $cursos[] = $row['nome_evento'];
}

$stmt->close();
$conn->close();

echo json_encode($cursos);
?>
