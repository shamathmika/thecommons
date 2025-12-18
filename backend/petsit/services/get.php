<?php
// petsit/services/get.php
require_once __DIR__ . '/../../common/cors.php';
// Fetch services for PetSitHub

header('Content-Type: application/json');

echo json_encode([
    [
        "id" => "P1",
        "company" => "petsit",
        "name" => "Dog Walking",
        "type" => "service",
        "price" => 25.00,
        "rating" => 5.0,
        "visits" => 10,
        "image" => "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400",
        "description" => "Professional dog walking in the village square."
    ]
]);
?>