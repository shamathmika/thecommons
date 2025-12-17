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

// Make the request look like a normal browser (some hosts block "weird" clients)
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36');

// If HTTPS has issues, you *can* relax SSL checks (uncomment if needed for class project only):
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

// Only treat it as an error if cURL failed or response is empty.
// Some hosts may return non-200 codes even when they send usable JSON.
if ($curlError || !$response) {
    http_response_code(502);
    echo json_encode([
        'error'   => 'Failed to fetch Whisk menu from company API',
        'details' => $curlError,
        'status'  => $httpCode,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Try to decode JSON
$data = json_decode($response, true);

if (!is_array($data)) {
    // If the body wasn't valid JSON, just return an empty array so frontend doesn't crash
    echo json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// Pass products straight through
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
