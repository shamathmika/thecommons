<?php
// common/auth.php
// Session & Login Helper

session_start();

function isLoggedIn()
{
    return isset($_SESSION['user_id']);
}

function login($username, $password)
{
    // Implement login logic here
    $_SESSION['user_id'] = 1; // Dummy user
    return true;
}

function logout()
{
    session_destroy();
}
?>