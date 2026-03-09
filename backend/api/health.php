<?php
require_once __DIR__ . '/../config/http.php';
applyApiCors();

http_response_code(200);
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'ok' => true,
    'service' => 'backend',
]);
