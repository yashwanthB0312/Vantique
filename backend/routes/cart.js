const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

// Get cart for user
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  res.send(cart || { items: [] });
});

// Add item to cart
router.post('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const index = cart.items.findIndex(item => item.productId.toString() === productId);
    if (index >= 0) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  res.send(cart);
});

// POST /api/cart/checkout/:userId
router.post('/checkout/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // Check stock and update product qty
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      if (item.quantity > product.qty) {
        return res.status(400).json({ message: `Only ${product.qty} in stock for ${product.brand}` });
      }

      product.qty -= item.quantity;
      await product.save();
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    // Create Order
    const order = new Order({
      userId: req.params.userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      totalAmount
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Order placed successfully', order });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  }
});

router.put('/:userId', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
});

router.delete('/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Filter out the item to be deleted
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
});

module.exports = router;
