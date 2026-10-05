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
                './manifest.json', './icon.png'];

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
  /* Direkt nach der Installation liegen die Dateien nur ohne ?v= im Vorrat (ASSETS),
     die Seite fragt aber nach ihrer ?v=-Fassung. Offline zaehlt dann dieselbe Datei
     in der vorhandenen Fassung - ablegen() haelt je Pfad ohnehin nur eine. Sonst
     startete die App beim ersten Offline-Aufruf ganz ohne Bereiche. */
  const gleicherPfad = await caches.match(req, { ignoreSearch: true });
  if (gleicherPfad) return gleicherPfad;
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    const start = await caches.match('./index.html');
    if (start) return start;
  }
  return new Response('Offline und nicht im Cache.', {
    status: 504, statusText: 'Gateway Timeout',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

/* Wie lange auf das Netz gewartet wird, bevor der Vorrat einspringt. Ohne Frist
   wartete der Start bei schlechtem Empfang, bis das Netz endgueltig aufgab. */
const NETZ_FRIST = 4000;

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  /* Das Ablegen laeuft unabhaengig von der Antwort an die Seite weiter, auch wenn
     der Vorrat schon geliefert wurde. waitUntil muss hier synchron fallen. */
  let abgelegt;
  event.waitUntil(new Promise((r) => { abgelegt = r; }));

  // reload statt default: erzwingt, dass der Browser seinen EIGENEN HTTP-Cache
  // umgeht und wirklich bei GitHub nachfragt. Das GitHub-eigene CDN-Cache-Fenster
  // (bis zu 10 Minuten nach einem Push) bleibt davon unberuehrt - das ist eine
  // Eigenschaft von GitHub Pages selbst, kein Cache, den der Service Worker steuert.
  const netz = fetch(req, { cache: 'reload' }).then((res) => {
    /* Nur erfolgreiche Antworten ablegen. Vorher landete auch eine 404- oder
       Fehlerseite im Vorrat - und ablegen() loeschte dabei die vorige, intakte
       Fassung derselben Datei. */
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => ablegen(c, req, copy)).then(abgelegt, abgelegt);
    } else {
      abgelegt();
    }
    return res;
  }, (err) => { abgelegt(); throw err; });

  event.respondWith((async () => {
    const frist = new Promise((r) => setTimeout(r, NETZ_FRIST, 'frist'));
    try {
      const erstes = await Promise.race([netz, frist]);
      if (erstes !== 'frist') return erstes;
      // Netz zu langsam: liegt die Datei im Vorrat, kommt sie von dort. Das Netz
      // laeuft weiter und legt die frische Fassung fuer den naechsten Start ab.
      const vorrat = await caches.match(req);
      if (vorrat) { netz.catch(() => {}); return vorrat; }
      return await netz;
    } catch (e) {
      return rueckfall(req);
    }
  })());
});
