(function () {
  'use strict';

  // State
  const state = {
    isMobileMenuOpen: false,
    activeDropdown: null,
    colors: ["#8E8E93", "#1B4332", "#40916C", "#F1F3F4"],
    gradientAngle: -45,
    animationSpeed: 15,
    backgroundSize: 400
  };
  const CONFIG = { SCROLL_THRESHOLD: 10, DEBOUNCE: 20 };

  const testimonials = [
    { text: "Fast sale, fair offer!", author: "Maria J.", location: "Phoenix, AZ" },
    { text: "No hassle, closed quick!", author: "Robert S.", location: "Denver, CO" },
    { text: "Easy process, professional.", author: "Linda W.", location: "Tampa, FL" }
  ];

  // Utility
  const validate = el => el instanceof Element ? el : null;
  const debounce = (fn, wait) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
  };
  const sanitize = str => { const d = document.createElement("div"); d.textContent = str; return d.innerHTML; };
  const notify = msg => {
    const n = validate(document.getElementById("notification")),
      t = validate(document.getElementById("notificationText"));
    if (!n || !t) return;
    t.textContent = msg; n.classList.add("visible");
    setTimeout(() => n.classList.remove("visible"), 3000);
  };

  // UI Controls
  function updateNav(section) {
    document.querySelectorAll("[data-section]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-section") === section);
    });
  }
  function closeDropdown() {
    if (state.activeDropdown) {
      const btn = document.querySelector(`[data-dropdown="${state.activeDropdown}"]`);
      btn && btn.closest(".dropdown-container")?.classList.remove("active");
      state.activeDropdown = null;
    }
  }
  function toggleDropdown(name) {
    if (state.activeDropdown === name) { closeDropdown(); return; }
    closeDropdown();
    const btn = document.querySelector(`[data-dropdown="${name}"]`);
    btn && btn.closest(".dropdown-container")?.classList.add("active");
    state.activeDropdown = name;
  }
  function toggleMobile() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    ["mobileMenuBtn", "mobileMenu", "mobileOverlay"].forEach(id => {
      validate(document.getElementById(id))?.classList.toggle("active", state.isMobileMenuOpen);
    });
    document.body.style.overflow = state.isMobileMenuOpen ? "hidden" : "";
  }
  function scrollToSection(id) {
    const el = validate(document.getElementById(id)); if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    updateNav(id); toggleMobile(); closeDropdown();
  }
  function handleScroll() {
    const sc = window.scrollY > CONFIG.SCROLL_THRESHOLD;
    validate(document.getElementById("navbar"))?.classList.toggle("scrolled", sc);
    validate(document.getElementById("backToTop"))?.classList.toggle("visible", sc);
  }

  // Forms
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target,
      data = Object.fromEntries(new FormData(form)),
      errs = [];
    ["property-address", "seller-name", "seller-phone"].forEach(f => {
      if (!data[f]?.trim()) errs.push(f + " required");
    });
    if (data["seller-email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data["seller-email"]))
      errs.push("Invalid email");
    const errBox = validate(document.getElementById("formErrors"));
    errBox.innerHTML = errs.length ? errs.map(e => `<div>${e}</div>`).join("") : "";
    if (errs.length) return;
    notify("Thanks! You'll hear from us shortly.");
    form.reset();
  }

  // Cookie
  function handleCookie(type) {
    localStorage.setItem("cookieConsent", type);
    const banner = validate(document.getElementById("cookieBanner"));
    if (banner) {
      banner.style.display = "none"; // 👈 DIRECTLY hides it instead of relying on .hidden class
    }
  }

  function initCookie() {
    const saved = localStorage.getItem("cookieConsent");
    if (saved) {
      handleCookie(saved);
    } else {
      validate(document.getElementById("acceptAllCookies"))?.addEventListener("click", () => handleCookie("all"));
      validate(document.getElementById("essentialOnlyCookies"))?.addEventListener("click", () => handleCookie("essential"));
    }
  }

  // Gradient & Motion
  function updateGradient() {
    const r = document.documentElement;
    state.colors.forEach((c, i) => r.style.setProperty(`--gradient-color-${i + 1}`, c));
    r.style.setProperty("--gradient-angle", state.gradientAngle + "deg");
    r.style.setProperty("--animation-speed", state.animationSpeed + "s");
    r.style.setProperty("--background-size", state.backgroundSize + "%");
  }
  function respectMotion() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.style.setProperty("--animation-speed", "0s");
      document.documentElement.style.scrollBehavior = "auto";
    }
  }

  // Render Testimonials
  function renderTestimonials() {
    const grid = validate(document.getElementById("testimonialsGrid"));
    if (grid) {
      grid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
          <blockquote>"${sanitize(t.text)}"</blockquote>
          <footer><cite>${sanitize(t.author)}</cite> – ${sanitize(t.location)}</footer>
        </div>`).join("");
    }
  }

  // Animated Numbers
  function animateNumber(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateNumber() {
      start += increment;
      if (start >= target) {
        element.textContent = target + suffix;
        element.classList.remove('counting');
        return;
      }
      element.textContent = Math.floor(start) + suffix;
      requestAnimationFrame(updateNumber);
    }

    element.classList.add('counting');
    updateNumber();
  }

  function initStatsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach((number, index) => {
            setTimeout(() => {
              number.classList.add('animate');

              // Extract number and suffix from text content
              const text = number.textContent.trim();
              let targetNum, suffix;

              if (text === '500+') {
                targetNum = 500;
                suffix = '+';
              } else if (text === '7 Days') {
                targetNum = 7;
                suffix = ' Days';
              } else if (text === '100%') {
                targetNum = 100;
                suffix = '%';
              } else {
                return; // Skip if format doesn't match
              }

              // Start animation after a brief delay
              setTimeout(() => {
                animateNumber(number, targetNum, suffix);
              }, 200);

            }, index * 200); // Stagger animations
          });

          // Disconnect observer after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    const statsSection = validate(document.querySelector('.stats-section'));
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  // Text Animation Initialization
  function initTextAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.animate-text, .animate-text-stagger, .animate-fade, .animate-slide-left, .animate-slide-right'
    );

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Setup
  function bind() {
    document.querySelectorAll("[data-section]").forEach(b => b.addEventListener("click", e => {
      e.preventDefault(); scrollToSection(b.getAttribute("data-section"));
    }));
    document.querySelectorAll("[data-dropdown]").forEach(b => b.addEventListener("click", e => {
      e.preventDefault(); toggleDropdown(b.getAttribute("data-dropdown"));
    }));
    document.addEventListener("click", e => {
      if (!e.target.closest(".dropdown-container")) closeDropdown();
    });
    validate(document.getElementById("mobileMenuBtn"))?.addEventListener("click", e => { e.preventDefault(); toggleMobile(); });
    validate(document.getElementById("mobileOverlay"))?.addEventListener("click", e => { e.preventDefault(); toggleMobile(); });
    validate(document.getElementById("backToTop"))?.addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    validate(document.getElementById("contactForm"))?.addEventListener("submit", handleSubmit);
    window.addEventListener("scroll", debounce(handleScroll, CONFIG.DEBOUNCE), { passive: true });
  }

  function init() {
    bind();
    renderTestimonials();
    updateGradient();
    respectMotion();
    initCookie();
    initStatsAnimation();
    handleScroll();
    console.log("UI ready");
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
