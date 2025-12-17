<?php
// common/auth.php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/session.php';

function registerUser($name, $email, $password)
{
    global $pdo;

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM marketplace_users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        return ['error' => 'User already exists'];
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO marketplace_users (name, email, password_hash, created_at) VALUES (?, ?, ?, NOW())");

    if ($stmt->execute([$name, $email, $hash])) {
        return ['success' => true, 'id' => $pdo->lastInsertId()];
    }

    return ['error' => 'Registration failed'];
}

function loginUser($email, $password)
{
    global $pdo;

    $stmt = $pdo->prepare("SELECT * FROM marketplace_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        return ['success' => true, 'user' => $user];
    }

    return ['error' => 'Invalid credentials'];
}

function loginViaOAuth($email, $name, $provider, $sub)
{
    global $pdo;

    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM marketplace_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Update oauth info if missing
        if (empty($user['oauth_provider'])) {
            $update = $pdo->prepare("UPDATE marketplace_users SET oauth_provider = ?, oauth_sub = ? WHERE id = ?");
            $update->execute([$provider, $sub, $user['id']]);
        }
    } else {
        // Create new user
        $stmt = $pdo->prepare("INSERT INTO marketplace_users (name, email, oauth_provider, oauth_sub, created_at) VALUES (?, ?, ?, ?, NOW())");
        if ($stmt->execute([$name, $email, $provider, $sub])) {
            $uid = $pdo->lastInsertId();
            $stmt = $pdo->prepare("SELECT * FROM marketplace_users WHERE id = ?");
            $stmt->execute([$uid]);
            $user = $stmt->fetch();
        } else {
            return ['error' => 'OAuth registration failed'];
        }
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];

    return ['success' => true, 'user' => $user];
}

function logoutUser()
{
    session_destroy();
}

function getCurrentUser()
{
    if (isset($_SESSION['user_id'])) {
        return [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email']
        ];
    }
    return null;
}
?>