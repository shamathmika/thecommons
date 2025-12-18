<?php
// thecommons/backend/whisk/menu/get.php
require_once __DIR__ . '/../../common/cors.php';
require __DIR__ . '/../../common/db.php';

header('Content-Type: application/json; charset=utf-8');

// 1) Try to call the real Whisk API on wendynttn.com
$remoteUrl = 'https://wendynttn.com/backend/whisk/products/list.php';

// Create a stream context with a User-Agent to avoid being blocked on shared hosting
$options = [
    'http' => [
        'method' => 'GET',
        'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36\r\n",
        'timeout' => 10,
        'ignore_errors' => true
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
    ]
];
$context = stream_context_create($options);
$response = @file_get_contents($remoteUrl, false, $context);

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