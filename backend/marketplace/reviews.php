<?php
// backend/marketplace/reviews.php
require_once __DIR__ . '/../common/cors.php';
require_once __DIR__ . '/../common/db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // GET reviews for a specific product
    $product_id = $_GET['product_id'] ?? '';

    $user_id = $_GET['user_id'] ?? '';

    if ($user_id) {
        $stmt = $pdo->prepare("SELECT r.*, u.name as author_name FROM reviews r JOIN marketplace_users u ON r.user_id = u.id WHERE r.user_id = ? ORDER BY r.created_at DESC");
        $stmt->execute([$user_id]);
        $reviews = $stmt->fetchAll();
        echo json_encode($reviews);
        exit;
    }

    if (!$product_id) {
        // Return latest reviews if no product specified? Or error?
        // Let's return latest 10 reviews globally for now logic
        $stmt = $pdo->prepare("SELECT r.*, u.name as author_name FROM reviews r JOIN marketplace_users u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT 10");
        $stmt->execute();
        $reviews = $stmt->fetchAll();
        echo json_encode($reviews);
        exit;
    }

    $stmt = $pdo->prepare("SELECT r.*, u.name as author_name FROM reviews r JOIN marketplace_users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC");
    $stmt->execute([$product_id]);
    $reviews = $stmt->fetchAll();

    echo json_encode($reviews);

} elseif ($method === 'DELETE' || ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete')) {
    // DELETE a review
    $review_id = $_GET['id'] ?? null;
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$review_id && isset($input['id'])) {
        $review_id = $input['id'];
    }

    if (!$review_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing review ID']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
        $stmt->execute([$review_id]);
        echo json_encode(['status' => 'success', 'message' => 'Review deleted']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
    exit;

} elseif ($method === 'POST') {
    // POST a new review
    // Expect JSON body: { "product_id": "...", "company": "...", "rating": 5, "comment": "...", "user_id": ... }

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    $product_id = $input['product_id'] ?? '';
    $company = $input['company'] ?? '';
    $rating = $input['rating'] ?? 0;
    $comment = $input['comment'] ?? '';
    $user_id = $input['user_id'] ?? 0; // In a real app, extract from session/token

    if (!$product_id || !$company || !$rating || !$user_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO reviews (product_id, company, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$product_id, $company, $user_id, $rating, $comment]);

        echo json_encode(['status' => 'success', 'message' => 'Review submitted']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>