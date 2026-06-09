/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Theme  ·  eco-theme.js
   Light/dark theme control for the content pages.
     • Fresh visitors follow the time of day (light 06:00–18:00, dark
       otherwise) and re-check each minute so it flips on its own.
     • The Sun/Moon toggle is a simple manual switch: one tap forces
       light or dark and remembers it (localStorage "rk-theme").
   A matching inline snippet in each page's <head> sets data-theme
   before first paint to avoid a flash; this file adds the toggle.
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  var KEY = "rk-theme";
  var root = document.documentElement;

  // The theme NAMES this page uses for light/dark can be overridden via
  // data-light / data-dark on the script tag (e.g. monastery/retreat use
  // "paper"/"night"). The stored value stays the generic light/dark.
  var tag = document.currentScript ||
            document.querySelector('script[src*="eco-theme.js"]') ||
            document.getElementById("eco-theme");
  var LIGHT = (tag && tag.getAttribute("data-light")) || "light";
  var DARK  = (tag && tag.getAttribute("data-dark"))  || "dark";

  var SUN  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M3.5 3.5l1.8 1.8M18.7 18.7l1.8 1.8M2 12h2.5M19.5 12H22M3.5 20.5l1.8-1.8M18.7 5.3l1.8-1.8"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2z"/></svg>';

  function timeTheme() { var h = new Date().getHours(); return (h >= 6 && h < 18) ? LIGHT : DARK; }
  function getMode() {   // "light" | "dark" if the visitor chose; else "auto" (follow time)
    try { var m = localStorage.getItem(KEY); if (m === "light" || m === "dark") return m; } catch (e) {}
    return "auto";
  }
  function resolved() {
    var m = getMode();
    return m === "auto" ? timeTheme() : (m === "dark" ? DARK : LIGHT);
  }
  function apply() {
    root.setAttribute("data-theme", resolved());
    root.setAttribute("data-theme-mode", getMode());
  }

  function mount() {
    if (document.querySelector(".eco-theme-toggle")) return;
    var btn = document.createElement("button");
    btn.className = "eco-theme-toggle";
    btn.type = "button";

    function isDark() { return resolved() === DARK; }
    function paint() {
      btn.innerHTML = isDark() ? MOON : SUN;   // shows the current theme
      var lbl = isDark() ? "Dark theme — tap for light" : "Light theme — tap for dark";
      btn.setAttribute("title", lbl);
      btn.setAttribute("aria-label", lbl);
    }

    apply();   // re-sync with the head snippet
    paint();

    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";   // flip to the opposite, as a sticky manual choice
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(); paint();
    });
    document.body.appendChild(btn);

    // Fresh visitors (no manual choice) keep following the clock — re-check
    // each minute so it flips on its own at 06:00 / 18:00.
    setInterval(function () {
      if (getMode() !== "auto") return;
      var t = timeTheme();
      if (root.getAttribute("data-theme") !== t) { root.setAttribute("data-theme", t); paint(); }
    }, 60000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
