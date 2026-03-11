<?php
require_once __DIR__ . '/http.php';
applyApiCors();

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');

function envOrDefault(string $key, string $default): string
{
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }

    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }

    return $default;
}

$host = envOrDefault('MYSQLHOST', 'db');
$user = envOrDefault('MYSQLUSER', 'root');
$pass = envOrDefault('MYSQLPASSWORD', 'root');
$db = envOrDefault('MYSQLDATABASE', 'jml_cursos');
$port = (int) envOrDefault('MYSQLPORT', '3306');

mysqli_report(MYSQLI_REPORT_OFF);

$_ENV['MYSQLHOST'] = $host;
$_ENV['MYSQLUSER'] = $user;
$_ENV['MYSQLPASSWORD'] = $pass;
$_ENV['MYSQLDATABASE'] = $db;
$_ENV['MYSQLPORT'] = (string) $port;

$conn = @new mysqli(
    $_ENV['MYSQLHOST'],
    $_ENV['MYSQLUSER'],
    $_ENV['MYSQLPASSWORD'],
    $_ENV['MYSQLDATABASE'],
    (int) $_ENV['MYSQLPORT']
);

if ($conn->connect_error) {
    // Local fallback when app is running outside Docker network.
    $conn = @new mysqli('localhost', $user, $pass, $db, $port);
}

if ($conn->connect_error) {
    // Common XAMPP fallback: root user with empty password.
    $conn = @new mysqli('localhost', 'root', '', $db, $port);
}

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro na conexao com banco',
        'details' => $conn->connect_error,
    ]);
    exit;
}

$conn->set_charset('utf8mb4');

