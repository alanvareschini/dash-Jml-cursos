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

$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
$stmt->execute([$email]);

$usuario = $stmt->fetch();

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
