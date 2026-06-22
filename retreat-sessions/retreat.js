/* Rideekanda — retreat sessions renderer.
   Media lives on Google Drive; we lazily inject Drive /preview iframes for
   watch & listen (so six players don't all load at once) and use
   drive.usercontent download URLs for clean downloads. */
(function () {
  var S = window.RK_SESSIONS || [];

  function previewUrl(id) { return "https://drive.google.com/file/d/" + id + "/preview"; }
  function downloadUrl(id) { return "https://drive.usercontent.google.com/download?id=" + id + "&export=download&confirm=t"; }
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // tiny inline icons (stroke = currentColor)
  var IC = {
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>',
    audio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 11v2"/></svg>',
    doc:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    dl:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>'
  };

  function card(s) {
    var sid = "ses-" + s.n;
    var guided = "";
    if (s.guided && s.guided.length) {
      guided = '<div class="ses__guided"><h4>Guided meditation recordings</h4>' +
        s.guided.map(function (g) {
          return '<div class="guided">' +
            '<span class="guided__name">' + esc(g.label) + '</span>' +
            '<span class="guided__act">' +
              '<button class="btn ghost" data-act="audio" data-id="' + g.id + '">' + IC.audio + 'Listen</button>' +
              '<a class="btn ghost" href="' + downloadUrl(g.id) + '">' + IC.dl + 'Download</a>' +
            '</span>' +
          '</div>';
        }).join("") +
      '</div>';
    }
    return '<article class="ses" id="' + sid + '">' +
      '<div class="ses__head">' +
        '<div class="ses__num">' + s.n + '</div>' +
        '<div class="ses__meta">' +
          '<p class="ses__day">Session ' + s.n + '</p>' +
          '<h2 class="ses__title">' + esc(s.title) + '</h2>' +
          (s.about ? '<p class="ses__about">' + esc(s.about) + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="ses__stage" data-stage></div>' +
      '<div class="ses__actions">' +
        '<button class="btn" data-act="video" data-id="' + s.video + '">' + IC.play + 'Watch</button>' +
        '<button class="btn ghost" data-act="audio" data-id="' + s.audio + '">' + IC.audio + 'Listen</button>' +
        '<button class="btn ghost" data-act="pdf" data-id="' + s.pdf + '">' + IC.doc + 'Summary</button>' +
      '</div>' +
      '<div class="ses__dl">' +
        '<span class="lbl">Download:</span>' +
        '<a class="dl-link" href="' + downloadUrl(s.video) + '">' + IC.dl + 'Video</a>' +
        '<a class="dl-link" href="' + downloadUrl(s.audio) + '">' + IC.dl + 'Audio</a>' +
        '<a class="dl-link" href="' + downloadUrl(s.pdf) + '">' + IC.dl + 'Summary (PDF)</a>' +
      '</div>' +
      guided +
    '</article>';
  }

  var list = document.getElementById("sessions");
  list.innerHTML = S.map(card).join("");
  [].slice.call(list.children).forEach(function (el, k) {
    setTimeout(function () { el.classList.add("in"); }, 60 + k * 70);
  });

  var totalEl = document.getElementById("total");
  if (totalEl) {
    var guidedCount = S.reduce(function (a, s) { return a + (s.guided ? s.guided.length : 0); }, 0);
    totalEl.innerHTML = "<b>" + S.length + "</b> sessions · video, audio &amp; summary" +
      (guidedCount ? " · <b>" + guidedCount + "</b> guided recordings" : "");
  }

  // open a media type into a card's stage (toggles off if same button re-clicked)
  function openStage(article, type, id, btn) {
    var stage = article.querySelector("[data-stage]");
    var already = stage.classList.contains("is-open") && stage.dataset.cur === type + ":" + id;
    // reset buttons in this card
    [].slice.call(article.querySelectorAll(".ses__actions .btn")).forEach(function (b) { b.classList.remove("is-active"); });
    if (already) {
      stage.classList.remove("is-open", "is-video", "is-audio", "is-pdf");
      stage.innerHTML = ""; stage.dataset.cur = "";
      return;
    }
    stage.className = "ses__stage is-open is-" + type;
    stage.dataset.cur = type + ":" + id;
    stage.innerHTML = '<iframe src="' + previewUrl(id) + '" allow="autoplay; encrypted-media; fullscreen" allowfullscreen loading="lazy"></iframe>';
    if (btn && btn.classList.contains("play")) {} // no-op
    if (type === "video" && btn) btn.classList.add("is-active");
    // smooth-scroll the stage into view if it's below the fold
    var r = stage.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight) stage.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  list.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("button[data-act]");
    if (!btn) return;
    var article = btn.closest(".ses");
    openStage(article, btn.dataset.act, btn.dataset.id, btn);
  });
})();
