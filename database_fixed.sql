-- Fashion E-commerce Database (Fixed Passwords)
-- Import this file to phpMyAdmin

-- Create database
CREATE DATABASE IF NOT EXISTS fashion_ecommerce;
USE fashion_ecommerce;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  phone VARCHAR(20),
  avatar VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  emailVerified BOOLEAN DEFAULT FALSE,
  resetPasswordToken VARCHAR(255),
  resetPasswordExpires DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  parentCategoryId INT,
  orderIndex INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parentCategoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  originalPrice DECIMAL(10,2),
  categoryId INT NOT NULL,
  subcategory ENUM('pakaian', 'sepatu', 'aksesoris', 'tas', 'perhiasan') NOT NULL,
  brand VARCHAR(255) NOT NULL,
  images JSON,
  sizes JSON,
  colors JSON,
  stock INT NOT NULL DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  isFeatured BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  numReviews INT DEFAULT 0,
  tags JSON,
  material VARCHAR(255),
  care TEXT,
  shippingWeight DECIMAL(8,2),
  shippingLength DECIMAL(8,2),
  shippingWidth DECIMAL(8,2),
  shippingHeight DECIMAL(8,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  userId INT NOT NULL,
  items JSON NOT NULL,
  shippingAddress JSON NOT NULL,
  paymentMethod ENUM('cod', 'bank_transfer', 'e_wallet') NOT NULL,
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  orderStatus ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shippingCost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  trackingNumber VARCHAR(255),
  estimatedDelivery DATETIME,
  deliveredAt DATETIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(255) NOT NULL,
  postalCode VARCHAR(10) NOT NULL,
  isDefault BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user_addresses(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (name, description, image, orderIndex) VALUES
('Pakaian', 'Koleksi pakaian trendy untuk pria dan wanita', '/uploads/categories/clothing.jpg', 1),
('Sepatu', 'Sepatu casual dan formal untuk berbagai kesempatan', '/uploads/categories/shoes.jpg', 2),
('Aksesoris', 'Aksesoris fashion untuk melengkapi penampilan', '/uploads/categories/accessories.jpg', 3),
('Tas', 'Tas elegan untuk berbagai kebutuhan', '/uploads/categories/bags.jpg', 4);

-- Insert default users with CORRECT hashed passwords
-- Customer: customer@example.com / password123
-- Admin: admin@example.com / admin123
INSERT INTO users (name, email, password, role, isActive) VALUES
('Customer User', 'customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', TRUE),
('Admin User', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Insert sample products
INSERT INTO products (name, description, price, originalPrice, categoryId, subcategory, brand, images, sizes, colors, stock, isFeatured) VALUES
('Kemeja Pria Casual', 'Kemeja casual dengan bahan katun yang nyaman dipakai', 150000, 200000, 1, 'pakaian', 'Fashion Brand', '["/uploads/products/shirt1.jpg"]', '["S", "M", "L", "XL"]', '[{"name": "Putih", "code": "#FFFFFF"}, {"name": "Hitam", "code": "#000000"}]', 50, TRUE),
('Celana Jeans Slim Fit', 'Celana jeans dengan model slim fit yang trendy', 250000, 300000, 1, 'pakaian', 'Denim Co', '["/uploads/products/jeans1.jpg"]', '["30", "32", "34", "36"]', '[{"name": "Biru", "code": "#0000FF"}]', 30, TRUE),
('Sepatu Sneakers', 'Sneakers casual dengan sol yang nyaman', 350000, 400000, 2, 'sepatu', 'Shoe Brand', '["/uploads/products/sneakers1.jpg"]', '["39", "40", "41", "42", "43"]', '[{"name": "Putih", "code": "#FFFFFF"}, {"name": "Hitam", "code": "#000000"}]', 25, TRUE),
('Tas Ransel', 'Tas ransel dengan kapasitas besar', 180000, 220000, 4, 'tas', 'Bag Brand', '["/uploads/products/backpack1.jpg"]', '["One Size"]', '[{"name": "Hitam", "code": "#000000"}, {"name": "Abu-abu", "code": "#808080"}]', 15, FALSE),
('Jam Tangan Classic', 'Jam tangan dengan desain klasik', 450000, 500000, 3, 'aksesoris', 'Watch Co', '["/uploads/products/watch1.jpg"]', '["One Size"]', '[{"name": "Silver", "code": "#C0C0C0"}]', 10, TRUE);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(categoryId);
CREATE INDEX idx_products_active ON products(isActive);
CREATE INDEX idx_products_featured ON products(isFeatured);
CREATE INDEX idx_orders_user ON orders(userId);
CREATE INDEX idx_orders_status ON orders(orderStatus);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role); 