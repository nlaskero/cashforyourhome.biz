// Main site-wide JavaScript utilities

// Smooth scrolling for anchor links
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetSelector = this.getAttribute('href');
      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Back to top button functionality
export function initBackToTop() {
  const button = document.getElementById('back-to-top');
  if (!button) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
  });
  button.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Initialize features when DOM is ready
export function initSiteFeatures() {
  initSmoothScroll();
  initBackToTop();
  console.log('Site features initialized');
}

if (document.readyState !== 'loading') {
  initSiteFeatures();
} else {
  document.addEventListener('DOMContentLoaded', initSiteFeatures);
}
