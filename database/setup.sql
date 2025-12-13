-- Poster.tv CMS Database Setup
-- Run this in phpMyAdmin or MySQL command line

CREATE DATABASE IF NOT EXISTS posterco_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE posterco_cms;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  director VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  vimeo_id_720p VARCHAR(100) NOT NULL,
  vimeo_id_1080p VARCHAR(100) NOT NULL,
  poster_image_url TEXT,
  order_index INT DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_featured (is_featured),
  INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  order_index INT DEFAULT 0,
  INDEX idx_order (order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO categories (name, slug, order_index) VALUES
('All', '*', 0),
('Featured Film', 'featured-film', 1),
('Commercials', 'commercials', 2),
('Music Videos', 'music-videos', 3)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert default admin user
-- Username: admin
-- Password: admin123
-- IMPORTANT: Change this password after first login!
INSERT INTO admin_users (username, password, email) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@posterco.tv')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- Insert existing projects from your website
INSERT INTO projects (title, slug, director, category, vimeo_id_720p, vimeo_id_1080p, is_featured, order_index) VALUES
('Veuve Clicquot x Jacquemus', 'veuve-clicquot-x-jacquemus', 'Jonas Lindstroem', 'commercials', '1117423122', '1117423122', 1, 1),
('Dior Sauvage', 'dior-sauvage-2025', 'Jean-Baptiste Mondino', 'commercials', '1115887892', '1115887892', 1, 2),
('Miss Dior', 'miss-dior', 'Manu Cossu', 'commercials', '1117421162', '1117421162', 1, 3),
('Eau Pure', 'kenzo', 'Manu Cossu', 'commercials', '1092256830', '1092256830', 1, 4),
('Conquest of Space', 'vacheron-constantin', 'Arnaud Bresson', 'commercials', '1093092700', '1093092700', 1, 5),
('FFT', 'federation-francaise-de-tennis', 'Only at Roland Garros', 'commercials', '1092435994', '1092435994', 1, 6),
('From Sunset to Sunrise', 'rabanne', 'Manu Cossu', 'commercials', '1092250725', '1092250725', 1, 7)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Success message
SELECT 'Database setup completed successfully!' AS message;
SELECT CONCAT('Total projects: ', COUNT(*)) AS status FROM projects;
SELECT CONCAT('Total categories: ', COUNT(*)) AS status FROM categories;
SELECT CONCAT('Admin users created: ', COUNT(*)) AS status FROM admin_users;
