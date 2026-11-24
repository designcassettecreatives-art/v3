/**
 * Lee Berry Café - Master Client Interactions Controller
 * Powers Lenis smooth scrolling, GSAP ScrollTriggers, Custom Magnetic Cursor,
 * Web Audio Café Synthesizer, 3D Card Tilt, and Interactive Modals
 */

import { BRAND_INFO, MUST_TRY_SPECIALS, PRODUCTS } from './products-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  initSmoothScroll();

  // 2. Initialize Custom Magnetic Cursor
  initCustomCursor();

  // 3. Initialize Ambient Sound Synthesizer
  initAmbientSound();

  // 4. Initialize 3D Hero Scene Layer
  initHeroScene();

  // 5. Render Must-Try Specials on Home Page
  renderHomeSpecials();

  // 6. Setup ScrollTriggers & Reveal Animations
  initScrollAnimations();

  // 7. Setup Modal & Toast Handlers
  setupModalSystem();

  // 8. Mobile Navigation Toggle
  setupMobileNav();

  // 9. Contact Form Simulation
  setupContactForm();
});

/* --------------------------------------------------------------------------
   1. Smooth Scroll (Lenis)
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const header = document.querySelector('.site-header');
  const updateHeader = (scrollY) => {
    if (!header) return;
    header.classList.toggle('scrolled', scrollY > 40);
  };

  // Respect accessibility preferences and retain native scrolling when motion is reduced.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof Lenis === 'undefined') {
    window.addEventListener('scroll', () => updateHeader(window.scrollY), { passive: true });
    updateHeader(window.scrollY);
    return;
  }

  const lenis = new Lenis({
    duration: 1.35,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.15,
    anchors: true
  });

  // Keep GSAP/ScrollTrigger in lockstep with Lenis for fluid, correctly timed reveals.
  if (typeof gsap !== 'undefined') {
    lenis.on('scroll', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update(); });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  lenis.on('scroll', ({ scroll }) => updateHeader(scroll));
  window.lenis = lenis;
  updateHeader(window.scrollY);
}

/* --------------------------------------------------------------------------
   2. Custom Magnetic Cursor
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower || window.innerWidth <= 900) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states on interactive targets
  const interactiveEls = document.querySelectorAll('a, button, .musttry-card, .cat-showcase-item, .story-product-row, input, textarea');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   3. Ambient Sound Synthesizer (Web Audio API)
   -------------------------------------------------------------------------- */
function initAmbientSound() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let oscillators = [];

  function startSound() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);
    masterGain.connect(audioCtx.destination);

    // Warm peaceful chord frequencies (Eb Major 9 / Berry Café Vibe)
    const freqs = [155.56, 196.00, 233.08, 293.66, 349.23];

    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
      const oscGain = audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.05, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.value = 0.25 / freqs.length;

      if (panner) {
        panner.pan.setValueAtTime((idx / (freqs.length - 1)) * 1.6 - 0.8, audioCtx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(panner);
        panner.connect(masterGain);
      } else {
        osc.connect(oscGain);
        oscGain.connect(masterGain);
      }

      osc.start();
      oscillators.push(osc);
    });

    isPlaying = true;
    soundBtn.classList.add('playing');
    soundBtn.setAttribute('title', 'Mute Café Ambience');
    soundBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    `;
    showToast('🎵 Café Ambience Playing — Sip the happiness');
  }

  function stopSound() {
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        oscillators.forEach(osc => { try { osc.stop(); } catch(e){} });
        oscillators = [];
      }, 1300);
    }
    isPlaying = false;
    soundBtn.classList.remove('playing');
    soundBtn.setAttribute('title', 'Play Café Ambience');
    soundBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
    `;
    showToast('Sound Muted');
  }

  soundBtn.addEventListener('click', () => {
    if (isPlaying) stopSound();
    else startSound();
  });
}

/* --------------------------------------------------------------------------
   4. Initialize 3D Hero Scene Layer
   -------------------------------------------------------------------------- */
function initHeroScene() {
  const container = document.getElementById('hero-webgl-canvas');
  if (!container || typeof LeeBerryHeroScene === 'undefined') return;

  const heroScene = new LeeBerryHeroScene('hero-webgl-canvas');

  // Deconstruct Flavor Explosion Toggle
  const explodeBtn = document.getElementById('btn-deconstruct-3d');
  if (explodeBtn) {
    explodeBtn.addEventListener('click', () => {
      const isExploded = heroScene.toggleExplosion();
      explodeBtn.innerHTML = isExploded 
        ? `<span>Reassemble Creation</span><span class="hud-action-icon">↺</span>`
        : `<span>Deconstruct 3D Flavours</span><span class="hud-action-icon">✦</span>`;
      
      showToast(isExploded ? 'Exploded 3D Flavor Orbit' : 'Ingredients Reassembled');
    });
  }
}

/* --------------------------------------------------------------------------
   5. Render Must-Try Specials (Home Page)
   -------------------------------------------------------------------------- */
function renderHomeSpecials() {
  const grid = document.getElementById('must-try-grid');
  if (!grid) return;

  grid.innerHTML = MUST_TRY_SPECIALS.map((item) => {
    return `
      <article class="musttry-card" data-tilt data-id="${item.id}">
        <div class="musttry-thumb-wrap" data-action="quickview" data-product="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="musttry-thumb" loading="lazy">
          <span class="musttry-badge">${item.badge}</span>
          <span class="musttry-price-pill">${item.price}</span>
        </div>
        <div class="musttry-card-body">
          <span class="musttry-tagline">${item.tagline}</span>
          <h3 class="musttry-title" data-action="quickview" data-product="${item.id}">${item.name}</h3>
          <p class="musttry-desc">${item.highlight}</p>
          <div class="musttry-card-footer">
            <button class="cta-button cta-button-outline" style="padding: 0.5rem 1.2rem; font-size: 0.8rem;" data-action="quickview" data-product="${item.id}">
              <span>View Recipe</span>
              <span>→</span>
            </button>
            <a href="flavours.html?cat=milkshakes" style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">
              Browse Category
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Apply 3D Tilt Effect on Desktop
  initCard3DTilt();
}

function initCard3DTilt() {
  if (window.innerWidth <= 900) return;
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   6. ScrollTrigger Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero Headline Entrance
  gsap.from('.hero-headline', {
    y: 35,
    opacity: 0,
    duration: 1.0,
    delay: 0.3,
    ease: 'power3.out'
  });

  gsap.from('.hero-description', {
    y: 25,
    opacity: 0,
    duration: 0.9,
    delay: 0.5,
    ease: 'power3.out'
  });

  gsap.from('.hero-cta-group', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.7,
    ease: 'power3.out'
  });

  // Section Headers ScrollTrigger
  const headers = document.querySelectorAll('.section-title');
  headers.forEach((h) => {
    gsap.from(h, {
      scrollTrigger: {
        trigger: h,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Recalculate trigger positions after fonts and media settle.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/* --------------------------------------------------------------------------
   7. Modal & Toast Notification System
   -------------------------------------------------------------------------- */
function setupModalSystem() {
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modal) return;

  // Open modal on click
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action="quickview"]');
    if (target) {
      const prodId = target.getAttribute('data-product');
      const prod = PRODUCTS.find(p => p.id === prodId) || 
                   MUST_TRY_SPECIALS.find(p => p.id === prodId);
      if (prod) openProductModal(prod);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal());
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openProductModal(prod) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const fullProd = PRODUCTS.find(p => p.id === prod.id) || prod;

  document.getElementById('modal-img').src = fullProd.image;
  document.getElementById('modal-img').alt = fullProd.name;
  document.getElementById('modal-title').textContent = fullProd.name;
  document.getElementById('modal-price').textContent = typeof fullProd.price === 'number' ? `₹${fullProd.price}` : fullProd.price;
  document.getElementById('modal-desc').textContent = fullProd.fullDesc || fullProd.shortDesc || fullProd.highlight;

  // Render Tags
  const tagsWrap = document.getElementById('modal-tags');
  if (tagsWrap) {
    const tags = fullProd.dietary || ['Vegetarian', 'Zero Preservatives'];
    tagsWrap.innerHTML = tags.map(t => `
      <span style="font-size: 0.72rem; font-weight: 600; padding: 0.25rem 0.65rem; border-radius: 9999px; background: rgba(59, 130, 246, 0.15); color: var(--berry-primary); border: 1px solid rgba(59, 130, 246, 0.3);">
        ${t}
      </span>
    `).join('');
  }

  // Render Ingredients
  const ingWrap = document.getElementById('modal-ingredients');
  if (ingWrap) {
    const ings = fullProd.ingredients || ['Fresh Ingredients', 'Pure Dairy Base'];
    ingWrap.innerHTML = ings.map(i => `
      <span style="font-size: 0.76rem; padding: 0.25rem 0.6rem; background: rgba(255, 255, 255, 0.06); border-radius: 6px; color: #fff;">
        ${i}
      </span>
    `).join('');
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

export function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3400);
}

/* --------------------------------------------------------------------------
   8. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function setupMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* --------------------------------------------------------------------------
   9. Contact Form Simulation
   -------------------------------------------------------------------------- */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    showToast(`✨ Thank you, ${name}! Your note has been received by Lee Berry Café team.`);
    form.reset();
  });
}

window.showToast = showToast;
