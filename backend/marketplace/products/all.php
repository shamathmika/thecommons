<?php
// backend/marketplace/products/all.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// Build base URL (works on localhost and on deployed host)
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host   = $_SERVER['HTTP_HOST'];
$base   = $scheme . '://' . $host;

// Local company product endpoints (inside thecommons backend)
$endpoints = [
    'nestly' => $base . '/backend/nestly/listings/get.php',
    'whisk'  => $base . '/backend/whisk/menu/get.php',
    'petsit' => $base . '/backend/petsit/services/get.php',
];

function fetchProducts($url, $companyKey) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    curl_close($ch);

    if ($curlError || $httpCode !== 200 || !$response) {
        // If one company fails, return empty for that company
        return [
            'company'  => $companyKey,
            'products' => [],
            'error'    => $curlError,
            'status'   => $httpCode,
        ];
    }

    $data = json_decode($response, true);
    if (!is_array($data)) {
        $data = [];
    }

    return [
        'company'  => $companyKey,
        'products' => $data,
    ];
}

$allProducts   = [];
$companyStatus = [];

foreach ($endpoints as $key => $url) {
    $result = fetchProducts($url, $key);
    $companyStatus[] = [
        'company' => $result['company'],
        'count'   => count($result['products']),
        'error'   => $result['error'] ?? null,
        'status'  => $result['status'] ?? 200,
    ];
    $allProducts = array_merge($allProducts, $result['products']);
}

// Final response structure
echo json_encode([
    'products'  => $allProducts,
    'companies' => $companyStatus,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>