<?php
// backend/marketplace/visits/track.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');

// Read JSON body (React will usually send JSON)
$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);
if (!$data) {
    // Fallback to form-encoded POST if needed
    $data = $_POST;
}

$company   = trim($data['company']  ?? '');
$productId = trim($data['productId'] ?? '');

// Basic validation
if ($company === '' || $productId === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'company and productId are required',
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// If login sets a user id in the session, capture it; otherwise null
$userId = $_SESSION['user_id'] ?? null;

// Insert visit row
$stmt = $conn->prepare("
    INSERT INTO visits (user_id, company, product_id)
    VALUES (?, ?, ?)
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to prepare statement: ' . $conn->error,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$stmt->bind_param("iss", $userId, $company, $productId);
$ok = $stmt->execute();

if (!$ok) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to insert visit: ' . $stmt->error,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    $stmt->close();
    exit;
}

$stmt->close();

echo json_encode([
    'success' => true,
    'message' => 'Visit tracked',
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
