'use strict';
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLayout = window.matchMedia('(max-width: 1150px)');
function setMenu(open, restoreFocus = false) {
  if (!menuButton || !mobileMenu) return;
  mobileMenu.classList.toggle('open', open);
  mobileMenu.inert = !open;
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل');
  if (restoreFocus) menuButton.focus();
}
setMenu(false);
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (event.target instanceof Element && !event.target.closest('.site-header')) setMenu(false);
});
mobileLayout.addEventListener('change', () => setMenu(false));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const themeToggle = document.getElementById('themeToggle');
function setTheme(light) {
  document.body.classList.toggle('warm-mode', light);
  themeToggle?.setAttribute('aria-pressed', String(light));
  themeToggle?.setAttribute('aria-label', light ? 'تفعيل المظهر الداكن' : 'تفعيل المظهر الفاتح');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f7f3ec' : '#10100e');
}
try { setTheme(localStorage.getItem('mazen-theme') === 'light'); } catch { setTheme(false); }
themeToggle?.addEventListener('click', () => {
  const light = !document.body.classList.contains('warm-mode');
  setTheme(light);
  try { localStorage.setItem('mazen-theme', light ? 'light' : 'dark'); } catch {}
});
const links = [...document.querySelectorAll('.desktop-nav a, .mobile-menu a')];
const targets = [...new Set(links.map(link => link.hash))].map(hash => ({ hash, element: document.getElementById(hash.slice(1)) })).filter(target => target.element);
let scheduled = false;
function updateNavigation() {
  const passed = targets.filter(target => target.hash !== '#top' && target.element.getBoundingClientRect().top <= 160);
  passed.sort((a, b) => b.element.getBoundingClientRect().top - a.element.getBoundingClientRect().top);
  let active = passed[0]?.hash || '#top';
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) active = '#contact';
  links.forEach(link => {
    link.classList.toggle('active', link.hash === active);
    if (link.hash === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

// Count completed working months, excluding gaps between documented roles.
const experienceYears = document.getElementById('experienceYears');
if (experienceYears) {
  const now = new Date();
  const currentMonth = now.getFullYear() * 12 + now.getMonth();
  const priorMonths = (2017 * 12 + 7) - (2011 * 12 + 7) + 1;
  const currentMonths = Math.max(0, currentMonth - (2018 * 12));
  experienceYears.textContent = `${Math.floor((priorMonths + currentMonths) / 12)}+`;
}
