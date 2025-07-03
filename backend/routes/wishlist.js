const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');

// GET Wishlist
router.get('/:userId', async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('items.productId');
  res.json(wishlist || { userId: req.params.userId, items: [] });
});

// ADD to Wishlist
router.post('/', async (req, res) => {
  const { userId, productId } = req.body;
  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [{ productId }] });
  } else if (!wishlist.items.find(item => item.productId.toString() === productId)) {
    wishlist.items.push({ productId });
  }

  await wishlist.save();
  res.json(wishlist);
});

// DELETE from Wishlist
router.delete('/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

  wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
  await wishlist.save();

  res.json({ message: 'Item removed from wishlist' });
});

module.exports = router;
