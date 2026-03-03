<?php
header('Content-Type: application/json');

$conn = new mysqli("db", "root", "root", "jml_cursos");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    echo json_encode(["error" => "Erro de conexão"]);
    exit;
}

$ano = $_GET['ano'] ?? '';

$params = [];
$types = "";
$where = "";

if ($ano !== "") {
    $where = "WHERE ano = ?";
    $params[] = $ano;
    $types .= "i";
}

$sql = "SELECT origem, SUM(quantidades_respostas) AS total_respostas
        FROM respostas_origem
        $where
        GROUP BY origem
        ORDER BY total_respostas DESC";

$stmt = $conn->prepare($sql);

if ($where !== "") {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$ranking = [];

while ($row = $result->fetch_assoc()) {
    $ranking[] = $row;
}

echo json_encode($ranking);

$conn->close();
?>
