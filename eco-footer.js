/* ──────────────────────────────────────────────────────────────
   Rideekanda Ecosystem Footer  ·  eco-footer.js
   Injects one canonical footer (matching the home page) at the
   bottom of every sub-page. Root-aware, like eco-nav / eco-header.

   Include on a host page (before </body>):
     <link rel="stylesheet" href="<ROOT>eco-footer.css">
     <script id="eco-footer" src="<ROOT>eco-footer.js"
             data-root="<ROOT>" defer></script>
   where <ROOT> is the relative path back to the site root
   ("../" for depth-1 pages, "../../" for projects/*, monastery/si …).
   ────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var tag = document.getElementById("eco-footer") ||
            document.currentScript ||
            (function () { var s = document.querySelectorAll('script[src*="eco-footer.js"]'); return s[s.length - 1]; })();
  var ROOT = (tag && tag.getAttribute("data-root")) || "";
  var LOGO = ROOT + "rideekanda-logo.svg";

  // Same logo the header / Explore launcher use, rendered via CSS mask so it
  // inherits the footer's light ink colour.
  var MARK = '<span class="eco-f-mark"><span style="-webkit-mask:url(' + LOGO +
    ') center/contain no-repeat;mask:url(' + LOGO + ') center/contain no-repeat;"></span></span>';

  var EXPLORE = [
    { label: "The Monastery",   href: "monastery/" },
    { label: "Retreat Program", href: "retreat/" },
    { label: "Gallery",         href: "gallery/" },
    { label: "Projects",        href: "projects/" },
    { label: "News &amp; Events", href: "news/" }
  ];
  var VISIT = [
    { text: "Yatawatta, Matale District" },
    { text: "Sri Lanka" },
    { label: "Book your stay",   href: "booking/" },
    { label: "Dāna · Donation", href: "donate/" },
    { label: "Contact",          href: "contact/" }
  ];

  function li(it) {
    return it.href
      ? '<li><a href="' + ROOT + it.href + '">' + it.label + '</a></li>'
      : '<li>' + it.text + '</li>';
  }

  var year = new Date().getFullYear();

  var html =
    '<div class="eco-f-container">' +
      '<div class="eco-f-grid">' +
        '<div>' +
          '<div class="eco-f-brand">' + MARK +
            '<span><span class="eco-f-name">Rideekanda</span>' +
            '<span class="eco-f-sub">Forest Monastery</span></span>' +
          '</div>' +
          '<p class="eco-f-blurb">A Buddhist forest meditation monastery in Matale, ' +
          'Sri Lanka, devoted to preserving the true teaching of the Buddha and ' +
          'guiding seekers along the noble path.</p>' +
        '</div>' +
        '<div><h4>Explore</h4><ul>' + EXPLORE.map(li).join("") + '</ul></div>' +
        '<div><h4>Visit &amp; Support</h4><ul>' + VISIT.map(li).join("") + '</ul></div>' +
      '</div>' +
      '<div class="eco-f-base">' +
        '<span>© ' + year + ' Rideekanda Forest Monastery</span>' +
        '<span>Sabbadānaṃ dhammadānaṃ jināti — the gift of dhamma surpasses all gifts</span>' +
      '</div>' +
    '</div>';

  function mount() {
    if (document.querySelector("footer.eco-footer")) return;
    var footer = document.createElement("footer");
    footer.className = "eco-footer";
    footer.setAttribute("role", "contentinfo");
    footer.innerHTML = html;
    document.body.appendChild(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
