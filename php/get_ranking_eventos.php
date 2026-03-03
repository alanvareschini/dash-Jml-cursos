<?php
$conn = new mysqli("db", "root", "root", "jml_cursos");
$conn->set_charset("utf8mb4");

$ano = isset($_GET['ano']) && $_GET['ano'] !== '' ? intval($_GET['ano']) : null;

if ($ano) {
    $sql = "SELECT nome_evento, SUM(quantidades_respostas) AS total_respostas
            FROM respostas_origem
            WHERE ano = ?
            GROUP BY nome_evento
            ORDER BY total_respostas DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $ano);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $sql = "SELECT nome_evento, SUM(quantidades_respostas) AS total_respostas
            FROM respostas_origem
            GROUP BY nome_evento
            ORDER BY total_respostas DESC";
    $result = $conn->query($sql);
}

$ranking = [];
while ($row = $result->fetch_assoc()) {
    $ranking[] = $row;
}

echo json_encode($ranking);
?>
