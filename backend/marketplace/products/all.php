<?php
// backend/marketplace/products/all.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

/**
 * Fetch products via internal inclusion to bypass cURL deadlock on localhost.
 */
function fetchProductsLocally($relativePath, $companyKey)
{
    ob_start();
    $fullPath = __DIR__ . '/../../' . $relativePath;

    if (file_exists($fullPath)) {
        // Suppress errors and include the script
        @include $fullPath;
    }

    $response = ob_get_clean();
    $data = json_decode($response, true);

    if (!is_array($data)) {
        return [
            'company' => $companyKey,
            'products' => [],
            'error' => 'Invalid JSON or file not found',
            'status' => 500
        ];
    }

    // Ensure company key is tagged on each product for unified view
    foreach ($data as &$p) {
        if (!isset($p['company']) || $p['company'] === '') {
            $p['company'] = $companyKey;
        }
    }

    return [
        'company' => $companyKey,
        'products' => $data,
    ];
}

$endpoints = [
    'nestly' => 'nestly/listings/get.php',
    'whisk' => 'whisk/menu/get.php',
    'petsit' => 'petsit/services/get.php',
];

$allProducts = [];
$companyStatus = [];

foreach ($endpoints as $key => $relPath) {
    $result = fetchProductsLocally($relPath, $key);
    $companyStatus[] = [
        'company' => $result['company'],
        'count' => count($result['products']),
        'error' => $result['error'] ?? null,
        'status' => $result['status'] ?? 200,
    ];
    $allProducts = array_merge($allProducts, $result['products']);
}

// Final response structure
echo json_encode([
    'products' => $allProducts,
    'companies' => $companyStatus,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>