/**
 * Lee Berry Café — lightweight floating blueberry emoji animation.
 * Replaces the previous 3D glass/chalice and procedural berry scene.
 */
(() => {
  const container = document.getElementById('hero-webgl-canvas');
  if (!container || container.dataset.berryAnimationReady === 'true') return;
  container.dataset.berryAnimationReady = 'true';
  container.classList.add('berry-emoji-field');
  container.setAttribute('aria-label', 'Floating blueberry decorations');
  container.setAttribute('aria-hidden', 'true');

  const berries = [
    { x: 76, y: 20, size: 54, delay: -1, duration: 11, drift: 34, rotate: 18 },
    { x: 88, y: 39, size: 40, delay: -5, duration: 13, drift: 24, rotate: -22 },
    { x: 68, y: 67, size: 48, delay: -8, duration: 12, drift: 30, rotate: 26 },
    { x: 94, y: 76, size: 34, delay: -3, duration: 10, drift: 20, rotate: -16 },
    { x: 57, y: 15, size: 30, delay: -6, duration: 14, drift: 18, rotate: 14 },
    { x: 81, y: 88, size: 42, delay: -10, duration: 12, drift: 26, rotate: -28 },
    { x: 63, y: 43, size: 27, delay: -2, duration: 15, drift: 16, rotate: 20 }
  ];

  berries.forEach((berry, index) => {
    const el = document.createElement('span');
    el.className = 'floating-blueberry-emoji';
    el.textContent = '🫐';
    el.style.setProperty('--berry-x', `${berry.x}%`);
    el.style.setProperty('--berry-y', `${berry.y}%`);
    el.style.setProperty('--berry-size', `${berry.size}px`);
    el.style.setProperty('--berry-delay', `${berry.delay}s`);
    el.style.setProperty('--berry-duration', `${berry.duration}s`);
    el.style.setProperty('--berry-drift', `${berry.drift}px`);
    el.style.setProperty('--berry-rotate', `${berry.rotate}deg`);
    el.style.setProperty('--berry-index', index);
    container.appendChild(el);
  });
})();
