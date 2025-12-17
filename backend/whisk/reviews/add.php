<?php
// thecommons/backend/whisk/reviews/add.php
require_once __DIR__ . '/../../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

$remoteUrl = 'https://wendynttn.com/backend/whisk/reviews/add.php';

// Read the raw body (JSON) and forward it
$rawBody = file_get_contents('php://input');

$ch = curl_init($remoteUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $rawBody);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($rawBody),
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

if ($curlError || !$response) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'error'   => 'Failed to send review to Whisk API',
        'details' => $curlError,
        'status'  => $httpCode,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Just relay whatever your Whisk add.php returns
http_response_code($httpCode);
echo $response;
?>
