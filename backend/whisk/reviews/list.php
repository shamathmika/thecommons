<?php
// thecommons/backend/whisk/reviews/list.php
require_once __DIR__ . '/../../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// Build URL to your Whisk reviews API
$baseUrl = 'https://wendynttn.com/backend/whisk/reviews/list.php';

// Pass through ?productId=... if present
$query = '';
if (!empty($_GET['productId'])) {
    $query = '?productId=' . urlencode($_GET['productId']);
}

$remoteUrl = $baseUrl . $query;

$ch = curl_init($remoteUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

if ($curlError || $httpCode !== 200 || !$response) {
    http_response_code(502);
    echo json_encode([
        'error'   => 'Failed to fetch Whisk reviews from company API',
        'details' => $curlError,
        'status'  => $httpCode,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Validate JSON
$data = json_decode($response, true);
if (!is_array($data)) {
    echo json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
