<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("db", "root", "root", "jml_cursos");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$senha = $data['senha'] ?? '';

if (!$email || !$senha) {
    echo json_encode(["success" => false]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();

    if (password_verify($senha, $usuario['senha'])) {
        $_SESSION['usuario_id'] = $usuario['id'];
        echo json_encode(["success" => true]);
        exit;
    }
}

echo json_encode(["success" => false]);
exit;
