/* ================= BEREICH: IMPFPASS =================
   Eigenständiges Modul. Optik und Bausteine kommen vollständig aus dem
   gemeinsamen Kern in index.html – dieses Modul bringt keine eigene Gestaltung mit. */

document.getElementById('mod-impfpass').insertAdjacentHTML('beforeend', `
<div class="wrap">

  <div class="app-header"><button class="screen-back" aria-label="Zurück" onclick="closeModule()">‹</button><span>Jörg's Impfpass</span></div>

  <div class="glass ov-card" id="imp-overview"></div>

  <div id="imp-alert-wrap"></div>

  <div class="section-label">Impfungen</div>
  <div class="list" id="imp-list"></div>
  <div class="empty" id="imp-empty" style="display:none"><b>Noch keine Impfung erfasst</b>Tippe unten, um die erste anzulegen.</div>

  <button class="add-btn" onclick="impOpenModal()">＋ Impfung hinzufügen</button>

  <p class="backup-hint" style="margin:18px 6px 0">Auffrischungsintervalle nach RKI/STIKO · nur zur persönlichen Übersicht, ersetzt keine ärztliche Beratung.</p>
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
      <div class="field field-row">
        <div>
          <label>Zuletzt geimpft</label>
          <input type="text" id="imp-f-last" placeholder="TT.MM.JJJJ" inputmode="decimal" autocomplete="off" oninput="autoDate(this)" onblur="fixDate(this)">
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
const IMP_KEYS = { impfungen: 'imp_impfungen_v1' };

/* Startbestand aus dem bisherigen statischen Impfpass – wird nur einmalig
   angelegt, wenn noch nichts gespeichert ist. Danach frei bearbeitbar. */
const IMP_SEED = [
  { name: 'Tetanus / Diphtherie',      last: '2023-03-03', next: '2033-03-03' },
  { name: 'Keuchhusten',               last: '2023-03-03', next: '' },
  { name: 'Polio',                     last: '2017-11-10', next: '' },
  { name: 'Masern / Mumps / Röteln',   last: '2018-10-20', next: '' },
  { name: 'Hepatitis A + B',           last: '2026-04-27', next: '' },
  { name: 'FSME',                      last: '2024-06-07', next: '2029-06-07' },
  { name: 'Meningokokken',             last: '2010-08-27', next: '' },
  { name: 'COVID-19',                  last: '2021-12-12', next: '' },
  { name: 'Tollwut',                   last: '',           next: '', open: true, doses: '2 von 3', note: 'Dosis 3 steht noch aus' },
  { name: 'Typhus',                    last: '2013-03-24', next: '2016-03-24' }
];

let impfungen = safeParse(store.get(IMP_KEYS.impfungen), null);
if (!Array.isArray(impfungen)) {
  impfungen = IMP_SEED.map((e, i) => Object.assign({ id: 'seed' + i, doses: '', provider: '', note: '', open: false }, e));
  store.set(IMP_KEYS.impfungen, JSON.stringify(impfungen));
}

function impPersist(){ store.set(IMP_KEYS.impfungen, JSON.stringify(impfungen)); }
function impNewId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* ---------------- Status ----------------
   Leitet sich ausschließlich aus den eingetragenen Daten ab – es wird nichts
   selbstständig fortgeschrieben. */
const IMP_SOON_DAYS = 180;

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

function impRenderAlert(){
  const el = $('imp-alert-wrap'); if(!el) return;
  const offen = impSorted().filter(impNeedsAction);
  if (!offen.length){ el.innerHTML = ''; return; }
  el.innerHTML = `<div class="alert-card">
    <div class="alert-title">Handlungsbedarf</div>
    ${offen.map(e => `<div class="alert-item">${esc(impAlertText(e))}</div>`).join('')}
  </div>`;
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
  el.innerHTML = liste.map(e => swipeWrap('impf', e.id, impEntryHTML(e))).join('');
  if (leer) leer.style.display = liste.length ? 'none' : '';
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
  $('imp-f-name').value     = e ? (e.name || '') : '';
  $('imp-f-last').value     = e ? isoToDE(e.last) : '';
  $('imp-f-next').value     = e ? isoToDE(e.next) : '';
  $('imp-f-doses').value    = e ? (e.doses || '') : '';
  $('imp-f-provider').value = e ? (e.provider || '') : '';
  $('imp-f-note').value     = e ? (e.note || '') : '';
  $('imp-f-open').checked   = e ? !!e.open : false;
  closeOpenSwipe();
  $('imp-overlay').classList.add('open');
}
function impCloseModal(){ $('imp-overlay').classList.remove('open'); impEditId = null; }

async function impSave(){
  const name = $('imp-f-name').value.trim();
  if (!name){ await notify('Bitte einen Namen für die Impfung eintragen.'); return; }
  const daten = {
    name,
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
    impfungen.push(Object.assign({ id: impNewId() }, daten));
  }
  impPersist();
  impCloseModal();
  impRender();
  renderLauncher();
  showToast('Gespeichert');
}

async function impDelete(id){
  const e = impfungen.find(x => x.id === id); if(!e) return;
  const ok = await showDialog('Der Eintrag wird unwiderruflich gelöscht.', { title: 'Löschen?', okText: 'Löschen' });
  if (!ok) return;
  const i = impfungen.findIndex(x => x.id === id);
  if (i >= 0) impfungen.splice(i, 1);
  impPersist();
  closeOpenSwipe();
  impRender();
  renderLauncher();
  showToast('Gelöscht');
}

/* ---------------- Sicherung ---------------- */
function impBuildBackupPayload(){ return { impfungen }; }
function impApplyBackup(text){
  const p = safeParse(text, null);
  if (p && Array.isArray(p.impfungen)){
    impfungen = p.impfungen;
    impPersist();
    impRender();
  }
}

registerModule({
  id: 'impfpass', name: 'Impfpass', tagline: 'Impfungen & Auffrischungen', order: 3,
  keys: IMP_KEYS,
  buildPayload: () => impBuildBackupPayload(),
  applyBackup: (t) => impApplyBackup(t),
  detect: p => !!(p && Array.isArray(p.impfungen)),
  init: () => { try { impRender(); } catch(e){} },
  onOpen: () => { try { impRender(); } catch(e){} },
  summary: () => {
    try {
      const offen = impfungen.filter(impNeedsAction).length;
      if (offen) return { sub: 'Impfungen & Auffrischungen', value: offen, unit: offen === 1 ? 'Hinweis' : 'Hinweise', note: 'Handlungsbedarf' };
      const bald = impfungen.filter(e => impStatus(e).key === 'soon').length;
      if (bald) return { sub: 'Impfungen & Auffrischungen', value: bald, unit: bald === 1 ? 'Impfung' : 'Impfungen', note: 'bald fällig' };
      return { sub: 'Impfungen & Auffrischungen', value: impfungen.length, unit: impfungen.length === 1 ? 'Impfung' : 'Impfungen', note: 'alle gültig' };
    } catch(e) { return { sub: 'Impfungen & Auffrischungen' }; }
  }
});
