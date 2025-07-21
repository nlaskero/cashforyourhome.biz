// Enhanced & Secured Cash For Your Home App
(function(){
  'use strict';

  const state = {
    isMobileMenuOpen: false,
    activeDropdown: null,
    isScrolled: false,
    activeSection: "home"
  };

  const CONFIG = {
    SCROLL_THRESHOLD: 10,
    DEBOUNCE_DELAY: 20
  };

  function validate(el) {
    if (!(el instanceof Element)) console.warn("Element not found or invalid:", el);
    return el;
  }

  function debounce(fn, wait) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
  }

  function updateNavActive(sectionId) {
    state.activeSection = sectionId;
    document.querySelectorAll(".nav-link, .mobile-nav-link")
      .forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-section") === sectionId);
      });
  }

  function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (!el) return console.error("Section not found:", sectionId);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    updateNavActive(sectionId);
    if (state.isMobileMenuOpen) toggleMobileMenu();
    closeDropdown();
  }

  function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    const btn = validate(document.getElementById("mobileMenuBtn"));
    const menu = validate(document.getElementById("mobileMenu"));
    const overlay = validate(document.getElementById("mobileOverlay"));

    if (!btn || !menu || !overlay) return;
    btn.classList.toggle("active", state.isMobileMenuOpen);
    menu.classList.toggle("active", state.isMobileMenuOpen);
    overlay.classList.toggle("active", state.isMobileMenuOpen);
    document.body.style.overflow = state.isMobileMenuOpen ? "hidden" : "";
    btn.setAttribute("aria-expanded", state.isMobileMenuOpen);
  }

  function handleScroll() {
    const scrolled = window.scrollY > CONFIG.SCROLL_THRESHOLD;
    state.isScrolled = scrolled;
    validate(document.getElementById("navbar"))?.classList.toggle("scrolled", scrolled);
    validate(document.getElementById("backToTop"))?.classList.toggle("visible", scrolled);
  }

  function setupNav() {
    document.querySelectorAll("[data-section]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const sec = btn.getAttribute("data-section");
        scrollToSection(sec);
      });
    });
  }

  function setupMobileMenu() {
    validate(document.getElementById("mobileMenuBtn"))?.addEventListener("click", e => {
      e.preventDefault();
      toggleMobileMenu();
    });
    validate(document.getElementById("mobileOverlay"))?.addEventListener("click", e => {
      e.preventDefault();
      toggleMobileMenu();
    });
  }

  function setupDropdowns() {
    document.querySelectorAll("[data-dropdown]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const name = btn.getAttribute("data-dropdown");
        const container = btn.closest(".dropdown-container");
        if (!container) return;

        const isOpen = state.activeDropdown === name;
        closeDropdown();

        if (!isOpen) {
          state.activeDropdown = name;
          container.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(".dropdown-container")) closeDropdown();
    });

    function closeDropdown() {
      if (!state.activeDropdown) return;
      const btn = document.querySelector(`[data-dropdown="${state.activeDropdown}"]`);
      btn?.closest(".dropdown-container")?.classList.remove("active");
      btn?.setAttribute("aria-expanded", "false");
      state.activeDropdown = null;
    }
    window.closeDropdown = closeDropdown;
  }

  function setupBackToTop() {
    validate(document.getElementById("backToTop"))?.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function init() {
    setupNav();
    setupMobileMenu();
    setupDropdowns();
    setupBackToTop();

    window.addEventListener("scroll", debounce(handleScroll, CONFIG.DEBOUNCE_DELAY), { passive: true });
    document.addEventListener("DOMContentLoaded", () => scrollToSection(state.activeSection));

    console.log("App initialized");
  }

  init();

  window.CashForYourHome = { scrollToSection };
})();
