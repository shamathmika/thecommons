<?php
// common/cors.php

$allowed_origin = "https://thecommons.great-site.net";

// Let localhost access during development
if (strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false) {
    $allowed_origin = "http://localhost:5173";
}

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Vary: Origin");

// Preflight handling
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    exit;
}
?>