const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      search,
      featured
    } = req.query;

    const db = req.app.locals.db;
    let whereClause = 'WHERE p.isActive = TRUE';
    const params = [];

    // Filter by category
    if (category) {
      whereClause += ' AND p.categoryId = ?';
      params.push(category);
    }
    if (subcategory) {
      whereClause += ' AND p.subcategory = ?';
      params.push(subcategory);
    }
    if (brand) {
      whereClause += ' AND p.brand LIKE ?';
      params.push(`%${brand}%`);
    }
    if (featured === 'true') {
      whereClause += ' AND p.isFeatured = TRUE';
    }

    // Price filter
    if (minPrice) {
      whereClause += ' AND p.price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      whereClause += ' AND p.price <= ?';
      params.push(Number(maxPrice));
    }

    // Search
    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Count total
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get products with pagination
    const offset = (page - 1) * limit;
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    const sortField = sort === 'createdAt' ? 'p.createdAt' : 
                     sort === 'price' ? 'p.price' : 
                     sort === 'name' ? 'p.name' : 'p.createdAt';

    const [products] = await db.execute(
      `SELECT p.*, c.name as categoryName 
       FROM products p 
       LEFT JOIN categories c ON p.categoryId = c.id 
       ${whereClause} 
       ORDER BY ${sortField} ${sortOrder} 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [rows] = await db.execute(
      `SELECT p.*, c.name as categoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (admin only)
router.post('/', [auth, admin, upload.array('images', 5)], async (req, res) => {
  try {
    const db = req.app.locals.db;
    const {
      name,
      description,
      price,
      originalPrice,
      categoryId,
      subcategory,
      brand,
      stock
    } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const [result] = await db.execute(
      `INSERT INTO products (name, description, price, originalPrice, categoryId, subcategory, brand, images, stock, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        name,
        description || '',
        Number(price),
        originalPrice ? Number(originalPrice) : null,
        categoryId,
        subcategory,
        brand || '',
        JSON.stringify(images),
        Number(stock)
      ]
    );
    const [rows] = await db.execute(
      `SELECT p.*, c.name as categoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id WHERE p.id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', [auth, admin, upload.array('images', 5)], async (req, res) => {
  try {
    const db = req.app.locals.db;
    const {
      name,
      description,
      price,
      originalPrice,
      categoryId,
      subcategory,
      brand,
      stock
    } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      try {
        images = JSON.parse(req.body.images);
      } catch { images = []; }
    }
    const [result] = await db.execute(
      `UPDATE products SET name=?, description=?, price=?, originalPrice=?, categoryId=?, subcategory=?, brand=?, images=?, stock=? WHERE id=?`,
      [
        name,
        description || '',
        Number(price),
        originalPrice ? Number(originalPrice) : null,
        categoryId,
        subcategory,
        brand || '',
        JSON.stringify(images),
        Number(stock),
        req.params.id
      ]
    );
    const [rows] = await db.execute(
      `SELECT p.*, c.name as categoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product stock (admin only)
router.patch('/:id/stock', [auth, admin], async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { stock } = req.body;
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }
    const [result] = await db.execute('UPDATE products SET stock = ? WHERE id = ?', [stock, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Stock updated successfully', stock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products (public)
router.get('/featured/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .populate('category', 'name')
    .limit(8);

    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 