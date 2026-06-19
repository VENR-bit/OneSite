/* Rideekanda e-book library — two categories:
     • Free distribution / public-domain → self-hosted ('file'), read & download here.
     • Other (commercial copyright) → Drive copy ('id') + a link to the source.       */
(function () {
  var MAIN = window.RK_BOOKS || [];
  var BN   = window.RK_BOOKS_BN || [];
  var TC   = window.RK_BOOKS_TC || [];
  var MAIN_LEN = MAIN.length, BN_LEN = BN.length;
  var BOOKS = MAIN.concat(BN).concat(TC);  // one global index space across all sections

  // For multi-language books, the file of the currently selected language.
  function fileFor(i) {
    var b = BOOKS[i];
    if (b && b.langs) {
      var sel = document.querySelector('.book__lang[data-i="' + i + '"]');
      var k = sel ? (+sel.value || 0) : 0;
      return (b.langs[k] || b.langs[0]).file;
    }
    return null;
  }

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
    var freeTag = '<span class="book__tag tag--free">Free for distribution</span>';
    var paidTag = '<span class="book__tag tag--paid">Commercial copyright</span>';
    if (b.langs) {
      // multi-language book → in-tile language selector; Read/Download use the chosen one
      var first = b.langs[0].file;
      cover = '<button class="book__cover" data-i="' + i + '" aria-label="Read ' + esc(b.title) + '">' +
        freeTag + coverInner + '<span class="read-badge">Read</span></button>';
      var select = b.langs.length > 1
        ? '<select class="book__lang" data-i="' + i + '" aria-label="Choose language">' +
            b.langs.map(function (l, k) { return '<option value="' + k + '">' + esc(l.lang) + '</option>'; }).join("") +
          '</select>'
        : '<p class="book__src">' + esc(b.langs[0].lang) + '</p>';
      actions = '<button class="btn read" data-i="' + i + '">Read</button>' +
        '<a class="btn ghost dl" data-i="' + i + '" href="' + esc(first) + '" download target="_blank" rel="noopener">Download</a>' +
        '<button class="btn ghost qr" data-i="' + i + '" aria-label="Show QR code">QR</button>';
      return '<article class="book">' + cover +
        '<div class="book__body">' +
          '<h3 class="book__title">' + esc(b.title) + '</h3>' +
          (b.author ? '<p class="book__author">' + esc(b.author) + '</p>' : '') +
          (b.source ? '<p class="book__src">' + esc(b.source) + '</p>' : '') +
          select +
          '<div class="book__actions">' + actions + '</div>' +
        '</div>' +
      '</article>';
    }
    if (commercial) {
      // copyright titles are not hosted/distributed here — only a link to the source
      var src = sourceUrl(b);
      cover = '<a class="book__cover book__cover--ext" href="' + esc(src) + '" target="_blank" rel="noopener" aria-label="Find ' + esc(b.title) + ' at its source">' +
        paidTag + coverInner + '<span class="read-badge">Source ↗</span></a>';
      actions = '<a class="btn src" href="' + esc(src) + '" target="_blank" rel="noopener">Read / buy at source ↗</a>';
    } else {
      cover = '<button class="book__cover" data-i="' + i + '" aria-label="Read ' + esc(b.title) + '">' +
        freeTag + coverInner + '<span class="read-badge">Read</span></button>';
      actions = '<button class="btn read" data-i="' + i + '">Read</button>' +
        '<a class="btn ghost dl" href="' + esc(L.dl) + '" download target="_blank" rel="noopener">Download</a>' +
        '<button class="btn ghost qr" data-i="' + i + '" aria-label="Show QR code">QR</button>';
    }
    return '<article class="book">' + cover +
      '<div class="book__body">' +
        '<h3 class="book__title">' + esc(b.title) + '</h3>' +
        (b.author ? '<p class="book__author">' + esc(b.author) + '</p>' : '') +
        (b.about ? '<p class="book__about">' + esc(b.about) + '</p>' : '<div class="book__about"></div>') +
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

  var free = [], other = [], bn = [], tc = [];
  BOOKS.forEach(function (b, i) {
    if (i >= MAIN_LEN + BN_LEN) tc.push({ b: b, i: i });   // Thubten Chodron (multi-language)
    else if (i >= MAIN_LEN) bn.push({ b: b, i: i });       // BuddhaNet manifest
    else if (b.file) free.push({ b: b, i: i });            // self-hosted free-distribution
    else other.push({ b: b, i: i });                       // commercial copyright
  });
  renderInto("grid-free", "count-free", free, false);
  renderInto("grid-tc", "count-tc", tc, false);
  renderInto("grid-bn", "count-bn", bn, false);
  renderInto("grid-other", "count-other", other, true);

  // language selector → update that card's download link
  document.addEventListener("change", function (e) {
    var sel = e.target.closest && e.target.closest(".book__lang");
    if (!sel) return;
    var i = +sel.dataset.i;
    var a = document.querySelector('.book__actions .dl[data-i="' + i + '"]');
    if (a) a.setAttribute("href", fileFor(i));
  });

  /* ---- reader (PDF.js — scrollable, works on mobile) ---- */
  var reader = document.getElementById("reader");
  var stage = document.getElementById("r-stage");
  var pagesEl = document.getElementById("r-pages");
  var readUrl = "", zoom = 100, night = false;
  var pdfDoc = null, pdfDims = null, pageObserver = null, loadToken = 0;
  try {
    var z = parseInt(localStorage.getItem("rk-read-zoom"), 10); if (z >= 50 && z <= 300) zoom = z;
    night = localStorage.getItem("rk-read-night") === "1";
  } catch (e) {}
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";

  function applyNight() {
    reader.classList.toggle("reader--night", night);
    var nb = document.getElementById("r-night");
    if (nb) nb.textContent = night ? "☀️" : "🌙";
  }
  function fitScale() {
    if (!pdfDims) return 1;
    var w = (pagesEl.clientWidth || stage.clientWidth || 700) - 4;
    return (w / pdfDims.w) * (zoom / 100);   // zoom 100% = fit page width
  }
  function buildPages() {
    if (!pdfDoc) return;
    if (pageObserver) pageObserver.disconnect();
    pagesEl.innerHTML = "";
    var s = fitScale();
    for (var n = 1; n <= pdfDoc.numPages; n++) {
      var d = document.createElement("div");
      d.className = "pdfpage"; d.dataset.n = n; d.dataset.done = "0";
      d.style.width = Math.round(pdfDims.w * s) + "px";
      d.style.height = Math.round(pdfDims.h * s) + "px";
      pagesEl.appendChild(d);
    }
    pageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) renderPage(en.target); });
    }, { root: stage, rootMargin: "300px 0px" });
    [].slice.call(pagesEl.children).forEach(function (d) { pageObserver.observe(d); });
  }
  function renderPage(div) {
    if (div.dataset.done === "1") return;
    div.dataset.done = "1";
    var n = +div.dataset.n, token = loadToken;
    pdfDoc.getPage(n).then(function (page) {
      if (token !== loadToken) return;
      var s = fitScale();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var vp = page.getViewport({ scale: s * dpr });
      var canvas = document.createElement("canvas");
      canvas.width = vp.width; canvas.height = vp.height;
      canvas.style.width = "100%"; canvas.style.height = "100%";
      div.style.height = "auto";
      div.innerHTML = ""; div.appendChild(canvas);
      page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
    }).catch(function () { div.dataset.done = "0"; });
  }
  function loadPdf(url) {
    var token = ++loadToken;
    pdfDoc = null; pdfDims = null;
    pagesEl.innerHTML = '<div class="reader__msg">Loading…</div>';
    if (!window.pdfjsLib) { pagesEl.innerHTML = '<div class="reader__msg">Reader unavailable — use Download or Open.</div>'; return; }
    pdfjsLib.getDocument(url).promise.then(function (doc) {
      if (token !== loadToken) return;
      pdfDoc = doc;
      return doc.getPage(1).then(function (p1) {
        var vp = p1.getViewport({ scale: 1 });
        pdfDims = { w: vp.width, h: vp.height };
        buildPages();
      });
    }).catch(function () {
      if (token !== loadToken) return;
      pagesEl.innerHTML = '<div class="reader__msg">Could not display this book here. Use <b>Download</b> or <b>Open&nbsp;↗</b>.</div>';
    });
  }
  function setZoom(z) {
    zoom = Math.max(50, Math.min(300, z));
    try { localStorage.setItem("rk-read-zoom", zoom); } catch (e) {}
    if (pdfDoc) buildPages();
  }

  function openReader(i) {
    var b = BOOKS[i]; if (!b) return;
    var f = fileFor(i);
    var L = f ? { read: f, dl: f, ext: f } : links(b);
    document.getElementById("r-title").textContent = b.title;
    document.getElementById("r-author").textContent = (b.author || "") + (b.source ? "  ·  " + b.source : "");
    document.getElementById("r-dl").href = L.dl;
    readUrl = L.read;
    applyNight();
    reader.classList.add("open");
    reader.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    stage.scrollTop = 0;
    loadPdf(readUrl);
  }
  function closeReader() {
    reader.classList.remove("open");
    reader.setAttribute("aria-hidden", "true");
    loadToken++;                 // cancel any in-flight renders
    if (pageObserver) pageObserver.disconnect();
    pagesEl.innerHTML = "";
    pdfDoc = null;
    readUrl = "";
    document.body.style.overflow = "";
  }
  document.getElementById("r-close").addEventListener("click", closeReader);
  document.getElementById("r-zoomin").addEventListener("click", function () { setZoom(zoom + 25); });
  document.getElementById("r-zoomout").addEventListener("click", function () { setZoom(zoom - 25); });
  document.getElementById("r-night").addEventListener("click", function () {
    night = !night;
    try { localStorage.setItem("rk-read-night", night ? "1" : "0"); } catch (e) {}
    applyNight();
  });

  /* ---- QR modal ---- */
  var qrm = document.getElementById("qrm");
  function openQR(i) {
    var b = BOOKS[i]; if (!b) return;
    var box = document.getElementById("qr-code");
    var f = fileFor(i);
    var qrTarget = f ? new URL(f, location.href).href : links(b).qr;
    try {
      var qr = qrcode(0, "M");
      qr.addData(qrTarget);
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
