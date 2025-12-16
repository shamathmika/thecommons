<?php
// whisk/menu/get.php
require_once __DIR__ . '/../../common/cors.php';
// Fetch menu items for Whisk

header('Content-Type: application/json');

echo json_encode(['menu' => []]);
?>