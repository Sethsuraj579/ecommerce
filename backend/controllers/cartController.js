const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) cart = { items: [], totalPrice: 0 };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [], totalPrice: 0 });
    }
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    // Recalculate total
    const populated = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    cart.totalPrice = populated.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity = quantity;
    await cart.save();
    // Recalculate total
    const populated = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    cart.totalPrice = populated.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.id);
    await cart.save();
    // Recalculate total
    const populated = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    cart.totalPrice = populated.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};