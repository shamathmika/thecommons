<?php
// thecommons/backend/whisk/menu/top.php
require_once __DIR__ . '/../../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

$remoteUrl = 'https://wendynttn.com/backend/whisk/products/top.php';

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
        'error'  => 'Failed to fetch Whisk top products',
        'detail' => $curlError,
        'status' => $httpCode,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$data = json_decode($response, true);
if (!is_array($data)) {
    echo json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
