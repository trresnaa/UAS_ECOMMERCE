const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get dashboard stats
router.get('/dashboard', [auth, admin], async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Total orders
    const totalOrders = await Order.countDocuments();
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const yearlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfYear }
    });

    // Total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const yearlyRevenue = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: startOfYear }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const monthlyCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startOfMonth }
    });

    // Total products
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    res.json({
      stats: {
        totalOrders,
        monthlyOrders,
        yearlyOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        yearlyRevenue: yearlyRevenue[0]?.total || 0,
        totalCustomers,
        monthlyCustomers,
        totalProducts,
        lowStockProducts
      },
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales analytics
router.get('/analytics', [auth, admin], async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock products
router.get('/low-stock', [auth, admin], async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 10 } })
      .populate('category', 'name')
      .sort({ stock: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending orders
router.get('/pending-orders', [auth, admin], async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { orderStatus: 'pending' },
        { orderStatus: 'confirmed' },
        { orderStatus: 'processing' }
      ]
    })
    .populate('user', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 