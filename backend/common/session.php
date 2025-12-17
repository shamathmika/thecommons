<?php
// common/session.php
// Start secure session and handle cross-origin credentials if needed

// Set session cookie parameters before starting the session
// Lifetime: 0 (session), Path: /, Domain: logic handled by browser for subdomains usually, 
// Secure: true (InfinityFree provides SSL), HttpOnly: true
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true, // Ensure this is true on HTTPS
    'httponly' => true,
    'samesite' => 'None' // Important for cross-site if frontend/backend are on different subdomains/ports
]);

session_start();

// Helper to check if session is active
function ensureSession()
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}
?>