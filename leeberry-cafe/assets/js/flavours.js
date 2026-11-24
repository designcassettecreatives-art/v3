/**
 * Lee Berry Café - Flavours Page Storytelling Engine (flavours.html)
 * Powers cinematic scroll-based product presentations, GSAP ScrollTrigger parallax,
 * URL category deep-linking, live search, and interactive modal views
 */

import { CATEGORIES, PRODUCTS } from './products-data.js';
import { showToast } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  function smoothScrollTo(target) {
    if (!target) return;
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(target, { offset: -110, duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  }
  // Check URL Query parameter for direct category navigation (e.g. flavours.html?cat=juices)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat') || 'all';

  let currentCategory = CATEGORIES.some(c => c.id === initialCat) ? initialCat : 'all';
  let searchQuery = '';

  const pillsContainer = document.getElementById('category-pills-wrap');
  const searchInput = document.getElementById('flavour-search-input');
  const spotlightContainer = document.getElementById('spotlight-spread-wrap');
  const productsContainer = document.getElementById('story-products-wrap');

  // Category pills act as smooth jump links to each horizontal menu rail.
  function renderCategoryPills() {
    if (!pillsContainer) return;
    pillsContainer.innerHTML = CATEGORIES.map((cat) => `
      <button class="cat-filter-btn ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.label}</span><span style="font-size:.72rem;opacity:.7;">(${cat.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.id).length})</span>
      </button>`).join('');
    pillsContainer.querySelectorAll('.cat-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;
        renderCategoryPills();
        if (currentCategory === 'all') {
          document.querySelectorAll('.menu-category-section').forEach(section => section.hidden = false);
          smoothScrollTo(document.querySelector('.storytelling-showcase'));
        } else {
          document.querySelectorAll('.menu-category-section').forEach(section => {
            section.hidden = section.dataset.category !== currentCategory;
          });
          smoothScrollTo(document.getElementById(`menu-category-${currentCategory}`));
        }
      });
    });
  }

  function renderProductCard(prod) {
    return `
      <article class="menu-product-card" data-story-item data-id="${prod.id}">
        <div class="menu-product-media" data-action="quickview" data-product="${prod.id}">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          <span class="menu-product-tag">${prod.tag || prod.categoryLabel}</span>
        </div>
        <div class="menu-product-body">
          <div class="menu-product-topline"><h3 class="menu-product-title">${prod.name}</h3><span class="menu-product-price">₹${prod.price}</span></div>
          <p class="menu-product-desc">${prod.shortDesc}</p>
          <div class="menu-product-actions">
            <button class="cta-button cta-button-primary" data-action="order" data-product="${prod.id}">+ Add to order</button>
            <button class="cta-button cta-button-outline" data-action="quickview" data-product="${prod.id}">Details ↗</button>
          </div>
        </div>
      </article>`;
  }

  // Render the menu in category-wise horizontal carousels.
  function filterAndRenderStorytelling() {
    if (!productsContainer) return;
    const q = searchQuery.trim().toLowerCase();
    const visibleCategories = CATEGORIES.filter(cat => cat.id !== 'all');
    const sections = visibleCategories.map(cat => {
      const items = PRODUCTS.filter(prod => prod.category === cat.id && (!q ||
        prod.name.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q) ||
        prod.shortDesc.toLowerCase().includes(q) || (prod.ingredients || []).some(i => i.toLowerCase().includes(q))));
      if (!items.length) return '';
      return `
        <section class="menu-category-section" id="menu-category-${cat.id}" data-category="${cat.id}" ${currentCategory !== 'all' && currentCategory !== cat.id ? 'hidden' : ''}>
          <div class="menu-category-heading">
            <div><h2>${cat.label}</h2><p>${cat.desc || 'Find your next favourite at Lee Berry Café.'}</p></div>
            <span class="menu-category-count">${items.length} ${items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div class="menu-horizontal-track" aria-label="${cat.label} menu items">${items.map(renderProductCard).join('')}</div>
        </section>`;
    }).join('');
    productsContainer.innerHTML = sections || `<div class="menu-empty-state"><p>No creations found matching “${searchQuery}”.</p><button class="cta-button cta-button-outline" id="btn-clear-search">Clear search</button></div>`;
    document.getElementById('btn-clear-search')?.addEventListener('click', () => {
      searchQuery = ''; if (searchInput) searchInput.value = '';
      currentCategory = 'all'; renderCategoryPills(); filterAndRenderStorytelling();
    });
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const cards = productsContainer.querySelectorAll('.menu-product-card');
      cards.forEach((card) => {
        gsap.fromTo(card,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: .72, ease: 'power3.out', clearProps: 'transform',
            scrollTrigger: { trigger: card, start: 'top 92%', once: true }
          }
        );
      });
      requestAnimationFrame(() => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    }
  }

  // 5. Live Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndRenderStorytelling();
    });
  }

  // 6. Order Button Handler
  document.addEventListener('click', (e) => {
    const orderBtn = e.target.closest('[data-action="order"]');
    if (orderBtn) {
      const prodId = orderBtn.getAttribute('data-product');
      const prod = PRODUCTS.find(p => p.id === prodId);
      if (prod) {
        showToast(`🥤 ${prod.name} (₹${prod.price}) added to counter order!`);
      }
    }
  });

  // Initial Boot
  renderCategoryPills();
  filterAndRenderStorytelling();
});
