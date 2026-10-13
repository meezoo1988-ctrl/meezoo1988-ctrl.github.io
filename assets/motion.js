'use strict';
// Scroll reveals, counters, progress bar, pointer glow and light parallax.
// Uses only textContent / classList / CSS custom properties (no HTML injection).
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Extra elements that animate in, staggered within their group.
  const groups = ['.offer-card', '.skill-tile', '.timeline-row', '.cert-list article', '.contact-data a', '.value-chips span', '.quick-facts li'];
  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal', 'reveal-item');
      el.style.setProperty('--d', `${Math.min(i, 8) * 70}ms`);
    });
  });
  document.querySelectorAll('.section-heading-row, .cert-copy, .offer-intro').forEach(el => el.classList.add('reveal'));

  const reveals = [...document.querySelectorAll('.reveal')];
  const counters = [...document.querySelectorAll('[data-count]')];

  function countUp(el) {
    const match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match || reduce) return;
    const end = Number(match[1]);
    const suffix = match[2];
    const start = performance.now();
    const duration = 1400;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(end * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));

    const co = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
  }

  // Reading progress + header state + hero parallax, batched per frame.
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const header = document.querySelector('.site-header');
  const heroScene = document.querySelector('.hero-scene');
  let pending = false;
  function onFrame() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
    header?.classList.toggle('scrolled', y > 10);
    if (heroScene && !reduce && y < 900) heroScene.style.setProperty('--py', `${(y * 0.12).toFixed(1)}px`);
    pending = false;
  }
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(onFrame); }
  }, { passive: true });
  onFrame();

  // Soft spotlight that follows the pointer on cards (mouse/pen only).
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.dash-card, .project-card, .offer-card, .cert-list article').forEach(card => {
      card.classList.add('glow-card');
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });
  }
})();
