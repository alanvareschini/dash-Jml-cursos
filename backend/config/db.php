<?php
require_once __DIR__ . '/http.php';
applyApiCors();

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');

function envOrDefault(string $key, string $default): string
{
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return $value;
    }

    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }

    return $default;
}
function createPdo(string $host, string $port, string $db, string $user, string $pass, array $options): PDO
{
    $charset = 'utf8mb4';
    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
    return new PDO($dsn, $user, $pass, $options);
}

$host = envOrDefault('MYSQLHOST', 'db');
$db = envOrDefault('MYSQLDATABASE', 'jml_cursos');
$user = envOrDefault('MYSQLUSER', 'root');
$pass = envOrDefault('MYSQLPASSWORD', 'root');
$port = envOrDefault('MYSQLPORT', '3306');

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = createPdo($host, $port, $db, $user, $pass, $options);
} catch (PDOException $ePrimary) {
    try {
        // Local fallback when app is running outside Docker network.
        $pdo = createPdo('localhost', $port, $db, $user, $pass, $options);
    } catch (PDOException $eLocal) {
        try {
            // Common XAMPP fallback: root user with empty password.
            $pdo = createPdo('localhost', $port, $db, $user, '', $options);
        } catch (PDOException $eFinal) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Erro na conexao com banco',
                'details' => $eFinal->getMessage(),
            ]);
            exit;
        }
    }
}

