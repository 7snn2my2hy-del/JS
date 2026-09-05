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
                './mod-finanzen.js', './mod-impfpass.js', './mod-fotografie.js',
                './manifest.json', './icon.png',
                // Startbilder: iOS zeigt beim Kaltstart aus dem Home-Bildschirm eines
                // davon an, ausgewählt über die media-Bedingungen in index.html.
                './splash/1320x2868.png', './splash/1290x2796.png', './splash/1284x2778.png',
                './splash/1206x2622.png', './splash/1179x2556.png', './splash/1170x2532.png',
                './splash/1242x2688.png', './splash/1125x2436.png', './splash/828x1792.png',
                './splash/750x1334.png'];

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

/* Rückfall, wenn das Netz nicht erreichbar ist.
   Zuerst der Cache-Eintrag zu genau dieser URL. Fehlt der, darf NUR ein Seitenaufruf
   (Navigation) auf index.html ausweichen. Vorher bekam jede beliebige Anfrage index.html
   zurück – eine noch nicht zwischengespeicherte ?v=-Fassung einer .js-Datei lieferte
   dadurch HTML an eine <script>-Einbindung, was den Start mit einem Syntaxfehler
   abbrach statt sauber fehlzuschlagen. Bei allen anderen Dateitypen ist ein ehrlicher
   Netzwerkfehler das bessere Ergebnis: der Browser meldet die fehlende Datei, statt sie
   scheinbar erfolgreich mit falschem Inhalt zu laden. */
async function rueckfall(req) {
  const treffer = await caches.match(req);
  if (treffer) return treffer;
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    const start = await caches.match('./index.html');
    if (start) return start;
  }
  return new Response('Offline und nicht im Cache.', {
    status: 504, statusText: 'Gateway Timeout',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  // reload statt default: erzwingt, dass der Browser seinen EIGENEN HTTP-Cache
  // umgeht und wirklich bei GitHub nachfragt. Das GitHub-eigene CDN-Cache-Fenster
  // (bis zu 10 Minuten nach einem Push) bleibt davon unberuehrt - das ist eine
  // Eigenschaft von GitHub Pages selbst, kein Cache, den der Service Worker steuert.
  event.respondWith(
    fetch(req, { cache: 'reload' }).then((res) => {
      const copy = res.clone();
      event.waitUntil(caches.open(CACHE).then((c) => ablegen(c, req, copy)));
      return res;
    }).catch(() => rueckfall(req))
  );
});
