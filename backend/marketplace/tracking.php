<?php
// backend/marketplace/tracking.php
require_once __DIR__ . '/../common/cors.php';
require_once __DIR__ . '/../common/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $product_id = $input['product_id'] ?? '';
    $company = $input['company'] ?? '';
    $user_id = $input['user_id'] ?? null; // Optional, 0 or null if not logged in

    if (!$product_id || !$company) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing product_id or company']);
        exit;
    }

    try {
        // Table schema: id, user_id, company, product_id, visited_at
        // user_id can be NULL if schema allows, or 0.

        $sql = "INSERT INTO visits (user_id, company, product_id, visited_at) VALUES (?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id, $company, $product_id]);

        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        // Log error
        error_log("Tracking Error: " . $e->getMessage());
        http_response_code(500);
        // RETURN THE ERROR MESSAGE to the frontend/user for debugging
        echo json_encode(['error' => 'Tracking failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'ignored']);
}
?>