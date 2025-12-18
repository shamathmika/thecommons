<?php
// backend/nestly/listings/get.php
require_once __DIR__ . '/../../common/cors.php';

// Proxies Nestly's listings API and normalizes it to The Commons product format.
header('Content-Type: application/json; charset=utf-8');

// Make sure PHP warnings/notices don't pollute JSON output
error_reporting(0);
ini_set('display_errors', 0);

// 1. Call your Nestly API (already working & returns clean JSON)
// 1. Call your Nestly API
$nestlyUrl = "https://shamathmikacmpe272.app/api/listings/get-listings.php";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $nestlyUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

// Relax SSL checks for compatibility with shared hosting
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode([]);
    return;
}

// 2. Decode the JSON from Nestly
$rawListings = json_decode($response, true);

if (!is_array($rawListings)) {
    echo json_encode([]);
    return;
}

// 3. Transform each Nestly listing into the unified marketplace format
$products = [];

// Prepare statement for fetching local visits
require __DIR__ . '/../../common/db.php';
$stmt = $pdo->prepare("SELECT COUNT(*) FROM visits WHERE product_id = ?");

foreach ($rawListings as $listing) {
    $pid = "N" . $listing["id"]; // Construct product ID for local lookup

    // Get local visit count
    $localVisits = 0;
    $debugErr = null;
    try {
        $stmt->execute([$pid]);
        $localVisits = (int) $stmt->fetchColumn();
        $stmt->closeCursor(); // Ensure cursor is closed for next iteration
    } catch (Exception $e) {
        $localVisits = 0;
        $debugErr = $e->getMessage();
    }

    $products[] = [
        "id" => $pid,                   // e.g. N1, N2...
        "company" => "nestly",
        "name" => $listing["title"] ?? "",
        "debug_error" => $debugErr, // TEMPORARY DEBUG
        "type" => "rental",
        "price" => isset($listing["rent"]) ? (float) $listing["rent"] : null,
        "rating" => isset($listing["avg_rating"]) ? (float) $listing["avg_rating"] : 0,
        "visits" => $localVisits, // Use our local count
        "image" => $listing["image_url"] ?? null,
        "description" => $listing["description"] ?? "",
    ];
}

// 4. Output final JSON array
echo json_encode($products);
