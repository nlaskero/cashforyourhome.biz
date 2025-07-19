// Global State
let state = {
  isMobileMenuOpen: false,
  activeDropdown: null,
  isScrolled: false,
  activeSection: "home",
  showCookieBanner: true,
  colors: ["#8E8E93", "#1B4332", "#40916C", "#F1F3F4"],
  animationSpeed: 15,
  gradientAngle: -45,
  backgroundSize: 400,
};

// Testimonials Data
const testimonials = [
  {
    text: "I needed to sell my house quickly due to a job relocation. Cash for Your Home made me a fair offer and closed in just 10 days. The process was smooth and professional from start to finish.",
    author: "Maria Johnson",
    location: "Phoenix, AZ",
  },
  {
    text: "After my divorce, I needed to sell the house fast. They bought it as-is, even with all the needed repairs. No stress, no hassle, just a fair cash offer and quick closing.",
    author: "Robert Smith",
    location: "Denver, CO",
  },
  {
    text: "We inherited a property that needed significant work. Instead of dealing with contractors and realtors, we sold to Cash for Your Home. They handled everything and paid us fairly.",
    author: "Linda Wilson",
    location: "Tampa, FL",
  },
];

// Utility Functions
function showNotification(message) {
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notificationText");

  notificationText.textContent = message;
  notification.classList.add("visible");

  setTimeout(() => {
    notification.classList.remove("visible");
  }, 3000);
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    updateActiveSection(sectionId);

    if (state.isMobileMenuOpen) {
      toggleMobileMenu();
    }

    if (state.activeDropdown) {
      closeDropdown();
    }
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  // Track back to top button usage
  if (window.gtag) {
    window.gtag("event", "click", {
      event_category: "Navigation",
      event_label: "Back to Top",
    });
  }
}

function updateActiveSection(sectionId) {
  state.activeSection = sectionId;

  // Update navigation active states
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeLink && activeLink.classList.contains("nav-link")) {
    activeLink.classList.add("active");
  }
}

function toggleMobileMenu() {
  state.isMobileMenuOpen = !state.isMobileMenuOpen;

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");

  if (state.isMobileMenuOpen) {
    mobileMenuBtn.classList.add("active");
    mobileMenu.classList.add("active");
    mobileOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    mobileMenuBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (state.activeDropdown) {
    closeDropdown();
  }
}

function toggleDropdown(dropdownName) {
  const dropdown = document
    .querySelector(`[data-dropdown="${dropdownName}"]`)
    .closest(".dropdown-container");

  if (state.activeDropdown === dropdownName) {
    closeDropdown();
  } else {
    // Close any open dropdown first
    closeDropdown();

    state.activeDropdown = dropdownName;
    dropdown.classList.add("active");
  }
}

function closeDropdown() {
  if (state.activeDropdown) {
    const dropdown = document
      .querySelector(`[data-dropdown="${state.activeDropdown}"]`)
      .closest(".dropdown-container");
    dropdown.classList.remove("active");
    state.activeDropdown = null;
  }
}

function handleScroll() {
  const scrollY = window.scrollY;
  const newIsScrolled = scrollY > 10;

  if (newIsScrolled !== state.isScrolled) {
    state.isScrolled = newIsScrolled;

    const navbar = document.getElementById("navbar");
    const backToTop = document.getElementById("backToTop");

    if (state.isScrolled) {
      navbar.classList.add("scrolled");
      backToTop.classList.add("visible");
    } else {
      navbar.classList.remove("scrolled");
      backToTop.classList.remove("visible");
    }
  }

  // Update active section based on scroll position
  const sections = ["home", "services", "about", "contact"];
  const sectionElements = sections
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  for (let i = sectionElements.length - 1; i >= 0; i--) {
    const element = sectionElements[i];
    if (element && element.getBoundingClientRect().top <= 100) {
      if (state.activeSection !== sections[i]) {
        updateActiveSection(sections[i]);
      }
      break;
    }
  }
}

function handleKeyDown(e) {
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.tagName === "SELECT"
  )
    return;

  switch (e.key.toLowerCase()) {
    case "home":
      e.preventDefault();
      scrollToTop();
      break;
    case "end":
      e.preventDefault();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
      break;
    case "escape":
      if (state.isMobileMenuOpen) {
        toggleMobileMenu();
      }
      if (state.activeDropdown) {
        closeDropdown();
      }
      break;
  }
}

function handleResize() {
  if (window.innerWidth > 768 && state.isMobileMenuOpen) {
    toggleMobileMenu();
  }
}

function handleCookieConsent(type) {
  if (window.gtag) {
    if (type === "all") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    } else {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
  }

  state.showCookieBanner = false;
  const cookieBanner = document.getElementById("cookieBanner");
  cookieBanner.classList.add("hidden");
}

function handleFormSubmit(e) {
  e.preventDefault();

  // Google Analytics event tracking
  if (window.gtag) {
    window.gtag("event", "form_submit", {
      event_category: "Lead Generation",
      event_label: "Cash Offer Form",
      value: 1,
    });
  }

  // Get form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  console.log("Form submitted:", data);
  showNotification(
    "Thank you! We'll contact you within 24 hours with your cash offer.",
  );

  // Reset form
  e.target.reset();
}

function handleAddressFormSubmit(e) {
  e.preventDefault();
  const address = e.target.elements["property-address"].value;

  if (window.gtag) {
    window.gtag("event", "address_submit", {
      event_category: "Lead Generation",
      event_label: "Quick Address Form",
      value: 1,
    });
  }

  showNotification(
    `Thank you! We'll evaluate ${address} and contact you within 24 hours.`,
  );
  e.target.reset();
}

function renderTestimonials() {
  const testimonialsGrid = document.getElementById("testimonialsGrid");
  if (!testimonialsGrid) return;

  testimonialsGrid.innerHTML = testimonials
    .map(
      (testimonial) => `
        <div class="testimonial-card">
            <div class="testimonial-rating">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F1268a8aa36364ef795a07a801a639f41%2F2ca4d2d95beb49ea8dfac4bd2fd46469?format=webp&width=800"
                    alt="5 Star Rating"
                    class="rating-img"
                />
            </div>
            <blockquote class="testimonial-text">
                "${testimonial.text}"
            </blockquote>
            <footer class="testimonial-footer">
                <div class="testimonial-author">
                    <div class="author-avatar">
                        ${testimonial.author.charAt(0)}
                    </div>
                    <div class="author-info">
                        <cite class="author-name">${testimonial.author}</cite>
                        <div class="author-location">${testimonial.location}</div>
                    </div>
                </div>
            </footer>
        </div>
    `,
    )
    .join("");
}

function updateGradient() {
  const root = document.documentElement;
  root.style.setProperty("--gradient-color-1", state.colors[0]);
  root.style.setProperty("--gradient-color-2", state.colors[1]);
  root.style.setProperty("--gradient-color-3", state.colors[2]);
  root.style.setProperty("--gradient-color-4", state.colors[3]);
  root.style.setProperty("--gradient-angle", `${state.gradientAngle}deg`);
  root.style.setProperty("--animation-speed", `${state.animationSpeed}s`);
  root.style.setProperty("--background-size", `${state.backgroundSize}%`);
}

// Event Listeners Setup
function setupEventListeners() {
  // Navigation
  document.querySelectorAll("[data-section]").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const section = element.getAttribute("data-section");
      scrollToSection(section);
    });
  });

  // Mobile Menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  const mobileOverlay = document.getElementById("mobileOverlay");
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", toggleMobileMenu);
  }

  // Dropdown
  document.querySelectorAll("[data-dropdown]").forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const dropdown = element.getAttribute("data-dropdown");
      toggleDropdown(dropdown);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown-container") && state.activeDropdown) {
      closeDropdown();
    }
  });

  // Forms
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  const addressForm = document.getElementById("addressForm");
  if (addressForm) {
    addressForm.addEventListener("submit", handleAddressFormSubmit);
  }

  // Cookie Banner
  const acceptAllCookies = document.getElementById("acceptAllCookies");
  if (acceptAllCookies) {
    acceptAllCookies.addEventListener("click", () =>
      handleCookieConsent("all"),
    );
  }

  const essentialOnlyCookies = document.getElementById("essentialOnlyCookies");
  if (essentialOnlyCookies) {
    essentialOnlyCookies.addEventListener("click", () =>
      handleCookieConsent("essential"),
    );
  }

  // Back to Top
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", scrollToTop);
  }

  // Scroll Events
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", handleKeyDown);

  // Dropdown menu items
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const href = item.getAttribute("href");
      if (href.startsWith("#")) {
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
      }
    });
  });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-on-scroll");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that should animate
  document
    .querySelectorAll(
      ".services-section, .process-section, .testimonials-section, .location-section",
    )
    .forEach((section) => {
      observer.observe(section);
    });
}

// Page Load Animation
function animatePageLoad() {
  // Add loading class to body initially
  document.body.classList.add("loading");

  // Remove loading class and trigger animations
  setTimeout(() => {
    document.body.classList.remove("loading");

    // Trigger hero animations
    const heroElements = document.querySelectorAll(
      ".hero-title, .hero-description, .hero-image, .hero-subtext, .hero-cta, .hero-quote",
    );
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200);
    });
  }, 100);
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Check if user prefers reduced motion
function respectMotionPreferences() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    // Disable animations
    document.documentElement.style.setProperty("--animation-speed", "0s");

    // Override smooth scrolling
    document.querySelectorAll("*").forEach((element) => {
      element.style.scrollBehavior = "auto";
    });
  }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Setup all functionality
  setupEventListeners();
  setupIntersectionObserver();
  renderTestimonials();
  updateGradient();
  initSmoothScrolling();
  respectMotionPreferences();

  // Optimize scroll handler
  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", debounce(handleScroll, 10));

  // Initial page load animation
  animatePageLoad();

  // Handle initial scroll state
  handleScroll();

  console.log("Cash For Your Home website initialized successfully!");
});

// Export for potential external use
window.CashForYourHome = {
  scrollToSection,
  showNotification,
  state,
};
