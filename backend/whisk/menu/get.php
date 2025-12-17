<?php
// whisk/menu/get.php
require_once __DIR__ . '/../../common/cors.php';
// Fetch menu items for Whisk

header('Content-Type: application/json; charset=utf-8');
$products = [
    [
        "id"          => "W1",
        "company"     => "whisk",
        "name"        => "Coffee Cake",
        "type"        => "dessert",
        "price"       => 6.00,
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
        "price"       => 4.00,
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
        "price"       => 4.00,
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
        "price"       => 7.50,
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
        "price"       => 6.50,
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
        "price"       => 12.00,
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
        "price"       => 5.00,
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
        "price"       => 7.00,
        "rating"      => 4.9,
        "visits"      => 99,
        "image"       => "https://wendynttn.com/images/products/fig-honey-cheesecake.jpg",
        "description" => "Silky, lightly sweet cheesecake with roasted figs on top."
    ],
];

echo json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
