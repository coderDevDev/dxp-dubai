<?php
/**
 * Poster.tv CMS - Categories API
 * Endpoints:
 * - GET /api/categories.php - Get all categories
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $stmt = $pdo->prepare("SELECT * FROM categories ORDER BY order_index ASC");
    $stmt->execute();
    $categories = $stmt->fetchAll();
    
    sendResponse($categories);
} catch(PDOException $e) {
    sendError('Failed to fetch categories: ' . $e->getMessage(), 500);
}
?>
