<?php
// marketplace/auth/login.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../common/auth.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$result = loginUser($data['email'], $data['password']);

if (isset($result['error'])) {
    http_response_code(401);
    echo json_encode($result);
} else {
    // Session is set in loginUser
    echo json_encode([
        'message' => 'Login successful',
        'user' => [
            'id' => $result['user']['id'],
            'name' => $result['user']['name'],
            'email' => $result['user']['email']
        ]
    ]);
}
?>