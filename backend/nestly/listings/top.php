<?php
// thecommons/backend/nestly/listings/top.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// Make sure PHP warnings/notices don't pollute JSON output
error_reporting(0);
ini_set('display_errors', 0);

$finalTopListings = [];
$success = false;

// 1. Attempt to fetch from Nestly's remote "top-5" API
$nestlyUrl = "https://shamathmikacmpe272.app/api/listings/get-top-5.php";

$headers = [
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept: application/json, text/javascript, */*; q=0.01',
    'Accept-Language: en-US,en;q=0.9',
    'Referer: https://thecommons.great-site.net/',
    'X-Requested-With: XMLHttpRequest'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $nestlyUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
// Bypass InfinityFree "humans_21909" cookie challenge
curl_setopt($ch, CURLOPT_COOKIE, "humans_21909=1");

// Relax SSL checks for compatibility with shared hosting
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response !== false && $httpCode === 200) {
    $rawListings = json_decode($response, true);
    if (is_array($rawListings) && count($rawListings) > 0) {
        foreach ($rawListings as $listing) {
            $finalTopListings[] = [
                "id" => isset($listing["id"]) ? "N" . $listing["id"] : null,
                "company" => "nestly",
                "name" => $listing["title"] ?? "",
                "type" => "rental",
                "price" => isset($listing["rent"]) ? (float) $listing["rent"] : null,
                "rating" => isset($listing["avg_rating"]) ? (float) $listing["avg_rating"] : 0,
                "visits" => isset($listing["review_count"]) ? (int) $listing["review_count"] : 0,
                "image" => $listing["image_url"] ?? null,
                "description" => $listing["description"] ?? "",
            ];
        }
        $success = true;
    }
}

// 2. Fallback: If remote API fails or is empty, use local data from get.php
if (!$success) {
    ob_start();
    include __DIR__ . '/get.php';
    $localDataStr = ob_get_clean();
    $localData = json_decode($localDataStr, true);

    if (is_array($localData)) {
        // Sort by visits descending
        usort($localData, function ($a, $b) {
            return ($b['visits'] ?? 0) <=> ($a['visits'] ?? 0);
        });
        // Take top 5
        $finalTopListings = array_slice($localData, 0, 5);
        // Ensure company is set
        foreach ($finalTopListings as &$item) {
            $item['company'] = 'nestly';
        }
    }
}

// 3. Output final JSON array
echo json_encode($finalTopListings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>