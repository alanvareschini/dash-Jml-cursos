<?php
require_once __DIR__ . '/../config/http.php';
applyApiCors();
startApiSession();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$data = is_array($data) ? $data : [];

$email = $data['email'] ?? '';
$senha = $data['senha'] ?? '';

if (!$email || !$senha) {
    echo json_encode(["success" => false]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1");
if (!$stmt) {
    echo json_encode(["success" => false]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result ? $result->fetch_assoc() : null;
$stmt->close();

if ($usuario) {
    if (password_verify($senha, $usuario['senha'])) {
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['nome'];

        echo json_encode([
            "success" => true,
            "nome" => $usuario['nome']
        ]);
        exit;
    }
}

echo json_encode(["success" => false]);
exit;
