<?php
// backend/nestly/listings/get.php
// Proxies Nestly's listings API and normalizes it to The Commons product format.

header("Content-Type: application/json");

// Make sure PHP warnings/notices don't pollute JSON output
error_reporting(0);
ini_set('display_errors', 0);

// 1. Call your Nestly API (already working & returns clean JSON)
$nestlyUrl = "https://shamathmikacmpe272.app/api/listings/get-listings.php";

$response = @file_get_contents($nestlyUrl);

if ($response === false) {
    // Up to you: return empty list or an error object
    echo json_encode([]);
    exit;
}

// 2. Decode the JSON from Nestly
$rawListings = json_decode($response, true);

if (!is_array($rawListings)) {
    echo json_encode([]);
    exit;
}

// 3. Transform each Nestly listing into the unified marketplace format
$products = [];

foreach ($rawListings as $listing) {
    $products[] = [
        "id" => "N" . $listing["id"],                   // e.g. N1, N2...
        "company" => "nestly",
        "name" => $listing["title"] ?? "",
        "type" => "rental",
        "price" => isset($listing["rent"]) ? (float) $listing["rent"] : null,
        "rating" => isset($listing["avg_rating"]) ? (float) $listing["avg_rating"] : 0,
        "visits" => isset($listing["visits"]) ? (int) $listing["visits"] : 0,
        "image" => $listing["image_url"] ?? null,
        "description" => $listing["description"] ?? "",
    ];
}

// 4. Output final JSON array
echo json_encode($products);
