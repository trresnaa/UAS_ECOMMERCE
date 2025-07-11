const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (addresses) updateData.addresses = addresses;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add shipping address
router.post('/addresses', auth, async (req, res) => {
  try {
    const { name, phone, address, city, postalCode, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    
    // If this is the default address, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
      name,
      phone,
      address,
      city,
      postalCode,
      isDefault: isDefault || false
    });

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update shipping address
router.put('/addresses/:addressId', auth, async (req, res) => {
  try {
    const { name, phone, address, city, postalCode, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is the default address, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      name,
      phone,
      address,
      city,
      postalCode,
      isDefault: isDefault || false
    };

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete shipping address
router.delete('/addresses/:addressId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 