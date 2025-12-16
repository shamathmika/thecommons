<?php
// nestly/listings/get.php
require_once __DIR__ . '/../../common/cors.php';
// Fetch listings for Nestly

header('Content-Type: application/json');

echo json_encode(['listings' => []]);
?>