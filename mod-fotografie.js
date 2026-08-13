/* ================= BEREICH: FOTOGRAFIE =================
   Eigenständiges Modul. Optik und Bausteine kommen aus dem gemeinsamen Kern in
   index.html (.bento/.bento-tile, .screen, .glass, .rt-row-Zeitleiste …) – dieses
   Modul bringt keine eigene Gestaltung mit, nur eine Handvoll Farbwerte für die
   Kalender-Punkte, die es aus den vorhandenen CSS-Variablen des Kerns schöpft.

   Zwei Teile:
   1) Szenarien – kuratierte Aufnahme-Rezepte (z.B. "Milchstraße", "Sternspuren").
      Anlegen, Ändern und Löschen passiert bewusst NICHT in der App, sondern hier im
      Gespräch direkt im Code (fgStartbestand) – die App zeigt sie nur an. Einzige
      Ausnahme: ein freies Notizen-Feld pro Szenario, das in der App selbst editiert
      und gespeichert wird. Liste als Bento-Grid (2 pro Zeile), Antippen öffnet eine
      reine Leseansicht.
   2) Astro-Kalender – rein berechnete Ereignisse (Neumond, Vollmond/Supermond,
      Meteorschauer, dazu die für 2026 bekannte Mondfinsternis und das
      Milchstraßenkern-Sichtbarkeitsfenster) bis zum 31.12.2026. Es wird nichts
      gespeichert oder synchronisiert, nur bei jedem Öffnen ab "heute" neu berechnet –
      vergangene Termine fallen dadurch von selbst raus. */

document.getElementById('mod-fotografie').insertAdjacentHTML('beforeend', `
<div class="wrap">

  <div class="app-header"><button class="screen-back" aria-label="Zurück" onclick="closeModule()">‹</button><span>Jörg's Fotografie</span></div>

  <div id="fg-list"></div>
  <div class="empty" id="fg-empty" style="display:none">Noch keine Szenarien hinterlegt.</div>

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
   Szenario-Vorgaben unten – Kamera und Objektive stehen dadurch verlässlich fest,
   Zubehör (Stativ, L-Bracket, Fernauslöser …) wird pro Szenario passend dazugeschrieben. */
const FG_AUSRUESTUNG = {
  kamera: 'Sony α7V',
  objektive: [
    { name: 'Sony FE 14mm F1.8 GM',         blendeMax: 'f/1.8' },
    { name: 'Sony FE 35mm F1.4 GM',         blendeMax: 'f/1.4' },
    { name: 'Sony FE 70–200mm F2.8 GM II',  blendeMax: 'f/2.8' },
    { name: 'Sony FE 200–600mm F5.6–6.3 G', blendeMax: 'f/5.6–6.3' }
  ]
};

/* ---------------- Daten ---------------- */
const FG_KEYS = { szenarien: 'fg_szenarien_v1' };

/* Kuratierter Bestand – Anlegen/Ändern/Löschen passiert hier im Code, nicht in der App
   (siehe Kopfkommentar). Inhalte bewusst konkret, basierend auf FG_AUSRUESTUNG und den
   in früheren Gesprächen ermittelten Einstellungen. */
function fgStartbestand(){
  return [
    {
      id: neueId(), name: 'Milchstraße',
      equipment: 'Sony α7V · Sony FE 14mm F1.8 GM · Stativ mit L-Bracket · Fernauslöser/Timer',
      iso: '3200–6400', verschluss: '10–15s (NPF-Regel bei 14mm)',
      objektiv: 'Sony FE 14mm F1.8 GM', blende: 'f/1.8 (Offenblende)',
      ausrichtung: 'Süden bis Südosten, Querformat (weiter Blickwinkel für Kernregion + Horizont)',
      photopills: 'Aufgangszeit & Richtung des galaktischen Zentrums prüfen (Night AR / Planner), nur bei Neumond planen, Lichtverschmutzung am Standort checken (Pollution Map).',
      inspiration: 'Festes Vordergrundmotiv suchen (Baum, Fels, Ruine, Zelt) und mit warmweißem Licht kurz während der Belichtung antippen statt dauerhaft anstrahlen. Milchstraße diagonal statt mittig, Kern über dem Motiv positionieren.',
      bearbeitung: 'Lightroom: Weißabgleich auf 3800–4200K feinjustieren · HSL: Blau/Lila-Sättigung & -Luminanz reduzieren · Radialfilter (Feder 70–80) über dem Kern, leicht erwärmen · dezente Vignette · Dunst/Klarheit moderat erhöhen.',
      notizen: ''
    },
    {
      id: neueId(), name: 'Sternspuren',
      equipment: 'Sony α7V · Sony FE 14mm F1.8 GM · Stativ mit L-Bracket (Hochformat) · Intervalltimer',
      iso: '400–800', verschluss: '30s Belichtung, 31s Intervall, ca. 77 Bilder / 40 Min',
      objektiv: 'Sony FE 14mm F1.8 GM', blende: 'f/2.8–4 (abgeblendet für Schärfe)',
      ausrichtung: 'Norden zum Polarstern, Hochformat (konzentrische Kreise, mehr Himmel im Bild)',
      photopills: 'Polarstern-Position prüfen (Kompass/AR), möglichst neumondnah planen (sonst überstrahlt der Vollmond die Spuren), Wetter/Wolkenfreiheit für die gesamte Sequenz checken.',
      inspiration: 'Silhouette (Baum, Gebäude, Person) unter dem Polarstern platzieren, damit die Kreise einen klaren Mittelpunkt bekommen. Wolkenlücken oder Nebelschwaden geben zusätzliche Struktur.',
      bearbeitung: 'Vor dem Stacking: Star Trail CleanR gegen Flugzeug-/Satellitenspuren · Stacking mit StarStaX (Desktop) oder Star Stacker (iPad), Modus Lighten/Maximum · danach Lightroom: Kontrast & Klarheit leicht anheben, Vordergrund separat aufhellen.',
      notizen: ''
    }
  ];
}

let szenarien = safeParse(store.get(FG_KEYS.szenarien), null);
if (!Array.isArray(szenarien)) szenarien = fgStartbestand();
// Bestehende Speicherstände (vor Einführung des Notizen-Felds) nachrüsten.
szenarien.forEach(s => { if (typeof s.notizen !== 'string') s.notizen = ''; });

function fgPersist(){ store.set(FG_KEYS.szenarien, JSON.stringify(szenarien)); }

/* ---------------- Liste (Bento-Grid, 2 pro Zeile) ---------------- */
function fgTileHTML(s){
  const kurz = [s.objektiv, s.ausrichtung].filter(Boolean).join(' · ');
  return `<div class="bento-tile" onclick="fgOpenDetail('${s.id}')">
    <div class="bento-head"><span class="bento-title">Szenario</span></div>
    <div class="bento-primary" style="font-size:1.05rem;white-space:normal;line-height:1.25">${esc(s.name)}</div>
    ${kurz ? `<div class="bento-foot"><div style="font-size:0.74rem;color:var(--muted);line-height:1.4">${esc(kurz)}</div></div>` : ''}
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

function fgOpenDetail(id){
  const s = szenarien.find(x => x.id === id); if (!s) return;
  fgDetailId = id;
  $('fg-detail-title').textContent = s.name;
  const kameraEinst = [s.iso ? 'ISO ' + s.iso : '', s.verschluss].filter(Boolean).join(' · ');
  const objektivEinst = [s.objektiv, s.blende].filter(Boolean).join(' · ');
  $('fg-detail-body').innerHTML =
    fgAbschnitt('Ausrüstung', s.equipment) +
    fgAbschnitt('Kamera-Einstellungen', kameraEinst) +
    fgAbschnitt('Objektiv-Einstellungen', objektivEinst) +
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
   läuft bewusst nur bis Jahresende 2026 und müsste für 2027 erweitert werden. */

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
  fgNeumondeZwischen(startD, endD).forEach(d => events.push({
    datum: d, typ: 'neumond', titel: 'Neumond',
    notiz: fgIstMilchstrassenSaison(d) ? 'Dunkelster Himmel des Monats – idealer Termin für die Milchstraße' : 'Dunkelster Himmel des Monats'
  }));
  fgVollmondeZwischen(startD, endD).forEach(d => {
    const supermond = fgIstSupermond(d);
    events.push({
      datum: d, typ: supermond ? 'supermond' : 'vollmond', titel: supermond ? 'Supermond' : 'Vollmond',
      notiz: supermond ? 'Vollmond nahe der Erdnähe – auffällig groß und hell' : 'Hellste Nacht des Monats – ungünstig für Milchstraße/Sternspuren'
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
      <div class="rt-line"><span class="rt-dot" style="background:${farbe}"></span></div>
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
   Nur die Szenarien (inkl. der individuellen Notizen) – der Kalender ist reine
   Berechnung und braucht keine Sicherung. */
function fgBuildBackupPayload(){ return { szenarien }; }
function fgApplyBackup(text){
  const p = safeParse(text, null);
  if (!(p && Array.isArray(p.szenarien))) return false;
  szenarien = p.szenarien;
  szenarien.forEach(s => { if (typeof s.notizen !== 'string') s.notizen = ''; });
  fgPersist();
  return true;
}

/* Kachel-Grafik: schlichte Kamera, reine Strich-Konstruktion passend zum uebrigen
   Kachel-Stil (wie bei Impfpass), keine Vorlage aus dem Netz. Farbe Violett.
   viewBox eng um die Form geschnitten (wie bei Impfpass), damit die Grafik die
   Kachel genauso ausfuellt wie bei den anderen Modulen, statt mit viel Leerraum
   drumherum kleiner zu wirken. */
function fgTileArt(){
  return `<svg viewBox="15 27 90 76" preserveAspectRatio="xMidYMid meet" fill="none" stroke="var(--violet)" stroke-width="2.4"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="18" y="42" width="84" height="58" rx="12"/>
    <rect x="42" y="30" width="26" height="16" rx="4"/>
    <circle cx="60" cy="71" r="21"/>
    <circle cx="60" cy="71" r="10"/>
    <circle cx="86" cy="54" r="3.2" fill="var(--violet)" stroke="none"/>
  </svg>`;
}

registerModule({
  id: 'fotografie', name: 'Fotografie', tagline: 'Astro-Szenarien & Kalender', order: 4,
  keys: FG_KEYS,
  buildPayload: () => fgBuildBackupPayload(),
  applyBackup: (t) => fgApplyBackup(t),
  restoreInfo: p => ((p && p.szenarien || []).length) + ' Szenario/Szenarien',
  detect: p => !!(p && Array.isArray(p.szenarien)),
  init: () => { try { fgRender(); } catch(e){} },
  onOpen: () => { try { fgRender(); } catch(e){} },
  summary: () => {
    try {
      const art = fgTileArt();
      const heute = heuteBerlin();
      if (heute.getTime() > FG_KALENDER_ENDE.getTime())
        return { sub: 'Guidelines & Kalender', value: szenarien.length, unit: szenarien.length === 1 ? 'Szenario' : 'Szenarien', note: 'angelegt', art };
      const events = fgBaueKalender(heute, FG_KALENDER_ENDE);
      if (!events.length) return { sub: 'Guidelines & Kalender', value: szenarien.length, unit: szenarien.length === 1 ? 'Szenario' : 'Szenarien', note: 'angelegt', art };
      const naechstes = events[0];
      const tage = Math.round((naechstes.datum - heute) / 86400000);
      return { sub: 'Guidelines & Kalender', value: tage, unit: tage === 1 ? 'Tag' : 'Tage', note: naechstes.titel, art };
    } catch(e) { return { sub: 'Guidelines & Kalender' }; }
  }
});
