const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Place order
router.post('/', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.send(order);
});

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('userId').populate('items.productId');
  res.send(orders);
});

// Get all successful orders (for admin)
router.get('/successful', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'successful' })
      .populate('userId')
      .populate('items.productId');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    if (!orders.length) return res.status(404).json({ message: 'No orders found for this user' });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user orders', error: err.message });
  }
});

module.exports = router;
