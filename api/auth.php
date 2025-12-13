<?php
/**
 * Poster.tv CMS - Authentication API
 * Endpoints:
 * - POST /api/auth.php?action=login  - Login
 * - POST /api/auth.php?action=logout - Logout
 * - GET  /api/auth.php?action=check  - Check session
 */

session_start();
require_once 'config.php';

$action = $_GET['action'] ?? '';

switch($action) {
    case 'login':
        login();
        break;
    case 'logout':
        logout();
        break;
    case 'check':
        checkSession();
        break;
    default:
        sendError('Invalid action', 400);
}

/**
 * Login - Authenticate user
 */
function login() {
    global $pdo;
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Method not allowed', 405);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }
    
    validateRequired($input, ['username', 'password']);
    
    $username = sanitizeString($input['username']);
    $password = $input['password'];
    
    // Get user from database
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendError('Invalid username or password', 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        sendError('Invalid username or password', 401);
    }
    
    // Set session
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = $user['id'];
    $_SESSION['admin_username'] = $user['username'];
    
    // Update last login
    $stmt = $pdo->prepare("UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = :id");
    $stmt->execute([':id' => $user['id']]);
    
    sendResponse([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
}

/**
 * Logout - Clear session
 */
function logout() {
    session_destroy();
    
    sendResponse([
        'success' => true,
        'message' => 'Logout successful'
    ]);
}

/**
 * Check if user is logged in
 */
function checkSession() {
    if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
        sendResponse([
            'logged_in' => true,
            'user' => [
                'id' => $_SESSION['admin_id'],
                'username' => $_SESSION['admin_username']
            ]
        ]);
    } else {
        sendResponse([
            'logged_in' => false
        ]);
    }
}
?>
