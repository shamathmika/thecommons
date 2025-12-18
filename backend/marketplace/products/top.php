<?php
// backend/marketplace/products/top.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// ---- Helper: call a backend endpoint on this same host via HTTP ----
// ---- Helper: call a backend endpoint via Internal Include (bypasses curl deadlock) ----
function fetch_products_from($label, $relativePath)
{
    ob_start();
    // Use include (not require_once) because we might want to run it even if included elsewhere (though usually get.php is a script)
    // Actually, get.php scripts are designed to execute. 
    // If they were functions, we'd call the function.
    // If they are scripts, include works.
    $fullPath = __DIR__ . '/../../' . $relativePath;

    // We need to suppress headers from the included file if possible, or ignore them.
    // PHP doesn't let us suppress headers easily but the output is captured.

    if (file_exists($fullPath)) {
        include $fullPath;
    }
    $response = ob_get_clean();

    $data = json_decode($response, true);

    if (!is_array($data)) {
        // Fallback or error
        return [
            'products' => [],
            'meta' => [
                'company' => $label,
                'status' => 500,
                'error' => 'Invalid JSON from local include',
                'debug_response' => substr($response, 0, 100)
            ],
        ];
    }

    // Ensure each product has the company label
    foreach ($data as &$p) {
        if (!isset($p['company']) || $p['company'] === '') {
            $p['company'] = $label;
        }
    }

    return [
        'products' => $data,
        'meta' => [
            'company' => $label,
            'status' => 200,
            'error' => null,
        ],
    ];
}

// ---- 1) Fetch products from each company (via their Commons backend proxies) ----

$nestly = fetch_products_from('nestly', 'nestly/listings/get.php');
$whisk = fetch_products_from('whisk', 'whisk/menu/get.php');
$petsit = fetch_products_from('petsit', 'petsit/services/get.php');

$allProducts = array_merge(
    $nestly['products'],
    $whisk['products'],
    $petsit['products']
);

// If no products at all, bail out
if (count($allProducts) === 0) {
    http_response_code(500);
    echo json_encode([
        'error' => 'No products available in marketplace',
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

// ---- 2) Compute normalized rating + visits for scoring ----

// find the maximum visits across all products (for normalization)
$maxVisits = 0;
foreach ($allProducts as $p) {
    if (isset($p['visits'])) {
        $v = (int) $p['visits'];
        if ($v > $maxVisits) {
            $maxVisits = $v;
        }
    }
}
if ($maxVisits <= 0) {
    $maxVisits = 1; // avoid division by zero
}

// weights
$weightRating = 0.7;
$weightVisits = 0.3;

foreach ($allProducts as &$p) {
    $rating = isset($p['rating']) ? (float) $p['rating'] : 0.0;
    $visits = isset($p['visits']) ? (float) $p['visits'] : 0.0;

    // rating assumed out of 5
    $ratingNorm = $rating <= 0 ? 0.0 : min($rating / 5.0, 1.0);
    // visits normalized to [0,1] by maxVisits
    $visitsNorm = $visits <= 0 ? 0.0 : min($visits / $maxVisits, 1.0);

    $score = $weightRating * $ratingNorm + $weightVisits * $visitsNorm;

    $p['score'] = round($score, 4);
    $p['rating_norm'] = round($ratingNorm, 4);
    $p['visits_norm'] = round($visitsNorm, 4);
}

// ---- 3) Sort by score descending and take top N ----

usort($allProducts, function ($a, $b) {
    // Higher score first
    return ($b['score'] <=> $a['score']);
});

$TOP_N = 5;
$topProducts = array_slice($allProducts, 0, $TOP_N);

// ---- 4) Return JSON ----

echo json_encode([
    'criteria' => [
        'description' => 'Weighted score = 0.7 * normalized rating + 0.3 * normalized visits',
        'weight_rating' => $weightRating,
        'weight_visits' => $weightVisits,
    ],
    'top' => $topProducts,
    'total_products' => count($allProducts),
    'companies' => [
        $nestly['meta'],
        $whisk['meta'],
        $petsit['meta'],
    ],
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>