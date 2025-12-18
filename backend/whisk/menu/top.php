<?php
// thecommons/backend/whisk/menu/top.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

$remoteUrl = 'https://wendynttn.com/backend/whisk/products/top.php';

// realistic headers
$headers = [
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept: application/json, text/javascript, */*; q=0.01',
    'Accept-Language: en-US,en;q=0.9',
    'Referer: https://thecommons.great-site.net/',
    'X-Requested-With: XMLHttpRequest'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $remoteUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
// Attempt to bypass the "humans_21909" cookie challenge
curl_setopt($ch, CURLOPT_COOKIE, "humans_21909=1");

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
// curl_close($ch) is deprecated since PHP 8.4/8.5 and unnecessary since PHP 8.0

$remoteData = null;
if ($response && $httpCode === 200) {
    $decoded = json_decode($response, true);
    if (is_array($decoded) && count($decoded) > 0) {
        foreach ($decoded as &$item) {
            $item['company'] = 'whisk';
        }
        $remoteData = $decoded;
    }
}

// 2) If remote fails, fallback to local most visited
if (!$remoteData) {
    require __DIR__ . '/../../common/db.php';
    // Get top 5 by visits from our local DB, filtered by whisk company
    // We assume get.php already normalized the IDs to start with 'W' or company='whisk'
    // Actually, whisk/menu/get.php returns whisk products.

    // Let's get the products from whisk/menu/get.php and sort them by visits locally
    ob_start();
    include __DIR__ . '/get.php';
    $allWhiskStr = ob_get_clean();
    $allWhisk = json_decode($allWhiskStr, true);

    if (is_array($allWhisk)) {
        usort($allWhisk, function ($a, $b) {
            return ($b['visits'] ?? 0) <=> ($a['visits'] ?? 0);
        });
        $remoteData = array_slice($allWhisk, 0, 5);
    }
}

// 3) Return data
echo json_encode($remoteData ?: [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>