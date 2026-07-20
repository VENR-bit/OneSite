/* Rideekanda — Retreat Documents renderer.
   Renders grouped PDF rows. Each row has View (opens the PDF in a new tab),
   Download (saves the file), and — on the kiosk only — a QR code so a visitor
   can take the document away on their own phone. */
(function () {
  var G = window.RK_DOCS || [];

  function fileUrl(f) { return "files/" + f; }
  function absUrl(f) { return location.origin + location.pathname.replace(/[^/]*$/, "") + fileUrl(f); }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var IC = {
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/></svg>',
    view: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.8 12S5.5 5.5 12 5.5 22.2 12 22.2 12 18.5 18.5 12 18.5 1.8 12 1.8 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    dl:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
    qr:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v7h-7"/></svg>'
  };

  // QR is for the kiosk: an installed PWA (display-mode standalone) OR a
  // fullscreen / minimal-ui kiosk browser. ?kiosk=1 forces on, ?kiosk=0 off.
  // Once kiosk is seen we remember it, since some kiosk launchers don't report
  // a display-mode on every page.
  var kparam = new URLSearchParams(location.search).get("kiosk");
  var mm = window.matchMedia;
  var standalone =
    (mm && (mm("(display-mode: standalone)").matches ||
            mm("(display-mode: fullscreen)").matches ||
            mm("(display-mode: minimal-ui)").matches)) ||
    window.navigator.standalone === true;
  try {
    if (kparam === "1" || standalone) localStorage.setItem("rk-kiosk", "1");
    if (kparam === "0") localStorage.removeItem("rk-kiosk");
  } catch (e) {}
  var remembered = false;
  try { remembered = localStorage.getItem("rk-kiosk") === "1"; } catch (e) {}
  var KIOSK = kparam === "1" || (kparam !== "0" && (standalone || remembered));
  function qrButton(it) {
    return KIOSK ? '<button class="btn ghost qr" data-file="' + esc(it.file) + '" data-title="' + esc(it.title) +
      '" aria-label="Show QR code to download">' + IC.qr + '<span>QR</span></button>' : "";
  }

  function row(it) {
    var meta = "PDF" + (it.size ? " · " + esc(it.size) : "");
    return '<div class="doc">' +
      '<div class="doc__main">' +
        '<span class="doc__ico">' + IC.doc + '</span>' +
        '<div class="doc__meta">' +
          '<p class="doc__title">' + esc(it.title) + '</p>' +
          '<p class="doc__sub">' + (it.desc ? esc(it.desc) + ' · ' : '') + meta + '</p>' +
        '</div>' +
        '<div class="doc__act">' +
          '<a class="btn" href="' + fileUrl(it.file) + '" target="_blank" rel="noopener">' + IC.view + '<span>View</span></a>' +
          '<a class="btn ghost" href="' + fileUrl(it.file) + '" download>' + IC.dl + '<span>Download</span></a>' +
          qrButton(it) +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function group(g) {
    return '<section class="grp' + (g.sinhala ? ' grp--si' : '') + '">' +
      '<div class="grp__label"><span>' + esc(g.label) + '</span><span class="line"></span>' +
        '<span class="count">' + String(g.items.length).padStart(2, "0") + '</span></div>' +
      g.items.map(row).join("") +
    '</section>';
  }

  var root = document.getElementById("library");
  if (!root) return;
  root.innerHTML = G.map(group).join("");
  [].slice.call(root.querySelectorAll(".doc")).forEach(function (el, k) {
    setTimeout(function () { el.classList.add("in"); }, 50 + k * 45);
  });

  var totalEl = document.getElementById("total");
  if (totalEl) {
    var n = G.reduce(function (a, g) { return a + g.items.length; }, 0);
    totalEl.innerHTML = "<b>" + n + "</b> documents · view &amp; download";
  }

  /* ---- QR modal (kiosk only) ---- */
  var qrm = document.getElementById("qrm");
  function openQR(file, title) {
    if (!qrm) return;
    var box = document.getElementById("qr-code");
    try {
      var qr = qrcode(0, "M");
      qr.addData(absUrl(file));
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 1, scalable: true });
    } catch (err) { box.textContent = "QR unavailable"; }
    document.getElementById("qr-title").textContent = title || "";
    qrm.classList.add("open"); qrm.setAttribute("aria-hidden", "false");
  }
  function closeQR() { if (qrm) { qrm.classList.remove("open"); qrm.setAttribute("aria-hidden", "true"); } }
  if (qrm) {
    var qx = document.getElementById("qr-close");
    if (qx) qx.addEventListener("click", closeQR);
    qrm.addEventListener("click", function (e) { if (e.target === qrm) closeQR(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeQR(); });
  }

  root.addEventListener("click", function (e) {
    var qrBtn = e.target.closest && e.target.closest("button.qr");
    if (qrBtn) { openQR(qrBtn.dataset.file, qrBtn.dataset.title); }
  });
})();
