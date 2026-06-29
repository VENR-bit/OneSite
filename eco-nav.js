/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Navigation  ·  eco-nav.js
   Injects a consistent "Explore" launcher + section menu onto
   every page so visitors can move around the ecosystem and always
   get home. Self-contained, no dependencies.

   Each host page includes it like:
     <link rel="stylesheet" href="<ROOT>eco-nav.css">
     <script id="eco-nav" src="<ROOT>eco-nav.js"
             data-root="<ROOT>" data-current="<id>" defer></script>
   where <ROOT> is the relative path back to the site root
   ("" at root, "../" for depth-1 pages, "../../" for projects/*)
   and <id> marks the current section (for highlighting).
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var tag = document.getElementById("eco-nav") ||
            document.currentScript ||
            (function () { var s = document.querySelectorAll('script[src*="eco-nav.js"]'); return s[s.length - 1]; })();
  var ROOT = (tag && tag.getAttribute("data-root")) || "";
  var CURRENT = (tag && tag.getAttribute("data-current")) || "";

  // ── Kiosk idle return ───────────────────────────────────────
  // In the installed kiosk app (PWA standalone), if a visitor wanders off the
  // dashboard and leaves a page idle, return them to the dashboard so the next
  // person starts fresh. Any interaction resets the timer; normal browser
  // visitors (not standalone) are never redirected.
  (function kioskIdleReturn() {
    var standalone =
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
    if (!standalone) return;                                     // installed kiosk only
    if (location.pathname.indexOf("/dashboard") !== -1) return;  // already on the dashboard
    var IDLE_MS = 120000;                                        // 2 minutes of no interaction
    var DASH = ROOT + "dashboard/";
    var timer;
    function go() {
      // Don't interrupt an open media player. Audio/video plays inside a
      // cross-origin Google Drive /preview iframe, whose playback can't reset
      // this timer — so if a player is open (audio library, Dhamma Talks),
      // defer the return instead of navigating away mid-listen.
      if (document.querySelector('iframe[src*="drive.google.com"]')) { reset(); return; }
      location.href = DASH;
    }
    function reset() { clearTimeout(timer); timer = setTimeout(go, IDLE_MS); }
    ["pointerdown", "touchstart", "mousemove", "keydown", "scroll", "wheel", "click"].forEach(function (ev) {
      window.addEventListener(ev, reset, { passive: true });
    });
    document.addEventListener("visibilitychange", function () { if (!document.hidden) reset(); });
    reset();
  })();

  var MAIN = [
    { id: "home",        href: "",                 en: "Home",                si: "මුල් පිටුව" },
    { id: "monastery",   href: "monastery/",            en: "Monastery",           si: "ආරණ්‍ය සේනාසනය" },
    { id: "retreat",     href: "retreat-center/",              en: "Retreat Program",     si: "භාවනා වැඩසටහන" },
    { id: "booking",     href: "book-your-stay/",              en: "Book Your Stay",      si: "වෙන් කරවා ගැනීම" },
    { id: "reviews",     href: "reviews/",              en: "Reviews",             si: "ඇගයීම්" },
    { id: "news",        href: "news-and-events/",                 en: "News & Events",       si: "ප්‍රවෘත්ති සහ සිදුවීම්" },
    { id: "gallery",     href: "gallery/",              en: "Gallery",             si: "ඡායාරූප" },
    { id: "videos",      href: "videos/",               en: "Video Gallery",       si: "වීඩියෝ" },
    { id: "donate",      href: "donate/",               en: "Donate",              si: "පරිත්‍යාග" },
    { id: "contact",     href: "contact/",              en: "Contact",             si: "සම්බන්ධ වන්න" }
  ];
  var PROJECTS = [
    { id: "projects",     href: "projects/",                en: "All Projects",  si: "ව්‍යාපෘති" },
    { id: "library-cafe", href: "projects/library-cafe/",   en: "Library Café",  si: "පුස්තකාල කැෆේ" },
    { id: "threestory",   href: "projects/threestory/",     en: "ThreeStory",    si: "තෙමහල් ගොඩනැගිල්ල" },
    { id: "road-project", href: "projects/road-project/",   en: "Road Project",  si: "මාර්ග ව්‍යාපෘතිය" },
    { id: "requirements", href: "requirements/",            en: "Monastery Requirements", si: "ආරණ්‍ය අවශ්‍යතා" }
  ];
  // Libraries — its own labelled section near the bottom.
  var LIBRARIES = [
    { id: "ebooks",          href: "ebooks/",           en: "E-Book Library",          si: "ඊ-පොත් පුස්තකාලය" },
    { id: "dhamma-talks",    href: "dhamma-talks/",     en: "Dhamma Talks (English)",  si: "ධර්ම දේශනා (ඉංග්‍රීසි)" },
    { id: "dhamma-talks-si", href: "dhamma-talks/si/",  en: "Dhamma Talks (Sinhala)",  si: "ධර්ම දේශනා (සිංහල)" },
    { id: "audio-library",   href: "audio-library/",    en: "Audio Library",           si: "ශ්‍රව්‍ය පුස්තකාලය" }
  ];
  var BOTTOM = [
    { id: "dashboard",   href: "dashboard/",            en: "Dashboard",           si: "උපකරණ පුවරුව" }
  ];

  // Explore mark = the official Rideekanda logo, rendered via CSS mask so it
  // inherits currentColor (the accent) and themes correctly — same logo the
  // dashboard centre uses. ROOT makes the path correct at any page depth.
  var LOGO_URL = ROOT + 'rideekanda-logo.svg';
  var LOTUS = '<span style="display:block;width:100%;height:100%;' +
    'background-color:currentColor;' +
    '-webkit-mask:url(' + LOGO_URL + ') center/contain no-repeat;' +
    'mask:url(' + LOGO_URL + ') center/contain no-repeat;"></span>';

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }

  function buildLink(item) {
    var a = document.createElement("a");
    a.className = "eco-link" + (item.id === CURRENT ? " is-current" : "");
    a.href = item.id === CURRENT ? "javascript:void 0" : (ROOT + item.href);
    if (item.id === CURRENT) a.setAttribute("aria-current", "page");
    a.appendChild(el("span", "eco-dot"));
    var tx = el("span", "eco-text");
    tx.appendChild(el("span", "eco-en", item.en));
    tx.appendChild(el("span", "eco-si", item.si));
    a.appendChild(tx);
    return a;
  }

  function buildSection(label, items) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el("div", "eco-sec-label", label));
    var grid = el("div", "eco-grid");
    items.forEach(function (it) { grid.appendChild(buildLink(it)); });
    frag.appendChild(grid);
    return frag;
  }

  function build() {
    var wrap = el("div", "eco-root");

    var launch = el("button", "eco-launch");
    launch.type = "button";
    launch.setAttribute("aria-label", "Explore Rideekanda");
    launch.innerHTML = '<span class="eco-mark">' + LOTUS + '</span><span class="eco-launch-label">Explore</span>';

    var overlay = el("div", "eco-overlay");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Rideekanda ecosystem navigation");

    var panel = el("div", "eco-panel");
    var head = el("div", "eco-head");
    head.innerHTML = '<h2 class="eco-title">Rideekanda<small>රිදීකන්ද ආරණ්‍ය සේනාසනය</small></h2>';
    var close = el("button", "eco-close", "&times;");
    close.type = "button"; close.setAttribute("aria-label", "Close menu");
    head.appendChild(close);
    panel.appendChild(head);
    function divider() {
      var d = el("div", "eco-divider");
      d.style.cssText = "height:1px;background:var(--eco-line, rgba(255,255,255,0.18));margin:20px 0 16px;";
      return d;
    }
    function buildGrid(items) {
      var g = el("div", "eco-grid");
      items.forEach(function (it) { g.appendChild(buildLink(it)); });
      return g;
    }
    panel.appendChild(buildSection("Explore the Monastery", MAIN));
    panel.appendChild(buildSection("Projects", PROJECTS));
    panel.appendChild(buildSection("Libraries", LIBRARIES));
    // Dashboard on its own at the bottom, under a divider line.
    panel.appendChild(divider());
    panel.appendChild(buildGrid(BOTTOM));
    panel.appendChild(el("div", "eco-foot", "Rideekanda Forest Monastery · Matale, Sri Lanka"));
    overlay.appendChild(panel);

    wrap.appendChild(launch);
    wrap.appendChild(overlay);
    document.body.appendChild(wrap);

    function open() { overlay.classList.add("is-open"); document.addEventListener("keydown", onKey); }
    function shut() { overlay.classList.remove("is-open"); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") shut(); }

    launch.addEventListener("click", open);
    close.addEventListener("click", shut);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) shut(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
