/* Rideekanda e-book library — renders book cards, in-page reader, and QR codes.
   A book is one of:
     • Drive file:        { id }
     • Internet Archive:  { archive, pdf }
     • Direct PDF:        { url }                                              */
(function () {
  var BOOKS = window.RK_BOOKS || [];

  function links(b) {
    if (b.file) {  // self-hosted on this site → clean same-origin download
      var abs = new URL(b.file, location.href).href;
      return { read: b.file, dl: b.file, ext: b.file, qr: abs, local: true };
    }
    if (b.id) return {
      read: "https://drive.google.com/file/d/" + b.id + "/preview",
      dl:   "https://drive.google.com/uc?export=download&id=" + b.id,
      ext:  "https://drive.google.com/file/d/" + b.id + "/view",
      qr:   "https://drive.google.com/file/d/" + b.id + "/view",
    };
    if (b.archive) return {
      read: "https://archive.org/embed/" + b.archive,
      dl:   b.pdf,
      ext:  "https://archive.org/details/" + b.archive,
      qr:   "https://archive.org/details/" + b.archive,
    };
    return { read: b.url, dl: b.url, ext: b.url, qr: b.url };
  }

  var esc = function (s) { return String(s || "").replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var grid = document.getElementById("grid");
  document.getElementById("count").textContent =
    String(BOOKS.length).padStart(2, "0") + " books";

  BOOKS.forEach(function (b, i) {
    var L = links(b);
    var art = document.createElement("article");
    art.className = "book";
    var coverInner = b.cover
      ? '<img src="' + esc(b.cover) + '" alt="' + esc(b.title) + ' — cover" loading="lazy" decoding="async">'
      : '<span class="ph"><b>' + esc(b.title) + '</b></span>';
    art.innerHTML =
      '<button class="book__cover" data-i="' + i + '" aria-label="Read ' + esc(b.title) + '">' +
        coverInner + '<span class="read-badge">Read</span>' +
      '</button>' +
      '<div class="book__body">' +
        '<h3 class="book__title">' + esc(b.title) + '</h3>' +
        '<p class="book__author">' + esc(b.author) + '</p>' +
        '<p class="book__about">' + esc(b.about) + '</p>' +
        (b.source ? '<p class="book__src">' + esc(b.source) + '</p>' : '') +
        '<div class="book__actions">' +
          '<button class="btn read" data-i="' + i + '">Read</button>' +
          '<a class="btn ghost dl" href="' + esc(L.dl) + '" download target="_blank" rel="noopener">Download</a>' +
          '<button class="btn ghost qr" data-i="' + i + '" aria-label="Show QR code">QR</button>' +
        '</div>' +
      '</div>';
    grid.appendChild(art);
    setTimeout(function () { art.classList.add("in"); }, 40 + (i % 8) * 45);
  });

  /* ---- reader lightbox ---- */
  var reader = document.getElementById("reader");
  var rFrame = document.getElementById("r-frame");
  function openReader(i) {
    var b = BOOKS[i]; if (!b) return;
    var L = links(b);
    document.getElementById("r-title").textContent = b.title;
    document.getElementById("r-author").textContent = b.author + (b.source ? "  ·  " + b.source : "");
    document.getElementById("r-dl").href = L.dl;
    document.getElementById("r-open").href = L.ext;
    rFrame.src = L.read;
    reader.classList.add("open");
    reader.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeReader() {
    reader.classList.remove("open");
    reader.setAttribute("aria-hidden", "true");
    rFrame.src = "about:blank";
    document.body.style.overflow = "";
  }
  document.getElementById("r-close").addEventListener("click", closeReader);

  /* ---- QR modal ---- */
  var qrm = document.getElementById("qrm");
  function openQR(i) {
    var b = BOOKS[i]; if (!b) return;
    var box = document.getElementById("qr-code");
    try {
      var qr = qrcode(0, "M");
      qr.addData(links(b).qr);
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 1, scalable: true });
    } catch (e) { box.textContent = "QR unavailable"; }
    document.getElementById("qr-title").textContent = b.title;
    qrm.classList.add("open");
    qrm.setAttribute("aria-hidden", "false");
  }
  function closeQR() { qrm.classList.remove("open"); qrm.setAttribute("aria-hidden", "true"); }
  document.getElementById("qr-close").addEventListener("click", closeQR);

  /* ---- delegated clicks ---- */
  grid.addEventListener("click", function (e) {
    var read = e.target.closest(".book__cover, .read");
    var qrBtn = e.target.closest(".qr");
    if (qrBtn) { openQR(+qrBtn.dataset.i); return; }
    if (read) { openReader(+read.dataset.i); }
  });

  reader.addEventListener("click", function (e) { if (e.target === reader) closeReader(); });
  qrm.addEventListener("click", function (e) { if (e.target === qrm) closeQR(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeReader(); closeQR(); }
  });
})();
