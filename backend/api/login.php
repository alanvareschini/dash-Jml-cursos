<?php
session_start();
header('Content-Type: application/json');

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

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