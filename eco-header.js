/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Header  ·  eco-header.js
   Injects one canonical header bar at the top of every sub-page.
   The brand logo links to the page top (#top) — there is no
   labelled "Home" button; site-wide navigation is the Explore
   launcher (eco-nav). Each page supplies its own in-page section
   links via the script tag's data-links attribute.

   Include on a host page:
     <link rel="stylesheet" href="<ROOT>eco-header.css">
     <script id="eco-header" src="<ROOT>eco-header.js"
             data-root="<ROOT>"
             data-links='[{"label":"About","href":"#about"}, ...]'
             defer></script>

   A link may set {"cta":true} to render as the accent pill
   (e.g. Support). hrefs starting with "#", "http", or containing
   "/" are used as-is; otherwise they are treated as page anchors.
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var tag = document.getElementById("eco-header") ||
            document.currentScript ||
            (function () { var s = document.querySelectorAll('script[src*="eco-header.js"]'); return s[s.length - 1]; })();
  var ROOT = (tag && tag.getAttribute("data-root")) || "";
  var PAD = (tag && tag.getAttribute("data-pad")) === "true";

  var links = [];
  try { links = JSON.parse((tag && tag.getAttribute("data-links")) || "[]"); }
  catch (e) { links = []; }

  // Brand lotus = the official Rideekanda logo, rendered via CSS mask so it
  // inherits currentColor (the accent) and themes correctly — same logo the
  // dashboard centre uses. ROOT makes the path correct at any page depth.
  var LOGO_URL = ROOT + 'rideekanda-logo.svg';
  var LOTUS = '<span style="display:block;width:100%;height:100%;' +
    'background-color:currentColor;' +
    '-webkit-mask:url(' + LOGO_URL + ') center/contain no-repeat;' +
    'mask:url(' + LOGO_URL + ') center/contain no-repeat;"></span>';

  var BURGER = '<svg viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 2h14M2 7h14M2 12h14"/></svg>';

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }

  function mkLink(item, inMobile) {
    var a = document.createElement("a");
    a.href = item.href || "#top";
    if (item.cta) a.className = "eco-h-cta";
    if (item.external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    a.textContent = item.label || "";
    return a;
  }

  function build() {
    var header = el("header", "eco-header");
    header.setAttribute("role", "banner");

    var inner = el("div", "eco-h-inner");

    // Brand → page top (logo only, no "Home" label)
    var brand = document.createElement("a");
    brand.className = "eco-h-brand";
    brand.href = "#top";
    brand.setAttribute("aria-label", "Rideekanda Forest Monastery");
    brand.innerHTML = '<span class="eco-h-mark">' + LOTUS + '</span>' +
      '<span class="eco-h-brandtext"><b>Rideekanda</b><small>Forest Monastery</small></span>';
    inner.appendChild(brand);

    // Desktop links
    var nav = el("nav", "eco-h-links");
    nav.setAttribute("aria-label", "Section");
    links.forEach(function (it) { nav.appendChild(mkLink(it, false)); });
    inner.appendChild(nav);

    // Hamburger
    var burger = el("button", "eco-h-burger", BURGER);
    burger.type = "button";
    burger.setAttribute("aria-label", "Menu");
    burger.setAttribute("aria-expanded", "false");
    inner.appendChild(burger);

    header.appendChild(inner);

    // Mobile dropdown
    var mobile = el("div", "eco-h-mobile");
    links.forEach(function (it) { mobile.appendChild(mkLink(it, true)); });
    header.appendChild(mobile);

    if (PAD) document.body.classList.add("eco-h-pad");

    document.body.insertBefore(header, document.body.firstChild);

    // Ensure a #top anchor exists for the brand link
    if (!document.getElementById("top")) {
      var t = document.createElement("span");
      t.id = "top";
      t.style.cssText = "position:absolute;top:0;left:0;";
      document.body.insertBefore(t, document.body.firstChild);
    }

    // Scrolled state
    var onScroll = function () {
      header.classList.toggle("eco-h-scrolled", window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile toggle
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("eco-h-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobile.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        header.classList.remove("eco-h-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
