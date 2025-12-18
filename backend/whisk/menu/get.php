<?php
// thecommons/backend/whisk/menu/get.php
require_once __DIR__ . '/../../common/cors.php';
require __DIR__ . '/../../common/db.php';

header('Content-Type: application/json; charset=utf-8');

// 1) Try to call the real Whisk API on wendynttn.com
$remoteUrl = 'https://wendynttn.com/backend/whisk/products/list.php';

// Use file_get_contents like Nestly for simplicity
$response = @file_get_contents($remoteUrl);

$data = null;

if ($response !== false) {
    $decoded = json_decode($response, true);
    if (is_array($decoded) && count($decoded) > 0) {
        $data = $decoded;
    }
}

// 2) If remote API didn't give valid JSON, fall back to a static list
// 2) If remote API didn't give valid JSON, return empty
if (!$data) {
    echo json_encode([]);
    return;
}

// 3) Inject local visit counts
if (is_array($data)) {
    // Prepare statement for counting visits
    // $pdo comes from db.php
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM visits WHERE product_id = ?");

    foreach ($data as &$item) {
        $pid = $item['id']; // e.g. "W1"

        $localVisits = 0;
        try {
            $stmt->execute([$pid]);
            $localVisits = (int) $stmt->fetchColumn();
            $stmt->closeCursor();
        } catch (Exception $e) {
            $localVisits = 0;
        }

        $item['visits'] = $localVisits;
    }
    unset($item);
}

// 4) Return data
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>