<?php
// thecommons/backend/whisk/menu/get.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// 1) Try to call the real Whisk API on wendynttn.com
$remoteUrl = 'https://wendynttn.com/backend/whisk/products/list.php';

$ch = curl_init($remoteUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 8);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt(
    $ch,
    CURLOPT_USERAGENT,
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
);

// If HTTPS has issues, you *can* relax SSL checks (ok for class project only):
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

$useFallback = false;
$data = null;

if ($curlError || !$response) {
    // cURL completely failed
    $useFallback = true;
} else {
    $decoded = json_decode($response, true);
    if (is_array($decoded) && count($decoded) > 0) {
        $data = $decoded;
    } else {
        // Got non-JSON or empty JSON (e.g., Bluehost 409 HTML page)
        $useFallback = true;
    }
}

// 2) If remote API didn't give valid JSON, fall back to a static list
if ($useFallback) {
    $data = [
        [
            "id" => "W1",
            "company" => "whisk",
            "name" => "Fig & Honey Cheesecake",
            "type" => "dessert",
            "price" => 7.00,
            "rating" => 4.9,
            "visits" => 104,
            "image" => "https://wendynttn.com/images/products/fig-honey-cheesecake.jpg",
            "description" => "Silky cheesecake topped with roasted figs and local honey."
        ],
        [
            "id" => "W2",
            "company" => "whisk",
            "name" => "Pear Cardamom Mini Cake",
            "type" => "dessert",
            "price" => 6.50,
            "rating" => 4.8,
            "visits" => 92,
            "image" => "https://wendynttn.com/images/products/pear-cardamom-cake.jpg",
            "description" => "Delicate mini cake with poached pear and warm cardamom."
        ],
        [
            "id" => "W3",
            "company" => "whisk",
            "name" => "Cranberry Pistachio Cookie",
            "type" => "dessert",
            "price" => 3.75,
            "rating" => 4.7,
            "visits" => 88,
            "image" => "https://wendynttn.com/images/products/cranberry-pistachio-cookie.jpg",
            "description" => "Chewy cookie with tart cranberries and toasted pistachios."
        ],
        [
            "id" => "W4",
            "company" => "whisk",
            "name" => "Brown Butter Chocolate Chip Cookie",
            "type" => "dessert",
            "price" => 3.95,
            "rating" => 4.9,
            "visits" => 110,
            "image" => "https://wendynttn.com/images/products/brown-butter-ccc.jpg",
            "description" => "Toasty brown butter cookie with puddles of dark chocolate."
        ],
        [
            "id" => "W5",
            "company" => "whisk",
            "name" => "Lemon Olive Oil Mini Cake",
            "type" => "dessert",
            "price" => 6.00,
            "rating" => 4.6,
            "visits" => 80,
            "image" => "https://wendynttn.com/images/products/lemon-olive-oil-cake.jpg",
            "description" => "Bright, moist cake with citrus zest and fruity olive oil."
        ],
        [
            "id" => "W6",
            "company" => "whisk",
            "name" => "Classic Vanilla Bean Cheesecake",
            "type" => "dessert",
            "price" => 7.25,
            "rating" => 4.8,
            "visits" => 95,
            "image" => "https://wendynttn.com/images/products/vanilla-bean-cheesecake.jpg",
            "description" => "Velvety cheesecake with real vanilla bean and buttery crust."
        ],
        [
            "id" => "W7",
            "company" => "whisk",
            "name" => "Dark Chocolate Cheesecake",
            "type" => "dessert",
            "price" => 7.50,
            "rating" => 4.9,
            "visits" => 90,
            "image" => "https://wendynttn.com/images/products/dark-chocolate-cheesecake.jpg",
            "description" => "Rich cocoa crust and bittersweet chocolate filling."
        ],
        [
            "id" => "W8",
            "company" => "whisk",
            "name" => "Coffee Cake",
            "type" => "dessert",
            "price" => 5.50,
            "rating" => 4.5,
            "visits" => 70,
            "image" => "https://wendynttn.com/images/products/coffee-cake.jpg",
            "description" => "Tender sour cream cake with cinnamon crumble topping."
        ],
        [
            "id" => "W9",
            "company" => "whisk",
            "name" => "Butter Croissant",
            "type" => "dessert",
            "price" => 3.25,
            "rating" => 4.6,
            "visits" => 60,
            "image" => "https://wendynttn.com/images/products/butter-croissant.jpg",
            "description" => "Flaky, layered croissant with a slow-fermented dough."
        ],
        [
            "id" => "W10",
            "company" => "whisk",
            "name" => "Macaron Box (6 pieces)",
            "type" => "dessert",
            "price" => 12.00,
            "rating" => 4.8,
            "visits" => 85,
            "image" => "https://wendynttn.com/images/products/macaron-box.jpg",
            "description" => "Assorted seasonal macarons with jam, ganache, and curds."
        ],
    ];
}

// 3) Return whichever data we ended up with
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
