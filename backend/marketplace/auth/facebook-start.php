<?php
// marketplace/auth/facebook-start.php

require_once __DIR__ . '/../../common/env.php';
require_once __DIR__ . '/../../common/session.php';

$client_id = $_ENV['FACEBOOK_CLIENT_ID'] ?? '';
$redirect_uri = $_ENV['FACEBOOK_REDIRECT_URI'] ?? '';

if (!$client_id || !$redirect_uri) {
    die("Facebook OAuth not configured");
}

// Facebook OAuth URL
$params = [
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'state' => bin2hex(random_bytes(16)),
    'scope' => 'email,public_profile'
];

$_SESSION['fb_oauth_state'] = $params['state'];

$url = "https://www.facebook.com/v17.0/dialog/oauth?" . http_build_query($params);

header("Location: $url");
exit;
