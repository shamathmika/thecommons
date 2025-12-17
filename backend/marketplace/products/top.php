<?php
// backend/marketplace/products/top.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// Build base URL for calling our own "all products" endpoint
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host   = $_SERVER['HTTP_HOST'];
$base   = $scheme . '://' . $host;

$allUrl = $base . '/backend/marketplace/products/all.php';

$ch = curl_init($allUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 6);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

if ($curlError || $httpCode !== 200 || !$response) {
    http_response_code(502);
    echo json_encode([
        'error'   => 'Failed to fetch marketplace products',
        'details' => $curlError,
        'status'  => $httpCode,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$data = json_decode($response, true);
if (!is_array($data) || !isset($data['products']) || !is_array($data['products'])) {
    echo json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$products = $data['products'];

// Sort by visits desc, then rating desc
usort($products, function ($a, $b) {
    $visitsA = (int)($a['visits'] ?? 0);
    $visitsB = (int)($b['visits'] ?? 0);

    if ($visitsA === $visitsB) {
        $ratingA = (float)($a['rating'] ?? 0);
        $ratingB = (float)($b['rating'] ?? 0);
        return $ratingB <=> $ratingA;
    }

    return $visitsB <=> $visitsA;
});

// Take top 5
$top5 = array_slice($products, 0, 5);

echo json_encode($top5, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>