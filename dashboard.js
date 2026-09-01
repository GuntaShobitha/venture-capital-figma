/* ══════════════════════════════════════════════
   STACKLY Dashboard — Shared JavaScript
   ══════════════════════════════════════════════ */

/**
 * Initialize dashboard. Pass 'user' or 'admin'.
 * Returns the user data object.
 */
function initDashboard(role) {
  const userData = JSON.parse(sessionStorage.getItem('stackly_user'));

  if (!userData || userData.role !== role) {
    window.location.href = './login.html';
    return null;
  }

  // Populate user info
  const avatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');

  if (avatar) avatar.textContent = userData.email.charAt(0).toUpperCase();
  if (userName) userName.textContent = userData.email.split('@')[0];
  if (userEmail) userEmail.textContent = userData.email;

  // Mobile menu
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuBtn = document.getElementById('menuBtn');

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('stackly_user');
      window.location.href = './login.html';
    });
  }

  // Toggle switches
  document.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
  });

  // Sidebar logo → always go to overview
  const logoLink = document.querySelector('.sidebar-logo a');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('overview');
    });
  }

  // Tab navigation
  initTabs();

  return userData;
}

/**
 * Initialize tab-based navigation for single-page dashboards.
 */
function initTabs() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabs = document.querySelectorAll('.dash-tab[data-tab]');

  if (!sidebarLinks.length || !tabs.length) return;

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Check URL hash for initial tab
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    switchTab(hash);
  }
}

/**
 * Switch to a specific tab by ID.
 */
function switchTab(tabId) {
  // Update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.sidebar-link[data-tab="${tabId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Show/hide tab content
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.dash-tab[data-tab="${tabId}"]`);
  if (activeTab) activeTab.classList.add('active');

  // Update URL hash without scroll
  history.replaceState(null, '', '#' + tabId);

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');

  // Scroll to top of main content
  const main = document.querySelector('.dash-main');
  if (main) main.scrollTop = 0;
}
