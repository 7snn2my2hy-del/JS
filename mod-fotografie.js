/* ================= BEREICH: FOTOGRAFIE =================
   Eigenständiges Modul. Optik und Bausteine kommen aus dem gemeinsamen Kern in
   index.html (.entry, .field, .modal, .rt-row-Zeitleiste …) – dieses Modul bringt
   keine eigene Gestaltung mit, nur eine Handvoll Farbwerte für die Kalender-Punkte,
   die es aus den vorhandenen CSS-Variablen des Kerns schöpft.

   Zwei Teile:
   1) Szenarien – eigene, frei anlegbare Aufnahme-Rezepte (z.B. "Milchstraße",
      "Sternspuren") mit festen Basisfeldern (ISO, Blende, Verschlusszeit,
      Brennweite, Weißabgleich, Ausrüstung) plus einem freien Notizfeld.
   2) Astro-Kalender – rein berechnete Ereignisse (Neumond, Vollmond/Supermond,
      bekannte Meteorschauer) für die kommenden rund acht Monate, dazu ein
      Hinweis auf die Milchstraßen-Saison. Es wird nichts gespeichert oder synchronisiert,
      nur bei jedem Öffnen neu berechnet – es gibt daher auch nichts zu sichern. */

document.getElementById('mod-fotografie').insertAdjacentHTML('beforeend', `
<div class="wrap">

  <div class="app-header"><button class="screen-back" aria-label="Zurück" onclick="closeModule()">‹</button><span>Jörg's Fotografie</span></div>

  <div class="section-label">Szenarien</div>
  <div id="fg-list"></div>
  <div class="empty" id="fg-empty" style="display:none"><b>Noch kein Szenario angelegt</b>Tippe unten, um dein erstes Astrofoto-Rezept anzulegen.</div>
  <button class="add-btn" onclick="fgOpenModal()">＋ Szenario hinzufügen</button>

  <div class="section-label spaced">Astro-Kalender</div>
  <div class="glass" style="padding:16px 18px">
    <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted-2);font-weight:600">Milchstraßen-Saison</div>
    <div style="font-size:1.05rem;font-weight:700;margin-top:6px;letter-spacing:-0.01em">April – September</div>
    <div style="font-size:0.82rem;color:var(--muted);margin-top:5px;line-height:1.5">Galaktisches Zentrum in den dunklen Morgen- bzw. Abendstunden sichtbar – am besten in mondlosen Nächten rund um Neumond.</div>
  </div>
  <div class="rt-list" id="fg-calendar" style="margin-top:16px"></div>

  <p class="backup-hint footnote">Neumond, Vollmond, Supermond-Kennzeichnung und Meteorschauer-Termine sind astronomisch berechnete Näherungswerte – kein amtlicher Almanach.</p>
</div>

<div class="overlay" id="fg-overlay" onclick="if(event.target===this)fgCloseModal()">
  <div class="modal">
    <div class="grabber"></div>
    <h2 id="fg-form-title">Neues Szenario</h2>
    <div class="field-stack">
      <div class="field">
        <label>Titel</label>
        <input type="text" id="fg-f-name" placeholder="z.B. Milchstraße" autocomplete="off">
      </div>
      <div class="field field-row">
        <div>
          <label>ISO</label>
          <input type="text" id="fg-f-iso" placeholder="z.B. 3200–6400" autocomplete="off">
        </div>
        <div>
          <label>Blende</label>
          <input type="text" id="fg-f-blende" placeholder="z.B. f/1.8" autocomplete="off">
        </div>
      </div>
      <div class="field field-row">
        <div>
          <label>Verschlusszeit</label>
          <input type="text" id="fg-f-verschluss" placeholder="z.B. 10–15s" autocomplete="off">
        </div>
        <div>
          <label>Brennweite</label>
          <input type="text" id="fg-f-brennweite" placeholder="z.B. 14mm" autocomplete="off">
        </div>
      </div>
      <div class="field">
        <label>Weißabgleich</label>
        <input type="text" id="fg-f-wb" placeholder="z.B. 3800–4200K" autocomplete="off">
      </div>
      <div class="field">
        <label>Ausrüstung</label>
        <input type="text" id="fg-f-equip" placeholder="z.B. Stativ, L-Bracket, Fernauslöser" autocomplete="off" list="fg-gear-liste">
        <datalist id="fg-gear-liste"></datalist>
      </div>
      <div class="field">
        <label>Notizen</label>
        <textarea id="fg-f-notizen" placeholder="Workflow, Standortwahl, Stacking, Tipps …" rows="4"></textarea>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="fgCloseModal()">Abbrechen</button>
      <button class="btn btn-primary" onclick="fgSave()">Speichern</button>
    </div>
  </div>
</div>
`);

/* ---------------- Daten ---------------- */
const FG_KEYS = { szenarien: 'fg_szenarien_v1' };

/* Startbestand nur beim allerersten Aufruf (noch nichts gespeichert) – danach frei
   editierbar/löschbar wie jeder andere Eintrag. Die Werte entsprechen den in anderen
   Gesprächen ermittelten Einstellungen für die Sony α7V (14mm, 33 MP). */
function fgStartbestand(){
  return [
    {
      id: neueId(), name: 'Milchstraße',
      iso: '3200–6400', blende: 'f/1.8', verschluss: '10–15s (NPF-Regel, 14mm)',
      brennweite: '14mm', wb: '3800–4200K (RAW-Vorschau, in Lightroom feinjustieren)',
      equip: 'Stativ mit L-Bracket, Fernauslöser',
      notizen: 'SteadyShot aus, Langzeit-Rauschunterdrückung aus, elektronischer Verschluss. Dunkler Standort ohne Lichtverschmutzung, Kernregion Richtung Süden.'
    },
    {
      id: neueId(), name: 'Sternspuren',
      iso: '400–800', blende: 'f/2.8–4', verschluss: '30s Belichtung, 31s Intervall, ca. 77 Bilder / 40 Min',
      brennweite: '14mm (weiter Blickwinkel)', wb: '3800–4200K, je nach Lichtverschmutzung anpassen',
      equip: 'Stativ mit L-Bracket (Hochformat), Intervalltimer',
      notizen: 'Richtung Norden zum Polarstern für konzentrische Kreise. Vorher Star Trail CleanR gegen Flugzeug-/Satellitenspuren, danach Stacking mit StarStaX (Desktop) oder Star Stacker (iPad) im Modus Lighten/Maximum.'
    }
  ];
}

let szenarien = safeParse(store.get(FG_KEYS.szenarien), null);
if (!Array.isArray(szenarien)) szenarien = fgStartbestand();

function fgPersist(){ store.set(FG_KEYS.szenarien, JSON.stringify(szenarien)); }

/* ---------------- Liste ---------------- */
function fgEntryHTML(s){
  const kopf = [s.iso ? 'ISO ' + s.iso : '', s.blende, s.verschluss].filter(Boolean).join(' · ');
  return `<div class="entry glass">
    <div class="entry-main">
      <div class="entry-name">${esc(s.name)}</div>
      ${kopf ? `<div class="entry-sub">${esc(kopf)}</div>` : ''}
      ${s.brennweite ? `<div class="entry-sub">${esc(s.brennweite)}</div>` : ''}
    </div>
    <div class="entry-right">${s.wb ? `<span class="cat-pill pill-violet">${esc(s.wb)}</span>` : ''}</div>
  </div>`;
}

function fgRenderList(){
  const el = $('fg-list'), leer = $('fg-empty'); if(!el) return;
  if (leer) leer.style.display = szenarien.length ? 'none' : '';
  el.innerHTML = `<div class="list">${szenarien.map(s => swipeWrap('fg', s.id, fgEntryHTML(s))).join('')}</div>`;
  el.querySelectorAll('.entry-wrap').forEach(wrap => {
    const id = wrap.dataset.id;
    attachSwipeGeneric(wrap, () => fgDelete(id), () => fgOpenModal(id));
  });
}

/* ---------------- Formular ---------------- */
let fgEditId = null;

function fgFuelleGearListe(){
  const dl = $('fg-gear-liste'); if(!dl) return;
  // gearAll() kommt aus dem Reisen-Modul (globale Ausrüstungsliste aus den Einstellungen) –
  // nur Vorschlag per Autovervollständigung, kein Zwang, dieselbe Liste zu benutzen.
  let namen = [];
  try { namen = (typeof gearAll === 'function') ? gearAll() : []; } catch(e){ namen = []; }
  dl.innerHTML = namen.map(n => `<option value="${esc(n)}"></option>`).join('');
}

function fgOpenModal(id){
  fgEditId = id || null;
  const s = id ? szenarien.find(x => x.id === id) : null;
  $('fg-form-title').textContent = s ? 'Szenario bearbeiten' : 'Neues Szenario';
  $('fg-f-name').value      = s ? (s.name || '') : '';
  $('fg-f-iso').value       = s ? (s.iso || '') : '';
  $('fg-f-blende').value    = s ? (s.blende || '') : '';
  $('fg-f-verschluss').value= s ? (s.verschluss || '') : '';
  $('fg-f-brennweite').value= s ? (s.brennweite || '') : '';
  $('fg-f-wb').value        = s ? (s.wb || '') : '';
  $('fg-f-equip').value     = s ? (s.equip || '') : '';
  $('fg-f-notizen').value   = s ? (s.notizen || '') : '';
  fgFuelleGearListe();
  closeOpenSwipe();
  oeffneOverlay('fg-overlay', fgCloseModal);
}
function fgCloseModal(){ schliesseOverlay('fg-overlay'); fgEditId = null; }

async function fgSave(){
  const name = $('fg-f-name').value.trim();
  if (!name){ await notify('Bitte einen Titel für das Szenario eintragen.'); return; }
  const daten = {
    name,
    iso: $('fg-f-iso').value.trim(),
    blende: $('fg-f-blende').value.trim(),
    verschluss: $('fg-f-verschluss').value.trim(),
    brennweite: $('fg-f-brennweite').value.trim(),
    wb: $('fg-f-wb').value.trim(),
    equip: $('fg-f-equip').value.trim(),
    notizen: $('fg-f-notizen').value.trim()
  };
  if (fgEditId){
    const s = szenarien.find(x => x.id === fgEditId);
    if (s) Object.assign(s, daten);
  } else {
    szenarien.push(Object.assign({ id: neueId() }, daten));
  }
  fgPersist();
  fgCloseModal();
  fgRenderList();
  renderLauncher();
  showToast('Gespeichert');
}

async function fgDelete(id){
  await loeschenMitRueckfrage({
    liste: szenarien, id,
    speichern: () => fgPersist(),
    zeichnen: () => fgRenderList()
  });
}

/* ---------------- Astro-Kalender ----------------
   Reine Berechnung, nichts davon wird gespeichert. Neumond/Vollmond über die
   synodische Mondperiode ab einem bekannten Referenz-Neumond; Supermond-Kennzeichnung
   über die anomalistische Periode ab dem gut dokumentierten Perigäums-Vollmond vom
   14. November 2016. Meteorschauer über feste, jährlich wiederkehrende Maxima-Daten.
   Alles bewusst als Näherung – siehe Fußnote im Modul selbst. */

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
  events.sort((a,b) => a.datum - b.datum);
  return events;
}

const FG_FARBEN = { neumond: 'var(--violet)', vollmond: 'var(--accent)', supermond: 'var(--orange)', meteor: 'var(--green)' };

function fgRenderCalendar(){
  const el = $('fg-calendar'); if(!el) return;
  const heute = heuteBerlin();
  const ende = new Date(heute.getTime() + 240 * 86400000);   // ca. 8 Monate voraus
  const events = fgBaueKalender(heute, ende).slice(0, 24);
  if (!events.length){ el.innerHTML = '<div class="empty">Keine berechneten Ereignisse im Zeitraum.</div>'; return; }
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
   Nur die Szenarien – der Kalender ist reine Berechnung und braucht keine Sicherung. */
function fgBuildBackupPayload(){ return { szenarien }; }
function fgApplyBackup(text){
  const p = safeParse(text, null);
  if (!(p && Array.isArray(p.szenarien))) return false;
  szenarien = p.szenarien;
  fgPersist();
  return true;
}

/* Kachel-Grafik: Sichelmond mit zwei kleinen Sternfunkeln, darunter eine schlichte
   Kamera – reine Strich-Konstruktion passend zum uebrigen Kachel-Stil (wie bei
   Impfpass), keine Vorlage aus dem Netz. Farbe Violett, sonst im Stil ungenutzt. */
function fgTileArt(){
  const funkeln = (cx, cy, r) => {
    const arme = [[0,-1],[0,1],[-1,0],[1,0]];
    return arme.map(([dx,dy]) => `<line x1="${cx}" y1="${cy}" x2="${(cx+dx*r).toFixed(1)}" y2="${(cy+dy*r).toFixed(1)}"/>`).join('');
  };
  return `<svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" fill="none" stroke="var(--violet)" stroke-width="2.1"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M70,20 A24,24 0 1 0 70,68 A17,17 0 1 1 70,20 Z"/>
    <g>${funkeln(94, 30, 7)}</g>
    <g>${funkeln(24, 78, 5)}</g>
    <rect x="20" y="66" width="52" height="34" rx="8"/>
    <rect x="34" y="58" width="16" height="10" rx="3"/>
    <circle cx="46" cy="84" r="12"/>
    <circle cx="46" cy="84" r="5.5"/>
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
      const events = fgBaueKalender(heute, new Date(heute.getTime() + 400*86400000));
      if (!events.length) return { sub: 'Fotografie', value: szenarien.length, unit: szenarien.length === 1 ? 'Szenario' : 'Szenarien', note: 'angelegt', art };
      const naechstes = events[0];
      const tage = Math.round((naechstes.datum - heute) / 86400000);
      return { sub: 'Fotografie', value: tage, unit: tage === 1 ? 'Tag' : 'Tage', note: naechstes.titel, art };
    } catch(e) { return { sub: 'Fotografie' }; }
  }
});
