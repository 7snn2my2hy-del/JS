// Service Worker für die vereinte App
// Netz zuerst (immer die aktuellste Fassung, wenn online), Cache als Rückfall (offline nutzbar).
// Bei einem Update nur die Versionsnummer erhöhen.

const CACHE = 'alles-2507261200';
const ASSETS = ['./', './index.html', './data-laender.js?v=2507261200', './mod-reisen.js?v=2507261200',
                './mod-finanzen.js?v=2507261200', './mod-impfpass.js?v=2507261200',
                './manifest.json?v=2507261200', './icon.png'];

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
