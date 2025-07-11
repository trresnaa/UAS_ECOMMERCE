const mysql = require('mysql2/promise');

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fashion_ecommerce',
      port: process.env.DB_PORT || 3306
    });

    console.log('MySQL Connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const createTables = async (connection) => {
  try {
    // Create users table
    await connection.execute(`
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
      )
    `);

    // Create categories table
    await connection.execute(`
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
      )
    `);

    // Create products table
    await connection.execute(`
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
      )
    `);

    // Create orders table
    await connection.execute(`
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
      )
    `);

    // Create user addresses table
    await connection.execute(`
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
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const insertDefaultUsers = async (connection) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Tresnajaya2004', 10);

    // Insert default customer
    await connection.execute(`
      INSERT IGNORE INTO users (name, email, password, role, isActive) 
      VALUES ('Tresna Customer', 'tresnacust@gmail.com', ?, 'customer', TRUE)
    `, [hashedPassword]);

    // Insert default admin
    await connection.execute(`
      INSERT IGNORE INTO users (name, email, password, role, isActive) 
      VALUES ('Tresna Admin', 'tresnaadmin@gmail.com', ?, 'admin', TRUE)
    `, [hashedPassword]);

    console.log('Default users created successfully');
  } catch (error) {
    console.error('Error creating default users:', error);
  }
};

const connectDB = async () => {
  try {
    const connection = await createConnection();
    await createTables(connection);
    await insertDefaultUsers(connection);
    return connection;
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, createConnection }; 