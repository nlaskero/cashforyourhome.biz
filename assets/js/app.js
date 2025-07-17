// Main site-wide JavaScript utilities

// Smooth scrolling for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetSelector = this.getAttribute("href");
      const target = document.querySelector(targetSelector);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// Back to top button functionality
function initBackToTop() {
  const button = document.getElementById("back-to-top");
  if (!button) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });
  button.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Initialize features when DOM is ready
function initSiteFeatures() {
  initSmoothScroll();
  initBackToTop();
  console.log("Site features initialized");
}

if (document.readyState !== "loading") {
  initSiteFeatures();
} else {
  document.addEventListener("DOMContentLoaded", initSiteFeatures);
}
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mobile-menu-button");
  const menu = document.getElementById("mobile-menu");
  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const line3 = document.getElementById("line3");

  btn.addEventListener("click", () => {
    menu.classList.toggle("h-0");
    menu.classList.toggle("overflow-hidden");
    line1.classList.toggle("rotate-45");
    line1.classList.toggle("translate-y-1.5");
    line2.classList.toggle("opacity-0");
    line3.classList.toggle("-rotate-45");
    line3.classList.toggle("-translate-y-1.5");
  });

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("h-0", "overflow-hidden");
      line1.classList.remove("rotate-45", "translate-y-1.5");
      line2.classList.remove("opacity-0");
      line3.classList.remove("-rotate-45", "-translate-y-1.5");
    });
  });
});
// Cookie Consent Management
class CookieConsent {
  constructor() {
    this.consentGiven = this.getConsentStatus();
    this.init();
  }

  init() {
    if (!this.consentGiven) {
      this.showBanner();
    } else {
      this.initializeAnalytics();
    }
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Banner buttons
    document
      .getElementById("cookie-accept-all")
      .addEventListener("click", () => {
        this.acceptAll();
      });

    document
      .getElementById("cookie-accept-essential")
      .addEventListener("click", () => {
        this.acceptEssential();
      });

    document.getElementById("cookie-settings").addEventListener("click", () => {
      this.showModal();
    });

    // Modal buttons
    document
      .getElementById("cookie-modal-close")
      .addEventListener("click", () => {
        this.hideModal();
      });

    document
      .getElementById("cookie-save-settings")
      .addEventListener("click", () => {
        this.saveSettings();
      });

    document
      .getElementById("cookie-accept-all-modal")
      .addEventListener("click", () => {
        this.acceptAll();
        this.hideModal();
      });

    // Modal overlay click
    document
      .querySelector(".cookie-modal-overlay")
      .addEventListener("click", () => {
        this.hideModal();
      });
  }

  showBanner() {
    document.getElementById("cookie-banner").style.display = "block";
    setTimeout(() => {
      document.getElementById("cookie-banner").style.opacity = "1";
    }, 100);
  }

  hideBanner() {
    document.getElementById("cookie-banner").style.display = "none";
  }

  showModal() {
    const modal = document.getElementById("cookie-modal");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    const preferences = this.getPreferences();
    document.getElementById("analytics-cookies").checked =
      preferences.analytics;
    document.getElementById("marketing-cookies").checked =
      preferences.marketing;
  }

  hideModal() {
    document.getElementById("cookie-modal").style.display = "none";
    document.body.style.overflow = "auto";
  }

  acceptAll() {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    this.savePreferences(preferences);
    this.hideBanner();
    this.initializeAnalytics();
  }

  acceptEssential() {
    const preferences = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    this.savePreferences(preferences);
    this.hideBanner();
  }

  saveSettings() {
    const preferences = {
      essential: true,
      analytics: document.getElementById("analytics-cookies").checked,
      marketing: document.getElementById("marketing-cookies").checked,
      timestamp: Date.now(),
    };
    this.savePreferences(preferences);
    this.hideModal();

    if (preferences.analytics) {
      this.initializeAnalytics();
    }
  }

  savePreferences(preferences) {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    this.consentGiven = true;
  }

  getPreferences() {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      return JSON.parse(consent);
    }
    return {
      essential: true,
      analytics: false,
      marketing: false,
    };
  }

  getConsentStatus() {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      const preferences = JSON.parse(consent);
      const twelveMonthsAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
      return preferences.timestamp > twelveMonthsAgo;
    }
    return false;
  }

  initializeAnalytics() {
    const preferences = this.getPreferences();
    if (preferences.analytics) {
      if (typeof gtag !== "undefined") {
        gtag("consent", "update", {
          analytics_storage: "granted",
        });

        gtag("event", "page_view", {
          page_title: "Home",
          page_location: window.location.href,
        });
      }
    }
  }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  new CookieConsent();

  // Track CTA button clicks
  document
    .querySelectorAll(".btn-primary, .btn-white, .cta-button")
    .forEach((button) => {
      button.addEventListener("click", function () {
        const preferences = JSON.parse(
          localStorage.getItem("cookieConsent") || "{}",
        );
        if (preferences.analytics && typeof gtag !== "undefined") {
          gtag("event", "click", {
            event_category: "engagement",
            event_label: "homepage_cta",
          });
        }
      });
    });
});
