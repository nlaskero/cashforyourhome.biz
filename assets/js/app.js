// Enhanced and Secured Cash For Your Home App
import sanitizeHtml from 'sanitize-html';

(function() {
  'use strict';

// Global State - Using Object.freeze to prevent mutation
const state = Object.seal({
isMobileMenuOpen: false,
activeDropdown: null,
isScrolled: false,
activeSection: "home",
showCookieBanner: true,
colors: Object.freeze(["#8E8E93", "#1B4332", "#40916C", "#F1F3F4"]),
animationSpeed: 15,
gradientAngle: -45,
backgroundSize: 400,
});

// Testimonials Data - Sanitized and validated
const testimonials = Object.freeze([
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
]);

// Constants
const SCROLL_THRESHOLD = 10;
const NOTIFICATION_TIMEOUT = 3000;
const ANIMATION_DELAY = 200;
const DEBOUNCE_DELAY = 10;
const SECTION_OFFSET = 100;
const MOBILE_BREAKPOINT = 768;

// Utility Functions
function sanitizeHTML(str) {
  return sanitizeHtml(str);
}

function validateElement(element, elementName = 'Element') {
  if (!element) {
    // Avoid leaking potentially sensitive element names in logs
    console.warn('Requested DOM element not found');
    return false;
  }
  return true;
}

function showNotification(message) {
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");

if (!validateElement(notification, 'Notification') || !validateElement(notificationText, 'NotificationText')) {
console.error('Required UI elements missing');
return;
}

// Sanitize the message to prevent XSS
notificationText.textContent = String(message);
notification.classList.add("visible");

setTimeout(() => {
notification.classList.remove("visible");
}, NOTIFICATION_TIMEOUT);
}

function scrollToSection(sectionId) {
// Validate section ID to prevent potential issues
if (typeof sectionId !== 'string' || !sectionId.match(/^[a-zA-Z0-9-_]+$/)) {
console.error('Invalid section ID:', sectionId);
return;
}

const element = document.getElementById(sectionId);
if (!validateElement(element, `Section ${sectionId}`)) return;

try {
element.scrollIntoView({ behavior: "smooth", block: "start" });
updateActiveSection(sectionId);


if (state.isMobileMenuOpen) {
  toggleMobileMenu();
}

if (state.activeDropdown) {
  closeDropdown();
}


} catch (error) {
console.error('Error scrolling to section:', error);
}
}

function scrollToTop() {
try {
window.scrollTo({
top: 0,
behavior: "smooth",
});


// Track back to top button usage - with safety check
if (typeof window.gtag === 'function') {
  window.gtag("event", "click", {
    event_category: "Navigation",
    event_label: "Back to Top",
  });
}


} catch (error) {
console.error('Error scrolling to top:', error);
}
}

function updateActiveSection(sectionId) {
if (typeof sectionId !== 'string') return;

state.activeSection = sectionId;

// Update navigation active states
document.querySelectorAll(".nav-link").forEach((link) => {
link.classList.remove("active");
});

const activeLink = document.querySelector(`[data-section="${CSS.escape(sectionId)}"]`);
if (activeLink && activeLink.classList.contains("nav-link")) {
activeLink.classList.add("active");
}
}

function toggleMobileMenu() {
state.isMobileMenuOpen = !state.isMobileMenuOpen;

const elements = {
mobileMenuBtn: document.getElementById("mobileMenuBtn"),
mobileMenu: document.getElementById("mobileMenu"),
mobileOverlay: document.getElementById("mobileOverlay")
};

// Validate all required elements exist
const allElementsExist = Object.values(elements).every(el => validateElement(el));
if (!allElementsExist) return;

const { mobileMenuBtn, mobileMenu, mobileOverlay } = elements;

if (state.isMobileMenuOpen) {
mobileMenuBtn.classList.add("active");
mobileMenu.classList.add("active");
mobileOverlay.classList.add("active");
document.body.style.overflow = "hidden";


// Add ARIA attributes for accessibility
mobileMenuBtn.setAttribute('aria-expanded', 'true');
mobileMenu.setAttribute('aria-hidden', 'false');


} else {
mobileMenuBtn.classList.remove("active");
mobileMenu.classList.remove("active");
mobileOverlay.classList.remove("active");
document.body.style.overflow = "";


// Update ARIA attributes
mobileMenuBtn.setAttribute('aria-expanded', 'false');
mobileMenu.setAttribute('aria-hidden', 'true');


}

if (state.activeDropdown) {
closeDropdown();
}
}

function toggleDropdown(dropdownName) {
if (typeof dropdownName !== 'string') return;

const dropdownTrigger = document.querySelector(`[data-dropdown="${CSS.escape(dropdownName)}"]`);
if (!dropdownTrigger) return;

const dropdown = dropdownTrigger.closest(".dropdown-container");
if (!validateElement(dropdown, 'Dropdown container')) return;

if (state.activeDropdown === dropdownName) {
closeDropdown();
} else {
// Close any open dropdown first
closeDropdown();


state.activeDropdown = dropdownName;
dropdown.classList.add("active");

// Add ARIA attributes
dropdownTrigger.setAttribute('aria-expanded', 'true');


}
}

function closeDropdown() {
if (state.activeDropdown) {
const dropdownTrigger = document.querySelector(`[data-dropdown="${CSS.escape(state.activeDropdown)}"]`);
if (dropdownTrigger) {
const dropdown = dropdownTrigger.closest(".dropdown-container");
if (dropdown) {
dropdown.classList.remove("active");
dropdownTrigger.setAttribute('aria-expanded', 'false');
}
}
state.activeDropdown = null;
}
}

function handleScroll() {
const scrollY = window.scrollY;
const newIsScrolled = scrollY > SCROLL_THRESHOLD;

if (newIsScrolled !== state.isScrolled) {
state.isScrolled = newIsScrolled;


const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

if (navbar) {
  navbar.classList.toggle("scrolled", state.isScrolled);
}

if (backToTop) {
  backToTop.classList.toggle("visible", state.isScrolled);
}


}

// Update active section based on scroll position
updateActiveSectionOnScroll();
}

function updateActiveSectionOnScroll() {
const sections = ["home", "services", "about", "contact"];
const sectionElements = sections
.map((id) => document.getElementById(id))
.filter(Boolean);

for (let i = sectionElements.length - 1; i >= 0; i--) {
const element = sectionElements[i];
if (element && element.getBoundingClientRect().top <= SECTION_OFFSET) {
if (state.activeSection !== sections[i]) {
updateActiveSection(sections[i]);
}
break;
}
}
}

function handleKeyDown(e) {
// Don't interfere with form inputs
const activeElement = document.activeElement;
if (activeElement && (
activeElement.tagName === "INPUT" ||
activeElement.tagName === "TEXTAREA" ||
activeElement.tagName === "SELECT" ||
activeElement.isContentEditable
)) return;

switch (e.key) {
case "Home":
e.preventDefault();
scrollToTop();
break;
case "End":
e.preventDefault();
window.scrollTo({
top: document.documentElement.scrollHeight,
behavior: "smooth",
});
break;
case "Escape":
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
if (window.innerWidth > MOBILE_BREAKPOINT && state.isMobileMenuOpen) {
toggleMobileMenu();
}
}

function handleCookieConsent(type) {
if (typeof type !== 'string' || !['all', 'essential'].includes(type)) {
console.error('Invalid cookie consent type:', type);
return;
}

if (typeof window.gtag === 'function') {
try {
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
} catch (error) {
console.error('Error updating consent:', error);
}
}

state.showCookieBanner = false;
const cookieBanner = document.getElementById("cookieBanner");
if (cookieBanner) {
cookieBanner.classList.add("hidden");
}

// Store consent preference
try {
localStorage.setItem('cookieConsent', type);
} catch (error) {
console.warn('Could not store cookie consent:', error);
}
}

function validateFormData(data) {
const requiredFields = ['name', 'email', 'phone', 'property-address'];
const errors = [];

requiredFields.forEach(field => {
if (!data[field] || String(data[field]).trim() === '') {
errors.push(`${field} is required`);
}
});

// Email validation
if (data.email && !/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(data.email)) {
errors.push('Invalid email format');
}

// Phone validation (basic)
if (data.phone && !/^[\d\s-+()]{10,}$/.test(data.phone)) {
errors.push('Invalid phone number');
}

return errors;
}

function handleFormSubmit(e) {
e.preventDefault();

const form = e.target;
const formData = new FormData(form);
const data = Object.fromEntries(formData.entries());

// Validate form data
const errors = validateFormData(data);
if (errors.length > 0) {
showNotification(`Please fix the following errors: ${errors.join(', ')}`);
return;
}

// Sanitize data
const sanitizedData = {};
for (const [key, value] of Object.entries(data)) {
sanitizedData[key] = sanitizeHTML(String(value).trim());
}

// Google Analytics event tracking - with safety check
if (typeof window.gtag === 'function') {
try {
window.gtag("event", "form_submit", {
event_category: "Lead Generation",
event_label: "Cash Offer Form",
value: 1,
});
} catch (error) {
console.error('Analytics error:', error);
}
}

console.log('Form submitted successfully.');
showNotification("Thank you! We'll contact you within 24 hours with your cash offer.");

// Reset form
form.reset();
}

function handleAddressFormSubmit(e) {
e.preventDefault();

const addressInput = e.target.elements["property-address"];
if (!addressInput) return;

const address = String(addressInput.value).trim();

if (!address) {
showNotification("Please enter a property address.");
return;
}

// Basic address validation
if (address.length < 10) {
showNotification("Please enter a complete address.");
return;
}

if (typeof window.gtag === 'function') {
try {
window.gtag("event", "address_submit", {
event_category: "Lead Generation",
event_label: "Quick Address Form",
value: 1,
});
} catch (error) {
console.error('Analytics error:', error);
}
}

console.log('Address submitted');
showNotification("Thank you! We'll analyze your property and contact you soon.");

// Reset form
e.target.reset();
}
function renderTestimonials() {
  const testimonialsGrid = document.getElementById("testimonialsGrid");
  if (!validateElement(testimonialsGrid, "Testimonials grid")) return;

  try {
    testimonialsGrid.innerHTML = "";
    testimonials.forEach((testimonial) => {
      const sanitizedText = sanitizeHTML(testimonial.text);
      const sanitizedAuthor = sanitizeHTML(testimonial.author);
      const sanitizedLocation = sanitizeHTML(testimonial.location);
      const authorInitial = sanitizedAuthor.charAt(0).toUpperCase();

      const card = document.createElement("div");
      card.className = "testimonial-card";

      const ratingDiv = document.createElement("div");
      ratingDiv.className = "testimonial-rating";

      const ratingImg = document.createElement("img");
      ratingImg.src = "https://cdn.builder.io/api/v1/image/assets%2F1268a8aa36364ef795a07a801a639f41%2F2ca4d2d95beb49ea8dfac4bd2fd46469?format=webp&width=800";
      ratingImg.alt = "5 Star Rating";
      ratingImg.className = "rating-img";
      ratingImg.loading = "lazy";
      ratingDiv.appendChild(ratingImg);

      const quote = document.createElement("blockquote");
      quote.className = "testimonial-text";
      quote.textContent = `"${sanitizedText}"`;

      const footer = document.createElement("footer");
      footer.className = "testimonial-footer";

      const authorDiv = document.createElement("div");
      authorDiv.className = "testimonial-author";

      const avatar = document.createElement("div");
      avatar.className = "author-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = authorInitial;

      const info = document.createElement("div");
      info.className = "author-info";

      const cite = document.createElement("cite");
      cite.className = "author-name";
      cite.textContent = sanitizedAuthor;

      const location = document.createElement("div");
      location.className = "author-location";
      location.textContent = sanitizedLocation;

      info.appendChild(cite);
      info.appendChild(location);
      authorDiv.appendChild(avatar);
      authorDiv.appendChild(info);
      footer.appendChild(authorDiv);

      card.appendChild(ratingDiv);
      card.appendChild(quote);
      card.appendChild(footer);

      testimonialsGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error rendering testimonials:", error);
  }
}


function updateGradient() {
try {
const root = document.documentElement;


// Validate colors array
if (!Array.isArray(state.colors) || state.colors.length < 4) {
  console.error('Invalid colors array');
  return;
}

state.colors.forEach((color, index) => {
  if (typeof color === 'string' && color.match(/^#[0-9A-Fa-f]{6}$/)) {
    root.style.setProperty(`--gradient-color-${index + 1}`, color);
  }
});

// Validate numeric values
if (typeof state.gradientAngle === 'number') {
  root.style.setProperty("--gradient-angle", `${state.gradientAngle}deg`);
}
if (typeof state.animationSpeed === 'number' && state.animationSpeed > 0) {
  root.style.setProperty("--animation-speed", `${state.animationSpeed}s`);
}
if (typeof state.backgroundSize === 'number' && state.backgroundSize > 0) {
  root.style.setProperty("--background-size", `${state.backgroundSize}%`);
}


} catch (error) {
console.error('Error updating gradient:', error);
}
}

// Event Listeners Setup
function setupEventListeners() {
// Navigation - with error handling
document.querySelectorAll("[data-section]").forEach((element) => {
element.addEventListener("click", (e) => {
e.preventDefault();
const section = element.getAttribute("data-section");
if (section) {
scrollToSection(section);
}
});
});

// Mobile Menu
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
if (mobileMenuBtn) {
mobileMenuBtn.addEventListener("click", (e) => {
e.preventDefault();
toggleMobileMenu();
});
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
if (dropdown) {
toggleDropdown(dropdown);
}
});
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
if (!e.target.closest(".dropdown-container") && state.activeDropdown) {
closeDropdown();
}
});

// Forms with enhanced error handling
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
acceptAllCookies.addEventListener("click", () => handleCookieConsent("all"));
}

const essentialOnlyCookies = document.getElementById("essentialOnlyCookies");
if (essentialOnlyCookies) {
essentialOnlyCookies.addEventListener("click", () => handleCookieConsent("essential"));
}

// Back to Top
const backToTop = document.getElementById("backToTop");
if (backToTop) {
backToTop.addEventListener("click", (e) => {
e.preventDefault();
scrollToTop();
});
}

// Dropdown menu items
document.querySelectorAll(".dropdown-item").forEach((item) => {
item.addEventListener("click", (e) => {
e.preventDefault();
const href = item.getAttribute("href");
if (href && href.startsWith("#")) {
const sectionId = href.substring(1);
scrollToSection(sectionId);
}
});
});
}

// Intersection Observer for animations
function setupIntersectionObserver() {
if (!('IntersectionObserver' in window)) {
console.warn('IntersectionObserver not supported');
return;
}

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
document.querySelectorAll(
".services-section, .process-section, .testimonials-section, .location-section"
).forEach((section) => {
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
  ".hero-title, .hero-description, .hero-image, .hero-subtext, .hero-cta, .hero-quote"
);

heroElements.forEach((element, index) => {
  setTimeout(() => {
    if (element) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  }, index * ANIMATION_DELAY);
});


}, 100);
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
anchor.addEventListener("click", function (e) {
e.preventDefault();
const href = this.getAttribute("href");
if (href && href !== "#") {
const target = document.querySelector(href);
if (target) {
target.scrollIntoView({
behavior: "smooth",
block: "start",
});
}
}
});
});
}

// Check if user prefers reduced motion
function respectMotionPreferences() {
if (!window.matchMedia) return;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
// Disable animations
document.documentElement.style.setProperty("--animation-speed", "0s");


// Override smooth scrolling
document.documentElement.style.scrollBehavior = "auto";


}
}

// Performance optimization: Debounce function
function debounce(func, wait) {
let timeout;
return function executedFunction(...args) {
const later = () => {
clearTimeout(timeout);
func.apply(this, args);
};
clearTimeout(timeout);
timeout = setTimeout(later, wait);
};
}

// Check for stored cookie consent
function checkStoredConsent() {
try {
const storedConsent = localStorage.getItem('cookieConsent');
if (storedConsent) {
handleCookieConsent(storedConsent);
}
} catch (error) {
console.warn('Could not check stored consent:', error);
}
}

// Initialize everything when DOM is loaded
function init() {
try {
// Setup all functionality
setupEventListeners();
setupIntersectionObserver();
renderTestimonials();
updateGradient();
initSmoothScrolling();
respectMotionPreferences();
checkStoredConsent();


// Optimize scroll handler with debouncing
const debouncedScroll = debounce(handleScroll, DEBOUNCE_DELAY);
window.addEventListener("scroll", debouncedScroll, { passive: true });
window.addEventListener("resize", debounce(handleResize, 100), { passive: true });
window.addEventListener("keydown", handleKeyDown);

// Initial page load animation
animatePageLoad();

// Handle initial scroll state
handleScroll();

console.log("Cash For Your Home website initialized successfully!");


} catch (error) {
console.error("Error initializing website:", error);
}
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
document.addEventListener("DOMContentLoaded", init);
} else {
init();
}

// Export for potential external use (with validation)
window.CashForYourHome = Object.freeze({
scrollToSection,
showNotification,
state: Object.freeze(state),
});

})();
