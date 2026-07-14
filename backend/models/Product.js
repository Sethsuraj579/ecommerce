const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discount: Number,
  category: String,
  images: [String],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ user: String, comment: String, rating: Number }],
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'products'  // Explicitly set the collection name
});

module.exports = mongoose.model('Product', productSchema);