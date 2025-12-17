<?php
// backend/marketplace/visits/list.php
require_once __DIR__ . '/../../common/cors.php';
require_once __DIR__ . '/../../db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');

// If your login sets user_id, we can filter by it.
// If not logged in, we just show global recent visits.
$userId = $_SESSION['user_id'] ?? null;

$visits = [];

if ($userId !== null) {
    $stmt = $conn->prepare("
        SELECT id, user_id, company, product_id, visited_at
        FROM visits
        WHERE user_id = ?
        ORDER BY visited_at DESC
        LIMIT 100
    ");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to prepare statement: ' . $conn->error,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $visits[] = $row;
    }

    $stmt->close();
} else {
    // No user filter → latest visits overall
    $sql = "
        SELECT id, user_id, company, product_id, visited_at
        FROM visits
        ORDER BY visited_at DESC
        LIMIT 100
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $visits[] = $row;
        }
    }
}

echo json_encode($visits, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
