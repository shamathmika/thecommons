<?php
// petsit/services/get.php
require_once __DIR__ . '/../../common/cors.php';
// Fetch services for PetSitHub

header('Content-Type: application/json');

echo json_encode(['services' => []]);
?>