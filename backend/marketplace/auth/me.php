<?php
// marketplace/auth/me.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../common/auth.php';

header('Content-Type: application/json');

$user = getCurrentUser();

if ($user) {
    echo json_encode(['user' => $user]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
}
?>