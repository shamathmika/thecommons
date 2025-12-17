<?php
// thecommons/backend/whisk/menu/get.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// This is your real Whisk API endpoint on your own site
$remoteUrl = 'https://wendynttn.com/backend/whisk/products/list.php';

// Call your company API using cURL
$ch = curl_init($remoteUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 8);

// If HTTPS has issues, uncomment these two lines (only if needed):
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

// If cURL failed or remote returned non-200, send a safe error/empty array
if ($curlError || $httpCode !== 200 || !$response) {
    http_response_code(502);
    echo json_encode([
        'error'   => 'Failed to fetch Whisk menu from company API',
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

// Pass products straight through
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
