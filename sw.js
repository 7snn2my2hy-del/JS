// Service Worker für die vereinte App
// Netz zuerst (immer die aktuellste Fassung, wenn online), Cache als Rückfall (offline nutzbar).
// Wichtig: Diese Datei bleibt fix und muss NICHT bei jedem Deploy angepasst werden.
// Die Versionsnummer (Cache-Busting) steckt ausschließlich in den ?v=-Query-Strings der
// <script>/<link>-Tags in index.html. Da hier bei jedem Request ohnehin zuerst das Netz
// gefragt wird, landet die jeweils aktuelle Version automatisch unter ihrer eigenen URL im
// Cache – unabhängig davon, welchen Stand ASSETS unten nennt. ASSETS dient nur dem
// allerersten Offline-Vorrat direkt nach der Installation.
// Nur anfassen, wenn sich die Cache-Logik selbst ändern soll (z.B. neue Datei ergänzen).

const CACHE = 'alles-v1';
const ASSETS = ['./', './index.html', './data-laender.js', './mod-reisen.js',
                './mod-finanzen.js', './mod-impfpass.js', './manifest.json', './icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
