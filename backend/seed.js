// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables from .env
dotenv.config();

// ============================================================
//  Sample Products (15 items)
// ============================================================
const products = [
  {
    title: 'Wireless Bluetooth Headphones Pro',
    description: 'Premium noise‑canceling headphones with 40‑hour battery life and deep bass.',
    price: 99.99,
    discount: 33,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
    stock: 45,
    rating: 4.8,
    reviews: [{ user: 'Sarah J.', comment: 'Amazing sound!', rating: 5 }]
  },
  {
    title: 'Premium Cotton T‑Shirt (Pack of 3)',
    description: 'Soft, breathable 100% organic cotton t‑shirts, perfect for everyday wear.',
    price: 39.99,
    discount: 33,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'],
    stock: 120,
    rating: 4.6,
    reviews: [{ user: 'Emma W.', comment: 'So comfortable!', rating: 5 }]
  },
  {
    title: 'Smart Watch Series 7 – Health Tracker',
    description: 'Track heart rate, sleep, steps, GPS + water‑resistant design.',
    price: 199.99,
    discount: 29,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop'],
    stock: 30,
    rating: 4.7,
    reviews: [{ user: 'Alex K.', comment: 'Best smartwatch I’ve owned.', rating: 5 }]
  },
  {
    title: 'Minimalist Leather Backpack',
    description: 'Handcrafted genuine leather backpack, fits laptops up to 15 inches.',
    price: 59.99,
    discount: 33,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop'],
    stock: 25,
    rating: 4.5,
    reviews: [{ user: 'Olivia P.', comment: 'Stylish and durable!', rating: 4 }]
  },
  {
    title: '4K Action Camera – Waterproof',
    description: 'Capture every adventure with 4K video, waterproof to 40m, image stabilisation.',
    price: 149.99,
    discount: 35,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop'],
    stock: 18,
    rating: 4.4,
    reviews: [{ user: 'Chris M.', comment: 'Great for travel vlogs!', rating: 5 }]
  },
  {
    title: 'Men’s Running Shoes – Breathable Mesh',
    description: 'Lightweight, responsive cushioning, ideal for marathons and daily runs.',
    price: 79.99,
    discount: 33,
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
    stock: 60,
    rating: 4.9,
    reviews: [{ user: 'James D.', comment: 'Perfect for marathons.', rating: 5 }]
  },
  {
    title: 'Organic Cotton Bedsheet Set – Queen',
    description: 'Luxuriously soft, includes fitted sheet, flat sheet, and 2 pillowcases.',
    price: 89.99,
    discount: 31,
    category: 'Home & Living',
    images: ['https://images.unsplash.com/photo-1526734823552-1b5fe7567c4d?w=600&h=600&fit=crop'],
    stock: 40,
    rating: 4.3,
    reviews: [{ user: 'Lisa M.', comment: 'So soft and cozy!', rating: 5 }]
  },
  {
    title: 'The Art of Coding – Bestseller Book',
    description: 'Master coding from basics to advanced, with real‑world projects.',
    price: 24.99,
    discount: 38,
    category: 'Books',
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop'],
    stock: 80,
    rating: 4.7,
    reviews: [{ user: 'David S.', comment: 'Finally, coding makes sense!', rating: 5 }]
  },
  {
    title: 'Wireless Charging Pad – Fast Charge',
    description: 'Qi‑compatible, LED indicator, anti‑slip design for desk or nightstand.',
    price: 29.99,
    discount: 20,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop'],
    stock: 55,
    rating: 4.2,
    reviews: [{ user: 'Tom H.', comment: 'Works perfectly with my phone.', rating: 4 }]
  },
  {
    title: 'Eco‑Friendly Yoga Mat – Non‑Slip',
    description: 'High‑density, alignment lines, perfect for all yoga styles.',
    price: 34.99,
    discount: 25,
    category: 'Sports',
    images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&h=600&fit=crop'],
    stock: 70,
    rating: 4.6,
    reviews: [{ user: 'Anna G.', comment: 'Great grip and thickness.', rating: 5 }]
  },
  {
    title: 'Stainless Steel Water Bottle – 1L',
    description: 'Double‑walled vacuum insulation, keeps drinks cold/hot for 24 hours.',
    price: 19.99,
    discount: 15,
    category: 'Home & Living',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop'],
    stock: 100,
    rating: 4.4,
    reviews: [{ user: 'Mark R.', comment: 'Keeps my coffee hot all day.', rating: 4 }]
  },
  {
    title: 'Professional Chef’s Knife Set',
    description: 'High‑carbon stainless steel, ergonomic handles, includes 3 knives.',
    price: 69.99,
    discount: 28,
    category: 'Home & Living',
    images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&h=600&fit=crop'],
    stock: 22,
    rating: 4.8,
    reviews: [{ user: 'Chef Maria', comment: 'Sharp and balanced – love it!', rating: 5 }]
  },
  {
    title: 'Wireless Gaming Mouse – RGB',
    description: 'Ultra‑light, 16000 DPI, programmable buttons, 70‑hour battery life.',
    price: 49.99,
    discount: 30,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop'],
    stock: 35,
    rating: 4.7,
    reviews: [{ user: 'GamerPro', comment: 'Smooth and precise.', rating: 5 }]
  },
  {
    title: 'Women’s Summer Floral Dress',
    description: 'Lightweight, breathable fabric, perfect for casual outings and beach vacations.',
    price: 44.99,
    discount: 22,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'],
    stock: 50,
    rating: 4.5,
    reviews: [{ user: 'Jessica L.', comment: 'Beautiful print and comfy.', rating: 4 }]
  },
  {
    title: 'Smart LED Bulb – Color Changing',
    description: 'Wi‑Fi enabled, compatible with Alexa/Google, 16 million colors.',
    price: 14.99,
    discount: 18,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&h=600&fit=crop'],
    stock: 85,
    rating: 4.3,
    reviews: [{ user: 'HomeAutomator', comment: 'Easy to set up and great mood lighting.', rating: 5 }]
  }
];

// ============================================================
//  Seed Function
// ============================================================
async function seedDatabase() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully.');

    // Optionally clear existing products (uncomment if you want a fresh start)
    // console.log('🗑️  Clearing existing products...');
    // await Product.deleteMany({});
    // console.log('✅ Cleared.');

    console.log('📦 Inserting products...');
    const result = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${result.length} products.`);

    // Optional – count to verify
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);

    console.log('✨ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();