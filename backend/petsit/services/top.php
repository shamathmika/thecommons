<?php
// thecommons/backend/petsit/services/top.php
require_once __DIR__ . '/../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

ob_start();
include __DIR__ . '/get.php';
$allPetStr = ob_get_clean();
$allPet = json_decode($allPetStr, true);

$topData = [];
if (is_array($allPet)) {
    usort($allPet, function ($a, $b) {
        return ($b['visits'] ?? 0) <=> ($a['visits'] ?? 0);
    });
    $topData = array_slice($allPet, 0, 5);
}

echo json_encode($topData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>