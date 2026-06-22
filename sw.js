/* ──────────────────────────────────────────────────────────────
   Rideekanda — Service Worker (PWA / kiosk)
   Strategy:
     • Navigations (HTML): network-first, fall back to cache, then to
       the cached dashboard — so the kiosk keeps working if the network
       drops, but always shows fresh content when online.
     • Static assets (css/js/img/fonts): stale-while-revalidate — fast
       paint from cache, refreshed in the background.
   Bump CACHE_VERSION to force clients to drop old caches.
   ────────────────────────────────────────────────────────────── */
var CACHE_VERSION = "rk-v18";
var CACHE = "rideekanda-" + CACHE_VERSION;

// Core shell to precache so the dashboard works offline on first launch.
// The dashboard now lives at /dashboard/; its scripts stay at the site root.
var PRECACHE = [
  "./",
  "dashboard/",
  "dashboard/index.html",
  "./app.jsx?v=27",
  "./icons.jsx?v=22",
  "./admin-panel.jsx?v=25",
  "./tweaks-panel.jsx?v=21",
  "./image-slot.js?v=21",
  "./tiles-data.js?v=11",
  "./calendar-data.js?v=24",
  "./eco-nav.js?v=16",
  "./eco-nav.css?v=10",
  "./styles.css?v=13",
  "./eco-header.css?v=6",
  "./eco-header.js?v=2",
  "./rideekanda-logo.svg",
  "./app/icon-192.png",
  "./app/icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // Best-effort precache — don't fail install if one item 404s.
      return Promise.allSettled(PRECACHE.map(function (u) { return c.add(u); }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;

  // HTML navigations → network-first.
  var isNav = req.mode === "navigate" ||
              (req.headers.get("accept") || "").indexOf("text/html") !== -1;

  if (isNav) {
    e.respondWith(
      fetch(req).then(function (res) {
        if (sameOrigin && res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match("dashboard/index.html") || caches.match("./");
        });
      })
    );
    return;
  }

  // Cross-origin (fonts, maps, CDNs) → just go to network, fall back to cache.
  if (!sameOrigin) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          if (res && res.ok && (url.hostname.indexOf("fonts.g") !== -1 || url.hostname.indexOf("unpkg") !== -1 || url.hostname.indexOf("cdnjs") !== -1)) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        }).catch(function () { return hit; });
      })
    );
    return;
  }

  // Same-origin static assets → stale-while-revalidate.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var fetchP = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || fetchP;
    })
  );
});
