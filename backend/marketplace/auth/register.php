<?php
// marketplace/auth/register.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../common/auth.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$result = registerUser($data['name'], $data['email'], $data['password']);

if (isset($result['error'])) {
    http_response_code(409); // Conflict
    echo json_encode($result);
} else {
    echo json_encode(['message' => 'User registered successfully', 'id' => $result['id']]);
}
?>