<?php
// backend/marketplace/auth/google-start.php

require_once __DIR__ . '/../../common/env.php';
require_once __DIR__ . '/../../common/session.php';

$client_id = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
$redirect_uri = $_ENV['GOOGLE_REDIRECT_URI'] ?? '';

if (!$client_id || !$redirect_uri) {
    die("OAuth configuration missing");
}

// CSRF protection
$_SESSION['oauth_state'] = bin2hex(random_bytes(16));

$params = [
    'response_type' => 'code',
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri,
    'scope' => 'openid email profile',
    'state' => $_SESSION['oauth_state'],
    'access_type' => 'online'
];

$url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

header("Location: $url");
exit;
