/* ══════════════════════════════════════════════
   STACKLY Login — Accepts any email/password
   ══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const roleSelect = document.getElementById('role');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const roleError = document.getElementById('roleError');
  const loginMessage = document.getElementById('loginMessage');
  const passwordToggle = document.getElementById('passwordToggle');
  const signinBtn = document.getElementById('signinBtn');

  // If already logged in, redirect
  const existing = JSON.parse(sessionStorage.getItem('stackly_user'));
  if (existing) {
    window.location.href = existing.role === 'admin' ? '/admin-dashboard.html' : '/user-dashboard.html';
    return;
  }

  // Password visibility toggle
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      passwordToggle.textContent = isPassword ? '◉' : '◉';
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      clearErrors();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const role = roleSelect ? roleSelect.value : 'user';

      // Validate
      let valid = true;

      if (!email) {
        showFieldError(emailInput, emailError, 'Email is required');
        valid = false;
      } else if (!isValidEmail(email)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email');
        valid = false;
      }

      if (!password) {
        showFieldError(passwordInput, passwordError, 'Password is required');
        valid = false;
      }

      if (roleSelect && !role) {
        showFieldError(roleSelect, roleError, 'Please select your role');
        valid = false;
      }

      if (!valid) return;

      // Any email + any password = login success
      const isAdmin = role === 'admin';

      const userData = {
        email: email,
        role: isAdmin ? 'admin' : 'user',
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
      };

      sessionStorage.setItem('stackly_user', JSON.stringify(userData));

      // Redirect
      signinBtn.disabled = true;
      signinBtn.innerHTML = '<span>Signing in...</span>';

      setTimeout(() => {
        window.location.href = isAdmin ? '/admin-dashboard.html' : '/user-dashboard.html';
      }, 400);
    });
  }

  function showFieldError(input, errorEl, message) {
    if (input) input.parentElement.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    if (loginMessage) loginMessage.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
