<?php
// marketplace/reviews.php
require_once __DIR__ . '/../common/cors.php';
// Global reviews for any product/service

header('Content-Type: application/json');

// Logic to fetch or submit reviews

echo json_encode([
    'reviews' => [
        ['id' => 1, 'product' => 'Cozy Apartment', 'rating' => 5, 'comment' => 'Great place!'],
        ['id' => 2, 'product' => 'Chocolate Cake', 'rating' => 4, 'comment' => 'Delicious!']
    ]
]);
?>