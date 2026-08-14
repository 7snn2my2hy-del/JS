/* ================= BEREICH: FOTOGRAFIE =================
   Eigenständiges Modul. Optik und Bausteine kommen aus dem gemeinsamen Kern in
   index.html (.bento/.bento-tile, .tt-map-Wasserzeichen, .screen, .glass,
   .rt-row-Zeitleiste …) – dieses Modul bringt keine eigene Gestaltung mit, nur eine
   Handvoll Farbwerte und kleine selbst gebaute Icons/Illustrationen, die es aus den
   vorhandenen CSS-Variablen des Kerns schöpft.

   Zwei Teile:
   1) Guides – kuratierte Aufnahme-Rezepte. Anlegen, Ändern und Löschen passiert
      bewusst NICHT in der App, sondern hier im Gespräch direkt im Code
      (fgStartbestand) – die App zeigt sie nur an. Einzige Ausnahme: ein freies
      Notizen-Feld pro Guide, das in der App selbst editiert und gespeichert wird.
      Liste als Bento-Grid (2 pro Zeile); jede Kachel zeigt Titel, ein kleines
      Icon-Badge oben rechts sowie ISO/Blende/Zeit unten (an den Kachelrand
      angedockt), Antippen öffnet eine reine Leseansicht mit der vollständigen
      Kamera-Einstellungen-Zeilenliste (Label links, Wert rechts).
   2) Astro-Kalender – rein berechnete Ereignisse (Neumond/Milchstraße, Vollmond/
      Supermond, Meteorschauer, dazu die für 2026 bekannte Mondfinsternis und das
      Milchstraßenkern-Sichtbarkeitsfenster) bis zum 31.12.2026, mit kleinen
      Icon-Markern statt reinen Farbpunkten (wie Flug/Hotel/Ort bei Reisen). Es wird
      nichts gespeichert oder synchronisiert, nur bei jedem Öffnen ab "heute" neu
      berechnet – vergangene Termine fallen dadurch von selbst raus. */

document.getElementById('mod-fotografie').insertAdjacentHTML('beforeend', `
<div class="wrap">

  <div class="app-header"><button class="screen-back" aria-label="Zurück" onclick="closeModule()">‹</button><span>Jörg's Fotografie</span></div>

  <div id="fg-list"></div>
  <div class="empty" id="fg-empty" style="display:none">Noch keine Guides hinterlegt.</div>

  <div class="section-label spaced">Astro-Kalender</div>
  <div class="rt-list" id="fg-calendar"></div>
</div>

<div class="screen" id="fg-detail-screen">
  <div class="app-header"><button class="screen-back" aria-label="Zurück" onclick="fgCloseDetail()">‹</button><span id="fg-detail-title"></span></div>
  <div id="fg-detail-body"></div>
</div>
`);

/* ---------------- Ausrüstungs-Basis ----------------
   Fest hinterlegt (kein Zugriff auf die Ausrüstungsliste in den Einstellungen möglich,
   die liegt nur im Local Storage). Dient als Referenz beim Formulieren der
   Guide-Vorgaben unten – Kamera und Objektive stehen dadurch verlässlich fest,
   Zubehör (Stativ, L-Bracket, Fernauslöser …) wird pro Guide passend dazugeschrieben. */
const FG_AUSRUESTUNG = {
  kamera: 'Sony α7V',
  objektive: [
    { name: 'Sony FE 14mm F1.8 GM',         blendeMax: 'f/1.8' },
    { name: 'Sony FE 35mm F1.4 GM',         blendeMax: 'f/1.4' },
    { name: 'Sony FE 70–200mm F2.8 GM II',  blendeMax: 'f/2.8' },
    { name: 'Sony FE 200–600mm F5.6–6.3 G', blendeMax: 'f/5.6–6.3' }
  ]
};

/* ---------------- Kachel-Icon ----------------
   Kleines, festes Icon-Badge oben rechts in der Kachel (kein raumgreifendes
   Wasserzeichen mehr) – eigene, selbst gebaute Glyphe je Guide, viewBox 0 0 24 24,
   einfarbig Violett, feste Größe/Position unabhängig von Titel- oder Wertlänge. */
const FG_GUIDE_ICON = {
  'ms-shot': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 16 Q12 4 22 16"/></svg>',
  'ms-timelapse': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 13 Q12 3 22 13"/><path d="M4 18 Q12 10 20 18" stroke-dasharray="1 4" opacity="0.6"/></svg>',
  'ms-stacking': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 9 Q12 1 22 9"/><path d="M2 14 Q12 6 22 14" opacity="0.6"/><path d="M2 19 Q12 11 22 19" opacity="0.35"/></svg>',
  'star-trails': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
  'meteoriten': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none"/><path d="M5 5 L13 13"/><circle cx="18" cy="7" r="1.2" fill="currentColor" stroke="none"/><path d="M18 7 L22 11"/></svg>'
};

/* ---------------- Daten ---------------- */
const FG_KEYS = { szenarien: 'fg_szenarien_v1' };

/* Kuratierter Bestand – Anlegen/Ändern/Löschen passiert hier im Code, nicht in der App
   (siehe Kopfkommentar). "art" wählt das Icon-Badge (FG_GUIDE_ICON). Die
   kachel*-Felder sind eigene, bewusst kurze Werte für die Kachel (ohne
   Zusatzerklärungen) – die ausführlichen Werte mit Kontext stehen in "einstellungen"
   für die Leseansicht. Reihenfolge dort: ISO, Blende, Verschlusszeit zuerst, danach
   alle weiteren motivrelevanten Einstellungen an Kamera und Objektiv. */
function fgStartbestand(){
  return [
    {
      id: neueId(), name: 'Milchstraße (Shot)', art: 'ms-shot',
      kachelIso: '3200–6400', kachelBlende: 'f/1.8', kachelZeit: '10–15s',
      equipment: 'Sony α7V · Sony FE 14mm F1.8 GM · Stativ mit L-Bracket · Fernauslöser/Timer',
      einstellungen: [
        { label: 'ISO', wert: '3200–6400' },
        { label: 'Blende', wert: 'f/1.8 (Offenblende)' },
        { label: 'Verschlusszeit', wert: '10–15s (NPF-Regel bei 14mm)' },
        { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
        { label: 'Fokus', wert: 'Manuell, auf ∞ bzw. hellen Stern per Lupenfunktion' },
        { label: 'Modus', wert: 'Manuell (M)' },
        { label: 'Verschluss', wert: 'Elektronisch' },
        { label: 'SteadyShot', wert: 'Aus' },
        { label: 'Langzeit-Rauschunterdrückung', wert: 'Aus' },
        { label: 'Weißabgleich', wert: '3800–4200K (RAW), in Lightroom feinjustieren' },
        { label: 'Dateiformat', wert: 'RAW' }
      ],
      ausrichtung: 'Süden bis Südosten, Querformat (weiter Blickwinkel für Kernregion + Horizont)',
      photopills: 'Aufgangszeit & Richtung des galaktischen Zentrums prüfen (Night AR / Planner), nur bei Neumond planen, Lichtverschmutzung am Standort checken (Pollution Map).',
      inspiration: 'Festes Vordergrundmotiv suchen (Baum, Fels, Ruine, Zelt) und mit warmweißem Licht kurz während der Belichtung antippen statt dauerhaft anstrahlen. Milchstraße diagonal statt mittig, Kern über dem Motiv positionieren.',
      bearbeitung: 'Lightroom: Weißabgleich auf 3800–4200K feinjustieren · HSL: Blau/Lila-Sättigung & -Luminanz reduzieren · Radialfilter (Feder 70–80) über dem Kern, leicht erwärmen · dezente Vignette · Dunst/Klarheit moderat erhöhen.',
      notizen: ''
    },
    {
      id: neueId(), name: 'Milchstraße (Timelapse)', art: 'ms-timelapse',
      kachelIso: '3200–6400', kachelBlende: 'f/1.8–2.0', kachelZeit: '10–13s',
      equipment: 'Sony α7V · Sony FE 14mm F1.8 GM · stabiles Stativ · Intervalltimer · optional Star Tracker/Slider, ausreichend Akku/Speicherkarte',
      einstellungen: [
        { label: 'ISO', wert: '3200–6400 (über die ganze Serie konstant halten)' },
        { label: 'Blende', wert: 'f/1.8–2.0 (leicht abgeblendet für gleichmäßigere Schärfe)' },
        { label: 'Verschlusszeit', wert: '10–13s Einzelbelichtung, 1–2s Pause' },
        { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
        { label: 'Fokus', wert: 'Manuell, auf ∞, vor Start fixieren und nicht mehr verändern' },
        { label: 'Modus', wert: 'Manuell (M)' },
        { label: 'Verschluss', wert: 'Elektronisch' },
        { label: 'SteadyShot', wert: 'Aus' },
        { label: 'Langzeit-Rauschunterdrückung', wert: 'Aus' },
        { label: 'Weißabgleich', wert: 'Fest einstellen (nicht Auto), sonst flackert die Serie' },
        { label: 'Dateiformat', wert: 'RAW' },
        { label: 'Bildwiedergabe', wert: 'Aus (spart Akku über die lange Serie)' }
      ],
      ausrichtung: 'Süden, Querformat – Kern wandert im Bildverlauf von links nach rechts durchs Bild',
      photopills: 'Zeitfenster mit Night AR planen, in dem der Kern gut im Ausschnitt bleibt. Akku-/Speicherkapazität für die Gesamtdauer vorab durchrechnen. Neumond-Nacht wählen.',
      inspiration: 'Ruhiges, unbewegtes Vordergrundmotiv am Bildrand wählen, damit die Bewegung der Milchstraße den Kontrast bildet. Bei Star Tracker den Vordergrund separat unbewegt aufnehmen und später einblenden.',
      bearbeitung: 'LRTimelapse zum Deflickern & Angleichen der Belichtung über die Serie · Lightroom-Grundentwicklung wie bei der Einzelaufnahme (WB, HSL, Kontrast) · Export als Bildsequenz, Zusammensetzen/Rendern z.B. in LRTimelapse oder Premiere.',
      notizen: ''
    },
    {
      id: neueId(), name: 'Milchstraße (Stacking)', art: 'ms-stacking',
      kachelIso: '1600–3200', kachelBlende: 'f/1.8–2.0', kachelZeit: '10–15s',
      equipment: 'Sony α7V · Sony FE 14mm F1.8 GM · Stativ mit L-Bracket · Fernauslöser/Timer',
      einstellungen: [
        { label: 'ISO (Himmel-Serie)', wert: '1600–3200 (niedriger als bei der Einzelaufnahme, das Stacking reduziert Rauschen)' },
        { label: 'Blende', wert: 'f/1.8–2.0' },
        { label: 'Verschlusszeit (Himmel)', wert: '8–10 Bilder à 10–15s, identischer Ausschnitt' },
        { label: 'ISO/Zeit (Vordergrund)', wert: '2–4 Bilder à 20–30s bei ISO 400–800' },
        { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
        { label: 'Fokus', wert: 'Manuell, auf ∞ – zwischen den Serien nicht verändern' },
        { label: 'Modus', wert: 'Manuell (M)' },
        { label: 'Verschluss', wert: 'Elektronisch' },
        { label: 'SteadyShot', wert: 'Aus' },
        { label: 'Langzeit-Rauschunterdrückung', wert: 'Aus' },
        { label: 'Weißabgleich', wert: 'Fest einstellen (nicht Auto), für konsistentes Stacking' },
        { label: 'Dateiformat', wert: 'RAW' },
        { label: 'Bildwiedergabe', wert: 'Aus (Akku für die mehreren Serien schonen)' }
      ],
      ausrichtung: 'Süden bis Südosten, Querformat – Kamera zwischen den Serien nicht bewegen (identischer Ausschnitt nötig)',
      photopills: 'Wie bei der Einzelaufnahme: Position des galaktischen Zentrums, Neumond, Lichtverschmutzung prüfen. Zusätzlich genug Zeit für die mehreren Serien einplanen (ca. 15–20 Min. Gesamtaufnahmezeit).',
      inspiration: 'Gleiche Bildideen wie bei der Einzelaufnahme (festes Vordergrundmotiv, warmweiß kurz anleuchten, Kern diagonal über dem Motiv) – durch das Stacking bleibt der Himmel dabei deutlich rauschärmer und detailreicher.',
      bearbeitung: 'Himmel-Serie in Sequator oder Starry Landscape Stacker stacken · Vordergrund-Belichtung separat in Photoshop einblenden/maskieren · danach wie bei der Einzelaufnahme in Lightroom: Weißabgleich, HSL Blau/Lila reduzieren, Radialfilter über dem Kern, Vignette, Dunst/Klarheit.',
      notizen: ''
    },
    {
      id: neueId(), name: 'Star Trails', art: 'star-trails',
      kachelIso: '400–800', kachelBlende: 'f/2.8–4', kachelZeit: '30s',
      equipment: 'Sony α7V · Sony FE 14mm F1.8 GM · Stativ mit L-Bracket (Hochformat) · Intervalltimer',
      einstellungen: [
        { label: 'ISO', wert: '400–800' },
        { label: 'Blende', wert: 'f/2.8–4 (abgeblendet für Schärfe)' },
        { label: 'Verschlusszeit', wert: '30s Belichtung, 31s Intervall, ca. 77 Bilder / 40 Min' },
        { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
        { label: 'Fokus', wert: 'Manuell, auf ∞' },
        { label: 'Modus', wert: 'Manuell (M)' },
        { label: 'Verschluss', wert: 'Elektronisch' },
        { label: 'SteadyShot', wert: 'Aus' },
        { label: 'Langzeit-Rauschunterdrückung', wert: 'Zwingend Aus (sonst Lücken zwischen den Trails durch Verarbeitungspause)' },
        { label: 'Weißabgleich', wert: '3800–4200K, je nach Lichtverschmutzung anpassen' },
        { label: 'Dateiformat', wert: 'RAW' },
        { label: 'Bildwiedergabe', wert: 'Aus (Akku für die lange Serie schonen)' }
      ],
      ausrichtung: 'Norden zum Polarstern, Hochformat (konzentrische Kreise, mehr Himmel im Bild)',
      photopills: 'Polarstern-Position prüfen (Kompass/AR), möglichst neumondnah planen (sonst überstrahlt der Vollmond die Spuren), Wetter/Wolkenfreiheit für die gesamte Sequenz checken.',
      inspiration: 'Silhouette (Baum, Gebäude, Person) unter dem Polarstern platzieren, damit die Kreise einen klaren Mittelpunkt bekommen. Wolkenlücken oder Nebelschwaden geben zusätzliche Struktur.',
      bearbeitung: 'Vor dem Stacking: Star Trail CleanR gegen Flugzeug-/Satellitenspuren · Stacking mit StarStaX (Desktop) oder Star Stacker (iPad), Modus Lighten/Maximum · danach Lightroom: Kontrast & Klarheit leicht anheben, Vordergrund separat aufhellen.',
      notizen: ''
    },
    {
      id: neueId(), name: 'Meteoriten', art: 'meteoriten',
      kachelIso: '3200–6400', kachelBlende: 'f/1.8', kachelZeit: '10–15s',
      equipment: 'Sony α7V · Sony FE 14mm F1.8 GM · Stativ · Intervalltimer, ausreichend Speicherkarte/Akku für lange Serie',
      einstellungen: [
        { label: 'ISO', wert: '3200–6400' },
        { label: 'Blende', wert: 'f/1.8 (Offenblende, für möglichst viele/schwache Meteore)' },
        { label: 'Verschlusszeit', wert: '10–15s Einzelbelichtung, minimale Pause' },
        { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
        { label: 'Fokus', wert: 'Manuell, auf ∞' },
        { label: 'Modus', wert: 'Manuell (M)' },
        { label: 'Verschluss', wert: 'Elektronisch' },
        { label: 'SteadyShot', wert: 'Aus' },
        { label: 'Langzeit-Rauschunterdrückung', wert: 'Aus' },
        { label: 'Weißabgleich', wert: '3800–4200K (RAW), in Lightroom feinjustieren' },
        { label: 'Dateiformat', wert: 'RAW' },
        { label: 'Bildwiedergabe', wert: 'Aus (Akku für die durchgehende Serie schonen)' }
      ],
      ausrichtung: 'Radiant (Ursprungspunkt des Schauers) leicht versetzt im Bild, nicht mittig · Querformat für großes Sichtfeld',
      photopills: 'Maximum-Zeitpunkt & Radiant-Position des Schauers prüfen (z.B. Perseiden Mitte August), Mondphase beachten (bei Vollmond kaum schwache Meteore sichtbar), dunklen Standort mit freiem Horizont wählen.',
      inspiration: 'Landschaft oder markantes Vordergrundmotiv als Kontext mit ins Bild nehmen. Die hellsten Meteore erscheinen selten – Geduld einplanen und komplette Serie durchlaufen lassen, auch wenn einzelne Bilder leer bleiben.',
      bearbeitung: 'Einzelbilder mit Meteorspur in Lightroom sichten und markieren · in Photoshop mehrere Bilder mit Meteoren im Modus "Aufhellen" (Lighten) übereinanderlegen für ein Bild mit mehreren Spuren · Himmel/Vordergrund wie bei der Milchstraßenaufnahme feinabstimmen (WB, HSL, Kontrast).',
      notizen: ''
    }
  ];
}

let szenarien = safeParse(store.get(FG_KEYS.szenarien), null);
if (!Array.isArray(szenarien)) szenarien = fgStartbestand();
// Bestehende Speicherstände (vor Einführung von Notizen/Einstellungen-Liste/Kachel-Werten) nachrüsten.
szenarien.forEach(s => {
  if (typeof s.notizen !== 'string') s.notizen = '';
  if (!Array.isArray(s.einstellungen)) {
    s.einstellungen = [
      s.iso ? { label: 'ISO', wert: s.iso } : null,
      s.blende ? { label: 'Blende', wert: s.blende } : null,
      s.verschluss ? { label: 'Verschlusszeit', wert: s.verschluss } : null,
      s.objektiv ? { label: 'Objektiv', wert: s.objektiv } : null
    ].filter(Boolean);
  }
  if (!s.art) s.art = 'ms-shot';
  if (!s.kachelIso) s.kachelIso = (s.einstellungen.find(z => z.label === 'ISO') || {}).wert || '';
  if (!s.kachelBlende) s.kachelBlende = (s.einstellungen.find(z => z.label === 'Blende') || {}).wert || '';
  if (!s.kachelZeit) s.kachelZeit = (s.einstellungen.find(z => z.label === 'Verschlusszeit') || {}).wert || '';
});

function fgPersist(){ store.set(FG_KEYS.szenarien, JSON.stringify(szenarien)); }

/* ---------------- Liste (Bento-Grid, 2 pro Zeile) ---------------- */
function fgKachelZeile(label, wert){
  if (!wert) return '';
  return `<div class="bento-list-row"><span class="bl">${esc(label)}</span><span class="bv">${esc(wert)}</span></div>`;
}

function fgTileHTML(s){
  const icon = FG_GUIDE_ICON[s.art] || '';
  return `<div class="bento-tile" style="position:relative" onclick="fgOpenDetail('${s.id}')">
    <span style="position:absolute;top:15px;right:16px;width:20px;height:20px;color:var(--violet);opacity:0.85">${icon}</span>
    <div class="bento-head"><span class="bento-title">Guides</span></div>
    <div class="bento-primary" style="font-size:1.05rem;white-space:normal;line-height:1.25;padding-right:26px">${esc(s.name)}</div>
    <div class="bento-foot" style="margin-top:auto;padding-top:14px">
      <div class="bento-list">
        ${fgKachelZeile('ISO', s.kachelIso)}
        ${fgKachelZeile('Blende', s.kachelBlende)}
        ${fgKachelZeile('Zeit', s.kachelZeit)}
      </div>
    </div>
  </div>`;
}

function fgRenderList(){
  const el = $('fg-list'), leer = $('fg-empty'); if(!el) return;
  if (leer) leer.style.display = szenarien.length ? 'none' : '';
  el.innerHTML = szenarien.length ? `<div class="bento">${szenarien.map(s => fgTileHTML(s)).join('')}</div>` : '';
}

/* ---------------- Leseansicht ---------------- */
let fgDetailId = null;

function fgAbschnitt(label, text){
  if (!text) return '';
  return `<div class="glass" style="padding:16px 18px;margin-bottom:12px">
    <div class="bento-title" style="margin-bottom:6px">${esc(label)}</div>
    <div style="font-size:0.88rem;color:var(--text);line-height:1.55;white-space:pre-wrap">${esc(text)}</div>
  </div>`;
}

/* Zeilenliste Label links / Wert rechts (Wert darf bei Bedarf mehrzeilig umbrechen,
   bleibt dabei aber rechtsbündig) – für den Abschnitt "Kamera-Einstellungen". */
function fgEinstellungenHTML(liste){
  if (!liste || !liste.length) return '';
  const zeilen = liste.map((z, i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:14px;padding:9px 0;${i < liste.length - 1 ? 'border-bottom:1px solid var(--stroke)' : ''}">
      <span style="font-size:0.82rem;color:var(--text);font-weight:600;flex-shrink:0">${esc(z.label)}</span>
      <span style="font-size:0.82rem;color:var(--muted);text-align:right">${esc(z.wert)}</span>
    </div>`).join('');
  return `<div class="glass" style="padding:16px 18px;margin-bottom:12px">
    <div class="bento-title" style="margin-bottom:2px">Kamera-Einstellungen</div>
    ${zeilen}
  </div>`;
}

function fgOpenDetail(id){
  const s = szenarien.find(x => x.id === id); if (!s) return;
  fgDetailId = id;
  $('fg-detail-title').textContent = s.name;
  $('fg-detail-body').innerHTML =
    fgAbschnitt('Ausrüstung', s.equipment) +
    fgEinstellungenHTML(s.einstellungen) +
    fgAbschnitt('Ausrichtung', s.ausrichtung) +
    fgAbschnitt('PhotoPills-Check', s.photopills) +
    fgAbschnitt('Inspiration & Komposition', s.inspiration) +
    fgAbschnitt('Bearbeitung', s.bearbeitung) +
    `<div class="glass" style="padding:16px 18px;margin-bottom:12px">
      <div class="bento-title" style="margin-bottom:6px">Notizen</div>
      <textarea id="fg-notiz-feld" rows="4" placeholder="Eigene Beobachtungen, Ergebnisse, Anpassungen …"
        style="width:100%;background:transparent;border:none;outline:none;resize:vertical;font:inherit;color:var(--text);line-height:1.55;padding:0">${esc(s.notizen || '')}</textarea>
      <button class="btn btn-secondary" style="margin-top:10px" onclick="fgSaveNotiz()">Notiz speichern</button>
    </div>`;
  const sc = $('fg-detail-screen');
  sc.classList.add('open');
  sc.scrollTop = 0;
  setTimeout(() => { if (sc.classList.contains('open')) sc.classList.add('settled'); }, 460);
}

function fgCloseDetail(){
  const sc = $('fg-detail-screen'); if (!sc) return;
  sc.classList.remove('settled');
  void sc.offsetHeight;
  sc.classList.remove('open');
  fgDetailId = null;
}

function fgSaveNotiz(){
  const s = szenarien.find(x => x.id === fgDetailId); if (!s) return;
  const feld = $('fg-notiz-feld'); if (!feld) return;
  s.notizen = feld.value.trim();
  fgPersist();
  showToast('Notiz gespeichert');
}

/* ---------------- Astro-Kalender ----------------
   Reine Berechnung, nichts davon wird gespeichert. Neumond/Vollmond über die
   synodische Mondperiode ab einem bekannten Referenz-Neumond; Supermond-Kennzeichnung
   über die anomalistische Periode ab dem gut dokumentierten Perigäums-Vollmond vom
   14. November 2016 (nächste reale Übereinstimmung: Supermond am 24.12.2026).
   Meteorschauer über feste, jährlich wiederkehrende Maxima-Daten. Mondfinsternis und
   Milchstraßenkern-Fenster sind feste, recherchierte Termine für 2026 – der Kalender
   läuft bewusst nur bis Jahresende 2026 und müsste für 2027 erweitert werden.
   Ein Neumond während der Milchstraßen-Saison (April–September) heißt direkt
   "Milchstraße" statt "Neumond" – außerhalb der Saison bleibt es "Neumond". */

const FG_KALENDER_ENDE = new Date(2026, 11, 31);   // 31. Dezember 2026 – bewusste Grenze, siehe oben

const FG_WOCHENTAGE = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const FG_MONATE_KURZ = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const FG_MONATE_LANG = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

const FG_METEORSCHAUER = [
  { monat: 0,  tag: 3,  name: 'Quadrantiden' },
  { monat: 3,  tag: 22, name: 'Lyriden' },
  { monat: 4,  tag: 5,  name: 'Eta-Aquariiden' },
  { monat: 7,  tag: 12, name: 'Perseiden' },
  { monat: 9,  tag: 8,  name: 'Draconiden' },
  { monat: 9,  tag: 21, name: 'Orioniden' },
  { monat: 10, tag: 17, name: 'Leoniden' },
  { monat: 11, tag: 14, name: 'Geminiden' },
  { monat: 11, tag: 22, name: 'Ursiden' }
];

/* Recherchiert (August 2026): partielle Mondfinsternis, 93–96% Bedeckung. */
const FG_FINSTERNISSE_2026 = [
  { datum: new Date(2026,7,28), titel: 'Partielle Mondfinsternis',
    notiz: 'Bis zu 93–96% des Mondes im Erdschatten · Beginn 04:34 Uhr, Höhepunkt 06:12 Uhr, kurz vor Monduntergang.' }
];

/* Näherung für Deutschland (50°N): das galaktische Zentrum wird ab Ende Februar in
   der Morgendämmerung tief im Südosten sichtbar und verschwindet ab Ende Oktober
   abends im Südwesten wieder in der Dämmerung. */
const FG_MILCHSTRASSE_FENSTER_2026 = [
  { datum: new Date(2026,1,20), titel: 'Milchstraßenkern ab jetzt sichtbar',
    notiz: 'Kernregion taucht morgens vor der Dämmerung tief im Südosten auf.' },
  { datum: new Date(2026,9,20), titel: 'Milchstraßenkern letztmals gut sichtbar',
    notiz: 'Kernregion verschwindet abends nach der Dämmerung im Südwesten.' }
];

/* ---- Kalender-Icons: kleine, selbst gebaute Marker (24x24, wie ICON_PLANE/BED/PIN
   in mod-reisen.js), keine Vorlage aus dem Netz. Ein Icon pro Ereignistyp, wird in
   fgMarkerHTML() farbig eingefärbt in einen Kreis-Rahmen gesetzt (gleiches Muster wie
   .rt-plane/.rt-bed/.rt-pin im Kern). */
const FG_ICONS = {
  neumond: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 3a9 9 0 1 0 0 18 7 7 0 0 1 0-18Z"/></svg>',
  vollmond: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>',
  supermond: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="10" cy="13" r="7"/><path d="M19 3l1.1 2.9L23 7l-2.9 1.1L19 11l-1.1-2.9L15 7l2.9-1.1L19 3Z"/></svg>',
  meteor: '<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.2" fill="currentColor"/><path d="M8 8 L20 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>',
  finsternis: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/><circle cx="16" cy="9" r="6" fill="var(--bg)"/></svg>',
  milchstrasse: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="18" r="1.8"/><circle cx="12" cy="11" r="2.4"/><circle cx="19" cy="5" r="1.8"/></svg>'
};

function fgMarkerHTML(typ, farbe){
  const icon = FG_ICONS[typ] || FG_ICONS.vollmond;
  return `<span style="position:relative;display:flex;align-items:center;justify-content:center;width:19px;height:19px;border-radius:50%;background:var(--bg);margin-top:1px;box-shadow:0 0 0 3px var(--bg)">
    <span style="width:14px;height:14px;color:${farbe};display:flex">${icon}</span>
  </span>`;
}

/* Wandelt einen UTC-Zeitstempel in ein lokales Datum (Mitternacht) nach Berliner
   Kalendertag um – passend zu heuteBerlin()/isoVon() aus dem Kern, damit Vergleiche
   zwischen berechneten Mondterminen und "heute" auf derselben Zeitzone beruhen. */
function fgDatumBerlin(ms){
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' });
    const t = {}; for (const p of fmt.formatToParts(new Date(ms))) t[p.type] = p.value;
    return new Date(+t.year, +t.month - 1, +t.day);
  } catch(e){ return new Date(ms); }
}

function fgNeumondeZwischen(startD, endD){
  const REF = Date.UTC(2000,0,6,18,14,0);
  const SYN = 29.530588861 * 86400000;
  const arr = [];
  let k = Math.floor((startD.getTime() - 3*86400000 - REF) / SYN);
  for (let i = 0; i < 40; i++){
    const d = fgDatumBerlin(REF + (k+i) * SYN);
    if (d.getTime() > endD.getTime()) break;
    if (d.getTime() >= startD.getTime()) arr.push(d);
  }
  return arr;
}

function fgVollmondeZwischen(startD, endD){
  const SYN = 29.530588861 * 86400000;
  const REF = Date.UTC(2000,0,6,18,14,0) + SYN / 2;
  const arr = [];
  let k = Math.floor((startD.getTime() - 3*86400000 - REF) / SYN);
  for (let i = 0; i < 40; i++){
    const d = fgDatumBerlin(REF + (k+i) * SYN);
    if (d.getTime() > endD.getTime()) break;
    if (d.getTime() >= startD.getTime()) arr.push(d);
  }
  return arr;
}

/* Grobe Näherung: "super", wenn der Vollmond nahe an einem Vielfachen der
   anomalistischen Periode (Erdnähe-Zyklus) ab dem dokumentierten Perigäums-Vollmond
   vom 14.11.2016 liegt. */
function fgIstSupermond(d){
  const ANKER = Date.UTC(2016,10,14,11,0,0);
  const ANOM = 27.554549878 * 86400000;
  const diff = d.getTime() - ANKER;
  const n = Math.round(diff / ANOM);
  const abstand = Math.abs(diff - n * ANOM) / 86400000;
  return abstand <= 1.2;
}

function fgIstMilchstrassenSaison(d){ const m = d.getMonth(); return m >= 3 && m <= 8; }

function fgMeteorschauerZwischen(startD, endD){
  const arr = [];
  for (let jahr = startD.getFullYear(); jahr <= endD.getFullYear(); jahr++){
    FG_METEORSCHAUER.forEach(e => {
      const d = new Date(jahr, e.monat, e.tag);
      if (d.getTime() >= startD.getTime() && d.getTime() <= endD.getTime()) arr.push({ datum: d, name: e.name });
    });
  }
  return arr;
}

function fgFesteTermineZwischen(liste, startD, endD){
  return liste.filter(e => e.datum.getTime() >= startD.getTime() && e.datum.getTime() <= endD.getTime());
}

function fgBaueKalender(startD, endD){
  const events = [];
  fgNeumondeZwischen(startD, endD).forEach(d => {
    const saison = fgIstMilchstrassenSaison(d);
    events.push({
      datum: d, typ: 'neumond', titel: saison ? 'Milchstraße' : 'Neumond',
      notiz: saison ? 'Dunkelster Himmel des Monats – idealer Termin für die Milchstraße' : 'Dunkelster Himmel des Monats'
    });
  });
  fgVollmondeZwischen(startD, endD).forEach(d => {
    const supermond = fgIstSupermond(d);
    events.push({
      datum: d, typ: supermond ? 'supermond' : 'vollmond', titel: supermond ? 'Supermond' : 'Vollmond',
      notiz: supermond ? 'Vollmond nahe der Erdnähe – auffällig groß und hell' : 'Hellste Nacht des Monats – ungünstig für Sternspuren'
    });
  });
  fgMeteorschauerZwischen(startD, endD).forEach(e => events.push({
    datum: e.datum, typ: 'meteor', titel: 'Meteorschauer: ' + e.name, notiz: 'Aktivitätsmaximum'
  }));
  fgFesteTermineZwischen(FG_FINSTERNISSE_2026, startD, endD).forEach(e => events.push({
    datum: e.datum, typ: 'finsternis', titel: e.titel, notiz: e.notiz
  }));
  fgFesteTermineZwischen(FG_MILCHSTRASSE_FENSTER_2026, startD, endD).forEach(e => events.push({
    datum: e.datum, typ: 'milchstrasse', titel: e.titel, notiz: e.notiz
  }));
  events.sort((a,b) => a.datum - b.datum);
  return events;
}

const FG_FARBEN = {
  neumond: 'var(--violet)', vollmond: 'var(--accent)', supermond: 'var(--orange)',
  meteor: 'var(--green)', finsternis: 'var(--danger)', milchstrasse: 'var(--petrol)'
};

function fgRenderCalendar(){
  const el = $('fg-calendar'); if(!el) return;
  const heute = heuteBerlin();
  if (heute.getTime() > FG_KALENDER_ENDE.getTime()){
    el.innerHTML = '<div class="empty">Kalender endet am 31.12.2026 – für 2027 muss er im Modul erweitert werden.</div>';
    return;
  }
  const events = fgBaueKalender(heute, FG_KALENDER_ENDE);
  if (!events.length){ el.innerHTML = '<div class="empty">Keine berechneten Ereignisse bis Jahresende.</div>'; return; }
  el.innerHTML = events.map((e, i) => {
    const farbe = FG_FARBEN[e.typ] || 'var(--accent)';
    return `<div class="rt-row${i === events.length - 1 ? ' last' : ''}">
      <div class="rt-date"><span class="rt-day">${e.datum.getDate()}</span><span class="rt-mon">${FG_MONATE_KURZ[e.datum.getMonth()]}</span></div>
      <div class="rt-line">${fgMarkerHTML(e.typ, farbe)}</div>
      <div class="rt-body">
        <div class="rt-name" style="color:${farbe}">${esc(e.titel)}</div>
        <div class="rt-meta">${esc(FG_WOCHENTAGE[e.datum.getDay()])}, ${e.datum.getDate()}. ${esc(FG_MONATE_LANG[e.datum.getMonth()])}</div>
        ${e.notiz ? `<div class="rt-notes">${esc(e.notiz)}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function fgRender(){ fgRenderList(); fgRenderCalendar(); }

/* ---------------- Sicherung ----------------
   Nur die Guides (inkl. der individuellen Notizen) – der Kalender ist reine
   Berechnung und braucht keine Sicherung. */
function fgBuildBackupPayload(){ return { szenarien }; }
function fgApplyBackup(text){
  const p = safeParse(text, null);
  if (!(p && Array.isArray(p.szenarien))) return false;
  szenarien = p.szenarien;
  szenarien.forEach(s => {
    if (typeof s.notizen !== 'string') s.notizen = '';
    if (!Array.isArray(s.einstellungen)) s.einstellungen = [];
    if (!s.art) s.art = 'ms-shot';
  });
  fgPersist();
  return true;
}

/* Kachel-Grafik: schlichte Kamera, reine Strich-Konstruktion passend zum uebrigen
   Kachel-Stil (wie bei Impfpass), keine Vorlage aus dem Netz. Farbe Violett. */
function fgTileArt(){
  return `<svg viewBox="6 19 108 92" preserveAspectRatio="xMidYMid meet" fill="none" stroke="var(--violet)" stroke-width="2.2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="18" y="42" width="84" height="58" rx="12"/>
    <rect x="42" y="30" width="26" height="16" rx="4"/>
    <circle cx="60" cy="71" r="21"/>
    <circle cx="60" cy="71" r="10"/>
    <circle cx="86" cy="54" r="3.2" fill="var(--violet)" stroke="none"/>
  </svg>`;
}

registerModule({
  id: 'fotografie', name: 'Fotografie', tagline: 'Astro-Guides & Kalender', order: 4,
  keys: FG_KEYS,
  buildPayload: () => fgBuildBackupPayload(),
  applyBackup: (t) => fgApplyBackup(t),
  restoreInfo: p => ((p && p.szenarien || []).length) + ' Guide(s)',
  detect: p => !!(p && Array.isArray(p.szenarien)),
  init: () => { try { fgRender(); } catch(e){} },
  onOpen: () => { try { fgRender(); } catch(e){} },
  summary: () => {
    try {
      const art = fgTileArt();
      const heute = heuteBerlin();
      if (heute.getTime() > FG_KALENDER_ENDE.getTime())
        return { sub: 'Guides & Kalender', value: szenarien.length, unit: szenarien.length === 1 ? 'Guide' : 'Guides', note: 'angelegt', art };
      const events = fgBaueKalender(heute, FG_KALENDER_ENDE);
      if (!events.length) return { sub: 'Guides & Kalender', value: szenarien.length, unit: szenarien.length === 1 ? 'Guide' : 'Guides', note: 'angelegt', art };
      const naechstes = events[0];
      const tage = Math.round((naechstes.datum - heute) / 86400000);
      return { sub: 'Guides & Kalender', value: tage, unit: tage === 1 ? 'Tag' : 'Tage', note: naechstes.titel, art };
    } catch(e) { return { sub: 'Guides & Kalender' }; }
  }
});
