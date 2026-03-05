<?php
// backend/config/db.php
// Conexão centralizada com o banco jml_cursos

$host = 'db'; // nome do serviço do banco no docker-compose
$db   = 'jml_cursos';   // nome do seu banco principal
$user = 'root';         // usuário MySQL
$pass = 'root';             // senha MySQL (coloque a sua se houver)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // lançar erros
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // retornar arrays associativos
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}