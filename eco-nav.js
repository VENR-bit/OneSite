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

  var MAIN = [
    { id: "home",        href: "index.html",            en: "Home",                si: "මුල් පිටුව" },
    { id: "monastery",   href: "monastery/",            en: "Monastery",           si: "ආරණ්‍ය සේනාසනය" },
    { id: "retreat",     href: "retreat/",              en: "Retreat Program",     si: "භාවනා වැඩසටහන" },
    { id: "booking",     href: "booking/",              en: "Book Your Stay",      si: "වෙන් කරවා ගැනීම" },
    { id: "gallery",     href: "gallery/",              en: "Gallery",             si: "ඡායාරූප" },
    { id: "reviews",     href: "reviews/",              en: "Reviews",             si: "ඇගයීම්" },
    { id: "donate",      href: "donate/",               en: "Donate",              si: "පරිත්‍යාග" },
    { id: "news",        href: "news/",                 en: "News & Events",       si: "ප්‍රවෘත්ති සහ සිදුවීම්" },
    { id: "requirements",      href: "requirements/",      en: "Monastery Requirements", si: "ආරණ්‍ය අවශ්‍යතා" }
  ];
  var PROJECTS = [
    { id: "projects",     href: "projects/",                en: "All Projects",  si: "ව්‍යාපෘති" },
    { id: "library-cafe", href: "projects/library-cafe/",   en: "Library Café",  si: "පුස්තකාල කැෆේ" },
    { id: "threestory",   href: "projects/threestory/",     en: "ThreeStory",    si: "ත්‍රෛ මහල් ගොඩනැගිල්ල" }
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
    panel.appendChild(buildSection("Explore the Monastery", MAIN));
    panel.appendChild(buildSection("Projects", PROJECTS));
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
