<?php
/**
 * Poster.tv CMS - Projects API
 * Endpoints:
 * - GET    /api/projects.php           - Get all projects (with optional filters)
 * - GET    /api/projects.php?id=X      - Get single project by ID
 * - POST   /api/projects.php           - Create new project
 * - PUT    /api/projects.php           - Update existing project
 * - DELETE /api/projects.php?id=X      - Delete project
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getProjects();
        break;
    case 'POST':
        createProject();
        break;
    case 'PUT':
        updateProject();
        break;
    case 'DELETE':
        deleteProject();
        break;
    default:
        sendError('Method not allowed', 405);
}

/**
 * GET - Retrieve projects
 */
function getProjects() {
    global $pdo;
    
    // Get single project by ID
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = :id");
        $stmt->execute([':id' => $_GET['id']]);
        $project = $stmt->fetch();
        
        if (!$project) {
            sendError('Project not found', 404);
        }
        
        sendResponse($project);
    }
    
    // Get single project by slug
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE slug = :slug");
        $stmt->execute([':slug' => $_GET['slug']]);
        $project = $stmt->fetch();
        
        if (!$project) {
            sendError('Project not found', 404);
        }
        
        sendResponse($project);
    }
    
    // Build query with filters
    $sql = "SELECT * FROM projects WHERE 1=1";
    $params = [];
    
    // Filter by category
    if (isset($_GET['category']) && $_GET['category'] !== '*') {
        $sql .= " AND category = :category";
        $params[':category'] = $_GET['category'];
    }
    
    // Filter by featured
    if (isset($_GET['featured'])) {
        $sql .= " AND is_featured = :featured";
        $params[':featured'] = $_GET['featured'] === 'true' || $_GET['featured'] === '1' ? 1 : 0;
    }
    
    // Add ordering
    $sql .= " ORDER BY order_index ASC, created_at DESC";
    
    // Execute query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();
    
    sendResponse($projects);
}

/**
 * POST - Create new project
 */
function createProject() {
    global $pdo;
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }
    
    // Validate required fields
    validateRequired($input, ['title', 'slug', 'director', 'category', 'vimeo_id_720p', 'vimeo_id_1080p']);
    
    // Check if slug already exists
    $stmt = $pdo->prepare("SELECT id FROM projects WHERE slug = :slug");
    $stmt->execute([':slug' => $input['slug']]);
    if ($stmt->fetch()) {
        sendError('Slug already exists. Please use a different slug.');
    }
    
    // Prepare data
    $data = [
        ':title' => sanitizeString($input['title']),
        ':slug' => sanitizeString($input['slug']),
        ':director' => sanitizeString($input['director']),
        ':category' => sanitizeString($input['category']),
        ':vimeo_720' => sanitizeString($input['vimeo_id_720p']),
        ':vimeo_1080' => sanitizeString($input['vimeo_id_1080p']),
        ':poster' => isset($input['poster_image_url']) ? sanitizeString($input['poster_image_url']) : null,
        ':featured' => isset($input['is_featured']) ? (int)$input['is_featured'] : 0,
        ':order_index' => isset($input['order_index']) ? (int)$input['order_index'] : 0
    ];
    
    // Insert into database
    $sql = "INSERT INTO projects (
        title, slug, director, category, 
        vimeo_id_720p, vimeo_id_1080p, poster_image_url, 
        is_featured, order_index
    ) VALUES (
        :title, :slug, :director, :category,
        :vimeo_720, :vimeo_1080, :poster,
        :featured, :order_index
    )";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($data);
        
        sendResponse([
            'success' => true,
            'message' => 'Project created successfully',
            'id' => $pdo->lastInsertId()
        ], 201);
    } catch(PDOException $e) {
        sendError('Failed to create project: ' . $e->getMessage(), 500);
    }
}

/**
 * PUT - Update existing project
 */
function updateProject() {
    global $pdo;
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }
    
    // Validate required fields
    validateRequired($input, ['id', 'title', 'slug', 'director', 'category', 'vimeo_id_720p', 'vimeo_id_1080p']);
    
    // Check if project exists
    $stmt = $pdo->prepare("SELECT id FROM projects WHERE id = :id");
    $stmt->execute([':id' => $input['id']]);
    if (!$stmt->fetch()) {
        sendError('Project not found', 404);
    }
    
    // Check if slug conflicts with another project
    $stmt = $pdo->prepare("SELECT id FROM projects WHERE slug = :slug AND id != :id");
    $stmt->execute([':slug' => $input['slug'], ':id' => $input['id']]);
    if ($stmt->fetch()) {
        sendError('Slug already exists. Please use a different slug.');
    }
    
    // Prepare data
    $data = [
        ':id' => (int)$input['id'],
        ':title' => sanitizeString($input['title']),
        ':slug' => sanitizeString($input['slug']),
        ':director' => sanitizeString($input['director']),
        ':category' => sanitizeString($input['category']),
        ':vimeo_720' => sanitizeString($input['vimeo_id_720p']),
        ':vimeo_1080' => sanitizeString($input['vimeo_id_1080p']),
        ':poster' => isset($input['poster_image_url']) ? sanitizeString($input['poster_image_url']) : null,
        ':featured' => isset($input['is_featured']) ? (int)$input['is_featured'] : 0,
        ':order_index' => isset($input['order_index']) ? (int)$input['order_index'] : 0
    ];
    
    // Update database
    $sql = "UPDATE projects SET 
        title = :title,
        slug = :slug,
        director = :director,
        category = :category,
        vimeo_id_720p = :vimeo_720,
        vimeo_id_1080p = :vimeo_1080,
        poster_image_url = :poster,
        is_featured = :featured,
        order_index = :order_index,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = :id";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($data);
        
        sendResponse([
            'success' => true,
            'message' => 'Project updated successfully'
        ]);
    } catch(PDOException $e) {
        sendError('Failed to update project: ' . $e->getMessage(), 500);
    }
}

/**
 * DELETE - Remove project
 */
function deleteProject() {
    global $pdo;
    
    if (!isset($_GET['id'])) {
        sendError('Project ID is required');
    }
    
    $id = (int)$_GET['id'];
    
    // Check if project exists
    $stmt = $pdo->prepare("SELECT id FROM projects WHERE id = :id");
    $stmt->execute([':id' => $id]);
    if (!$stmt->fetch()) {
        sendError('Project not found', 404);
    }
    
    // Delete project
    try {
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        sendResponse([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    } catch(PDOException $e) {
        sendError('Failed to delete project: ' . $e->getMessage(), 500);
    }
}
?>
