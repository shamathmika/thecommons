<?php
// Load environment variables from .env file manually
// common/env.php
function loadEnv($file)
{
    if (!file_exists($file))
        return;

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue; // Skip comments
        if (!str_contains($line, '='))
            continue;

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        $_ENV[$name] = $value;
        putenv("$name=$value");
    }
}

// Load main .env
loadEnv(__DIR__ . '/../.env');

// Load .env.local if exists (for local development)
loadEnv(__DIR__ . '/../.env.local');
