<?php
// backend/marketplace/users/delete.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../common/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use DELETE or POST.']);
    exit;
}

// Support both DELETE method and POST with a body (for simplicity in some environments)
$input = json_decode(file_get_contents('php://input'), true);
$user_id = $input['id'] ?? $_GET['id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user ID']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Delete reviews
    $stmt = $pdo->prepare("DELETE FROM reviews WHERE user_id = ?");
    $stmt->execute([$user_id]);

    // 2. Delete visits (if you have a 'user_id' column in visits)
    // Checking if visits table has user_id
    try {
        $stmt = $pdo->prepare("DELETE FROM visits WHERE user_id = ?");
        $stmt->execute([$user_id]);
    } catch (Exception $e) {
        // visits might not have user_id, ignore if column doesn't exist
    }

    // 3. Delete the user
    $stmt = $pdo->prepare("DELETE FROM marketplace_users WHERE id = ?");
    $stmt->execute([$user_id]);

    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Account and data deleted successfully.']);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>