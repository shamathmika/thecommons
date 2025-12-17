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
        "id"          => "W1",
        "company"     => "whisk",
        "name"        => "Coffee Cake",
        "type"        => "dessert",
        "price"       => 40.00,
        "rating"      => 4.7,
        "visits"      => 95,
        "image"       => "https://wendynttn.com/images/products/coffee-cake.jpg",
        "description" => "Velvety coffee-based and walnut sponge with cappuccino whipped cream frosting."
    ],
    [
        "id"          => "W2",
        "company"     => "whisk",
        "name"        => "Chocolate Cupcake",
        "type"        => "dessert",
        "price"       => 5.50,
        "rating"      => 4.8,
        "visits"      => 120,
        "image"       => "https://wendynttn.com/images/products/chocolate-cupcake.jpg",
        "description" => "Moist chocolate cupcake topped with silky cocoa buttercream and sprinkles."
    ],
    [
        "id"          => "W3",
        "company"     => "whisk",
        "name"        => "Vanilla Cupcake",
        "type"        => "dessert",
        "price"       => 5.50,
        "rating"      => 4.6,
        "visits"      => 88,
        "image"       => "https://wendynttn.com/images/products/vanilla-cupcake.jpg",
        "description" => "Classic vanilla cupcake with Madagascar vanilla bean frosting."
    ],
    [
        "id"          => "W4",
        "company"     => "whisk",
        "name"        => "Red Velvet Cake",
        "type"        => "dessert",
        "price"       => 48.00,
        "rating"      => 4.9,
        "visits"      => 110,
        "image"       => "https://wendynttn.com/images/products/red-velvet-cake.jpg",
        "description" => "Elegant layers of crimson sponge and cream cheese frosting."
    ],
    [
        "id"          => "W5",
        "company"     => "whisk",
        "name"        => "Lemon Tart",
        "type"        => "dessert",
        "price"       => 6.00,
        "rating"      => 4.7,
        "visits"      => 78,
        "image"       => "https://wendynttn.com/images/products/lemon-tart.jpg",
        "description" => "Buttery crust filled with bright, zesty lemon curd."
    ],
    [
        "id"          => "W6",
        "company"     => "whisk",
        "name"        => "Blueberry Cheesecake",
        "type"        => "dessert",
        "price"       => 45.0,
        "rating"      => 4.8,
        "visits"      => 102,
        "image"       => "https://wendynttn.com/images/products/blueberry-cheesecake.jpg",
        "description" => "Non-baked cheesecake bursting with fresh blueberries."
    ],
    [
        "id"          => "W7",
        "company"     => "whisk",
        "name"        => "Butter Croissant",
        "type"        => "pastry",
        "price"       => 3.50,
        "rating"      => 4.5,
        "visits"      => 90,
        "image"       => "https://wendynttn.com/images/products/croissant.jpg",
        "description" => "Flaky, buttery layers baked golden every morning."
    ],
    [
        "id"          => "W8",
        "company"     => "whisk",
        "name"        => "Macaron Box (6 pc)",
        "type"        => "dessert",
        "price"       => 18.00,
        "rating"      => 4.9,
        "visits"      => 98,
        "image"       => "https://wendynttn.com/images/products/macaron-box.jpg",
        "description" => "Assorted French macarons with seasonal flavors."
    ],
    [
        "id"          => "W9",
        "company"     => "whisk",
        "name"        => "Banana Bread",
        "type"        => "dessert",
        "price"       => 10.00,
        "rating"      => 4.6,
        "visits"      => 85,
        "image"       => "https://wendynttn.com/images/products/banana-bread.jpg",
        "description" => "Tender loaf made with ripe bananas and toasted walnuts."
    ],
    [
        "id"          => "W10",
        "company"     => "whisk",
        "name"        => "Fig & Honey Cheesecake",
        "type"        => "dessert",
        "price"       => 45.00,
        "rating"      => 4.9,
        "visits"      => 99,
        "image"       => "https://wendynttn.com/images/products/fig-honey-cheesecake.jpg",
        "description" => "Silky, lightly sweet cheesecake with roasted figs on top."
    ],
    ];
}

// 3) Return whichever data we ended up with
echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
