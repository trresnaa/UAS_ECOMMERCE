const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const [categories] = await db.execute(`
      SELECT c.*, pc.name as parentCategoryName 
      FROM categories c 
      LEFT JOIN categories pc ON c.parentCategoryId = pc.id 
      WHERE c.isActive = TRUE 
      ORDER BY c.orderIndex, c.name
    `);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category (admin only)
router.post('/', [auth, admin, upload.single('image')], async (req, res) => {
  try {
    const { name, description, parentCategory, order } = req.body;
    
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const category = new Category({
      name,
      description,
      image,
      parentCategory: parentCategory || null,
      order: order || 0
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category (admin only)
router.put('/:id', [auth, admin, upload.single('image')], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 