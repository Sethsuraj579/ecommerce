const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number }],
  shippingAddress: {
    name: String, email: String, phone: String, address: String, city: String, state: String, zip: String
  },
  paymentMethod: { type: String, enum: ['COD', 'Razorpay', 'Stripe'] },
  status: { type: String, default: 'pending' },
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);