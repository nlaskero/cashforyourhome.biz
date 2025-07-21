// Enhanced & Secured Cash For Your Home App
(function(){
  'use strict';

  // --- GLOBAL STATE ---
  const state = {
    isMobileMenuOpen: false,
    activeDropdown: null,
    isScrolled: false,
    activeSection: "home",
    showCookieBanner: true,
    colors: ["#8E8E93", "#1B4332", "#40916C", "#F1F3F4"],
    animationSpeed: 15,
    gradientAngle: -45,
    backgroundSize: 400
  };

  // --- TESTIMONIALS DATA ---
  const testimonials = [
    {
      text: "I needed to sell my house quickly due to a job relocation. Cash for Your Home made me a fair offer and closed in just 10 days. The process was smooth and professional from start to finish.",
      author: "Maria Johnson",
      location: "Phoenix, AZ"
    },
    {
      text: "After my divorce, I needed to sell the house fast. They bought it as-is, even with all the needed repairs. No stress, no hassle, just a fair cash offer and quick closing.",
      author: "Robert Smith",
      location: "Denver, CO"
    },
    {
      text: "We inherited a property that needed significant work. Instead of dealing with contractors and realtors, we sold to Cash for Your Home. They handled everything and paid us fairly.",
      author: "Linda Wilson",
      location: "Tampa, FL"
    }
  ];

  const CONFIG = Object.freeze({
    SCROLL_THRESHOLD: 10,
    NOTIFICATION_TIMEOUT: 3000,
    ANIMATION_DELAY: 200,
    DEBOUNCE_DELAY: 10,
    SECTION_OFFSET: 100,
    MOBILE_BREAKPOINT: 768
  });

  // --- UTILITY FUNCTIONS ---
  function sanitizeHTML(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function validateElement(el, name = "Element"){
    if( !(el instanceof Element) ){
      console.warn(`${name} not found or invalid`);
      return false;
    }
    return true;
  }

  function debounce(fn, wait){
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // --- NOTIFICATIONS ---
  function showNotification(msg){
    const note = document.getElementById("notification");
    const noteT = document.getElementById("notificationText");
    if(!validateElement(note, "Notification") || !validateElement(noteT,"NotificationText")) return;

    noteT.textContent = String(msg);
    note.classList.add("visible");
    setTimeout(() => note.classList.remove("visible"), CONFIG.NOTIFICATION_TIMEOUT);
  }

  // --- NAV, SCROLL, MENU ---
  function updateActiveSection(id){
    if(typeof id !== "string") return;
    state.activeSection = id;

    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    const active = document.querySelector(`[data-section="${CSS.escape(id)}"]`);
    if(active && active.classList.contains("nav-link")) active.classList.add("active");
  }

  function scrollToSection(id){
    if(!/^[\w-]+$/.test(id)){
      console.error("Invalid section ID:", id); return;
    }
    const el = document.getElementById(id);
    if(!validateElement(el, `Section ${id}`)) return;

    el.scrollIntoView({behavior:"smooth",block:"start"});
    updateActiveSection(id);
    if(state.isMobileMenuOpen) toggleMobileMenu();
    if(state.activeDropdown) closeDropdown();
  }

  function scrollToTop(){
    window.scrollTo({top:0,behavior:"smooth"});
    if(typeof window.gtag === "function"){
      window.gtag("event","click",{event_category:"Navigation",event_label:"Back to Top"});
    }
  }

  function handleScroll(){
    const newScrolled = window.scrollY > CONFIG.SCROLL_THRESHOLD;
    if(newScrolled !== state.isScrolled){
      state.isScrolled = newScrolled;
      ["navbar","backToTop"].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.toggle(id==="navbar"?"scrolled":"visible", newScrolled);
      });
    }
    // update active by scroll pos
    ["home","services","about","contact"].reverse().some(sectionId => {
      const sec = document.getElementById(sectionId);
      if(sec && sec.getBoundingClientRect().top <= CONFIG.SECTION_OFFSET){
        if(state.activeSection !== sectionId) updateActiveSection(sectionId);
        return true;
      }
    });
  }

  function toggleMobileMenu(){
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    const btn = document.getElementById("mobileMenuBtn"),
          menu = document.getElementById("mobileMenu"),
          overlay = document.getElementById("mobileOverlay");
    if(!validateElement(btn,"MenuBtn") || !validateElement(menu,"Menu") || !validateElement(overlay,"Overlay")) return;

    btn.classList.toggle("active",state.isMobileMenuOpen);
    menu.classList.toggle("active",state.isMobileMenuOpen);
    overlay.classList.toggle("active",state.isMobileMenuOpen);
    document.body.style.overflow = state.isMobileMenuOpen ? "hidden" : "";

    btn.setAttribute("aria-expanded",state.isMobileMenuOpen);
    menu.setAttribute("aria-hidden",!state.isMobileMenuOpen);

    if(state.activeDropdown) closeDropdown();
  }

  function toggleDropdown(name){
    if(typeof name !== "string") return;
    const trigger = document.querySelector(`[data-dropdown="${CSS.escape(name)}"]`);
    if(!trigger) return;
    if(state.activeDropdown === name){
      closeDropdown(); return;
    }
    closeDropdown();
    const container = trigger.closest(".dropdown-container");
    if(!validateElement(container,name)) return;

    state.activeDropdown = name;
    container.classList.add("active");
    trigger.setAttribute("aria-expanded","true");
  }

  function closeDropdown(){
    const name = state.activeDropdown;
    if(!name) return;
    const trigger = document.querySelector(`[data-dropdown="${CSS.escape(name)}"]`);
    if(trigger){
      const c = trigger.closest(".dropdown-container");
      if(c){
        c.classList.remove("active");
        trigger.setAttribute("aria-expanded","false");
      }
    }
    state.activeDropdown = null;
  }

  function handleKeyDown(e){
    if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName) ||
       document.activeElement.isContentEditable) return;

    switch(e.key){
      case "Home": e.preventDefault(); scrollToTop(); break;
      case "End": e.preventDefault(); window.scrollTo({top:document.documentElement.scrollHeight,behavior:"smooth"}); break;
      case "Escape":
        if(state.isMobileMenuOpen) toggleMobileMenu();
        if(state.activeDropdown) closeDropdown();
        break;
    }
  }

  function handleResize(){
    if(window.innerWidth > CONFIG.MOBILE_BREAKPOINT && state.isMobileMenuOpen){
      toggleMobileMenu();
    }
  }

  // --- FORM HANDLING ---
  function validateFormData(data){
    const errors = [];
    ["name","email","phone","property-address"].forEach(f => {
      if(!data[f] || !data[f].trim()) errors.push(`${f} is required`);
    });
    if(data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Invalid email format");
    if(data.phone && !/^[\d\s\-+()]{10,}$/.test(data.phone)) errors.push("Invalid phone number");
    return errors;
  }

  function handleFormSubmit(e){
    e.preventDefault();
    const form = e.target, data = Object.fromEntries(new FormData(form).entries());
    const errors = validateFormData(data);
    if(errors.length){
      showNotification(`Please fix: ${errors.join(', ')}`);
      return;
    }
    const sanitized = {};
    Object.entries(data).forEach(([k,v])=>{
      sanitized[k] = sanitizeHTML(v.trim());
    });
    if(typeof window.gtag==="function"){
      try{
        window.gtag("event","form_submit",{event_category:"Lead Generation",event_label:"Cash Offer Form",value:1});
      }catch(err){ console.error("Analytics error",err); }
    }
    console.log("Submitted:",sanitized);
    showNotification("Thank you! We’ll contact you within 24 hours with your cash offer.");
    form.reset();
  }

  function handleAddressFormSubmit(e){
    e.preventDefault();
    const addrEl = e.target.elements["property-address"];
    if(!addrEl) return;
    const addr = addrEl.value.trim();
    if(!addr) return showNotification("Please enter a property address.");
    if(addr.length < 10) return showNotification("Please enter a complete address.");
    if(typeof window.gtag==="function"){
      try{
        window.gtag("event","address_submit",{event_category:"Lead Generation",event_label:"Quick Address Form",value:1});
      }catch(err){ console.error("Analytics error",err); }
    }
    console.log("Address:",sanitizeHTML(addr));
    showNotification("Thank you! We’ll analyze your property and contact you soon.");
    e.target.reset();
  }

  // --- TESTIMONIALS RENDER ---
  function renderTestimonials(){
    const grid = document.getElementById("testimonialsGrid");
    if(!validateElement(grid,"TestimonialsGrid")) return;
    grid.innerHTML = testimonials.map(t=>{
      const text = sanitizeHTML(t.text),
            author = sanitizeHTML(t.author),
            loc = sanitizeHTML(t.location),
            init = author.charAt(0).toUpperCase();
      return `
        <div class="testimonial-card">
          <div class="testimonial-rating">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F1268a8aa36364ef795a07a801a639f41%2F2ca4d2d95beb49ea8dfac4bd2fd46469?format=webp&width=800"
                 alt="5 Star Rating" class="rating-img" loading="lazy">
          </div>
          <blockquote class="testimonial-text">"${text}"</blockquote>
          <footer class="testimonial-footer">
            <div class="testimonial-author">
              <div class="author-avatar" aria-hidden="true">${init}</div>
              <div class="author-info">
                <cite class="author-name">${author}</cite>
                <div class="author-location">${loc}</div>
              </div>
            </div>
          </footer>
        </div>
      `;
    }).join('');
  }

  // --- GRADIENT & ANIMATION STYLING ---
  function updateGradient(){
    const root = document.documentElement;
    if(!Array.isArray(state.colors) || state.colors.length < 4) {
      console.error("Invalid colors"); return;
    }
    state.colors.forEach((c,i)=>{
      if(/^#[0-9A-Fa-f]{6}$/.test(c)){
        root.style.setProperty(`--gradient-color-${i+1}`,c);
      }
    });
    if(typeof state.gradientAngle==="number")
      root.style.setProperty("--gradient-angle",`${state.gradientAngle}deg`);
    if(typeof state.animationSpeed==="number" && state.animationSpeed>0)
      root.style.setProperty("--animation-speed",`${state.animationSpeed}s`);
    if(typeof state.backgroundSize==="number" && state.backgroundSize>0)
      root.style.setProperty("--background-size",`${state.backgroundSize}%`);
  }

  function respectMotionPreferences(){
    if(!window.matchMedia) return;
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      document.documentElement.style.setProperty("--animation-speed","0s");
      document.documentElement.style.scrollBehavior = "auto";
    }
  }

  function initSmoothScrolling(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
      anchor.addEventListener("click",e=>{
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if(href && href !== "#" && href.startsWith("#")){
          const targ = document.querySelector(href);
          if(targ) targ.scrollIntoView({behavior:"smooth",block:"start"});
        }
      });
    });
  }

  function setupIntersectionObserver(){
    if(!("IntersectionObserver" in window)){
      console.warn("Observer not supported");
      return;
    }
    const obs = new IntersectionObserver((ents, ob)=>{
      ents.forEach(en=>{
        if(en.isIntersecting){
          en.target.classList.add("animate-on-scroll");
          ob.unobserve(en.target);
        }
      });
    },{threshold:0.1,rootMargin:"0px 0px -50px 0px"});
    document.querySelectorAll(".services-section, .process-section, .testimonials-section, .location-section")
      .forEach(el => obs.observe(el));
  }

  function animatePageLoad(){
    document.body.classList.add("loading");
    setTimeout(()=>{
      document.body.classList.remove("loading");
      document.querySelectorAll(".hero-title, .hero-description, .hero-image, .hero-subtext, .hero-cta, .hero-quote")
        .forEach((el, idx)=>{
          if(el){
            setTimeout(()=>{
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, idx * CONFIG.ANIMATION_DELAY);
          }
        });
    }, 100);
  }

  function checkStoredConsent(){
    try{
      const c = localStorage.getItem("cookieConsent");
      if(c) handleCookieConsent(c);
    }catch(e){ console.warn("Consent check error", e); }
  }

  function handleCookieConsent(type){
    if(!["all","essential"].includes(type)) return console.error("Invalid consent type");
    if(typeof window.gtag==="function"){
      try{
        window.gtag("consent","update",{
          analytics_storage: type==="all"?"granted":"denied",
          ad_storage: type==="all"?"granted":"denied"
        });
      }catch(e){console.error("gtag error",e);}
    }
    state.showCookieBanner = false;
    const banner = document.getElementById("cookieBanner");
    if(banner) banner.classList.add("hidden");
    try{
      localStorage.setItem("cookieConsent",type);
    }catch(e){ console.warn("Consent save error", e); }
  }

  // --- INIT & EVENT BINDING ---
  function init(){
    try{
      document.querySelectorAll("[data-section]").forEach(el=>{
        el.addEventListener("click",e=>{
          e.preventDefault();
          scrollToSection(el.getAttribute("data-section"));
        });
      });
      ["mobileMenuBtn","mobileOverlay","acceptAllCookies","essentialOnlyCookies","backToTop"]
        .forEach(id=>{
          const el = document.getElementById(id);
          if(el){
            const handler = {
              mobileMenuBtn: toggleMobileMenu,
              mobileOverlay: toggleMobileMenu,
              acceptAllCookies: () => handleCookieConsent("all"),
              essentialOnlyCookies: () => handleCookieConsent("essential"),
              backToTop: scrollToTop
            }[id];
            el.addEventListener("click", e => {
              e.preventDefault();
              handler(e);
            });
          }
        });
      document.querySelectorAll("[data-dropdown]").forEach(el=>{
        el.addEventListener("click",e=>{
          e.preventDefault();
          toggleDropdown(el.getAttribute("data-dropdown"));
        });
      });
      document.addEventListener("click", e=>{
        if(!e.target.closest(".dropdown-container") && state.activeDropdown){
          closeDropdown();
        }
      });
      const cf = document.getElementById("contactForm");
      if(cf) cf.addEventListener("submit", handleFormSubmit);
      const af = document.getElementById("addressForm");
      if(af) af.addEventListener("submit", handleAddressFormSubmit);
      document.querySelectorAll(".dropdown-item").forEach(item=>{
        item.addEventListener("click",e=>{
          e.preventDefault();
          const href = item.getAttribute("href");
          if(href.startsWith("#")) scrollToSection(href.slice(1));
        });
      });

      setupIntersectionObserver();
      renderTestimonials();
      updateGradient();
      initSmoothScrolling();
      respectMotionPreferences();
      checkStoredConsent();

      window.addEventListener("scroll", debounce(handleScroll, CONFIG.DEBOUNCE_DELAY), {passive:true});
      window.addEventListener("resize", debounce(handleResize, 100), {passive:true});
      window.addEventListener("keydown", handleKeyDown);

      animatePageLoad();
      handleScroll();
      console.log("✅ Cash For Your Home app initialized!");
    } catch(err){
      console.error("Init error", err);
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // --- EXPOSE PUBLIC METHODS ---
  window.CashForYourHome = {
    scrollToSection,
    showNotification,
    state: Object.freeze(state)
  };

})();
