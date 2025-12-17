<?php
// marketplace/auth/logout.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../common/auth.php';

header('Content-Type: application/json');

logoutUser();

echo json_encode(['message' => 'Logged out successfully']);
?>