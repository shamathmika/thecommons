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

// Prepare statements for fetching local visits and reviews
require __DIR__ . '/../../common/db.php';
$visitStmt = $pdo->prepare("SELECT COUNT(*) FROM visits WHERE product_id = ?");
$reviewStmt = $pdo->prepare("SELECT AVG(rating), COUNT(*) FROM reviews WHERE product_id = ?");

foreach ($rawListings as $listing) {
    $pid = "N" . $listing["id"]; // Construct product ID for local lookup

    // 1. Get local visit count
    $localVisits = 0;
    try {
        $visitStmt->execute([$pid]);
        $localVisits = (int) $visitStmt->fetchColumn();
        $visitStmt->closeCursor();
    } catch (Exception $e) {
        $localVisits = 0;
    }

    // 2. Get local reviews aggregate
    $localAvg = 0;
    $localCount = 0;
    try {
        $reviewStmt->execute([$pid]);
        $row = $reviewStmt->fetch(PDO::FETCH_NUM);
        if ($row) {
            $localAvg = (float) $row[0];
            $localCount = (int) $row[1];
        }
        $reviewStmt->closeCursor();
    } catch (Exception $e) {
        // ignore
    }

    // 3. Combine Ratings: Check for presence to avoid averaging with 0
    $remoteRating = isset($listing["avg_rating"]) ? (float) $listing["avg_rating"] : 0;

    // Improved Logic:
    // If we have local reviews, and a remote rating exists (>0), average them.
    // If we have local reviews but no remote rating (0), use local.
    // Otherwise use remote.
    if ($localCount > 0 && $remoteRating > 0) {
        $finalRating = ($remoteRating + $localAvg) / 2;
    } elseif ($localCount > 0) {
        $finalRating = $localAvg;
    } else {
        $finalRating = $remoteRating;
    }

    $products[] = [
        "id" => $pid,
        "company" => "nestly",
        "name" => $listing["title"] ?? "",
        "type" => "rental",
        "price" => isset($listing["rent"]) ? (float) $listing["rent"] : null,
        "rating" => $finalRating,
        "visits" => $localVisits,
        "image" => $listing["image_url"] ?? null,
        "description" => $listing["description"] ?? "",
    ];
}

// 4. Output final JSON array
echo json_encode($products);
