'use strict';
// Runs before first paint: enables motion styles, applies the saved theme
// (no light/dark flash) and blocks the page from being framed (clickjacking).
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  if (window.top !== window.self) {
    root.classList.add('framed');
    try { window.top.location.replace(window.self.location.href); } catch (e) {}
  }
  try {
    if (localStorage.getItem('mazen-theme') === 'light') root.classList.add('warm-mode');
  } catch (e) {}
})();
