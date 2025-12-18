<?php
// backend/marketplace/users/testimonials.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../common/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // Adjust `name` if your column is called something else
    $stmt = $pdo->prepare("
        SELECT id, name, review
        FROM marketplace_users
        WHERE review IS NOT NULL AND review <> ''
        ORDER BY id DESC
        LIMIT 20
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($rows);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load testimonials']);
}
