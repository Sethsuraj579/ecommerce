// ============================================================
//  Dependencies
// ============================================================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

// ============================================================
//  App Initialization
// ============================================================
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
//  Middleware
// ============================================================
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:5000"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https:"],  // also for fonts
      },
    },
}));                                 // Security headers
app.use(cors());                                   // Cross-origin requests
app.use(compression());                            // Response compression
app.use(express.json());                           // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));   // Parse URL-encoded bodies

// Rate limiting – prevents abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);   // apply to all API routes

// ============================================================
//  Static Files (for admin panel & optional frontend)
// ============================================================
// Serve the admin.html and any other static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend'))); // Optional: serve frontend files if needed

// If you want to serve your entire frontend from here:
// app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================================
//  Routes
// ============================================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Simple test route to confirm the server is alive
app.get('/', (req, res) => {
  res.send('ShopHub API is running 🚀');
});

// ============================================================
//  Error Handling Middleware (must be last)
// ============================================================
app.use(require('./middleware/errorHandler'));

// ============================================================
//  MongoDB Connection & Server Start
// ============================================================
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully.');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.error('   Please check your MONGO_URI in .env and ensure MongoDB is running.');
    process.exit(1);
  }
};

startServer();