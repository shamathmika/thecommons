<?php
// thecommons/backend/nestly/listings/top.php
require_once __DIR__ . '/../../../common/cors.php';

header('Content-Type: application/json; charset=utf-8');

// Nestly doesn't have a dedicated remote "top" API provided in the initial context,
// so we'll fetch all and sort by visits locally.

ob_start();
include __DIR__ . '/get.php';
$allNestlyStr = ob_get_clean();
$allNestly = json_decode($allNestlyStr, true);

$topData = [];
if (is_array($allNestly)) {
    usort($allNestly, function ($a, $b) {
        return ($b['visits'] ?? 0) <=> ($a['visits'] ?? 0);
    });
    $topData = array_slice($allNestly, 0, 5);
}

echo json_encode($topData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>