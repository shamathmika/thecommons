<?php
// backend/petsit/services/get.php

require_once __DIR__ . '/../../common/cors.php';

// Returns PetSitHub services in The Commons product format.
header('Content-Type: application/json; charset=utf-8');

// Make sure PHP warnings/notices don't pollute JSON output
error_reporting(0);
ini_set('display_errors', 0);

// 1. Call your PetSitHub API (running on your own hosting)
$petsitUrl = "https://anandita-prakash.infinityfreeapp.com/api/services/get.php";
$headers = [
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept: application/json, text/javascript, */*; q=0.01',
    'Accept-Language: en-US,en;q=0.9',
    'Referer: https://thecommons.great-site.net/',
    'X-Requested-With: XMLHttpRequest'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $petsitUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_COOKIE, "humans_21909=1");

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpCode !== 200) {
    echo json_encode([]);
    return;
}

// 2. Decode JSON from PetSitHub
$rawServices = json_decode($response, true);

if (!is_array($rawServices)) {
    echo json_encode([]);
    return;
}

// 3. Prepare local DB helpers for visits & reviews (Commons DB)
require __DIR__ . '/../../common/db.php';

$visitStmt = $pdo->prepare("SELECT COUNT(*) FROM visits WHERE product_id = ?");
$reviewStmt = $pdo->prepare("SELECT AVG(rating), COUNT(*) FROM reviews WHERE product_id = ?");

$products = [];

foreach ($rawServices as $service) {
    // IMPORTANT: adjust these keys if your PetSitHub API uses different names
    $remoteId = $service["id"] ?? null;
    $name = $service["name"] ?? "";
    $type = $service["type"] ?? "service";
    $price = isset($service["price"]) ? (float) $service["price"] : null;
    $remoteRating = isset($service["rating"]) ? (float) $service["rating"] : 0.0;
    $remoteVisits = isset($service["visits"]) ? (int) $service["visits"] : 0;
    $image = $service["image"] ?? null;
    $description = $service["short_desc"] ?? "";

    if ($remoteId === null) {
        // skip malformed entries
        continue;
    }

    // Use a product ID prefixed with "P" for PetSitHub products in Commons DB
    $pid = "P" . $remoteId;

    // ---- 3a. Get local visit count from Commons DB ----
    $localVisits = 0;
    try {
        $visitStmt->execute([$pid]);
        $localVisits = (int) $visitStmt->fetchColumn();
        $visitStmt->closeCursor();
    } catch (Exception $e) {
        $localVisits = 0;
    }

    // Combine remote visits + local visit tracking if you want
    $totalVisits = $remoteVisits + $localVisits;

    // ---- 3b. Get local reviews aggregate from Commons DB ----
    $localAvg = 0.0;
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
        // ignore errors
    }

    // ---- 3c. Combine remote rating with local reviews (same logic as Nestly) ----
    if ($localCount > 0 && $remoteRating > 0) {
        $finalRating = ($remoteRating + $localAvg) / 2;
    } elseif ($localCount > 0) {
        $finalRating = $localAvg;
    } else {
        $finalRating = $remoteRating;
    }

    // ---- 3d. Normalize into The Commons product schema ----
    $products[] = [
        "id" => $pid,          // e.g. "P1", "P2"
        "company" => "petsit",      // company key for PetSitHub
        "name" => $name,
        "type" => $type ?: "service",
        "price" => $price,
        "rating" => $finalRating,
        "visits" => $totalVisits,
        "image" => $image,
        "description" => $description,
    ];
}

// 4. Output final JSON array (what the Commons frontend will use)
echo json_encode($products);