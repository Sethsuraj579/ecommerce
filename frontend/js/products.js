// js/products.js

// Load featured products (used on homepage)
async function loadFeaturedProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  try {
    const data = await apiRequest('/products?limit=8');
    const products = data.products || [];

    if (products.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#6c757d;">No products available yet.</p>';
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.images?.[0] || 'https://via.placeholder.com/200'}" alt="${p.title}" loading="lazy" />
        <h3>${p.title}</h3>
        <p class="price">$${p.price.toFixed(2)}</p>
        <a href="product.html?id=${p._id}" class="btn btn-primary btn-sm">View Details</a>
        <button class="btn btn-secondary btn-sm" onclick="addToCart('${p._id}')">Add to Cart</button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading products:', err);
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:red;">Error: ${err.message}</p>`;
  }
}

// Add to cart function (used by buttons)
async function addToCart(productId) {
  try {
    await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    alert('✅ Added to cart!');
    // Update cart badge if exists
    if (typeof updateCartCount === 'function') updateCartCount();
  } catch (err) {
    if (err.message.includes('401') || err.message.includes('token')) {
      alert('Please login first.');
      window.location.href = 'login.html';
    } else {
      alert('Error: ' + err.message);
    }
  }
}

// Load all products with filters (for products.html)
async function loadAllProducts(page = 1, category = '', sort = '') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  try {
    let url = `/products?page=${page}&limit=12`;
    if (category) url += `&category=${category}`;
    if (sort) url += `&sort=${sort}`;

    const data = await apiRequest(url);
    const products = data.products || [];

    if (products.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#6c757d;">No products found.</p>';
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.images?.[0] || 'https://via.placeholder.com/200'}" alt="${p.title}" loading="lazy" />
        <h3>${p.title}</h3>
        <p class="price">$${p.price.toFixed(2)}</p>
        <a href="product.html?id=${p._id}" class="btn btn-primary btn-sm">View</a>
        <button class="btn btn-secondary btn-sm" onclick="addToCart('${p._id}')">Add to Cart</button>
      </div>
    `).join('');

    // Pagination controls
    const pagination = document.getElementById('pagination');
    if (pagination) {
      const totalPages = data.pages || 1;
      pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(p => `<button class="btn ${p === page ? 'btn-primary' : 'btn-outline'}" onclick="loadAllProducts(${p}, '${category}', '${sort}')">${p}</button>`)
        .join('');
    }
  } catch (err) {
    console.error('Error loading products:', err);
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:red;">Error: ${err.message}</p>`;
  }
}

// Auto-load if DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('product-grid');
  if (grid) {
    // If on homepage, load featured
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      loadFeaturedProducts();
    }
    // If on products page, load all
    if (window.location.pathname.includes('products.html')) {
      loadAllProducts();
    }
  }
});