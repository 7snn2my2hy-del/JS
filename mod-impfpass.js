/* ================= BEREICH: IMPFPASS =================
   Eigenständiges Modul. Optik und Bausteine kommen vollständig aus dem
   gemeinsamen Kern in index.html – dieses Modul bringt keine eigene Gestaltung mit. */

document.getElementById('mod-impfpass').insertAdjacentHTML('beforeend', `
<div class="wrap">

  <div class="app-header"><button class="screen-back" aria-label="Zurück" onclick="closeModule()">‹</button><span>Jörg's Impfpass</span></div>

  <div class="glass ov-card" id="imp-overview"></div>

  <div id="imp-alert-wrap"></div>

  <div id="imp-list"></div>
  <div class="empty" id="imp-empty" style="display:none"><b>Noch keine Impfung erfasst</b>Tippe unten, um die erste anzulegen.</div>

  <button class="add-btn" onclick="impOpenModal()">＋ Impfung hinzufügen</button>

  <p class="backup-hint footnote">Auffrischungsintervalle nach RKI/STIKO · nur zur persönlichen Übersicht, ersetzt keine ärztliche Beratung.</p>
</div>

<div class="overlay" id="imp-overlay" onclick="if(event.target===this)impCloseModal()">
  <div class="modal">
    <div class="grabber"></div>
    <h2 id="imp-form-title">Neue Impfung</h2>
    <div class="field-stack">
      <div class="field">
        <label>Impfung</label>
        <input type="text" id="imp-f-name" placeholder="z.B. Tetanus / Diphtherie" autocomplete="off">
      </div>
      <div class="field">
        <label>Kategorie</label>
        <select id="imp-f-kategorie">
          <option value="standard">Standardimpfung</option>
          <option value="indikation">Indikationsimpfung</option>
          <option value="reise">Reiseimpfung</option>
        </select>
      </div>
      <div class="field field-row">
        <div>
          <label>Zuletzt geimpft</label>
          <input type="text" id="imp-f-last" placeholder="TT.MM.JJJJ" inputmode="decimal" autocomplete="off" oninput="autoDate(this)" onblur="fixDate(this);impAutoSuggestNext()">
        </div>
        <div>
          <label>Nächste Auffrischung</label>
          <input type="text" id="imp-f-next" placeholder="TT.MM.JJJJ" inputmode="decimal" autocomplete="off" oninput="autoDate(this)" onblur="fixDate(this)">
        </div>
      </div>
      <div class="field field-row">
        <div>
          <label>Dosen (optional)</label>
          <input type="text" id="imp-f-doses" placeholder="z.B. 2 von 3" autocomplete="off">
        </div>
        <div>
          <label>Impfstoff / Arzt (optional)</label>
          <input type="text" id="imp-f-provider" placeholder="—" autocomplete="off">
        </div>
      </div>
      <div class="field f-toggle">
        <input type="checkbox" id="imp-f-open" class="f-toggle-cb">
        <label class="f-toggle-lab" for="imp-f-open">Impfserie noch unvollständig</label>
      </div>
      <div class="field">
        <label>Notiz (optional)</label>
        <textarea id="imp-f-note" placeholder="z.B. Dosis 3 steht noch aus"></textarea>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="impCloseModal()">Abbrechen</button>
      <button class="btn btn-primary" onclick="impSave()">Speichern</button>
    </div>
  </div>
</div>
`);

/* ---------------- Daten ---------------- */
const IMP_KEYS = { impfungen: 'imp_impfungen_v1', kategorieMigration: 'imp_kategorie_migration_v2' };

/* Kategorien wie im STIKO-Kalender selbst: Standard-, Indikations- und Reiseimpfungen.
   Kein Alters-Clustering - bei einer Einzelperson nicht sinnvoll, STIKO trennt intern
   ohnehin primaer nach dieser Kategorie. */
const IMP_KATEGORIEN = [
  { key: 'standard',   label: 'Standardimpfungen' },
  { key: 'indikation', label: 'Indikationsimpfungen' },
  { key: 'reise',      label: 'Reiseimpfungen' }
];
function impKategorie(e){ return e.kategorie || 'standard'; }

/* Startbestand aus dem bisherigen statischen Impfpass – wird nur einmalig
   angelegt, wenn noch nichts gespeichert ist. Danach frei bearbeitbar.
   Kategorie-Zuordnung nach bestem Wissen (Hepatitis A gilt haeufig als Reise- oder
   Indikationsimpfung, hier als Reise eingeordnet - bei Bedarf im Formular anpassen). */
const IMP_SEED = [
  { name: 'Tetanus / Diphtherie',      last: '2023-03-03', next: '2033-03-03', kategorie: 'standard' },
  { name: 'Keuchhusten',               last: '2023-03-03', next: '',           kategorie: 'standard' },
  { name: 'Polio',                     last: '2017-11-10', next: '',           kategorie: 'standard' },
  { name: 'Masern / Mumps / Röteln',   last: '2018-10-20', next: '',           kategorie: 'standard' },
  { name: 'Hepatitis A + B',           last: '2026-04-27', next: '',           kategorie: 'reise' },
  { name: 'FSME',                      last: '2024-06-07', next: '2029-06-07', kategorie: 'indikation' },
  { name: 'Meningokokken',             last: '2010-08-27', next: '',           kategorie: 'indikation' },
  { name: 'COVID-19',                  last: '2021-12-12', next: '',           kategorie: 'indikation' },
  { name: 'Tollwut',                   last: '',           next: '', open: true, doses: '2 von 3', note: 'Dosis 3 steht noch aus', kategorie: 'reise' },
  { name: 'Typhus',                    last: '2013-03-24', next: '2016-03-24', kategorie: 'reise' }
];

let impfungen = safeParse(store.get(IMP_KEYS.impfungen), null);
if (!Array.isArray(impfungen)) {
  impfungen = IMP_SEED.map((e, i) => Object.assign({ id: 'seed' + i, doses: '', provider: '', note: '', open: false }, e));
  store.set(IMP_KEYS.impfungen, JSON.stringify(impfungen));
}

function impPersist(){ store.set(IMP_KEYS.impfungen, JSON.stringify(impfungen)); }
// Kennungen kommen aus dem Kern (neueId).

/* Alteintraege ohne Kategorie (vor diesem Update angelegt) bekommen "Standardimpfung"
   als Vorschlag - haeufigster Fall, jederzeit im Formular korrigierbar. Laeuft bei
   jedem Start mit, tut aber nichts mehr, sobald einmal alles nachgezogen ist. */
/* Rät die Kategorie aus dem Namen, nach demselben Muster wie IMP_SEED oben.
   Nur die eindeutigen Fälle - alles andere (auch unbekannte Namen) landet bei
   "standard", dem haeufigsten Fall, und ist im Formular jederzeit korrigierbar. */
function impKategorieRaten(name){
  const n = (name || '').toLowerCase();
  if (/tollwut|typhus|gelbfieber|japanische enzephalitis|cholera|hepatitis a/.test(n)) return 'reise';
  if (/fsme|meningokokken|covid|pneumokokken|zoster|gürtelrose|rsv|grippe|influenza/.test(n)) return 'indikation';
  return 'standard';
}

const IMP_KATEGORIE_MIGRATION_KEY = 'imp_kategorie_migration_v2';
function impMigriere(){
  let geaendert = false;
  // Alteintraege ganz ohne Kategorie (vor der ersten Version dieser Funktion angelegt).
  impfungen.forEach(e => { if (!e.kategorie) { e.kategorie = impKategorieRaten(e.name); geaendert = true; } });
  // Einmalige Nachkorrektur: eine fruehere Fassung dieser Funktion hat Alteintraege
  // pauschal auf "standard" gesetzt, statt wie hier nach dem Namen zu raten - dadurch
  // landeten z.B. Tollwut oder FSME faelschlich bei den Standardimpfungen. Laeuft nur
  // dieses eine Mal (Flag unten), damit spaeter von Hand gewaehltes "Standard" nicht
  // wieder umgebogen wird.
  if (!store.get(IMP_KATEGORIE_MIGRATION_KEY)) {
    impfungen.forEach(e => {
      const geraten = impKategorieRaten(e.name);
      if (e.kategorie === 'standard' && geraten !== 'standard') { e.kategorie = geraten; geaendert = true; }
    });
    store.set(IMP_KATEGORIE_MIGRATION_KEY, '1');
  }
  if (geaendert) impPersist();
}

/* ---------------- Status ----------------
   Leitet sich ausschließlich aus den eingetragenen Daten ab – es wird nichts
   selbstständig fortgeschrieben. */
const IMP_SOON_DAYS = 180;

/* Automatischer Auffrisch-Vorschlag NUR fuer die wenigen Impfungen mit einem stabilen,
   fuer alle Erwachsenen gleichermassen geltenden STIKO-Intervall (Stand Epidemiologisches
   Bulletin 4/2026: Tetanus/Diphtherie/Keuchhusten alle 10 Jahre, einmalig als Tdap).
   Bewusst NICHT fuer die anderen Eintraege: Pneumokokken/Herpes Zoster/RSV haengen vom
   Alter ab statt von einem Kalenderintervall, Tollwut/Typhus sind reise-/anlassbezogen
   ohne festen Rhythmus, MMR/Polio haben bei Erwachsenen ueblicherweise gar keine
   periodische Auffrischung. Ein automatischer Vorschlag waere dort falsch praezise. */
const IMP_STIKO_INTERVALL = [
  { muster: /tetanus|diphtherie|keuchhusten|pertussis|tdap/i, jahre: 10 }
];
function impStikoJahre(name){
  const treffer = IMP_STIKO_INTERVALL.find(e => e.muster.test(name || ''));
  return treffer ? treffer.jahre : null;
}
/* Fuellt "Naechste Auffrischung" nur, wenn das Feld noch leer ist - eine bereits von
   Hand eingetragene oder vom Arzt abweichende Angabe wird nie ueberschrieben. */
function impAutoSuggestNext(){
  const jahre = impStikoJahre($('imp-f-name').value);
  if (!jahre) return;
  const nextEl = $('imp-f-next');
  if (nextEl.value.trim()) return;
  const lastIso = deToISO($('imp-f-last').value.trim());
  if (!lastIso) return;
  const d = new Date(lastIso + 'T00:00:00');
  if (isNaN(d)) return;
  d.setFullYear(d.getFullYear() + jahre);
  nextEl.value = isoToDE(d.toISOString().slice(0, 10));
}

function impStatus(e){
  if (e.open) return { key: 'open',    label: 'Unvollständig', pill: 'pill-red' };
  if (e.next){
    const d = daysUntil(e.next);
    if (d !== null && d < 0)              return { key: 'over', label: 'Überfällig',  pill: 'pill-red' };
    if (d !== null && d <= IMP_SOON_DAYS) return { key: 'soon', label: 'Bald fällig', pill: 'pill-orange' };
  }
  return { key: 'ok', label: 'Gültig', pill: 'pill-green' };
}
function impNeedsAction(e){ const k = impStatus(e).key; return k === 'open' || k === 'over'; }

/* Kurztext für die Hinweis-Karte */
function impAlertText(e){
  const st = impStatus(e);
  if (st.key === 'open') return `${e.name} — ${e.note || 'Impfserie noch unvollständig'}`;
  const jahr = e.next ? e.next.slice(0, 4) : '';
  return `${e.name} — überfällig seit ${jahr || displayDate(e.next)}`;
}
function impSoonText(e){
  const tage = daysUntil(e.next);
  return `${e.name} — fällig am ${displayDate(e.next)}${tage != null ? ` (in ${tage} Tagen)` : ''}`;
}

/* Sortierung: Handlungsbedarf zuerst, dann bald fällig, dann alphabetisch */
const IMP_ORDER = { open: 0, over: 1, soon: 2, ok: 3 };
function impSorted(){
  return [...impfungen].sort((a, b) => {
    const d = IMP_ORDER[impStatus(a).key] - IMP_ORDER[impStatus(b).key];
    return d !== 0 ? d : (a.name || '').localeCompare(b.name || '', 'de', { numeric: true });
  });
}

/* ---------------- Darstellung ---------------- */
function impRenderOverview(){
  const el = $('imp-overview'); if(!el) return;
  const gesamt = impfungen.length;
  const offen  = impfungen.filter(impNeedsAction).length;
  const bald   = impfungen.filter(e => impStatus(e).key === 'soon').length;
  el.innerHTML = `
    <div class="ov-stats">
      <div class="stat"><div class="stat-label">Erfasst</div><div class="stat-value">${gesamt}</div></div>
      <div class="stat"><div class="stat-label">Bald fällig</div><div class="stat-value" style="color:${bald ? 'var(--orange)' : 'var(--text)'}">${bald}</div></div>
      <div class="stat"><div class="stat-label">Handlungsbedarf</div><div class="stat-value" style="color:${offen ? 'var(--danger)' : 'var(--green)'}">${offen}</div></div>
    </div>`;
}

/* Zeigt beides direkt im Kopfbereich: was ueberfaellig/unvollstaendig ist
   (Handlungsbedarf, rot) UND was in den naechsten 180 Tagen ansteht (Bald faellig,
   orange) - vorher stand nur die ueberfaellige Liste da, die bald faelligen waren nur
   als Zahl in der Kachel darueber sichtbar, nicht als konkrete Liste. */
function impRenderAlert(){
  const el = $('imp-alert-wrap'); if(!el) return;
  const sortiert = impSorted();
  const dringend = sortiert.filter(impNeedsAction);
  const bald = sortiert.filter(e => impStatus(e).key === 'soon');
  let html = '';
  if (dringend.length){
    html += `<div class="alert-card">
      <div class="alert-title">Handlungsbedarf</div>
      ${dringend.map(e => `<div class="alert-item">${esc(impAlertText(e))}</div>`).join('')}
    </div>`;
  }
  if (bald.length){
    html += `<div class="alert-card alert-card-soon">
      <div class="alert-title">Bald fällig</div>
      ${bald.map(e => `<div class="alert-item">${esc(impSoonText(e))}</div>`).join('')}
    </div>`;
  }
  el.innerHTML = html;
}

function impEntryHTML(e){
  const st = impStatus(e);
  const teile = [];
  if (e.last) teile.push('Zuletzt ' + displayDate(e.last));
  if (e.next) teile.push('Nächste ' + displayDate(e.next));
  if (!teile.length && e.note) teile.push(e.note);
  const pills = [];
  if (e.doses)    pills.push(`<span class="cat-pill pill-muted">${esc(e.doses)}</span>`);
  if (e.provider) pills.push(`<span class="cat-pill pill-muted">${esc(e.provider)}</span>`);
  return `<div class="entry glass" onclick="impOpenModal('${e.id}')">
    <div class="entry-main">
      <div class="entry-name">${esc(e.name)}</div>
      ${teile.length ? `<div class="entry-sub">${esc(teile.join(' · '))}</div>` : ''}
      ${pills.length ? `<div class="entry-pills">${pills.join('')}</div>` : ''}
    </div>
    <div class="entry-right"><span class="cat-pill ${st.pill}">${st.label}</span></div>
  </div>`;
}

function impRenderList(){
  const el = $('imp-list'), leer = $('imp-empty'); if(!el) return;
  const liste = impSorted();
  if (leer) leer.style.display = liste.length ? 'none' : '';
  if (!liste.length){ el.innerHTML = ''; return; }
  let html = '';
  IMP_KATEGORIEN.forEach((kat, i) => {
    const gruppe = liste.filter(e => impKategorie(e) === kat.key);
    if (!gruppe.length) return;
    html += `<div class="section-label${i === 0 ? '' : ' spaced'}">${kat.label}</div>`;
    html += `<div class="list">${gruppe.map(e => swipeWrap('impf', e.id, impEntryHTML(e))).join('')}</div>`;
  });
  el.innerHTML = html;
  el.querySelectorAll('.entry-wrap').forEach(wrap => {
    const id = wrap.dataset.id;
    attachSwipeGeneric(wrap, () => impDelete(id), () => impOpenModal(id));
  });
}

function impRender(){ impRenderOverview(); impRenderAlert(); impRenderList(); }

/* ---------------- Formular ---------------- */
let impEditId = null;

function impOpenModal(id){
  impEditId = id || null;
  const e = id ? impfungen.find(x => x.id === id) : null;
  $('imp-form-title').textContent = e ? 'Impfung bearbeiten' : 'Neue Impfung';
  $('imp-f-name').value      = e ? (e.name || '') : '';
  $('imp-f-kategorie').value = e ? impKategorie(e) : 'standard';
  $('imp-f-last').value     = e ? isoToDE(e.last) : '';
  $('imp-f-next').value     = e ? isoToDE(e.next) : '';
  $('imp-f-doses').value    = e ? (e.doses || '') : '';
  $('imp-f-provider').value = e ? (e.provider || '') : '';
  $('imp-f-note').value     = e ? (e.note || '') : '';
  $('imp-f-open').checked   = e ? !!e.open : false;
  closeOpenSwipe();
  oeffneOverlay('imp-overlay', impCloseModal);
}
function impCloseModal(){ schliesseOverlay('imp-overlay'); impEditId = null; }

async function impSave(){
  const name = $('imp-f-name').value.trim();
  if (!name){ await notify('Bitte einen Namen für die Impfung eintragen.'); return; }
  const daten = {
    name,
    kategorie: $('imp-f-kategorie').value,
    last:     deToISO($('imp-f-last').value.trim()),
    next:     deToISO($('imp-f-next').value.trim()),
    doses:    $('imp-f-doses').value.trim(),
    provider: $('imp-f-provider').value.trim(),
    note:     $('imp-f-note').value.trim(),
    open:     $('imp-f-open').checked
  };
  if (impEditId){
    const e = impfungen.find(x => x.id === impEditId);
    if (e) Object.assign(e, daten);
  } else {
    impfungen.push(Object.assign({ id: neueId() }, daten));
  }
  impPersist();
  impCloseModal();
  impRender();
  showToast('Gespeichert');
}

async function impDelete(id){
  await loeschenMitRueckfrage({
    liste: impfungen, id,
    speichern: () => impPersist(),
    zeichnen: () => impRender()
  });
}

/* ---------------- Sicherung ---------------- */
function impBuildBackupPayload(){ return { impfungen, kategorieMigration: store.get(IMP_KEYS.kategorieMigration) || null }; }
/* Uebernimmt nur Daten und meldet zurueck, ob es geklappt hat. Rueckfrage,
   Erfolgsmeldung und Neuzeichnen macht der Kern in applyCombined – so verhaelt sich
   dieser Bereich beim Wiederherstellen genauso wie Reisen und Finanzen. */
function impApplyBackup(text){
  const p = safeParse(text, null);
  if (!(p && Array.isArray(p.impfungen))) return false;
  impfungen = p.impfungen;
  impPersist();
  // Das Migrations-Flag reist mit, damit die einmalige Kategorie-Nachkorrektur nach
  // einem Wiederherstellen nicht nochmal laeuft und dabei eine inzwischen bewusst auf
  // "standard" gesetzte Impfung erneut umbiegt.
  if (p.kategorieMigration) store.set(IMP_KEYS.kategorieMigration, p.kategorieMigration);
  return true;
}

/* Kachel-Grafik: Virus mit Spritze, schlichte Linienzeichnung passend zum
   uebrigen Kachel-Stil. Eigene Konstruktion – die Vorlage aus dem Netz wird
   bewusst nicht nachgezeichnet.
   Die Spritze liegt auf einer sauberen 45-Grad-Achse: Nadel, Zylinder mit
   Skalenstrichen, Kolben und Griff sitzen alle auf derselben Geraden, damit
   sie nicht auseinanderfaellt. */
function impTileArt(){
  const R = 23, cx = 42, cy = 70;
  let stacheln = '';
  for (let i = 0; i < 12; i++){
    const a = (i / 12) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * R,        y1 = cy + Math.sin(a) * R;
    const x2 = cx + Math.cos(a) * (R + 8),  y2 = cy + Math.sin(a) * (R + 8);
    stacheln += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`
             +  `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="2.6"/>`;
  }

  /* Spritze entlang der Achse von unten-links nach oben-rechts aufbauen.
     u = Laengsrichtung, v = Querrichtung – so bleibt alles exakt ausgerichtet. */
  const s = Math.SQRT1_2;                 // 45 Grad
  const ax = 62, ay = 56;                 // Nadelspitze (zeigt zum Virus)
  const P = (l, q) => [(ax + l * s + q * s).toFixed(1), (ay - l * s + q * s).toFixed(1)];
  const seg = (l1, q1, l2, q2) => { const a = P(l1,q1), b = P(l2,q2); return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; };
  const halbB = 6;                        // halbe Zylinderbreite

  const zyl = [P(14,-halbB), P(40,-halbB), P(40,halbB), P(14,halbB)]
                .map(p => p.join(',')).join(' ');
  const griff = seg(41, -10, 41, 10);     // Fingerauflage am Zylinderende
  const kolben = seg(41, 0, 52, 0) + seg(52, -8, 52, 8);   // Kolbenstange + Daumenplatte
  const nadel = seg(0, 0, 14, 0);
  const ansatz = `<polygon points="${[P(11,-3), P(14,-halbB), P(14,halbB), P(11,3)].map(p=>p.join(',')).join(' ')}"/>`;
  let skala = '';
  for (let i = 1; i <= 4; i++) skala += seg(16 + i * 5, -3.2, 16 + i * 5, 1.2);

    /* Rahmen eng am tatsaechlichen Inhalt (gemessen: x 8.4..104.4, y 13.6..103.6)
     statt der lockeren 120x120-Flaeche – das Icon wird dadurch rund 14% groesser,
     ohne dass an der Zeichnung selbst etwas geaendert wird. */
    /* Leicht eingefaerbt statt rein weiss: Petrol setzt sich vom Blau der
     Laendersilhouette ab und passt zum Gesundheitsthema. */
  return `<svg viewBox="0.7 5.9 111.4 105.4" preserveAspectRatio="xMidYMid meet" fill="none" stroke="var(--petrol)" stroke-width="2.1"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g>
      <circle cx="${cx}" cy="${cy}" r="${R}"/>
      ${stacheln}
      <circle cx="${cx - 7}" cy="${cy - 6}" r="3.4"/>
      <circle cx="${cx + 7}" cy="${cy + 3}" r="4.4"/>
      <circle cx="${cx - 2}" cy="${cy + 10}" r="2.6"/>
    </g>
    <g>
      ${nadel}
      ${ansatz}
      <polygon points="${zyl}"/>
      ${skala}
      ${griff}
      ${kolben}
    </g>
  </svg>`;
}

registerModule({
  id: 'impfpass', name: 'Impfpass', tagline: 'Impfungen', order: 3,
  keys: IMP_KEYS,
  buildPayload: () => impBuildBackupPayload(),
  applyBackup: (t) => impApplyBackup(t),
  restoreInfo: p => ((p && p.impfungen || []).length) + ' Impfung(en)',
  migrate: () => impMigriere(),
  detect: p => !!(p && Array.isArray(p.impfungen)),
  init: () => { try { impRender(); } catch(e){} },
  onOpen: () => { try { impRender(); } catch(e){} },
  summary: () => {
    try {
      const art = impTileArt();
      const offen = impfungen.filter(impNeedsAction).length;
      if (offen) return { sub: 'Impfungen', value: offen, unit: offen === 1 ? 'Hinweis' : 'Hinweise', note: 'Handlungsbedarf', art };
      const bald = impfungen.filter(e => impStatus(e).key === 'soon').length;
      if (bald) return { sub: 'Impfungen', value: bald, unit: bald === 1 ? 'Impfung' : 'Impfungen', note: 'bald fällig', art };
      return { sub: 'Impfungen', value: impfungen.length, unit: impfungen.length === 1 ? 'Impfung' : 'Impfungen', note: 'alle gültig', art };
    } catch(e) { return { sub: 'Impfungen' }; }
  }
});
