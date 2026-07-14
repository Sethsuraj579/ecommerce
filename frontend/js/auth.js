function updateNav() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const authLinks = document.getElementById('auth-links');
  const userLinks = document.getElementById('user-links');
  const userName = document.getElementById('user-name');
  if (token && user) {
    authLinks.style.display = 'none';
    userLinks.style.display = 'flex';
    userName.textContent = `Hi, ${user.name}`;
  } else {
    authLinks.style.display = 'flex';
    userLinks.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', updateNav);

document.getElementById('logout')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});