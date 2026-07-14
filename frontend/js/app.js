// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  // Update navigation
  if (typeof updateNav === 'function') updateNav();

  // Update cart count
  if (typeof updateCartCount === 'function') {
    if (localStorage.getItem('token')) updateCartCount();
  }

  console.log('🛒 ShopHub app initialized successfully!');
});