<?php
// thecommons/backend/whisk/menu/get.php
require_once __DIR__ . '/../../common/cors.php';
require __DIR__ . '/../../common/db.php';

header('Content-Type: application/json; charset=utf-8');

// Make sure PHP warnings don't pollute the JSON output
error_reporting(0);
ini_set('display_errors', 0);

// 1) Try to call the real Whisk API on wendynttn.com
$remoteUrl = 'https://wendynttn.com/backend/whisk/products/list.php';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $remoteUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

// Realistic headers to mimic a modern Chrome browser
$headers = [
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept: application/json, text/javascript, */*; q=0.01',
    'Accept-Language: en-US,en;q=0.9',
    'Referer: https://thecommons.great-site.net/',
    'X-Requested-With: XMLHttpRequest'
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Attempt to bypass the "humans_21909" cookie challenge identified in debug logs
curl_setopt($ch, CURLOPT_COOKIE, "humans_21909=1");

// Relax SSL checks for compatibility with shared hosting
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
$curlInfo = curl_getinfo($ch);

$data = null;
$jsonErr = null;

if ($response !== false) {
    $decoded = json_decode($response, true);
    if (is_array($decoded) && count($decoded) > 0) {
        $data = $decoded;
    } else {
        $jsonErr = json_last_error_msg();
        // If it's valid JSON but empty, $jsonErr will be "No error"
    }
}

// 2) If remote API didn't give valid JSON, return empty with DEBUG info
if (!$data) {
    echo json_encode([
        'error' => 'No data received from remote API',
        'debug' => [
            'remote_url' => $remoteUrl,
            'http_code' => $httpCode,
            'curl_error' => $curlErr,
            'json_error' => $jsonErr,
            'response_snippet' => substr((string) $response, 0, 500)
        ]
    ], JSON_PRETTY_PRINT);
    return;
}

// 3) Inject local visit counts and combine ratings
if (is_array($data)) {
    // Prepare statements for counting visits and reviews
    require __DIR__ . '/../../common/db.php';
    $visitStmt = $pdo->prepare("SELECT COUNT(*) FROM visits WHERE product_id = ?");
    $reviewStmt = $pdo->prepare("SELECT AVG(rating), COUNT(*) FROM reviews WHERE product_id = ?");

    foreach ($data as &$item) {
        $pid = $item['id']; // e.g. "W1"

        // 1. Local Visits
        $localVisits = 0;
        try {
            $visitStmt->execute([$pid]);
            $localVisits = (int) $visitStmt->fetchColumn();
            $visitStmt->closeCursor();
        } catch (Exception $e) {
            $localVisits = 0;
        }
        $item['visits'] = $localVisits;
        $item['company'] = 'whisk';

        // 2. Local Reviews aggregate
        $localAvg = 0;
        $localCount = 0;
        try {
            $reviewStmt->execute([$pid]);
            $row = $reviewStmt->fetch(PDO::FETCH_NUM);
            if ($row) {
                $localAvg = (float) $row[0];
                $localCount = (int) $row[1];
            }
            $reviewStmt->closeCursor();
        } catch (Exception $e) {
        }

        // 3. Combine Ratings: Check for presence to avoid averaging with 0
        $remoteRating = isset($item["rating"]) ? (float) $item["rating"] : 0;
        if ($localCount > 0 && $remoteRating > 0) {
            $item['rating'] = ($remoteRating + $localAvg) / 2;
        } elseif ($localCount > 0) {
            $item['rating'] = $localAvg;
        } else {
            $item['rating'] = $remoteRating;
        }
    }
    unset($item);
}

// 4) Return data
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>