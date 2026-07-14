async function updateCartCount() {
  try {
    const cart = await apiRequest('/cart');
    const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
  } catch {
    document.getElementById('cart-count').textContent = '0';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('token') && document.getElementById('cart-count')) {
     updateCartCount();
  }
});