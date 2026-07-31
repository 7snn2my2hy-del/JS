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

/* Jede neue ?v=-Fassung einer Datei liegt unter einer eigenen URL im Cache. Ohne
   Aufräumen bleibt jede jemals ausgelieferte Version dort für immer liegen – der Cache
   wächst mit jedem Deploy weiter, obwohl immer nur die neueste gebraucht wird. Beim
   Ablegen einer Datei werden deshalb alle Einträge mit demselben Pfad, aber anderem
   Query-String entfernt. Das kommt ohne Kenntnis der aktuellen Versionsnummer aus,
   die Datei bleibt dadurch weiterhin fix. */
async function ablegen(cache, req, res) {
  await cache.put(req, res);
  const pfad = new URL(req.url).pathname;
  for (const alt of await cache.keys()) {
    const u = new URL(alt.url);
    if (u.pathname === pfad && alt.url !== req.url) await cache.delete(alt);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      event.waitUntil(caches.open(CACHE).then((c) => ablegen(c, req, copy)));
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
