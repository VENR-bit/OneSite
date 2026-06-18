/* Rideekanda e-book library — two categories:
     • Free distribution / public-domain → self-hosted ('file'), read & download here.
     • Other (commercial copyright) → Drive copy ('id') + a link to the source.       */
(function () {
  var BOOKS = window.RK_BOOKS || [];

  function links(b) {
    if (b.file) {  // self-hosted on this site → clean same-origin download
      var abs = new URL(b.file, location.href).href;
      return { read: b.file, dl: b.file, ext: b.file, qr: abs, local: true };
    }
    if (b.id) return {
      read: "https://drive.google.com/file/d/" + b.id + "/preview",
      dl:   "https://drive.usercontent.google.com/download?id=" + b.id + "&export=download&confirm=t",
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

  // "Source" link for copyright titles → Google Books (read a preview / buy / download from the rights holder).
  function sourceUrl(b) {
    return "https://www.google.com/search?tbm=bks&q=" + encodeURIComponent(b.title + " " + b.author);
  }

  var esc = function (s) { return String(s || "").replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function card(b, i, commercial) {
    var L = links(b);
    var coverInner = b.cover
      ? '<img src="' + esc(b.cover) + '" alt="' + esc(b.title) + ' — cover" loading="lazy" decoding="async">'
      : '<span class="ph"><b>' + esc(b.title) + '</b></span>';
    var cover, actions;
    if (commercial) {
      // copyright titles are not hosted/distributed here — only a link to the source
      var src = sourceUrl(b);
      cover = '<a class="book__cover book__cover--ext" href="' + esc(src) + '" target="_blank" rel="noopener" aria-label="Find ' + esc(b.title) + ' at its source">' +
        coverInner + '<span class="read-badge">Source ↗</span></a>';
      actions = '<a class="btn src" href="' + esc(src) + '" target="_blank" rel="noopener">Read / buy at source ↗</a>';
    } else {
      cover = '<button class="book__cover" data-i="' + i + '" aria-label="Read ' + esc(b.title) + '">' +
        coverInner + '<span class="read-badge">Read</span></button>';
      actions = '<button class="btn read" data-i="' + i + '">Read</button>' +
        '<a class="btn ghost dl" href="' + esc(L.dl) + '" download target="_blank" rel="noopener">Download</a>' +
        '<button class="btn ghost qr" data-i="' + i + '" aria-label="Show QR code">QR</button>';
    }
    return '<article class="book">' + cover +
      '<div class="book__body">' +
        '<h3 class="book__title">' + esc(b.title) + '</h3>' +
        '<p class="book__author">' + esc(b.author) + '</p>' +
        '<p class="book__about">' + esc(b.about) + '</p>' +
        (b.source ? '<p class="book__src">' + esc(b.source) + '</p>' : '') +
        '<div class="book__actions">' + actions + '</div>' +
      '</div>' +
    '</article>';
  }

  function renderInto(gridId, countId, items, commercial) {
    var grid = document.getElementById(gridId);
    document.getElementById(countId).textContent = String(items.length).padStart(2, "0") + " books";
    grid.innerHTML = items.map(function (it) { return card(it.b, it.i, commercial); }).join("");
    [].slice.call(grid.querySelectorAll(".book")).forEach(function (el, k) {
      setTimeout(function () { el.classList.add("in"); }, 40 + (k % 8) * 45);
    });
  }

  var free = [], other = [];
  BOOKS.forEach(function (b, i) { (b.file ? free : other).push({ b: b, i: i }); });
  renderInto("grid-free", "count-free", free, false);
  renderInto("grid-other", "count-other", other, true);

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

  /* ---- delegated clicks (both grids) ---- */
  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var qrBtn = e.target.closest(".qr");
    if (qrBtn) { openQR(+qrBtn.dataset.i); return; }
    // only the free (button) covers open the in-page reader; copyright covers are <a> links
    var read = e.target.closest("button.book__cover, .read");
    if (read) { openReader(+read.dataset.i); }
  });

  reader.addEventListener("click", function (e) { if (e.target === reader) closeReader(); });
  qrm.addEventListener("click", function (e) { if (e.target === qrm) closeQR(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeReader(); closeQR(); }
  });
})();
