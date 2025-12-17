<?php
// backend/marketplace/auth/google-callback.php

require_once __DIR__ . '/../../common/env.php';
require_once __DIR__ . '/../../common/auth.php';
require_once __DIR__ . '/../../common/session.php';

$client_id = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
$client_secret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? '';
$redirect_uri = $_ENV['GOOGLE_REDIRECT_URI'] ?? '';
$frontend_url = $_ENV['FRONTEND_URL'] ?? '/';

if (!$client_id || !$client_secret) {
    die("OAuth not configured");
}

if (!isset($_GET['code'])) {
    die("Missing code");
}

/*
// If you want strict CSRF protection, uncomment this:
if (!isset($_GET['state']) || $_GET['state'] !== ($_SESSION['oauth_state'] ?? '')) {
    die("Invalid state");
}
*/

$code = $_GET['code'];

// Exchange code for token
$token_url = "https://oauth2.googleapis.com/token";

$postData = [
    'code' => $code,
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'redirect_uri' => $redirect_uri,
    'grant_type' => 'authorization_code'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $token_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$tokenData = json_decode($response, true);

if (!isset($tokenData['access_token'])) {
    die("Failed to retrieve access token");
}

$access_token = $tokenData['access_token'];

// Fetch user info
$user_url = "https://www.googleapis.com/oauth2/v3/userinfo";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $user_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$userData = json_decode($response, true);

if (!isset($userData['email'])) {
    die("Failed to fetch user data");
}

// Login or register
$result = loginViaOAuth(
    $userData['email'],
    $userData['name'] ?? '',
    'google',
    $userData['sub']
);

if (isset($result['error'])) {
    die("OAuth login failed");
}

// Redirect to frontend
header("Location: $frontend_url");
exit;
