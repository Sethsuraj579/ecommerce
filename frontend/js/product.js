// js/product.js

async function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    document.getElementById('productDetail').innerHTML = '<p style="color:red;">Product ID not provided.</p>';
    return;
  }

  try {
    const product = await apiRequest(`/products/${productId}`);

    // Populate product detail
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDesc').textContent = product.description || 'No description available.';
    document.getElementById('productStock').textContent = `Stock: ${product.stock || 0}`;

    // Image
    const img = document.getElementById('productImage');
    if (img) {
      img.src = product.images?.[0] || 'https://via.placeholder.com/400';
      img.alt = product.title;
    }

    // Rating
    const ratingContainer = document.getElementById('productRating');
    if (ratingContainer) {
      const stars = '★'.repeat(Math.floor(product.rating || 0)) + '☆'.repeat(5 - Math.floor(product.rating || 0));
      ratingContainer.innerHTML = `${stars} (${product.reviews?.length || 0} reviews)`;
    }

    // Original price (if discount)
    const originalEl = document.getElementById('productOriginal');
    if (originalEl && product.discount && product.discount > 0) {
      const originalPrice = product.price / (1 - product.discount / 100);
      originalEl.textContent = `$${originalPrice.toFixed(2)}`;
    } else if (originalEl) {
      originalEl.textContent = '';
    }

    // Store productId for cart actions
    document.getElementById('productId').value = product._id;

    // Load related products
    loadRelatedProducts(product.category, product._id);
  } catch (err) {
    console.error('Error loading product:', err);
    document.getElementById('productDetail').innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

async function loadRelatedProducts(category, currentId) {
  const container = document.getElementById('relatedGrid');
  if (!container) return;

  try {
    const data = await apiRequest(`/products?category=${category}&limit=4`);
    const related = (data.products || []).filter(p => p._id !== currentId);

    if (related.length === 0) {
      container.innerHTML = '<p>No related products found.</p>';
      return;
    }

    container.innerHTML = related.map(p => `
      <div class="product-card">
        <img src="${p.images?.[0] || 'https://via.placeholder.com/200'}" alt="${p.title}" loading="lazy" />
        <h4>${p.title}</h4>
        <p>$${p.price.toFixed(2)}</p>
        <a href="product.html?id=${p._id}" class="btn btn-primary btn-sm">View</a>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading related products:', err);
    container.innerHTML = '<p>Could not load related products.</p>';
  }
}

// Add to cart from product detail page
async function addToCartFromDetail() {
  const productId = document.getElementById('productId').value;
  const qtyInput = document.getElementById('qtyInput');
  const quantity = parseInt(qtyInput?.value || 1);

  if (!productId) {
    alert('Product not found.');
    return;
  }

  try {
    await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    alert('✅ Added to cart!');
    if (typeof updateCartCount === 'function') updateCartCount();
  } catch (err) {
    if (err.message.includes('401')) {
      alert('Please login first.');
      window.location.href = 'login.html';
    } else {
      alert('Error: ' + err.message);
    }
  }
}

// Buy Now (add to cart and go to checkout)
async function buyNow() {
  const productId = document.getElementById('productId').value;
  const qtyInput = document.getElementById('qtyInput');
  const quantity = parseInt(qtyInput?.value || 1);

  if (!productId) {
    alert('Product not found.');
    return;
  }

  try {
    await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    window.location.href = 'checkout.html';
  } catch (err) {
    alert('Please login first.');
    window.location.href = 'login.html';
  }
}

// Wishlist toggle
async function toggleWishlist() {
  const productId = document.getElementById('productId').value;
  if (!productId) return;

  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const idx = wishlist.indexOf(productId);

  if (idx > -1) {
    wishlist.splice(idx, 1);
    alert('Removed from wishlist ❤️');
  } else {
    wishlist.push(productId);
    alert('Added to wishlist ❤️');
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Auto-load when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productDetail')) {
    loadProductDetail();

    // Attach event listeners
    document.getElementById('addToCartBtn')?.addEventListener('click', addToCartFromDetail);
    document.getElementById('buyNowBtn')?.addEventListener('click', buyNow);
    document.getElementById('wishlistBtn')?.addEventListener('click', toggleWishlist);
  }
});
