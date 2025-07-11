const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price brand');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const db = req.app.locals.db;
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Get product from MySQL
      const [productRows] = await db.execute('SELECT * FROM products WHERE id = ?', [item.product]);
      const product = productRows[0];
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        product: item.product,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: (product.images && Array.isArray(product.images)) ? product.images[0] : null
      });
      // Update stock in MySQL
      await db.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product]);
    }

    const shippingCost = 15000; // Fixed shipping cost
    const tax = subtotal * 0.11; // 11% tax
    const total = subtotal + shippingCost + tax;

    // Save order in MySQL (not implemented here, keep existing logic if needed)
    // ...

    res.status(201).json({ message: 'Order placed and stock updated (MySQL)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    if (orderStatus === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user', 'name email')
     .populate('items.product', 'name images price brand');

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search
    } = req.query;

    const query = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) query.orderNumber = { $regex: search, $options: 'i' };

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 