/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Theme  ·  eco-theme.js
   Shared light/dark theme control for the content pages.
     • Auto (default) — light 06:00–18:00, dark otherwise; re-checks
       each minute so it flips on its own at sunrise/sunset.
     • Light / Dark — manual override, remembered in localStorage
       under "rk-theme" (shared across the whole site).
   A matching inline snippet in each page's <head> sets data-theme
   before first paint to avoid a flash; this file adds the toggle.
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  var KEY = "rk-theme";
  var ORDER = ["auto", "light", "dark"];
  var root = document.documentElement;

  // The theme NAMES this page uses for light/dark can be overridden via
  // data-light / data-dark on the script tag (e.g. monastery/retreat use
  // "paper"/"night"). The stored mode stays the generic auto/light/dark.
  var tag = document.currentScript ||
            document.querySelector('script[src*="eco-theme.js"]') ||
            document.getElementById("eco-theme");
  var LIGHT = (tag && tag.getAttribute("data-light")) || "light";
  var DARK  = (tag && tag.getAttribute("data-dark"))  || "dark";

  var AUTO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var SUN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M3.5 3.5l1.8 1.8M18.7 18.7l1.8 1.8M2 12h2.5M19.5 12H22M3.5 20.5l1.8-1.8M18.7 5.3l1.8-1.8"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z"/></svg>';

  function timeTheme() { var h = new Date().getHours(); return (h >= 6 && h < 18) ? LIGHT : DARK; }
  function getMode() {
    try { var m = localStorage.getItem(KEY); if (ORDER.indexOf(m) !== -1) return m; } catch (e) {}
    return "auto";
  }
  function apply(m) {
    var t = (m === "auto") ? timeTheme() : (m === "dark" ? DARK : LIGHT);
    root.setAttribute("data-theme", t);
    root.setAttribute("data-theme-mode", m);
  }

  function mount() {
    if (document.querySelector(".eco-theme-toggle")) return;
    var btn = document.createElement("button");
    btn.className = "eco-theme-toggle";
    btn.type = "button";

    function paint() {
      var m = getMode();
      btn.innerHTML = m === "auto" ? AUTO : (m === "dark" ? MOON : SUN);
      var lbl = m === "auto" ? "Theme: Auto (by time) — tap for Light"
              : m === "light" ? "Theme: Light — tap for Dark"
              : "Theme: Dark — tap for Auto";
      btn.setAttribute("title", lbl);
      btn.setAttribute("aria-label", lbl);
    }

    apply(getMode());   // re-sync with the head snippet
    paint();

    btn.addEventListener("click", function () {
      var next = ORDER[(ORDER.indexOf(getMode()) + 1) % ORDER.length];
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next); paint();
    });
    document.body.appendChild(btn);

    // While on Auto, flip on its own when the clock crosses 06:00 / 18:00.
    setInterval(function () {
      if (getMode() !== "auto") return;
      var t = timeTheme();
      if (root.getAttribute("data-theme") !== t) root.setAttribute("data-theme", t);
    }, 60000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
