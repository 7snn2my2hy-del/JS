/* ================= BEREICH: IMPFPASS =================
   Eigenständiges Modul. Optik und Bausteine kommen vollständig aus dem
   gemeinsamen Kern in index.html – dieses Modul bringt keine eigene Gestaltung mit. */

document.getElementById('mod-impfpass').insertAdjacentHTML('beforeend', `
<div class="wrap">

  <div class="app-header"><button class="screen-back" aria-label="Zurück" onclick="closeModule()">‹</button><span>Jörg's Impfpass</span></div>

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
        <input type="text" id="imp-f-name" placeholder="z.B. Tetanus / Diphtherie" autocomplete="off" oninput="impZeigeStikoHinweis()">
      </div>
      <div class="field">
        <label>Kategorie</label>
        <select id="imp-f-kategorie">
          <option value="standard">Standardimpfung</option>
          <option value="indikation">Indikationsimpfung</option>
          <option value="reise">Reiseimpfung</option>
        </select>
      </div>
      <div class="imp-hinweis" id="imp-stiko-hinweis" style="display:none"></div>
      <div class="field">
        <div id="imp-dosen-liste"></div>
        <button type="button" class="imp-dose-add" onclick="impDoseHinzufuegen()">＋ weitere Impfung</button>
      </div>
      <div class="field" id="imp-f-next-wrap">
        <label>Nächste Auffrischung (falls bekannt)</label>
        <input type="text" id="imp-f-next" placeholder="TT.MM.JJJJ" inputmode="decimal" autocomplete="off" oninput="autoDate(this)" onblur="fixDate(this)">
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
const IMP_KEYS = { impfungen: 'imp_impfungen_v1', kategorieMigration: 'imp_kategorie_migration_v2', dosenMigration: 'imp_dosen_migration_v1', abgleich2026: 'imp_abgleich_2026_v2' };

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
  { name: 'Tetanus / Diphtherie',      dosen: ['2023-03-03'], kategorie: 'standard' },
  { name: 'Keuchhusten',               dosen: ['2023-03-03'], kategorie: 'standard' },
  { name: 'Polio',                     dosen: ['2017-11-10'], kategorie: 'standard' },
  { name: 'Masern / Mumps / Röteln',   dosen: ['2018-10-20'], kategorie: 'standard' },
  { name: 'Hepatitis A + B',           dosen: ['2026-04-27'], kategorie: 'reise' },
  { name: 'FSME',                      dosen: ['2024-06-07'], next: '2029-06-07', kategorie: 'indikation' },
  { name: 'Meningokokken',             dosen: ['2010-08-27'], kategorie: 'indikation' },
  { name: 'COVID-19',                  dosen: ['2021-12-12'], kategorie: 'indikation' },
  { name: 'Tollwut',                   dosen: [],             kategorie: 'reise' },
  { name: 'Typhus',                    dosen: ['2013-03-24'], next: '2016-03-24', kategorie: 'reise' }
];

let impfungen = safeParse(store.get(IMP_KEYS.impfungen), null);
if (!Array.isArray(impfungen)) {
  impfungen = IMP_SEED.map((e, i) => Object.assign({ id: 'seed' + i, next: '' }, e));
  store.set(IMP_KEYS.impfungen, JSON.stringify(impfungen));
}

function impPersist(){ store.set(IMP_KEYS.impfungen, JSON.stringify(impfungen)); }
// Kennungen kommen aus dem Kern (neueId).

/* Automatische Auffrisch-/Vollstaendigkeitspruefung NUR fuer die wenigen Impfungen mit
   einem stabilen, fuer alle Erwachsenen gleichermassen geltenden STIKO-Schema (Stand
   Epidemiologisches Bulletin 4/2026). Bei allen anderen (Tollwut, Typhus, FSME,
   Meningokokken, COVID-19, Polio, MMR ...) waere ein automatisches Schema falsch
   praezise - Grund und Dosenzahl haengen dort vom Alter, Impfstofftyp oder Anlass ab,
   nicht von einer festen Regel. Dort bleibt "Naechste Auffrischung" eine manuelle,
   optionale Angabe wie bisher. */
const IMP_STIKO_SCHEMA = [
  { muster: /tetanus|diphtherie|keuchhusten|pertussis|tdap/i,
    dosenNoetig: 1, auffrischJahre: 10,
    hinweis: 'STIKO: Bei vollständiger Grundimmunisierung genügt 1 Auffrischung, danach alle 10 Jahre erneut auffrischen.' },
  { muster: /hepatitis\s*a\s*\+?\s*b|hepatitis\s*b\s*\+?\s*a|twinrix/i,
    dosenNoetig: 3, auffrischJahre: null,
    hinweis: 'STIKO: 3 Dosen für die Grundimmunisierung (Monat 0, 1, 6), danach in der Regel keine routinemäßige Auffrischung.' }
];
function impSchemaFuer(name){
  return IMP_STIKO_SCHEMA.find(e => e.muster.test(name || '')) || null;
}

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
const IMP_DOSEN_MIGRATION_KEY = 'imp_dosen_migration_v1';
const IMP_ABGLEICH_2026_KEY = 'imp_abgleich_2026_v2';

/* Vollstaendiger Bestand, 1:1 aus dem gelben Impfpass abgelesen (Fotos vom 11.8.2026,
   Seiten 7, 8, 10, 11, 15, 17). Ersetzt beim einmaligen Abgleich unten den kompletten
   bisherigen Bestand - alles, was NICHT im Impfpass steht, faellt dabei raus (z.B. ein
   frueher vorhandenes Datum 03.03.2023 bei Tetanus/Keuchhusten, das auf keiner Seite
   des Passes zu finden ist).

   Kombinationsimpfstoffe sind bei JEDER enthaltenen Komponente eingetragen, weil eine
   Spritze mehrere Antigene abdeckt - dasselbe Datum taucht daher mehrfach auf:
     Td-Virelon (02.03.2007) = Tetanus + Diphtherie + Polio
     Repevax    (10.11.2017) = Tetanus + Diphtherie + Pertussis + Polio
     Boostrix   (19.05.2026) = Tetanus + Diphtherie + Pertussis
     Twinrix    (4x)         = Hepatitis A + Hepatitis B

   Keuchhusten/Pertussis: In der Kindertabelle auf Seite 7 ist die Pertussis-Spalte in
   allen Zeilen leer (nur Diphtherie und Tetanus sind angekreuzt) - in den 1980ern war
   die Keuchhustenimpfung zeitweise nicht allgemein empfohlen. Die erste dokumentierte
   Pertussis-Komponente kommt daher erst 2017 ueber Repevax. */
const IMP_PASS_2026 = [
  { name: 'Tetanus / Diphtherie', kategorie: 'standard',
    dosen: ['1989-01-20','1989-02-21','1990-01-08','1996-06-07','2007-03-02','2017-11-10','2026-05-19'] },
  { name: 'Keuchhusten', kategorie: 'standard',
    dosen: ['2017-11-10','2026-05-19'] },
  { name: 'Polio', kategorie: 'standard',
    dosen: ['1989-01-31','1989-03-09','1990-02-14','1997-11-12','2007-03-02','2017-11-10'] },
  { name: 'Masern / Mumps / Röteln', kategorie: 'standard',
    dosen: ['2010-08-23','2010-10-20'] },
  { name: 'Meningokokken', kategorie: 'indikation',
    dosen: ['2010-08-27'] },
  { name: 'COVID-19', kategorie: 'indikation',
    dosen: ['2021-05-30','2021-07-12','2021-12-12'] },
  { name: 'FSME', kategorie: 'indikation',
    dosen: ['2023-03-16','2023-04-20','2024-06-07'] },
  { name: 'Hepatitis A + B', kategorie: 'reise',
    dosen: ['2013-07-15','2013-08-12','2014-03-17','2026-04-27'] },
  { name: 'Typhus', kategorie: 'reise',
    dosen: ['2013-07-24'] },
  { name: 'Tollwut', kategorie: 'reise',
    dosen: ['2026-06-01','2026-06-08','2026-06-22'] }
];

/* Einmaliger, vollstaendiger Abgleich mit dem Impfpass. Bewusst ein harter Ersatz statt
   eines schrittweisen Zusammenfuehrens: Joerg will exakt den Papierstand in der App,
   ohne Reste aus dem urspruenglichen Startbestand. Laeuft nur dieses eine Mal (Flag),
   danach sind alle spaeteren Aenderungen wieder allein seine. */
function impAbgleich2026(){
  if (store.get(IMP_ABGLEICH_2026_KEY)) return;
  impfungen = IMP_PASS_2026.map((e, i) => ({
    id: 'pass' + i,
    name: e.name,
    kategorie: e.kategorie,
    dosen: e.dosen.slice().sort(),
    next: ''
  }));
  store.set(IMP_ABGLEICH_2026_KEY, '1');
  impPersist();
}

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
  // Umstellung vom alten Einzeldatum ("Zuletzt geimpft") auf die neue Dosen-Liste.
  // "last" wird die erste (und meist einzige bekannte) Dosis; "doses"/"open"/"note"/
  // "provider" gab es als freie Textfelder und lassen sich nicht verlustfrei in
  // einzelne Dosis-Daten uebersetzen - sie bleiben unsichtbar am Eintrag haengen statt
  // geloescht zu werden, falls sie spaeter doch noch gebraucht werden. Laeuft nur einmal.
  if (!store.get(IMP_DOSEN_MIGRATION_KEY)) {
    impfungen.forEach(e => {
      if (!Array.isArray(e.dosen)) {
        e.dosen = e.last ? [e.last] : [];
        geaendert = true;
      }
    });
    store.set(IMP_DOSEN_MIGRATION_KEY, '1');
  }
  if (geaendert) impPersist();
  // Erst NACH der Dosen-Migration, da hier bereits ein Array vorausgesetzt wird.
  impAbgleich2026();
}

/* ---------------- Status ----------------
   Leitet sich ausschließlich aus den eingetragenen Daten ab – es wird nichts
   selbstständig fortgeschrieben. */
const IMP_SOON_DAYS = 180;

/* Chronologisch sortierte Liste der erfassten Impfdaten (leere/ungueltige raus). */
function impDosenListe(e){ return Array.isArray(e.dosen) ? e.dosen.filter(Boolean).sort() : []; }

/* Zeigt/versteckt den STIKO-Hinweistext und das manuelle "Naechste Auffrischung"-Feld,
   je nachdem ob der eingetragene Name ein bekanntes Schema hat. Bei bekanntem Schema
   rechnet die App selbst - das manuelle Feld waere dort widerspruechlich und wird
   ausgeblendet, nicht nur versteckt gehalten (der Wert bleibt aber erhalten, falls
   vorher schon einer drinstand, z.B. aus der Zeit vor dieser Funktion). */
function impZeigeStikoHinweis(){
  const schema = impSchemaFuer($('imp-f-name').value);
  const hinweisEl = $('imp-stiko-hinweis');
  const nextWrap = $('imp-f-next-wrap');
  if (schema) {
    hinweisEl.style.display = '';
    hinweisEl.textContent = schema.hinweis;
    nextWrap.style.display = 'none';
  } else {
    hinweisEl.style.display = 'none';
    hinweisEl.textContent = '';
    nextWrap.style.display = '';
  }
}

function impStatus(e){
  const schema = impSchemaFuer(e.name);
  const dosen = impDosenListe(e);
  if (schema) {
    if (dosen.length < schema.dosenNoetig) {
      return { key: 'open', label: 'Unvollständig', pill: 'pill-red', next: null };
    }
    if (schema.auffrischJahre) {
      const d = new Date(dosen[dosen.length - 1] + 'T00:00:00');
      d.setFullYear(d.getFullYear() + schema.auffrischJahre);
      const naechste = d.toISOString().slice(0, 10);
      const tage = daysUntil(naechste);
      if (tage !== null && tage < 0)              return { key: 'over', label: 'Überfällig',  pill: 'pill-red',    next: naechste };
      if (tage !== null && tage <= IMP_SOON_DAYS) return { key: 'soon', label: 'Bald fällig', pill: 'pill-orange', next: naechste };
      return { key: 'ok', label: 'Gültig', pill: 'pill-green', next: naechste };
    }
    return { key: 'ok', label: 'Gültig', pill: 'pill-green', next: null };
  }
  // Kein bekanntes Schema: wie bisher rein manuell, nur falls ein "next"-Datum
  // hinterlegt ist. Ohne Datum keine Dringlichkeitseinstufung moeglich - das ist
  // ehrlicher als geraten.
  if (e.next) {
    const tage = daysUntil(e.next);
    if (tage !== null && tage < 0)              return { key: 'over', label: 'Überfällig',  pill: 'pill-red',    next: e.next };
    if (tage !== null && tage <= IMP_SOON_DAYS) return { key: 'soon', label: 'Bald fällig', pill: 'pill-orange', next: e.next };
  }
  return { key: 'ok', label: dosen.length ? 'Erfasst' : 'Gültig', pill: dosen.length ? 'pill-muted' : 'pill-green', next: e.next || null };
}
function impNeedsAction(e){ const k = impStatus(e).key; return k === 'open' || k === 'over'; }

/* Kurztext für die Hinweis-Karte */
function impRadarText(e, st){
  if (st.key === 'open') {
    const schema = impSchemaFuer(e.name);
    const n = impDosenListe(e).length;
    return schema ? `${e.name} — ${n} von ${schema.dosenNoetig} Dosen` : `${e.name} — unvollständig`;
  }
  if (st.key === 'over') return st.next ? `${e.name} — überfällig seit ${displayDate(st.next)}` : `${e.name} — überfällig`;
  const tage = st.next ? daysUntil(st.next) : null;
  return `${e.name} — fällig am ${displayDate(st.next)}${tage != null ? ` (in ${tage} Tagen)` : ''}`;
}

/* Sortierung: Handlungsbedarf zuerst, dann bald fällig, dann alphabetisch */
const IMP_ORDER = { open: 0, over: 1, soon: 2, ok: 3 };
function impSorted(){
  return [...impfungen].sort((a, b) => {
    const d = IMP_ORDER[impStatus(a).key] - IMP_ORDER[impStatus(b).key];
    return d !== 0 ? d : (a.name || '').localeCompare(b.name || '', 'de', { numeric: true });
  });
}

/* Die drei dringlichsten Eintraege: unvollstaendig/ueberfaellig zuerst, dann bald
   faellig, jeweils nach Datum sortiert. Analog zum Kuendigungs-Radar in Finanzen -
   eine kompakte, dringlichkeitssortierte Liste statt einzelner Kennzahlen. */
function impDringlichkeitsListe(){
  const eintraege = impfungen.map(e => ({ e, st: impStatus(e) }))
    .filter(x => x.st.key === 'open' || x.st.key === 'over' || x.st.key === 'soon');
  const rang = { open: 0, over: 1, soon: 2 };
  eintraege.sort((a, b) => {
    const r = rang[a.st.key] - rang[b.st.key];
    if (r !== 0) return r;
    const da = a.st.next || '9999-99-99', db = b.st.next || '9999-99-99';
    return da.localeCompare(db);
  });
  return eintraege.slice(0, 3);
}

/* ---------------- Darstellung ---------------- */
function impRenderAlert(){
  const el = $('imp-alert-wrap'); if (!el) return;
  const liste = impDringlichkeitsListe();
  if (!liste.length) {
    el.innerHTML = `<div class="empty"><b>Alles erledigt</b>Keine Impfung ist überfällig, unvollständig oder steht in Kürze an.</div>`;
    return;
  }
  el.innerHTML = `<div class="alert-card">
    <div class="alert-title">Als Nächstes fällig</div>
    ${liste.map(({ e, st }) => `<div class="alert-item">${esc(impRadarText(e, st))}</div>`).join('')}
  </div>`;
}

function impEntryHTML(e){
  const st = impStatus(e);
  const dosen = impDosenListe(e);
  const letzte = dosen.length ? dosen[dosen.length - 1] : '';
  const teile = [];
  teile.push('Letzte Impfung: ' + (letzte ? displayDate(letzte) : '–'));
  teile.push('Nächste Impfung: ' + (st.next ? displayDate(st.next) : '–'));
  return `<div class="entry glass">
    <div class="entry-main">
      <div class="entry-name">${esc(e.name)}</div>
      <div class="entry-sub">${esc(teile[0])}</div>
      <div class="entry-sub">${esc(teile[1])}</div>
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

function impRender(){ impRenderAlert(); impRenderList(); }

/* ---------------- Formular ---------------- */
let impEditId = null;
let impDosenBearbeitung = [];   // Arbeitskopie der Dosen-Liste, waehrend das Formular offen ist

function impRenderDosenListe(){
  const el = $('imp-dosen-liste'); if (!el) return;
  if (!impDosenBearbeitung.length) impDosenBearbeitung = [''];
  el.innerHTML = impDosenBearbeitung.map((datum, i) => `
    <div class="field imp-dose-row">
      <div class="imp-dose-input-wrap">
        <label>Impfung ${i + 1}</label>
        <input type="text" class="imp-dose-input" placeholder="TT.MM.JJJJ" inputmode="decimal" autocomplete="off"
               value="${esc(isoToDE(datum))}" oninput="autoDate(this)" onblur="fixDate(this);impDoseAktualisieren(${i},this.value)">
      </div>
      ${impDosenBearbeitung.length > 1 ? `<button type="button" class="imp-dose-remove" onclick="impDoseEntfernen(${i})" aria-label="Impfung ${i + 1} entfernen">✕</button>` : ''}
    </div>`).join('');
}
function impDoseAktualisieren(i, deVal){ impDosenBearbeitung[i] = deToISO(deVal.trim()); }
function impDoseHinzufuegen(){ impDosenBearbeitung.push(''); impRenderDosenListe(); }
function impDoseEntfernen(i){ impDosenBearbeitung.splice(i, 1); impRenderDosenListe(); }

function impOpenModal(id){
  impEditId = id || null;
  const e = id ? impfungen.find(x => x.id === id) : null;
  $('imp-form-title').textContent = e ? 'Impfung bearbeiten' : 'Neue Impfung';
  $('imp-f-name').value      = e ? (e.name || '') : '';
  $('imp-f-kategorie').value = e ? impKategorie(e) : 'standard';
  $('imp-f-next').value      = e ? isoToDE(e.next) : '';
  impDosenBearbeitung = e ? impDosenListe(e).slice() : [];
  impRenderDosenListe();
  impZeigeStikoHinweis();
  closeOpenSwipe();
  oeffneOverlay('imp-overlay', impCloseModal);
}
function impCloseModal(){ schliesseOverlay('imp-overlay'); impEditId = null; }

async function impSave(){
  const name = $('imp-f-name').value.trim();
  if (!name){ await notify('Bitte einen Namen für die Impfung eintragen.'); return; }
  const dosen = impDosenBearbeitung.filter(Boolean);
  const daten = {
    name,
    kategorie: $('imp-f-kategorie').value,
    dosen,
    next: impSchemaFuer(name) ? '' : deToISO($('imp-f-next').value.trim())
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
function impBuildBackupPayload(){
  return {
    impfungen,
    kategorieMigration: store.get(IMP_KEYS.kategorieMigration) || null,
    dosenMigration: store.get(IMP_KEYS.dosenMigration) || null,
    abgleich2026: store.get(IMP_KEYS.abgleich2026) || null
  };
}
/* Uebernimmt nur Daten und meldet zurueck, ob es geklappt hat. Rueckfrage,
   Erfolgsmeldung und Neuzeichnen macht der Kern in applyCombined – so verhaelt sich
   dieser Bereich beim Wiederherstellen genauso wie Reisen und Finanzen. */
function impApplyBackup(text){
  const p = safeParse(text, null);
  if (!(p && Array.isArray(p.impfungen))) return false;
  impfungen = p.impfungen;
  impPersist();
  // Die Migrations-Flags reisen mit, damit die einmaligen Nachkorrekturen nach einem
  // Wiederherstellen nicht nochmal laufen und dabei etwas bereits von Hand Angepasstes
  // erneut umbiegen.
  if (p.kategorieMigration) store.set(IMP_KEYS.kategorieMigration, p.kategorieMigration);
  if (p.dosenMigration) store.set(IMP_KEYS.dosenMigration, p.dosenMigration);
  if (p.abgleich2026) store.set(IMP_KEYS.abgleich2026, p.abgleich2026);
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
