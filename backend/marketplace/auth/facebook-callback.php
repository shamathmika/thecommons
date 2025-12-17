<?php
require_once __DIR__ . '/../../common/env.php';
require_once __DIR__ . '/../../common/auth.php';
require_once __DIR__ . '/../../common/session.php';

$client_id = $_ENV['FACEBOOK_CLIENT_ID'] ?? '';
$client_secret = $_ENV['FACEBOOK_CLIENT_SECRET'] ?? '';
$redirect_uri = $_ENV['FACEBOOK_REDIRECT_URI'] ?? '';
$frontend_url = $_ENV['FRONTEND_URL'] ?? '/';

if (!isset($_GET['code'])) {
    die("Missing code");
}

// OPTIONAL STATE CHECK
/*
if (!isset($_GET['state']) || $_GET['state'] !== ($_SESSION['fb_oauth_state'] ?? '')) {
    die("Invalid state");
}
*/

$code = $_GET['code'];

// Step 1: Exchange code for access token
$token_url = "https://graph.facebook.com/v17.0/oauth/access_token?" . http_build_query([
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'client_secret' => $client_secret,
    'code' => $code
]);

$token_response = file_get_contents($token_url);
$token_data = json_decode($token_response, true);

if (!isset($token_data['access_token'])) {
    die("Failed to retrieve access token");
}

$access_token = $token_data['access_token'];

// Step 2: Fetch user profile
$user_url = "https://graph.facebook.com/me?fields=id,name,email&access_token={$access_token}";
$user_response = file_get_contents($user_url);
$user_data = json_decode($user_response, true);

if (!isset($user_data['id'])) {
    die("Failed to fetch Facebook user profile");
}

// Step 3: Login/register user into marketplace
$result = loginViaOAuth(
    $user_data['email'] ?? ($user_data['id'] . '@facebook.com'),
    $user_data['name'] ?? '',
    'facebook',
    $user_data['id']
);

if (isset($result['error'])) {
    die("Login failed");
}

// Step 4: Redirect to marketplace frontend
header("Location: $frontend_url");
exit;
