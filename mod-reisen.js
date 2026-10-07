/* ================= BEREICH: REISEN =================
   Eigenständiges Modul. Nutzt den gemeinsamen Unterbau aus index.html.
   Änderungen hier betreffen nur diesen Bereich. */

document.getElementById('mod-reisen').insertAdjacentHTML('beforeend', `
<div class="wrap" id="home-wrap">

  <div class="app-header">
    <button class="screen-back" aria-label="Zurück" onclick="closeModule()">‹</button>
    <button class="icon-btn" aria-label="Reise hinzufügen" onclick="rpOpenModal('trip')">＋</button>
    <span>Reisen</span>
  </div>

  <div class="karte world-card" id="world-card"></div>

  <div class="sub-header"><div class="sub-header-text"><h1>Meine Reisen</h1><p>Geplante und laufende Reisen</p></div></div>
  <div id="trip-tiles"></div>
  <div id="done-section"></div>
</div>

<!-- ============ LÄNDER-AUSWAHL (Vollbild, damit die Tastatur nichts verdeckt) ============ -->
<div class="screen picker-screen" id="picker-screen">
  <div class="picker-head">
    <div class="screen-topbar">
      <button class="screen-back" onclick="closePicker()" aria-label="Zurück">‹</button>
      <div class="screen-title">
        <h2>Wo warst du schon?</h2>
        <p id="picker-count">&nbsp;</p>
      </div>
    </div>
    <input class="picker-search" id="picker-search" type="search" placeholder="Land suchen" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" oninput="filterPicker(this.value)">
  </div>
  <div class="picker-list" id="picker-list"></div>
</div>

<!-- ============ REISE ============
     Plus oben rechts: Menue zum Anlegen (Stopp, Flug ...), Import und Bearbeiten.
     Darunter die Segment-Steuerung fuer Uebersicht, Route und Fotografie. -->
<div class="screen" id="trip-screen">
  <div class="screen-topbar">
    <button class="screen-back" onclick="closeTripScreen()" aria-label="Zurück">‹</button>
    <div class="screen-title">
      <h2 id="ts-name">Reise</h2>
      <p id="ts-dest"></p>
    </div>
    <button class="icon-btn teilen" onclick="rpTeilenMenu(this)" aria-label="Teilen"></button>
    <button class="icon-btn" onclick="rpPlusMenu(this)" aria-label="Hinzufügen">＋</button>
  </div>
  <div class="tab-bar" id="tab-bar"></div>
  <div id="tab-content"></div>
</div>

<!-- ============ REISEPLAN-IMPORT ============ -->
<div class="screen" id="import-screen">
  <div class="screen-topbar">
    <button class="screen-back" onclick="closeImport()" aria-label="Zurück">‹</button>
    <div class="screen-title">
      <h2>Reiseplan importieren</h2>
      <p id="import-sub">&nbsp;</p>
    </div>
  </div>
  <div id="import-body"></div>
</div>

<!-- ============ EINTRAG-ANSICHT (nur lesen; Bearbeiten/Löschen per Wischen oder langem Druck) ============ -->
<div class="screen" id="detail-screen">
  <div class="screen-topbar">
    <button class="screen-back" onclick="rpCloseDetail()" aria-label="Zurück">‹</button>
    <div class="screen-title">
      <h2 id="dv-title">Eintrag</h2>
      <p id="dv-sub">&nbsp;</p>
    </div>
  </div>
  <div id="dv-body"></div>
</div>

<!-- Formular -->
<div class="overlay" id="form-overlay" onclick="if(event.target===this)blattAbbrechen(this)">
  <div class="modal">
    <div class="blatt-kopf">
      <button type="button" class="kopf-knopf" onclick="blattAbbrechen(this)">Abbrechen</button>
      <h2 id="form-title">Eintrag</h2>
      <button type="button" class="kopf-knopf fett" onclick="saveModal()">Sichern</button>
    </div>
    <div class="formular" id="form-fields"></div>
  </div>
</div>

<!-- Fotografie: versteckter Datei-Input + Vollbild-Viewer -->
<input type="file" id="foto-file-input" accept="image/*" multiple style="display:none" onchange="handleFotoFiles(this.files)">
<div class="overlay img-viewer" id="img-viewer" onclick="closeImgViewer()"><img id="img-viewer-img" src="" alt=""></div>

<!-- Ausruestung je Foto-Ort waehlen: wirkt sofort, deshalb nur "Fertig" -->
<div class="overlay" id="gear-overlay" onclick="if(event.target===this)closeGearPicker()">
  <div class="modal">
    <div class="blatt-kopf">
      <h2>Ausrüstung</h2>
      <button type="button" class="kopf-knopf fett" onclick="closeGearPicker()">Fertig</button>
    </div>
    <div class="formular" id="gear-choices"></div>
  </div>
</div>
`);


/* ===== STORAGE ===== */

/* ===== BILD-SPEICHER (IndexedDB, Fallback: inline im Eintrag) =====
   Referenzbilder liegen in IndexedDB (viel Platz), Einträge speichern nur die Bild-ID.
   Ist IndexedDB nicht verfügbar, werden Bilder wie früher direkt als Data-URI im Eintrag gehalten. */
const IMG_DB='reisen-images', IMG_STORE='images';
let _idb=null, idbReady=false;
function idbOpen(){
  return new Promise(resolve => {
    if (!window.indexedDB) { resolve(null); return; }
    try {
      const req=indexedDB.open(IMG_DB,1);
      req.onupgradeneeded=()=>{ const db=req.result; if(!db.objectStoreNames.contains(IMG_STORE)) db.createObjectStore(IMG_STORE,{keyPath:'id'}); };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>resolve(null);
    } catch(e){ resolve(null); }
  });
}
async function idbInit(){ _idb=await idbOpen(); idbReady=!!_idb; }
function _imgStore(mode){ return _idb.transaction(IMG_STORE,mode).objectStore(IMG_STORE); }
function idbPut(id,data){ return new Promise((res,rej)=>{ try{ const r=_imgStore('readwrite').put({id,data}); r.onsuccess=()=>res(); r.onerror=()=>rej(r.error); }catch(e){ rej(e); } }); }
function idbGet(id){ return new Promise(res=>{ try{ const r=_imgStore('readonly').get(id); r.onsuccess=()=>res(r.result?r.result.data:null); r.onerror=()=>res(null); }catch(e){ res(null); } }); }
function idbDelete(id){ return new Promise(res=>{ try{ const r=_imgStore('readwrite').delete(id); r.onsuccess=()=>res(); r.onerror=()=>res(); }catch(e){ res(); } }); }
function idbAll(){ return new Promise(res=>{ try{ const r=_imgStore('readonly').getAll(); r.onsuccess=()=>res(r.result||[]); r.onerror=()=>res([]); }catch(e){ res([]); } }); }
function idbClear(){ return new Promise(res=>{ try{ const r=_imgStore('readwrite').clear(); r.onsuccess=()=>res(); r.onerror=()=>res(); }catch(e){ res(); } }); }
function isDataUri(s){ return typeof s==='string' && s.startsWith('data:'); }

/* Migriert evtl. noch inline gespeicherte Bilder (alte Einträge) nach IndexedDB. */
async function migrateInlineImages(){
  if (!idbReady) return;
  let changed=false;
  for (const a of activities) {
    if (a.images && a.images.some(isDataUri)) {
      const refs=[];
      for (const ref of a.images) {
        if (isDataUri(ref)) { const nid='img_'+neueId(); await idbPut(nid, ref); refs.push(nid); changed=true; }
        else refs.push(ref);
      }
      a.images=refs;
    }
  }
  if (changed) persist('activity');
}

/* ===== WELTKARTE =====
   Quelle: Natural Earth via world-atlas (50m), vereinfacht, Equirectangular auf 1000x500.
   246 Eintraege inkl. Kleinstaaten und Gebieten, deutsch benannt. */
/* COUNTRY_PATHS: in data-laender.js */

/* Vorberechneter Zoom-Ausschnitt je Land für die Reisekarten */
/* COUNTRY_VIEW: in data-laender.js */

/* COUNTRY_DOT: in data-laender.js */

const COUNTRY_LIST = Object.keys(COUNTRY_PATHS).sort((a,b)=>a.localeCompare(b,'de'));
const WORLD_TOTAL = 195; // 193 UN-Mitglieder + 2 Beobachter (Vatikan, Palästina)
/* Abhängige Gebiete, Überseegebiete und nicht (voll) anerkannte Gebiete.
   Die zählen beim Zähler "Länder" mit, aber NICHT in der Prozentzahl –
   sonst käme man über 100 %, weil die Liste 246 Einträge hat, die Welt aber 195 Staaten.
   246 Eintraege minus 51 Gebiete ergibt genau die 195 aus WORLD_TOTAL. */
const TERRITORIES = new Set(["Åland", "Amerikanisch-Samoa", "Amerikanische Jungferninseln", "Anguilla", "Aruba", "Ashmore- und Cartierinseln", "Australische Territorien im Indischen Ozean", "Bermuda", "Britische Jungferninseln", "Britisches Territorium im Indischen Ozean", "Cookinseln", "Curaçao", "Falklandinseln", "Färöer", "Französisch-Guayana", "Französisch-Polynesien", "Französische Süd- und Antarktisgebiete", "Grönland", "Guadeloupe", "Guam", "Guernsey", "Heard und McDonaldinseln", "Hongkong", "Isle of Man", "Jersey", "Kaimaninseln", "Macau", "Martinique", "Mayotte", "Montserrat", "Neukaledonien", "Niue", "Nördliche Marianen", "Norfolkinsel", "Pitcairninseln", "Puerto Rico", "Réunion", "Sint Maarten", "St. Barthélemy", "St. Helena", "St. Martin", "St. Pierre und Miquelon", "Südgeorgien und die Südlichen Sandwichinseln", "Turks- und Caicosinseln", "Wallis und Futuna", "Kosovo", "Nordzypern", "Somaliland", "Taiwan", "Westsahara", "Siachen-Gletscher"]);
function isSovereign(c){ return !TERRITORIES.has(c); }
/* Zuordnung Gebiet -> Hauptland, für die gruppierte Darstellung in der Länderliste.
   Umstrittene Gebiete (Taiwan, Kosovo, Westsahara, Nordzypern, Somaliland, Siachen)
   sind bewusst NICHT zugeordnet und stehen eigenständig in der Liste. */
const TERRITORY_PARENT = {"Französisch-Guayana": "Frankreich", "Guadeloupe": "Frankreich", "Martinique": "Frankreich", "Réunion": "Frankreich", "Mayotte": "Frankreich", "Französisch-Polynesien": "Frankreich", "Neukaledonien": "Frankreich", "Wallis und Futuna": "Frankreich", "St. Barthélemy": "Frankreich", "St. Martin": "Frankreich", "St. Pierre und Miquelon": "Frankreich", "Französische Süd- und Antarktisgebiete": "Frankreich", "Anguilla": "Großbritannien", "Bermuda": "Großbritannien", "Britische Jungferninseln": "Großbritannien", "Britisches Territorium im Indischen Ozean": "Großbritannien", "Falklandinseln": "Großbritannien", "Guernsey": "Großbritannien", "Isle of Man": "Großbritannien", "Jersey": "Großbritannien", "Kaimaninseln": "Großbritannien", "Montserrat": "Großbritannien", "Pitcairninseln": "Großbritannien", "St. Helena": "Großbritannien", "Südgeorgien und die Südlichen Sandwichinseln": "Großbritannien", "Turks- und Caicosinseln": "Großbritannien", "Amerikanisch-Samoa": "USA", "Amerikanische Jungferninseln": "USA", "Guam": "USA", "Nördliche Marianen": "USA", "Puerto Rico": "USA", "Aruba": "Niederlande", "Curaçao": "Niederlande", "Sint Maarten": "Niederlande", "Färöer": "Dänemark", "Grönland": "Dänemark", "Åland": "Finnland", "Hongkong": "China", "Macau": "China", "Ashmore- und Cartierinseln": "Australien", "Australische Territorien im Indischen Ozean": "Australien", "Heard und McDonaldinseln": "Australien", "Norfolkinsel": "Australien", "Cookinseln": "Neuseeland", "Niue": "Neuseeland"};
const PARENT_TERRITORIES = (() => {
  const m = {};
  for (const [t, p] of Object.entries(TERRITORY_PARENT)) (m[p] = m[p] || []).push(t);
  for (const p of Object.keys(m)) m[p].sort((a,b)=>a.localeCompare(b,'de'));
  return m;
})();
/* Ländernamen tolerant nachschlagen (Groß-/Kleinschreibung, gängige Alternativen) */
const COUNTRY_ALIAS = {'usa':'USA','vereinigte staaten':'USA','united states':'USA','uk':'Großbritannien','england':'Großbritannien','vereinigtes königreich':'Großbritannien','uae':'VAE','vereinigte arabische emirate':'VAE','holland':'Niederlande','tschechische republik':'Tschechien','swasiland':'Eswatini','birma':'Myanmar','burma':'Myanmar','mazedonien':'Nordmazedonien','weißrussland':'Belarus','weissrussland':'Belarus','kapverden':'Kap Verde','malediven inseln':'Malediven','bali':'Indonesien','hawaii':'USA','mallorca':'Spanien','kanaren':'Spanien','madeira':'Portugal','azoren':'Portugal'};
function resolveCountry(name){
  if(!name) return null;
  const raw=String(name).trim();
  if(COUNTRY_PATHS[raw]) return raw;
  const low=raw.toLowerCase();
  if(COUNTRY_ALIAS[low]) return COUNTRY_ALIAS[low];
  const hit=COUNTRY_LIST.find(c=>c.toLowerCase()===low);
  return hit||null;
}
/* Karte für eine Reise: Land hervorgehoben, eng gezoomt */
/* Breitengrad aus der internen y-Einheit zurückrechnen. Skalierung und Nullpunkt an
   fünf Referenzländern (Deutschland, Italien, Schweden, Namibia, Ägypten) abgeglichen -
   die Rohdaten sind eine unkorrigierte Plate-Carrée-Projektion (1 Einheit Länge und
   1 Einheit Breite haben überall dieselbe Kartengröße), ohne die übliche Stauchung
   nach den Polen hin. Wird nur für die Proportionskorrektur unten gebraucht. */
function breitengradVon(y){ return (249 - y) / 2.75; }

/* Zerlegt einen Pfad in seine "M...Z"-Teilstücke (Land + alle Nebeninseln einzeln). */
function teilpfade(d){ return d.split(/(?=M)/).filter(Boolean); }
function teilBBox(t){
  const nums = (t.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
  for (let i=0; i+1<nums.length; i+=2){
    const x=nums[i], y=nums[i+1];
    if (x<minX) minX=x; if (x>maxX) maxX=x;
    if (y<minY) minY=y; if (y>maxY) maxY=y;
  }
  return { minX, minY, maxX, maxY };
}

/* Nur die größte zusammenhängende Fläche eines Landes - weit entfernte Nebeninseln
   (Hawaii bei den USA, Kanaren bei Spanien) ziehen sonst den Rahmen beim Zuschneiden so
   weit auf, dass vom eigentlichen Land nur ein Bruchteil sichtbar bleibt. */
function groessteFlaeche(d){
  const teile = teilpfade(d);
  if (teile.length <= 1) return d;
  let bester = teile[0], besteFlaeche = -1;
  for (const t of teile){
    const b = teilBBox(t);
    const f = (b.maxX-b.minX) * (b.maxY-b.minY);
    if (f > besteFlaeche){ besteFlaeche = f; bester = t; }
  }
  return bester;
}

/* Die Werte in COUNTRY_VIEW sind grosszuegig gerahmt – Namibia etwa fuellt seinen
   Rahmen nur zu gut einem Drittel, wodurch die Silhouette auf der Kachel verloren wirkt.
   Statt die hand-justierten Werte zu ersetzen, wird der tatsaechliche Umriss hier
   ausgemessen und eng gerahmt. Alle Pfade bestehen ausschliesslich aus M/L/Z mit
   absoluten Koordinaten, die Messung ist daher exakt.
   Wichtig: mit einem engen Rahmen darf NICHT "slice" verwendet werden, sonst schneidet
   das Seitenverhaeltnis der Kachel Teile des Landes ab (genau daran ist ein frueherer
   Versuch gescheitert). Deshalb "meet" – das Land bleibt vollstaendig sichtbar und
   wird so gross wie moeglich dargestellt.
   Korrigiert zusaetzlich die Ost-West-Stauchung der Rohdaten: bei einem mittleren
   Breitengrad von z.B. 51° (Deutschland) ist ein Grad Laenge nur noch cos(51°)=0.63 so
   breit wie ein Grad Breite - unkorrigiert wirkt das Land dadurch zu breit gezeichnet.
   Die Korrektur betrifft nur diese Einzelland-Ansicht (Kacheln/Startseite/Reise-Detail),
   nicht die grosse Weltkarte mit allen Laendern gleichzeitig - dort wuerde eine pro Land
   unterschiedliche Stauchung benachbarte Laender an ihrer gemeinsamen Grenze auseinander-
   reissen. Die Kompression laeuft ueber ein SVG-transform um den eigenen Mittelpunkt des
   Landes, die Rohdaten selbst bleiben unangetastet. */
const _tightViewCache = {};
function tightCountryView(d, cacheKey){
  if (cacheKey && _tightViewCache[cacheKey]) return _tightViewCache[cacheKey];
  if (!d) return null;
  const nums = d.match(/-?\d+(?:\.\d+)?/g);
  if (!nums || nums.length < 4) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2){
    const x = parseFloat(nums[i]), y = parseFloat(nums[i+1]);
    if (!isFinite(x) || !isFinite(y)) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  let w = maxX - minX, h = maxY - minY;
  if (!(w > 0) || !(h > 0)) return null;
  const midLat = breitengradVon((minY + maxY) / 2);
  // Untergrenze 0.15 gegen Extremverzerrung nahe der Pole (dort wuerde cos(lat) sonst
  // gegen 0 gehen und das Land unbrauchbar schmal zusammenstauchen).
  const cosFaktor = Math.max(0.15, Math.cos(midLat * Math.PI / 180));
  const cx = (minX + maxX) / 2;
  const wKorrigiert = w * cosFaktor;
  // Rundum gleicher Rand: die Silhouette liegt als Wasserzeichen ueber der ganzen
  // Kachel und soll dort mittig sitzen. (Frueher war der Rand oben groesser, um das
  // Land im damals schmalen Streifen tiefer zu setzen – im jetzigen Layout erzeugt
  // das nur einen sichtbar ungleichen Abstand nach oben und unten.)
  // Der Rand bestimmt zugleich die Groesse: je mehr Rand im Rahmen steckt, desto
  // kleiner erscheint das Land in der Kachel. 0.09 laesst rundum etwas Luft.
  const rand = Math.max(wKorrigiert, h) * 0.09;
  const box = [cx - wKorrigiert/2 - rand, minY - rand, wKorrigiert + rand*2, h + rand*2];
  const transform = `matrix(${cosFaktor.toFixed(4)},0,0,1,${(cx*(1-cosFaktor)).toFixed(2)},0)`;
  const result = { box, transform };
  if (cacheKey) _tightViewCache[cacheKey] = result;
  return result;
}

/* begrenzt=true positioniert den Umriss auf einen Bereich der Kachel (fuer die
   Reise-Kacheln in "Meine Reisen"). Ohne den Parameter (Startseiten-Kachel des
   Bereichs) bleibt es beim alten, grossflaechigen Wasserzeichen ueber die ganze
   Kachel - das wollte Joerg dort ausdruecklich unveraendert.
   Zeigt immer nur die groesste zusammenhaengende Flaeche eines Landes - auch bei
   Reisen zu einer einzelnen kleinen Insel (z.B. "Lanzarote", Land "Spanien"). Ein
   Versuch, dort gezielt nur die Insel zu zeigen, ist an der Kartenaufloesung
   gescheitert: einzelne Kanareninseln sind im Datensatz nur mit 3-5 Punkten hinterlegt
   und damit als Form nicht erkennbar (Dreiecke/Vierecke statt Kuestenlinie). Das
   Festland zu zeigen ist die bewusst gewaehlte, einheitliche Regel fuer alle Faelle. */
function tripMapSVG(country, begrenzt){
  const cls = begrenzt ? ' class="tt-country-shape"' : '';
  const key=resolveCountry(country);
  if(!key) return '';
  if(COUNTRY_DOT.has(key)){
    // Diese Kleinstaaten haben in den Kartendaten keinen echten Umriss (nur einen
    // Positions-Punkt). Statt eines Punkts eine große, eingefärbte Insel-Silhouette
    // (Hauptinsel + Nebeninseln) im Kachel-Seitenverhältnis, damit sie die Kachel füllt.
    const island = "M40,30 C46,20 62,16 76,20 C86,14 100,18 104,28 C114,30 118,42 112,52 C118,62 110,74 98,76 C92,86 76,86 68,80 C56,84 42,78 40,68 C30,64 28,48 36,42 C34,36 36,32 40,30 Z M112,64 C118,62 122,68 118,73 C114,78 107,74 109,68 C109,66 110,64 112,64 Z M31,20 C35,18 39,21 37,25 C35,28 29,26 30,22 C30,21 30,20 31,20 Z";
    return `<svg${cls} viewBox="0 0 144 100" preserveAspectRatio="xMidYMid slice"><path d="${island}" fill="var(--accent)"/></svg>`;
  }
  const d = groessteFlaeche(COUNTRY_PATHS[key]);
  const eng = tightCountryView(d, key);
  if (eng) {
    return `<svg${cls} viewBox="${eng.box.map(v => v.toFixed(2)).join(' ')}" preserveAspectRatio="xMidYMid meet"><path d="${d}" fill="var(--accent)" transform="${eng.transform}"/></svg>`;
  }
  const box=COUNTRY_VIEW[key];
  if(!box) return '';
  return `<svg${cls} viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMid slice"><path d="${d}" fill="var(--accent)"/></svg>`;
}

/* ===== DATENMODELL ===== */
const KEYS = { trips:'rp_trips_v1', stops:'rp_stops_v1', hotels:'rp_hotels_v1', flights:'rp_flights_v1', cars:'rp_cars_v1', transfers:'rp_transfers_v1', activities:'rp_activities_v1', packing:'rp_packing_v1', todos:'rp_todos_v1', visited:'rp_visited_v1', autoTrips:'rp_autotrips_v1', gear:'rp_gear_v1' };
let trips      = safeParse(store.get(KEYS.trips), []);
let stops      = safeParse(store.get(KEYS.stops), []);
let hotels     = safeParse(store.get(KEYS.hotels), []);
let flights    = safeParse(store.get(KEYS.flights), []);
let cars       = safeParse(store.get(KEYS.cars), []);
/* Transfer = eine Fahrt zwischen zwei Orten (Wegbeschreibung, Entfernung, Fahrzeit).
   Bewusst ein eigener Typ und keine Notiz am Hotel: die Fahrt gehoert zu keinem der
   beiden Orte, sondern liegt dazwischen. */
let transfers  = safeParse(store.get(KEYS.transfers), []);
let activities = safeParse(store.get(KEYS.activities), []);
let packing    = safeParse(store.get(KEYS.packing), []);
let todos      = safeParse(store.get(KEYS.todos), []);
let visited    = safeParse(store.get(KEYS.visited), []);
let autoTrips  = safeParse(store.get(KEYS.autoTrips), []);

/* Ausrüstung – global, kategorisiert (Kameras, Objektive, Drohne, Zubehör), in Einstellungen pflegbar. */
const GEAR_CATS = ['Kameras','Objektive','Drohne','Zubehör'];
function emptyGear(){ return { 'Kameras':[], 'Objektive':[], 'Drohne':[], 'Zubehör':[] }; }
function gearClassify(name){
  const s=(name||'').toLowerCase();
  if (/dji|drohne|drone|mavic|\bmini\s?\d|\bair\s?\d/.test(s)) return 'Drohne';
  if (/\d+\s?mm|\bgm\b|objektiv|\blens\b|f1\.|f2\.|f\/|\d+-\d+/.test(s)) return 'Objektive';
  if (/α|alpha|\ba7|\ba1\b|\ba9\b|kamera|camera|\bbody\b|eos|x-t|gfx|\br5\b|\br6\b/.test(s)) return 'Kameras';
  return 'Zubehör';
}
function normalizeGear(g){ const o=emptyGear(); for(const c of GEAR_CATS) if(Array.isArray(g&&g[c])) o[c]=g[c].slice(); return o; }
function gearAll(){ return GEAR_CATS.reduce((acc,c)=>acc.concat(gear[c]||[]),[]); }
let gear = safeParse(store.get(KEYS.gear), null);
if (gear === null) {
  gear = { 'Kameras':['Sony α7V'], 'Objektive':['14mm GM','35mm','70-200mm','200-600mm'], 'Drohne':['DJI Mini 5 Pro'], 'Zubehör':['Stativ','L-Bracket','Ersatzakkus','Speicherkarten'] };
  store.set(KEYS.gear, JSON.stringify(gear));
} else if (Array.isArray(gear)) {
  const flat=gear; gear=emptyGear();
  flat.forEach(n=>{ if(n){ const c=gearClassify(n); if(!gear[c].includes(n)) gear[c].push(n); } });
  store.set(KEYS.gear, JSON.stringify(gear));
} else {
  gear = normalizeGear(gear);
}
/* Datenumstellungen. Laufen ueber den migrate-Haken des Kerns – beim Start und nach dem
   Wiederherstellen. Vorher waren es zwei IIFEs, die nur beim Laden der Datei liefen:
   eine aeltere Sicherung wurde dadurch unveraendert uebernommen. Beide Schritte sind
   wiederholbar und aendern nichts, wenn es nichts zu tun gibt. */
function rpMigrate(){
  /* Vorhandene Ausruestung aus Foto-Orten uebernehmen */
  let gearChanged=false;
  gear = normalizeGear(gear);
  for (const a of activities){ if (a.type==='foto' && Array.isArray(a.equipment)){ for (const e of a.equipment){ if (e && !gearAll().includes(e)){ gear[gearClassify(e)].push(e); gearChanged=true; } } } }
  if (gearChanged) store.set(KEYS.gear, JSON.stringify(gear));

  /* Frueheres Hotel-Feld "Adresse" ins neue Feld "Ort" uebernehmen */
  let hotelChanged=false;
  for (const h of hotels){ if (h.address && !h.city){ h.city = h.address; delete h.address; hotelChanged=true; } }
  if (hotelChanged) store.set(KEYS.hotels, JSON.stringify(hotels));
}
const DATA = { trip:['trips',KEYS.trips], stop:['stops',KEYS.stops], hotel:['hotels',KEYS.hotels], flight:['flights',KEYS.flights], car:['cars',KEYS.cars], transfer:['transfers',KEYS.transfers], activity:['activities',KEYS.activities], photo:['activities',KEYS.activities], pack:['packing',KEYS.packing], todo:['todos',KEYS.todos] };
const REFS = { trips:()=>trips, stops:()=>stops, hotels:()=>hotels, flights:()=>flights, cars:()=>cars, transfers:()=>transfers, activities:()=>activities, packing:()=>packing, todos:()=>todos };
function arr(type){ return REFS[DATA[type][0]](); }
function setArr(type, val){
  const name = DATA[type][0];
  if (name==='trips') trips=val; else if (name==='stops') stops=val; else if (name==='hotels') hotels=val;
  else if (name==='flights') flights=val; else if (name==='cars') cars=val; else if (name==='transfers') transfers=val;
  else if (name==='activities') activities=val;
  else if (name==='packing') packing=val; else if (name==='todos') todos=val;
}
function persist(type){ store.set(DATA[type][1], JSON.stringify(arr(type))); }
// Kennungen kommen aus dem Kern (neueId).

/* ===== DATUM ===== */
function tripYear(t){ return (t.start || t.end || '').slice(0,4); }
/* Reisedauer in Tagen, inklusive An- und Abreisetag */
function tripDuration(t){
  if (!t.start || !t.end) return '';
  const a = new Date(t.start+'T00:00:00'), b = new Date(t.end+'T00:00:00');
  if (isNaN(a) || isNaN(b) || b < a) return '';
  const n = Math.round((b - a) / 86400000) + 1;
  return n + (n===1 ? ' Tag' : ' Tage');
}
/* Datumshilfen (deToISO, autoDate, fixDate, autoTime, fixTime) und showToast liegen im Kern. */

/* ===== HOME ===== */

/* ===== BESUCHTE LÄNDER (Weltkarte auf der Startseite) ===== */
function saveVisited(){ store.set(KEYS.visited, JSON.stringify(visited)); }
/* Abgeschlossene Reisen tragen ihr Land automatisch als besucht ein.
   Jede Reise wird nur EINMAL verarbeitet – entfernst du ein Land später von Hand,
   kommt es nicht wieder zurück. */
function syncVisitedFromTrips(){
  const today = todayISO();
  const added = [];
  let touched = false;
  for (const t of trips) {
    if (!t.end || t.end >= today) continue;      // Reise noch nicht vorbei
    if (autoTrips.includes(t.id)) continue;      // schon verarbeitet
    autoTrips.push(t.id); touched = true;
    const key = resolveCountry(t.country);
    if (key && !visited.includes(key)) { visited.push(key); added.push(key); }
  }
  if (touched) {
    store.set(KEYS.autoTrips, JSON.stringify(autoTrips));
    if (added.length) { saveVisited(); return added; }
  }
  return [];
}
/* visited enthält AUSSCHLIESSLICH das, was du selbst angehakt hast.
   Kein automatisches Mitmarkieren – sonst stünde da "China besucht", nur weil
   du in Hongkong warst. */
function toggleVisited(c){
  const key = resolveCountry(c); if(!key) return;
  const i = visited.indexOf(key);
  if (i >= 0) visited.splice(i,1); else visited.push(key);
  saveVisited();
  renderWorldCard();
  if ($('picker-screen') && $('picker-screen').classList.contains('open')) renderPickerList();
}
/* Welche der 195 Länder sind abgedeckt? Ein Gebiet deckt sein Hauptland ab
   (Hongkong -> China), ohne dass China als besucht gilt. Mehrfachnennung
   fällt weg: Turks + Großbritannien bleibt EIN Land. */
function countedCountries(){
  const s = new Set();
  for (const c of visited) {
    if (isSovereign(c)) s.add(c);
    else { const p = TERRITORY_PARENT[c]; if (p) s.add(p); }
  }
  return s;
}
/* Länder, die nur über ein Gebiet zählen – dort warst du selbst nicht. */
function impliedCountries(){
  const s = countedCountries();
  for (const c of visited) s.delete(c);
  return s;
}
/* Weltkarte: reine Anzeige – besuchte Länder in Orange. Eintragen läuft über das Plus / die Länderliste. */
function worldMapSVG(){
  // Die Karte zeigt ausschließlich, wo du selbst warst. Ein Land, das nur über ein
  // Gebiet zählt (China wegen Hongkong), bleibt grau – sonst behauptet die Karte etwas Falsches.
  const seen = new Set(visited);
  const rest = COUNTRY_LIST.filter(c=>!seen.has(c)).map(c=>COUNTRY_PATHS[c]).join('');
  const hit  = COUNTRY_LIST.filter(c=>seen.has(c)).map(c=>COUNTRY_PATHS[c]).join('');
  // Ausschnitt aus den Daten gemessen: Land reicht von y=17.8 (Nordgrönland)
  // bis y=412.3 (Südgeorgien), plus 6 Einheiten Luft ringsum -> vertikal mittig, nichts abgeschnitten.
  return `<svg class="wm-svg" viewBox="0 11.8 1000 406.5" preserveAspectRatio="xMidYMid meet">
    <path d="${rest}" fill="var(--land)"/>${hit?`<path d="${hit}" fill="var(--been)"/>`:''}
  </svg>`;
}
function renderWorldCard(){
  const el = $('world-card'); if(!el) return;
  // Gezählt wird pro Land, nicht pro Anhaken: Turks + Großbritannien = ein Land.
  const staaten = countedCountries().size;
  const pct = Math.min(100, Math.round(staaten / WORLD_TOTAL * 100));
  const R = 26, C = 2*Math.PI*R;
  const dash = Math.max(0, Math.min(1, staaten/WORLD_TOTAL)) * C;
  el.innerHTML = `
    <button class="wm-add" onclick="openPicker()" aria-label="Länder eintragen">＋</button>
    <div class="wm-map">${worldMapSVG()}</div>
    <div class="wm-stats">
      <div class="wm-stat"><div class="wm-val">${pct}<span class="wm-pct">%</span></div><div class="wm-lab">Welt</div></div>
      <div class="wm-donut">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="${R}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="9"/>
          <circle cx="32" cy="32" r="${R}" fill="none" stroke="var(--been)" stroke-width="9" stroke-linecap="round"
                  stroke-dasharray="${dash.toFixed(1)} ${(C-dash).toFixed(1)}" transform="rotate(-90 32 32)"/>
        </svg>
      </div>
      <div class="wm-stat"><div class="wm-val">${staaten}</div><div class="wm-lab">Länder</div></div>
    </div>`;
}
/* Länder-Auswahl mit Suche – für kleine Länder, die man schlecht antippen kann */
let pickerFilter='';
function openPicker(){ pickerFilter=''; const s=$('picker-search'); if(s) s.value=''; renderPickerList(); screenOeffnen('picker-screen'); }
function closePicker(){ screenSchliessen('picker-screen'); const s=$('picker-search'); if(s) s.blur(); }
function filterPicker(v){ pickerFilter=(v||'').toLowerCase(); renderPickerList(); }
function renderPickerList(){
  const q = pickerFilter;
  const seen = new Set(visited);
  const st = countedCountries().size;
  const geb = visited.filter(c=>!isSovereign(c)).length;
  $('picker-count').textContent = `${st} von ${WORLD_TOTAL} Ländern` + (geb? ` · ${geb} Gebiet${geb===1?'':'e'}` : '');

  const impl = impliedCountries();
  const zeile = (c, sub, last) => {
    const via = !seen.has(c) && impl.has(c);
    const woher = via ? (PARENT_TERRITORIES[c]||[]).filter(t=>seen.has(t)) : [];
    return `
    <button class="pick-row${sub?' sub':''}${last?' last':''}${seen.has(c)?' on':''}${via?' via':''}" onclick="toggleVisited('${c.replace(/'/g,"\\'")}')">
      <span class="pick-text"><span class="pick-name">${esc(c)}</span>${woher.length?`<span class="pick-via">zählt über ${esc(woher.join(', '))}</span>`:''}</span>
      <span class="pick-mark">${SYMBOL.haken}</span>
    </button>`;
  };

  let html;
  if (q) {
    // Bei aktiver Suche flach anzeigen – Gruppierung würde Treffer verstecken
    const treffer = COUNTRY_LIST.filter(c=>c.toLowerCase().includes(q));
    html = treffer.map(c=>zeile(c, false, false)).join('');
  } else {
    // Ohne Suche: Hauptländer alphabetisch, zugehörige Gebiete als Baum darunter
    html = COUNTRY_LIST.filter(c=>!TERRITORY_PARENT[c]).map(c=>{
      const kinder = PARENT_TERRITORIES[c];
      return zeile(c, false, false) + (kinder ? kinder.map((k,i)=>zeile(k, true, i===kinder.length-1)).join('') : '');
    }).join('');
  }
  $('picker-list').innerHTML = html ? `<div class="liste">${html}</div>`
    : leerHTML({ symbol: 'pin', titel: 'Kein Treffer', text: `Kein Land passt zu „${pickerFilter}“.`, klein: true });
}

/* ===== REISEPLAN-IMPORT =====
   Nimmt einen JSON-Block entgegen (z.B. aus einem ausgewerteten PDF) und trägt
   die Einträge in die AKTUELLE Reise ein. Nichts wird ohne Vorschau übernommen. */
const IMPORT_TYPES = [
  ['stops','stop','Stopps'], ['flights','flight','Flüge'], ['hotels','hotel','Hotels'],
  ['cars','car','Mietwagen'], ['transfers','transfer','Transfers'],
  ['activities','activity','Aktivitäten'], ['photos','photo','Fotografie'],
  ['packing','pack','Packliste'], ['todos','todo','Checkliste']
];
let importItems = [];   // { type, label, sub, data, on }
let importTripMeta = null;

function openImport(){
  const t=currentTrip(); if(!t) return;
  importItems=[]; importTripMeta=null;
  $('import-sub').textContent = 'Für: '+t.name;
  renderImportStep1();
  screenOeffnen('import-screen');
}
function closeImport(){ screenSchliessen('import-screen'); }

function renderImportStep1(err){
  $('import-body').innerHTML = `
    <p class="import-hint">Füge hier den Datenblock ein, den du aus deinem Reiseplan erhalten hast. Die App zeigt dir vor dem Übernehmen eine Vorschau.</p>
    ${err?`<div class="import-err">${esc(err)}</div>`:''}
    <textarea class="import-input" id="import-input" placeholder='{ "flights": [ … ], "hotels": [ … ] }' spellcheck="false" autocapitalize="off" autocorrect="off"></textarea>
    <button class="btn btn-primary import-btn" onclick="parseImport()">Auswerten</button>`;
}

/* Datum aus dem Block annehmen: sowohl 09.09.2026 als auch 2026-09-09 */
function importDate(v){
  if(!v) return '';
  const s=String(v).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)) return deToISO(s) ? s : '';
  return deToISO(s);
}
function parseImport(){
  const raw=($('import-input').value||'').trim();
  if(!raw){ renderImportStep1('Bitte zuerst den Datenblock einfügen.'); return; }
  // Markdown-Zaun tolerieren, falls mitkopiert
  const clean=raw.replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/,'').trim();
  let p;
  try { p=JSON.parse(clean); }
  catch(e){ renderImportStep1('Das ist kein gültiger Datenblock. Achte darauf, den kompletten Text von { bis } zu kopieren.'); return; }
  if(!p || typeof p!=='object'){ renderImportStep1('Der Datenblock ist leer.'); return; }

  importItems=[]; importTripMeta=null;
  // Reisedaten (optional)
  if(p.trip && typeof p.trip==='object'){
    // Laeuft ueber das Reise-Schema statt ueber eine feste Liste. Vorher waren nur
    // Name, Land, Start und Ende vorgesehen - neue Felder (z.B. der Veranstalter-
    // Kontakt) waeren beim Import stillschweigend unter den Tisch gefallen.
    const m={};
    for(const f of SCHEMAS.trip){
      const v=p.trip[f.key];
      if(v===undefined || v===null) continue;
      if(f.date){ const dv=importDate(v); if(dv) m[f.key]=dv; continue; }
      const t=String(v).trim(); if(t) m[f.key]=t;
    }
    if(Object.keys(m).length){
      importTripMeta=m;
      const parts=[m.country, (m.start||m.end)?`${displayDate(m.start)||'?'} – ${displayDate(m.end)||'?'}`:''].filter(Boolean);
      importItems.push({ type:'__meta', label:m.name||currentTrip().name, sub:'Reisedaten aktualisieren · '+(parts.join(' · ')||'—'), data:m, on:true });
    }
  }
  // Einträge je Typ
  for(const [key,type,titel] of IMPORT_TYPES){
    const list=p[key];
    if(!Array.isArray(list)) continue;
    for(const it of list){
      if(!it || typeof it!=='object') continue;
      const obj={}; const schema=SCHEMAS[type];
      for(const f of schema){
        if(f.type==='images' || f.type==='select-stop') continue;
        let v=it[f.key];
        if(v===undefined || v===null) continue;
        if(f.date){ const dv=importDate(v); if(dv) obj[f.key]=dv; continue; }
        if(f.key==='equipment'){ obj.equipment=Array.isArray(v)?v.map(String):String(v).split(',').map(s=>s.trim()).filter(Boolean); continue; }
        if(f.key==='motives'){ obj.motives=Array.isArray(v)?v.map(String):String(v).split('\n').map(s=>s.trim()).filter(Boolean); continue; }
        obj[f.key]=String(v).trim();
      }
      // Pflichtfelder prüfen – unvollständige Einträge überspringen
      const fehlt=schema.filter(f=>f.required && !obj[f.key]);
      if(fehlt.length) continue;
      const label = (type==='flight'||type==='transfer') ? `${obj.from} → ${obj.to}` : (type==='car' ? [obj.company, obj.vehicle].filter(Boolean).join(' · ') : obj.name);
      const datum = obj.date||obj.checkin||obj.arrival||obj.pickupDate||'';
      // Schon vorhanden? Gleicher Name (und Datum, falls vorhanden) in derselben Reise.
      // Dann nicht vorauswählen – sonst legt ein zweiter Import alles doppelt an.
      const t = currentTrip();
      const doppelt = arr(type).some(x => {
        if (x.tripId !== t.id) return false;
        if (type==='photo' && x.type!=='foto') return false;
        if (type==='activity' && x.type==='foto') return false;
        const gleich = (type==='flight'||type==='transfer')
          ? (x.from===obj.from && x.to===obj.to)
          : type==='car'
            ? ((x.company||'').trim().toLowerCase() === (obj.company||'').trim().toLowerCase())
            : ((x.name||'').trim().toLowerCase() === (obj.name||'').trim().toLowerCase());
        if (!gleich) return false;
        const xd = x.date||x.checkin||x.arrival||x.pickupDate||'';
        return !datum || !xd || xd===datum;
      });
      const sub = [titel, datum?displayDate(datum):'', obj.time?obj.time+' Uhr':''].filter(Boolean).join(' · ');
      importItems.push({ type, label, sub, data:obj, on:!doppelt, doppelt });
    }
  }
  if(!importItems.length){ renderImportStep1('Im Datenblock konnte ich nichts finden, was ich eintragen kann.'); return; }
  renderImportStep2();
}

function renderImportStep2(){
  const gruppen={};
  importItems.forEach((it,i)=>{ (gruppen[it.type]=gruppen[it.type]||[]).push(i); });
  const titel={ '__meta':'Reisedaten', stop:'Stopps', flight:'Flüge', hotel:'Hotels', car:'Mietwagen', transfer:'Transfers', activity:'Aktivitäten', photo:'Fotografie', pack:'Packliste', todo:'Checkliste' };
  const dop = importItems.filter(i=>i.doppelt).length;
  let html=`<p class="import-hint">${importItems.length} Einträge erkannt. Hake ab, was übernommen werden soll.</p>`
    + (dop?`<div class="import-warn">${dop} ${dop===1?'Eintrag ist':'Einträge sind'} in dieser Reise schon vorhanden und ${dop===1?'wurde':'wurden'} abgewählt. Ankreuzen legt ${dop===1?'ihn':'sie'} ein zweites Mal an.</div>`:'');
  for(const [type,idx] of Object.entries(gruppen)){
    html+=`<div class="section-label">${titel[type]||type} <span class="sl-count">${idx.length}</span></div><div class="import-list liste">`;
    for(const i of idx){
      const it=importItems[i];
      html+=`<button class="imp-row${it.on?' on':''}${it.doppelt?' dup':''}" onclick="toggleImport(${i})">
        <span class="imp-mark">${SYMBOL.haken}</span>
        <span class="imp-text"><span class="imp-name">${esc(it.label)}</span><span class="imp-sub">${esc(it.sub)}${it.doppelt?' · <b class="imp-dup">schon vorhanden</b>':''}</span></span>
      </button>`;
    }
    html+='</div>';
  }
  const n=importItems.filter(i=>i.on).length;
  html+=`<div class="import-actions">
    <button class="btn btn-secondary" onclick="renderImportStep1()">Zurück</button>
    <button class="btn btn-primary" id="import-go" onclick="runImport()"${n?'':' disabled'}>${n} übernehmen</button>
  </div>`;
  $('import-body').innerHTML=html;
}
function toggleImport(i){
  importItems[i].on=!importItems[i].on;
  renderImportStep2();
}
function runImport(){
  const t=currentTrip(); if(!t) return;
  const gewaehlt=importItems.filter(i=>i.on);
  if(!gewaehlt.length) return;
  let n=0;
  for(const it of gewaehlt){
    if(it.type==='__meta'){
      Object.assign(t, it.data); persist('trip'); n++;
      if (t.finId && typeof finSyncFromReisen === 'function') finSyncFromReisen(t.finId, { name:t.name, start:t.start, end:t.end, country:t.country||'' });
      continue;
    }
    const obj={ ...it.data, id:neueId(), tripId:t.id };
    if(it.type==='photo') obj.type='foto';
    if(it.type==='activity') obj.type='normal';
    if(it.type==='pack'||it.type==='todo') obj.checked=false;
    arr(it.type).push(obj); persist(it.type); n++;
  }
  closeImport();
  renderHome(); renderTripScreen();
  showToast(n+(n===1?' Eintrag':' Einträge')+' übernommen');
}

function renderHome(){
  const added = syncVisitedFromTrips();
  renderWorldCard();
  renderTripCards();
  if (added.length) showToast(added.join(', ') + (added.length===1?' zu deinen Ländern':' zu deinen Ländern hinzugefügt'));
}

function countdownParts(t){
  const du = daysUntil(t.start);
  if (t.start && du !== null) {
    if (du > 0) return { big: du, unit: du===1?'Tag':'Tage', label:'bis zur Abreise', cls:'accent' };
    if (du === 0) return { big:'Heute', unit:'', label:'Die Reise beginnt!', cls:'green' };
    if (t.end && todayISO() <= t.end) return { big:'Aktiv', unit:'', label:'Reise läuft gerade', cls:'green' };
    return { big:'Fertig', unit:'', label:'Reise abgeschlossen', cls:'muted' };
  }
  return { big:'—', unit:'', label:'Kein Datum festgelegt', cls:'muted' };
}

/* Symbole kommen aus dem Kern - eine Linienstaerke, keine eigenen Glyphen im Bereich. */
const ICON_PLANE = SYMBOL.flugzeug;
const ICON_BED = SYMBOL.bett;
const ICON_PIN = SYMBOL.pin;
const ICON_CAR = SYMBOL.auto;
const ICON_TRANSFER = SYMBOL.transfer;
const ICON_CAMERA = SYMBOL.kamera;

/* Baut eine Reise-Kachel. Bei abgeschlossenen Reisen steht statt des Countdowns Jahr + Dauer. */
function tripTileHTML(t, done){
  const map = t.country ? tripMapSVG(t.country, true) : '';
  let big, unit, label, cls;
  if (done) {
    big = tripYear(t) || '—'; unit = ''; cls = 'muted';
    label = tripDuration(t) || ((t.start||t.end) ? `${displayDate(t.start)||'?'} – ${displayDate(t.end)||'?'}` : '');
  } else {
    const cd = countdownParts(t);
    big = cd.big; unit = cd.unit; label = cd.label; cls = cd.cls;
  }
  /* Huelle und Wisch-Knoepfe kommen aus dem Kern (swipeInnerHTML). Vorher war beides hier
     von Hand nachgebaut - mit <div> statt <button> und damit leicht abweichend von allen
     anderen Listen. Eine Aenderung im Kern waere hier stillschweigend nicht angekommen. */
  const inner = `<div class="bento-tile trip-tile${done?' done':''}">
        ${kachelKopf(t.name, 'flugzeug')}
        <div class="tt-country">${t.country ? esc(t.country) : (t.destination ? esc(t.destination) : '\u00A0')}</div>
        ${map ? `<div class="tt-map">${map}</div>` : ''}
        <div class="tt-cd"><span class="tt-cd-val ${cls}">${typeof big==='number'?big:esc(big)}</span>${unit?`<span class="tt-cd-unit">${unit}</span>`:''}</div>
        <div class="tt-cd-label">${esc(label)}</div>
      </div>`;
  return `<div class="tile-wrap" data-id="${t.id}">${swipeInnerHTML(inner)}</div>`;
}
/* swipeWrap liegt im gemeinsamen Kern (index.html). */
/* Löscht einen Eintrag nach Rückfrage – inkl. Bildern aus der Datenbank */
async function deleteEntryById(type, id){
  await loeschenMitRueckfrage({
    liste: arr(type), id,
    // Bilder gehoeren zum Eintrag. Sie verschwinden erst, wenn Rueckgaengig nicht
    // mehr geht - sonst kaeme der Eintrag ohne seine Bilder zurueck.
    endgueltig: async (e) => { if (idbReady && e.images) for (const ref of e.images) if(!isDataUri(ref)) await idbDelete(ref); },
    speichern: () => persist(type),
    zeichnen: () => { renderTabContent(); renderHome(); }
  });
}
/* Hängt die Swipe-Gesten an alle Einträge im Reiter */
/* Antippen oeffnet den Eintrag (die ganze Zeile, nicht nur der Pfeil); Wischen
   und langes Druecken bieten Bearbeiten und Loeschen. */
function wireEntrySwipe(){
  const el = $('tab-content'); if(!el) return;
  el.querySelectorAll('.entry-wrap').forEach(wrap => {
    const id = wrap.dataset.id, type = wrap.dataset.type;
    attachSwipeGeneric(wrap, () => deleteEntryById(type, id), () => rpOpenModal(type, id), () => rpOpenDetail(type, id));
  });
}

function wireSwipe(container){
  container.querySelectorAll('.tile-wrap').forEach(wrap => {
    const id = wrap.dataset.id;
    attachSwipeGeneric(wrap, () => deleteTripById(id), () => rpOpenModal('trip', id), () => openTripScreen(id));
  });
}
/* Reise gilt als abgeschlossen, sobald das Enddatum vorbei ist */
function isDone(t){ return !!(t.end && t.end < todayISO()); }

function renderTripCards(){
  const el = $('trip-tiles'), doneEl = $('done-section');
  const upcoming = trips.filter(t=>!isDone(t)).sort((a,b)=>(a.start||'9999').localeCompare(b.start||'9999'));
  const done = trips.filter(isDone).sort((a,b)=>(b.end||'').localeCompare(a.end||'')); // neueste zuerst

  if (!trips.length) {
    el.innerHTML = leerHTML({ symbol: 'koffer', titel: 'Keine Reisen',
      text: 'Route, Flüge, Hotels, Fotografie und Packliste an einem Ort.',
      knopf: 'Reise hinzufügen', aktion: "rpOpenModal('trip')" });
  } else if (!upcoming.length) {
    el.innerHTML = leerHTML({ symbol: 'koffer', titel: 'Keine geplante Reise', text: 'Zeit für die nächste?',
      knopf: 'Reise hinzufügen', aktion: "rpOpenModal('trip')", klein: true });
  } else {
    el.innerHTML = `<div class="bento">${upcoming.map(t=>tripTileHTML(t,false)).join('')}</div>`;
    wireSwipe(el);
  }

  // Abgeschlossene Reisen nur zeigen, wenn es welche gibt
  if (!done.length) { doneEl.innerHTML = ''; return; }
  doneEl.innerHTML = `<div class="sub-header"><div class="sub-header-text"><h1>Abgeschlossen <span class="sl-count">${done.length}</span></h1><p>Bereits gereist</p></div></div>
    <div class="bento">${done.map(t=>tripTileHTML(t,true)).join('')}</div>`;
  wireSwipe(doneEl);
}

/* ===== SWIPE ===== */
/* Das "Tippen woanders schliesst die offene Zeile" erledigt der Kern bereits
   pro Zeile (attachSwipeGeneric). Ein eigener, globaler Handler hier war
   redundant und schloss die Zeile bei JEDEM Touch irgendwo im Dokument –
   auch beim Start der Zurueck-Geste, was diese durcheinanderbrachte. */

/* Reise inkl. aller zugehörigen Daten und Bilder löschen (über Swipe) */
/* Bewusst nicht ueber loeschenMitRueckfrage: hier haengen sieben weitere Listen dran.
   Ein Rueckgaengig muesste all diese Eintraege wiederherstellen – das waere eine andere,
   deutlich groessere Mechanik als das Zurueckholen eines einzelnen Eintrags. */
/* Der eigentliche Aufraeumvorgang, ohne Rueckfrage - wiederverwendbar fuer den Fall, dass
   eine verknuepfte Reise automatisch aus Finanzen heraus geloescht wird (dort wurde die
   Rueckfrage fuer den Finanzen-Eintrag bereits gestellt; eine zweite waere doppelt). */
async function rpDeleteTripSilently(id){
  const t = trips.find(x=>x.id===id); if(!t) return;
  if (idbReady) { for (const a of activities.filter(x=>x.tripId===id)) for (const ref of (a.images||[])) if(!isDataUri(ref)) await idbDelete(ref); }
  setArr('trip', trips.filter(x=>x.id!==id)); persist('trip');
  ['stop','hotel','flight','car','transfer','activity','pack','todo'].forEach(tp=>{ setArr(tp, arr(tp).filter(x=>x.tripId!==id)); persist(tp); });
  // Merkliste aufräumen; besuchte Länder bleiben erhalten
  if (autoTrips.includes(id)) { autoTrips = autoTrips.filter(x=>x!==id); store.set(KEYS.autoTrips, JSON.stringify(autoTrips)); }
}
/* ===== Verknuepfung mit Finanzen-Urlauben =====
   finId auf einer Reise markiert, dass sie aus einem Finanzen-Eintrag entstanden ist.
   Bestehende, vor dieser Funktion angelegte Reisen haben kein finId und bleiben
   unverknuepft - eine rueckwirkende automatische Zuordnung waere bei mehrdeutigen
   Namen (zwei Mal "Namibia") riskant. */

/* Legt beim Anlegen eines Finanzen-Urlaubs automatisch eine Huelle in Reisen an - nur
   Name, Zeitraum und Land. Hotels, Packliste, Fotos etc. traegt man dort selbst nach. */
function rpCreateShellTrip(daten, finId){
  const t = { id: neueId(), name: daten.name, start: daten.start, end: daten.end, finId };
  if (daten.country) t.country = daten.country;
  trips.push(t);
  persist('trip');
  renderHome();
  return t.id;
}

/* Name/Zeitraum/Land eines verknuepften Eintrags nachziehen, wenn er in Finanzen
   bearbeitet wurde. Schreibt direkt, ohne ueber saveModal() zu gehen - sonst wuerde das
   einen Ruecksync nach Finanzen ausloesen und beide Seiten wechselseitig anstossen. */
function rpSyncFromFinanzen(reiseId, daten){
  const t = trips.find(x => x.id === reiseId); if (!t) return;
  t.name = daten.name || t.name;
  if (daten.start) t.start = daten.start;
  t.end = daten.end || daten.start || t.end;
  // Ohne Angabe bleibt das Land stehen - aeltere Finanzen-Eintraege kennen keins,
  // ein Bearbeiten dort loeschte sonst Kartenumriss und "besucht"-Eintrag.
  if (daten.country) t.country = daten.country;
  persist('trip');
  renderHome();
  if (currentTripId === reiseId) renderTripScreen();
}

async function deleteTripById(id){
  const t = trips.find(x=>x.id===id); if(!t) return;
  const ok = await showDialog('Mit allen Stopps, Flügen, Hotels, Aktivitäten und Listen.', { title:`„${t.name}“ löschen?`, okText:'Reise löschen', rot:true, blatt:true });
  if(!ok) return;
  // Ein verknuepfter Finanzen-Eintrag wird hier NICHT mitgeloescht (Geld-Daten sind
  // sensibler als Reise-Logistik) - nur die Verknuepfung faellt weg, damit er nicht auf
  // eine nicht mehr existierende Reise zeigt.
  if (t.finId && typeof finUnlinkReise === 'function') finUnlinkReise(t.finId);
  await rpDeleteTripSilently(id);
  renderHome(); showToast('Gelöscht');

}

/* ===== REISE-DETAIL ===== */
let currentTripId = null, activeTab = 'overview';
const TABS = [['overview','Übersicht'],['route','Route'],['photos','Fotografie']];

function openTripScreen(id){ currentTripId=id; activeTab='overview'; renderTripScreen(); screenOeffnen('trip-screen'); }
function closeTripScreen(){ screenSchliessen('trip-screen'); currentTripId=null; renderHome(); }
function currentTrip(){ return trips.find(t=>t.id===currentTripId); }
function switchTab(k){
  if (k === activeTab) return;
  activeTab=k;
  renderTripScreen();
  // iOS: nach dem Inhaltswechsel den fixierten Scroll-Container zurücksetzen und
  // die Momentum-Scroll-Engine kurz auffrischen – sonst scrollt die neue Ansicht
  // anfangs nicht (man müsste erst tippen).
  const sc = $('trip-screen');
  if (sc) {
    sc.scrollTop = 0;
    // iOS: nach dem innerHTML-Wechsel „vergisst" der fixierte Container die scrollbare Höhe.
    // Overflow kurz umschalten mit erzwungenem Reflow dazwischen -> Scroll-Engine rechnet neu.
    sc.style.overflowY = 'hidden';
    void sc.offsetHeight;
    sc.style.overflowY = '';
    // 'settled' sicherstellen, falls der Screen (noch) keinen entfernten Transform hat
    sc.classList.add('settled');
  }
}

function renderTripScreen(){
  const t = currentTrip();
  if (!t) { closeTripScreen(); return; }
  $('ts-name').textContent = t.name;
  // Zeitraum und Dauer stehen in der Übersichtskarte – hier bleibt nur das Land,
  // und auch das nur, wenn es nicht ohnehin schon der Name der Reise ist.
  const ziel = t.country || t.destination || '';
  $('ts-dest').textContent = ziel;
  $('ts-dest').hidden = !ziel || ziel === t.name;
  segmentRendern($('tab-bar'), TABS, activeTab, 'switchTab');
  renderTabContent();
}
function renderTabContent(){
  const t = currentTrip(); if(!t) return;
  const el = $('tab-content');
  const map = { overview:renderOverviewTab, route:renderRouteTab, photos:renderPhotosTab };
  el.innerHTML = map[activeTab](t);
  wireEntrySwipe();
}

function renderOverviewTab(t){
  const c = id => arr(id).filter(x=>x.tripId===t.id).length;
  // Countdown wie auf der Reisekachel; vorher stand bei einer abgeschlossenen
  // Reise hier "Unterwegs".
  const cd = countdownParts(t);
  const big = cd.big;
  const sub = (typeof cd.big === 'number') ? `${cd.unit} bis ${esc(t.name)}` : esc(cd.label);
  const map = t.country ? tripMapSVG(t.country) : '';
  const range = (t.start || t.end) ? `${displayDate(t.start)||'?'} – ${displayDate(t.end)||'?'}` : '';
  const dur = tripDuration(t);
  // Eine Karte: Countdown + Weltkarte oben, Zeitraum darunter, dann die Zahlen
  const hero = `<div class="karte ov-card">
    <div class="ov-top">
      <div class="ov-cd">
        <div class="ov-cd-label">Countdown</div>
        <div class="ov-cd-val">${typeof big==='number'?big:esc(big)}</div>
        <div class="ov-cd-sub">${sub}</div>
      </div>
      ${map ? `<div class="ov-map">${map}</div>` : ''}
    </div>
    ${(range||dur) ? `<div class="ov-when">
      ${range ? `<span class="ov-when-range">${esc(range)}</span>` : ''}
      ${(range&&dur) ? `<span class="ov-when-dot">·</span>` : ''}
      ${dur ? `<span class="ov-when-dur">${esc(dur)}</span>` : ''}
    </div>` : ''}
    <div class="ov-stats">
      <div class="stat"><div class="stat-ic ic-flight">${ICON_PLANE}</div><div class="stat-value">${c('flight')}</div></div>
      <div class="stat"><div class="stat-ic ic-car">${ICON_CAR}</div><div class="stat-value">${c('car')}</div></div>
      <div class="stat"><div class="stat-ic ic-hotel">${ICON_BED}</div><div class="stat-value">${c('hotel')}</div></div>
      <div class="stat"><div class="stat-ic ic-activity">${ICON_PIN}</div><div class="stat-value">${activities.filter(x=>x.tripId===t.id&&x.type!=='foto').length}</div></div>
      <div class="stat"><div class="stat-ic ic-foto">${ICON_CAMERA}</div><div class="stat-value">${activities.filter(x=>x.tripId===t.id&&x.type==='foto').length}</div></div>
    </div>
  </div>`;
  return hero + renderOperatorSection(t) + renderTodosSection(t) + renderPackSection(t);
}
/* Plus oben rechts: anlegen, was zur Reise gehoert - wie das Plus-Menue in
   Kalender oder Dateien. Wer gerade nicht auf dem passenden Reiter steht, wird
   dorthin mitgenommen, damit das Neue nach dem Sichern sichtbar ist. */
const ICON_STOPP = SYMBOL.punkt;
function rpPlusMenu(anker){
  const auf = (tab, fn) => () => { if (activeTab !== tab) switchTab(tab); fn(); };
  menuOeffnen(anker, [
    { text: 'Stopp',      symbol: ICON_STOPP,    tun: auf('route', () => rpOpenModal('stop')) },
    { text: 'Flug',       symbol: ICON_PLANE,    tun: auf('route', () => rpOpenModal('flight')) },
    { text: 'Hotel',      symbol: ICON_BED,      tun: auf('route', () => rpOpenModal('hotel')) },
    { text: 'Mietwagen',  symbol: ICON_CAR,      tun: auf('route', () => rpOpenModal('car')) },
    { text: 'Transfer',   symbol: ICON_TRANSFER, tun: auf('route', () => rpOpenModal('transfer')) },
    { text: 'Aktivität',  symbol: ICON_PIN,      tun: auf('route', () => rpOpenModal('activity')) },
    '-',
    { text: 'Foto-Ort',   symbol: ICON_CAMERA,   tun: auf('photos', addFotoPlace) },
    '-',
    { text: 'Reiseplan importieren', symbol: 'import', tun: openImport },
    { text: 'Reise bearbeiten',      symbol: 'stift',  tun: () => rpOpenModal('trip', currentTripId) }
  ]);
}

/* Veranstalter-Kontakt. Gilt fuer die ganze Reise, nicht fuer eine einzelne Station -
   deshalb auf Reise-Ebene und nicht am Hotel. Der Notruf ist abgesetzt, damit er im
   Ernstfall nicht mit der Nummer fuer Geschaeftszeiten verwechselt wird. */
function renderOperatorSection(t){
  const hat = ['operator','opContact','opPhone','opEmergency','opOffice','opEmail','opNotes'].some(k=>String(t[k]||'').trim());
  if (!hat) return '';
  const zeile = (label, wert, klasse) => {
    const v = String(wert||'').trim();
    if (!v) return '';
    return `<div class="dv-row${klasse?' '+klasse:''}"><span class="dv-k">${esc(label)}</span><span class="dv-v">${v}</span></div>`;
  };
  const tel = nr => `<a class="rt-tel" href="tel:${esc(String(nr).replace(/[^+0-9]/g,''))}">${esc(nr)}</a>`;
  const mail = ad => `<a class="rt-tel" href="mailto:${esc(ad)}">${esc(ad)}</a>`;
  const zeilen = [
    zeile('Veranstalter', t.operator ? esc(t.operator) : ''),
    zeile('Ansprechpartner', t.opContact ? esc(t.opContact) : ''),
    zeile('Telefon', t.opPhone ? tel(t.opPhone) : ''),
    zeile('Weiteres Büro', t.opOffice ? tel(t.opOffice) : ''),
    zeile('Notruf', t.opEmergency ? tel(t.opEmergency) : '', 'dv-row-alarm'),
    zeile('E-Mail', t.opEmail ? mail(t.opEmail) : '')
  ].join('');
  const hinweis = String(t.opNotes||'').trim()
    ? `<div class="dv-card karte dv-prose">${String(t.opNotes).trim().split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean).map(x=>`<p>${esc(x).replace(/\n/g,'<br>')}</p>`).join('')}</div>`
    : '';
  return `<div class="section-label">Veranstalter</div>${zeilen?`<div class="dv-card karte">${zeilen}</div>`:''}${hinweis}`;
}
/* Packliste – gleiche Mechanik wie die Checkliste, direkt in der Übersicht */
function renderPackSection(t){
  const list = packing.filter(s=>s.tripId===t.id);
  const open = list.filter(i=>!i.checked);
  const done = list.filter(i=>i.checked);
  const ordered = [...open, ...done];
  const rows = ordered.map(i => `
    <div class="todo-row${i.checked?' checked':''}">
      <button class="todo-check${i.checked?' checked':''}" onclick="togglePack('${i.id}')" aria-label="Eingepackt">
        ${SYMBOL.haken}
      </button>
      <input class="todo-text" value="${esc(i.name)}" onchange="renamePack('${i.id}', this.value)"
             onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">
      <button class="todo-del" onclick="removePack('${i.id}')" aria-label="Löschen">✕</button>
    </div>`).join('');
  const newRow = `
    <div class="todo-row">
      <span class="todo-check ghost"></span>
      <input class="todo-text" id="pack-new" placeholder="Neuer Gegenstand …"
             onkeydown="if(event.key==='Enter'){event.preventDefault();addPackInline();}"
             onblur="addPackInline(true)">
    </div>`;
  const count = list.length ? ` <span class="sl-count">${done.length}/${list.length}</span>` : '';
  return `<div class="sub-header"><div class="sub-header-text"><h1>Packliste${count}</h1><p>Was mit muss</p></div></div><div class="todo-list">${rows}${newRow}</div>`;
}
function togglePack(id){ const i=packing.find(x=>x.id===id); if(!i) return; i.checked=!i.checked; persist('pack'); renderTabContent(); }
function renamePack(id, val){
  const i=packing.find(x=>x.id===id); if(!i) return;
  const name=val.trim();
  if (!name) { setArr('pack', packing.filter(x=>x.id!==id)); persist('pack'); renderTabContent(); return; }
  i.name=name; persist('pack');
}
function removePack(id){ setArr('pack', packing.filter(x=>x.id!==id)); persist('pack'); renderTabContent(); }
function addPackInline(silent){
  const inp=$('pack-new'); if(!inp) return;
  const name=inp.value.trim();
  if (!name) return;
  packing.push({ id:neueId(), tripId:currentTripId, name, checked:false });
  persist('pack');
  renderTabContent();
  if (!silent) { const next=$('pack-new'); if(next) next.focus(); }
}

/* Route als Zeitleiste: durchgehende Linie, Punkt je Stopp, Datum als eigene Spalte */
function nightsBetween(a, b){
  if(!a || !b) return 0;
  const d1=new Date(a+'T00:00:00'), d2=new Date(b+'T00:00:00');
  if(isNaN(d1)||isNaN(d2)) return 0;
  return Math.max(0, Math.round((d2-d1)/86400000));
}
/* Flughafen „Frankfurt (FRA)" in Stadt + Code zerlegen */
function splitAirport(s){
  const t = String(s||'').trim();
  const m = t.match(/^(.*?)\s*\(([A-Za-z]{3})\)\s*$/);
  return m ? { city:m[1].trim(), code:m[2].toUpperCase() } : { city:t, code:'' };
}
/* Wie viele Tage später landet der Flug? Aus den echten Daten, keine Vermutung. */
function arrivalDayOffset(f){
  if(!f.date || !f.arrivalDate) return 0;
  const a = new Date(f.date+'T00:00:00'), b = new Date(f.arrivalDate+'T00:00:00');
  if(isNaN(a)||isNaN(b)) return 0;
  return Math.round((b-a)/86400000);
}
function renderRouteTab(t){
  const seq = routeSequenz(t);
  if(!seq.length) return leerHTML({ symbol: 'route', titel: 'Noch keine Route',
    text: 'Stopps, Flüge, Transfers, Hotels, Mietwagen und Aktivitäten. Hotels und Aktivitäten ordnen sich dem passenden Stopp zu.',
    knopf: 'Hinzufügen', aktion: 'rpPlusMenu(this)' });
  const body = seq.map((item,i)=> renderRouteRow(item, i===seq.length-1)).join('');
  return `<div class="rt-list">${body}</div>`;
}
/* Alle Eintraege einer Reise in der Reihenfolge des Zeitstrahls: Stopps mit ihren
   Hotels und Aktivitaeten, dazwischen Fluege, Transfers und Mietwagen. */
function routeSequenz(t){
  const inRange = (d, s) => d && s.arrival && s.departure && s.arrival <= d && d <= s.departure;
  // Reihenfolge beachten: findStop() liest tripStops, deshalb steht die Liste zuerst.
  // Vorher stand sie darunter und es ging nur deshalb gut, weil der erste Aufruf zufaellig
  // spaeter kam - ein Verschieben der Zeile haette es lautlos zerbrochen.
  const tripStops   = stops.filter(s=>s.tripId===t.id);
  // Bei Überlappung (Abreisetag = Ankunftstag des nächsten Stopps) gewinnt der neu beginnende Stopp
  const findStop = (d) => { let best=null; for (const s of tripStops){ if (inRange(d,s) && (!best || s.arrival > best.arrival)) best=s; } return best; };
  const tripHotels  = hotels.filter(h=>h.tripId===t.id);
  const tripActs    = activities.filter(a=>a.tripId===t.id && a.type!=='foto');
  const tripFlights = flights.filter(f=>f.tripId===t.id);
  const tripCars    = cars.filter(c=>c.tripId===t.id);
  const tripTrans   = transfers.filter(x=>x.tripId===t.id);

  // Hotels & Aktivitäten automatisch per Datum einem Stopp zuordnen
  const childOf = {}; tripStops.forEach(s=> childOf[s.id]=[]);
  const ungrouped = [];
  tripHotels.forEach(h=>{ const s=findStop(h.checkin); const node={art:'hotel',datum:h.checkin||'',zeit:'',o:h}; if(s) childOf[s.id].push(node); else ungrouped.push(node); });
  tripActs.forEach(a=>{ const s=findStop(a.date); const node={art:'activity',datum:a.date||'',zeit:a.time||'',o:a}; if(s) childOf[s.id].push(node); else ungrouped.push(node); });

  // Top-Level-Knoten (Stopps als Gruppen, Flüge & Mietwagen als eigene Ebene)
  const top = [];
  tripStops.forEach(s=> top.push({art:'stop',datum:s.arrival||'',zeit:'',prio:3,o:s}));
  tripFlights.forEach(f=> top.push({art:'flight',datum:f.date||'',zeit:f.time||'',prio:2,o:f}));
  // Reihenfolge innerhalb eines Tages: Mietwagen (0), Transfer (1), Flug (2), Stopp (3).
  // Am Ankunftstag: erst das Auto uebernehmen, dann losfahren (Transfer). Am Abreisetag:
  // erst zum Flughafen fahren (Transfer), dann fliegen - vorher stand der Flug vor der
  // Anfahrt dorthin. Diese eine Rangfolge deckt beide Faelle richtig ab.
  tripCars.forEach(c=> top.push({art:'car',datum:c.pickupDate||'',zeit:c.pickupTime||'',prio:0,o:c}));
  tripTrans.forEach(x=> top.push({art:'transfer',datum:x.date||'',zeit:x.time||'',prio:1,o:x}));
  ungrouped.forEach(n=> top.push({...n, prio: n.art==='hotel'?4:5}));
  top.sort((a,b)=> ((a.datum||'9999-99-99')+a.prio+(a.zeit||'~~')).localeCompare((b.datum||'9999-99-99')+b.prio+(b.zeit||'~~')));

  // Flache Render-Sequenz: Kinder direkt hinter ihren Stopp
  const seq = [];
  top.forEach(node=>{
    seq.push(node);
    if(node.art==='stop'){
      childOf[node.o.id]
        .sort((a,b)=> ((a.datum||'9999')+(a.zeit||'~~')).localeCompare((b.datum||'9999')+(b.zeit||'~~')))
        .forEach(k=> seq.push({...k, child:true}));
    }
  });
  return seq;
}
/* Dauer (Naechte/Tage) steht jetzt unter Tag und Monat statt als Pille in der Meta-Zeile -
   ruhiger als eine zusaetzliche farbige Flaeche neben dem Text, und an derselben Stelle
   fuer alle drei Typen, die eine Dauer haben (Hotel, Stopp, Mietwagen). */
function rtDateCol(iso, opts){
  const small = opts === true || (opts && opts.small);
  const dauer = (opts && typeof opts === 'object') ? opts.dauer : null;
  const d = iso ? new Date(iso+'T00:00:00') : null;
  const cls = small ? 'rt-date rt-cdate' : 'rt-date';
  const kopf = (d && !isNaN(d))
    ? `<span class="rt-day">${String(d.getDate()).padStart(2,'0')}</span>${small?'':`<span class="rt-mon">${['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][d.getMonth()]}</span>`}`
    : `<span class="rt-day">–</span>`;
  const dauerHtml = dauer ? `<span class="rt-dauer">${dauer.n}<em>${esc(dauer.label)}</em></span>` : '';
  return `<div class="${cls}">${kopf}${dauerHtml}</div>`;
}
/* Pfeil am rechten Zeilenrand: zeigt nur an, dass die Zeile in die Ansicht fuehrt -
   antippen laesst sich die ganze Zeile (wireEntrySwipe). */
function rtChevron(){
  return `<span class="rt-chev" aria-hidden="true">›</span>`;
}
/* Telefonnummer als waehlbare Unterzeile. stopPropagation, weil ein Tipp auf die Zeile
   sonst die Eintrag-Ansicht oeffnet statt zu waehlen. */
function rtPhoneHTML(o){
  const nr = String(o.phone||'').trim();
  if (!nr) return '';
  return `<div class="rt-sub"><a class="rt-tel" href="tel:${esc(nr.replace(/[^+0-9]/g,''))}" onclick="event.stopPropagation()">${esc(nr)}</a></div>`;
}
function renderRouteRow(item, last){
  const o = item.o, lc = last?' last':'';
  if (item.art === 'transfer'){
    const strecke = [o.from, o.to].filter(Boolean).join(' → ') || 'Transfer';
    const kurz = [o.distance, o.duration].filter(Boolean).join(' · ');
    return swipeWrap('transfer', o.id, `<div class="rt-row transfer${lc}">
      ${rtDateCol(o.date)}
      <div class="rt-line"><span class="rt-transfer">${ICON_TRANSFER}</span></div>
      <div class="rt-body">
        <div class="rt-name">${esc(strecke)}</div>
        ${o.time?`<div class="rt-meta"><span>${esc(o.time)} Uhr</span></div>`:''}
        ${kurz?`<div class="rt-sub">${esc(kurz)}</div>`:''}
        ${rtPhoneHTML(o)}
      </div>
      ${rtChevron()}
    </div>`);
  }
  if (item.art === 'flight'){
    const a = splitAirport(o.from), b = splitAirport(o.to);
    const plus = arrivalDayOffset(o), dauer = o.duration || '';
    return swipeWrap('flight', o.id, `<div class="rt-row flight${lc}">
      ${rtDateCol(o.date)}
      <div class="rt-line"><span class="rt-plane">${ICON_PLANE}</span></div>
      <div class="rt-body">
        <div class="rt-name">${esc(a.code||a.city)} → ${esc(b.code||b.city)}</div>
        <div class="rt-meta">
          ${o.time?`<span>${esc(o.time)}${o.arrivalTime?' – '+esc(o.arrivalTime)+(plus>0?' +'+plus:''):''} Uhr</span>`:''}
          ${dauer?`<span class="rt-nights">${esc(dauer)}</span>`:''}
        </div>
        ${(o.airline||o.flightNo)?`<div class="rt-sub">${esc([o.airline,o.flightNo].filter(Boolean).join(' · '))}</div>`:''}
        ${rtPhoneHTML(o)}
      </div>
      ${rtChevron()}
    </div>`);
  }
  if (item.art === 'car'){
    const days = nightsBetween(o.pickupDate, o.dropoffDate);
    const route = [o.pickupPlace, o.dropoffPlace].filter(Boolean);
    const routeTxt = route.length ? (route.length===2 && route[0]!==route[1] ? route[0]+' → '+route[1] : route[0]) : '';
    return swipeWrap('car', o.id, `<div class="rt-row car${lc}">
      ${rtDateCol(o.pickupDate, {dauer:days?{n:days, label:days===1?'Tag':'Tage'}:null})}
      <div class="rt-line"><span class="rt-car">${ICON_CAR}</span></div>
      <div class="rt-body">
        <div class="rt-name">${esc(o.company||'Mietwagen')}</div>
        <div class="rt-meta">
          ${(o.pickupDate||o.dropoffDate)?`<span>${displayDate(o.pickupDate)||'?'} – ${displayDate(o.dropoffDate)||'?'}</span>`:''}
        </div>
        ${[o.vehicle, routeTxt].filter(Boolean).map(t=>`<div class="rt-sub">${esc(t)}</div>`).join('')}
        ${rtPhoneHTML(o)}
      </div>
      ${rtChevron()}
    </div>`);
  }
  if (item.art === 'hotel'){
    const n = nightsBetween(o.checkin, o.checkout);
    const ort = o.city || o.address || '';
    const child = item.child;
    const marker = child ? `<span class="rt-cmark bed">${ICON_BED}</span>` : `<span class="rt-bed">${ICON_BED}</span>`;
    return swipeWrap('hotel', o.id, `<div class="rt-row hotel${child?' rt-child':''}${lc}">
      ${rtDateCol(o.checkin, {small:child, dauer:n?{n, label:n===1?'Nacht':'Nächte'}:null})}
      <div class="rt-line">${marker}</div>
      <div class="rt-body">
        <div class="rt-name">${esc(o.name)}</div>
        <div class="rt-meta">
          ${(o.checkin||o.checkout)?`<span>${displayDate(o.checkin)||'?'} – ${displayDate(o.checkout)||'?'}</span>`:''}
        </div>
        ${(ort||o.board)?`<div class="rt-sub">${esc([ort,o.board].filter(Boolean).join(' · '))}</div>`:''}
        ${rtPhoneHTML(o)}
      </div>
      ${rtChevron()}
    </div>`);
  }
  if (item.art === 'activity'){
    const child = item.child;
    const marker = child ? `<span class="rt-cmark pin">${ICON_PIN}</span>` : `<span class="rt-pin">${ICON_PIN}</span>`;
    return swipeWrap('activity', o.id, `<div class="rt-row activity${child?' rt-child':''}${lc}">
      ${rtDateCol(o.date, child)}
      <div class="rt-line">${marker}</div>
      <div class="rt-body">
        <div class="rt-name">${esc(o.name)}</div>
        ${o.time?`<div class="rt-meta"><span>${esc(o.time)} Uhr</span></div>`:''}
        ${rtPhoneHTML(o)}
      </div>
      ${rtChevron()}
    </div>`);
  }
  // stop (Gruppen-Header)
  const n = nightsBetween(o.arrival, o.departure);
  return swipeWrap('stop', o.id, `<div class="rt-row${lc}">
    ${rtDateCol(o.arrival, {dauer:n?{n, label:n===1?'Nacht':'Nächte'}:null})}
    <div class="rt-line"><span class="rt-dot"></span></div>
    <div class="rt-body">
      <div class="rt-name">${esc(o.name)}</div>
      <div class="rt-meta">
        ${(o.arrival||o.departure)?`<span>${displayDate(o.arrival)||'?'} – ${displayDate(o.departure)||'?'}</span>`:''}
      </div>
    </div>
    ${rtChevron()}
  </div>`);
}
/* Fotografie: immer offene Foto-Ort-Karten direkt im Tab.
   Ein Foto-Ort ist ein activities-Eintrag mit type:'foto' (name = Ort). */
function renderPhotosTab(t){
  const list = activities.filter(s=>s.tripId===t.id && s.type==='foto')
                 .sort((a,b)=>((a.order||0)-(b.order||0)) || String(a.id).localeCompare(String(b.id)));
  const body = list.length
    ? `<div class="foto-list">${list.map(fotoCardHTML).join('')}</div>`
    : leerHTML({ symbol: 'kamera', titel: 'Noch kein Foto-Ort', text: 'Orte für deine Shootings, mit Ausrüstung, Notizen und Referenzbildern.',
                 knopf: 'Foto-Ort hinzufügen', aktion: 'addFotoPlace()' });
  setTimeout(() => { loadFotoImages(); sizeFotoTextareas(); }, 0);
  return body;
}
function fotoCardHTML(p){
  const imgs = (p.images||[]).map((ref,idx)=>
    `<div class="foto-thumb" data-ref="${esc(ref)}" onclick="viewFotoImage('${p.id}',${idx})">
       <div class="foto-thumb-ph">…</div>
       <button class="img-del" onclick="event.stopPropagation();deleteFotoImage('${p.id}','${esc(ref)}')" aria-label="Bild löschen">✕</button>
     </div>`).join('');
  return `<div class="karte foto-card" data-id="${p.id}">
    <div class="foto-head">
      <input class="foto-ort" value="${esc(p.name||'')}" placeholder="Ort, z.B. Sossusvlei – Dünen"
             onchange="renameFotoPlace('${p.id}', this.value)"
             onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">
      <button class="foto-del foto-karte" onclick="rpFotoKarte('${p.id}')" aria-label="In Karten öffnen">${SYMBOL.pin}</button>
      <button class="foto-del" onclick="deleteFotoPlace('${p.id}')" aria-label="Foto-Ort löschen">✕</button>
    </div>
    <div class="foto-field">
      <label>Ausrüstung</label>
      <button class="foto-equip" onclick="openGearPicker('${p.id}')">
        ${(p.equipment&&p.equipment.length) ? `<span class="foto-pills">${p.equipment.map(e=>`<span class="cat-pill">${esc(e)}</span>`).join('')}</span>` : '<span class="foto-equip-empty">Ausrüstung wählen …</span>'}
        <span class="foto-equip-chevron">›</span>
      </button>
    </div>
    <div class="foto-field">
      <label>Notizen</label>
      <textarea class="foto-textarea" placeholder="Notizen zum Shooting …" rows="2"
             oninput="this.style.height='auto';this.style.height=(this.scrollHeight)+'px'"
             onchange="setFotoNotes('${p.id}', this.value)">${esc(p.notes||'')}</textarea>
    </div>
    <div class="foto-field">
      <label>Referenzbilder</label>
      <div class="foto-gallery">
        ${imgs}
        <div class="foto-add" onclick="pickFotoImages('${p.id}')" aria-label="Foto hinzufügen"><span class="plus">＋</span></div>
      </div>
    </div>
  </div>`;
}
/* Notiz-Felder wachsen mit dem Inhalt statt einer festen Mindesthoehe - direkt nach dem
   Einfuegen ins DOM einmal auf den vorhandenen Text einmessen (oninput uebernimmt danach
   jede weitere Eingabe live). */
function sizeFotoTextareas(){
  document.querySelectorAll('.foto-textarea').forEach(el => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  });
}
async function loadFotoImages(){
  const thumbs = document.querySelectorAll('.foto-thumb[data-ref]');
  for (const th of thumbs){
    if (th.classList.contains('loaded')) continue;
    const ref = th.getAttribute('data-ref');
    let src = isDataUri(ref) ? ref : (idbReady ? await idbGet(ref) : null);
    if (src){ th.style.backgroundImage = `url(${src})`; th.classList.add('loaded'); const ph=th.querySelector('.foto-thumb-ph'); if(ph) ph.remove(); }
  }
}
function addFotoPlace(){
  const p={ id:neueId(), tripId:currentTripId, type:'foto', name:'', equipment:[], notes:'', images:[], order:Date.now() };
  activities.push(p);
  persist('activity');
  renderTabContent();
  setTimeout(()=>{ const el=document.querySelector(`.foto-card[data-id="${p.id}"] .foto-ort`); if(el) el.focus(); }, 60);
}
function renameFotoPlace(id,val){ const p=activities.find(x=>x.id===id); if(!p) return; p.name=(val||'').trim(); persist('activity'); }
function setFotoNotes(id,val){ const p=activities.find(x=>x.id===id); if(!p) return; p.notes=val; persist('activity'); }
async function deleteFotoPlace(id){
  await loeschenMitRueckfrage({
    liste: arr('activity'), id,
    text: 'Der Foto-Ort wird gelöscht.',
    endgueltig: async (p) => { if(idbReady && p.images) for(const ref of p.images) if(!isDataUri(ref)) await idbDelete(ref); },
    speichern: () => persist('activity'),
    zeichnen: () => renderTabContent()
  });
}
let _fotoPickId = null;
function pickFotoImages(id){ _fotoPickId=id; const inp=$('foto-file-input'); if(inp){ inp.value=''; inp.click(); } }
async function handleFotoFiles(files){
  const id=_fotoPickId; const p=activities.find(x=>x.id===id); if(!p) return;
  if(!p.images) p.images=[];
  for(const f of files){
    try{
      const data=await resizeImage(f);
      if(idbReady){ const nid='img_'+neueId(); await idbPut(nid,data); p.images.push(nid); }
      else p.images.push(data);
    }catch(e){}
  }
  persist('activity');
  renderTabContent();
  loadFotoImages();
}
async function deleteFotoImage(id, ref){
  const p=activities.find(x=>x.id===id); if(!p||!p.images) return;
  p.images=p.images.filter(r=>r!==ref);
  if(idbReady && !isDataUri(ref)) await idbDelete(ref);
  persist('activity');
  renderTabContent();
  loadFotoImages();
}
async function viewFotoImage(id, idx){
  const p=activities.find(x=>x.id===id); if(!p||!p.images||!p.images[idx]) return;
  const ref=p.images[idx];
  let src = isDataUri(ref) ? ref : (idbReady ? await idbGet(ref) : null);
  if(!src) return;
  $('img-viewer-img').src=src;
  oeffneOverlay('img-viewer', closeImgViewer);
}
function closeImgViewer(){ schliesseOverlay('img-viewer'); $('img-viewer-img').src=''; }

/* ===== AUSRÜSTUNG (global, kategorisiert, in Einstellungen pflegbar) ===== */
function persistGear(){ store.set(KEYS.gear, JSON.stringify(gear)); }
function gearRowTap(){ renderGearManage(); screenOeffnen('einst-ausruestung'); }
function gearZeilenWert(){ const w=$('gear-row-wert'); if(w) w.textContent = String(gearAll().length); }
/* Je Kategorie eine Gruppe wie in den Einstellungen: Minuskreis entfernt,
   die letzte Zeile mit Pluskreis nimmt Neues auf. Aenderungen wirken sofort. */
function renderGearManage(){
  const el=$('gear-list'); if(!el) return;
  gearZeilenWert();
  el.innerHTML = GEAR_CATS.map(cat=>{
    const items=gear[cat]||[];
    const rows=items.map((g,i)=>`
      <div class="feld reihe">
        <button type="button" class="minus-kreis" onclick="gearRemove('${cat}',${i})" aria-label="${esc(g)} entfernen"></button>
        <input value="${esc(g)}" aria-label="${esc(cat)}" onchange="gearRename('${cat}',${i}, this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">
      </div>`).join('');
    const newRow=`
      <div class="feld reihe">
        <span class="plus-kreis" aria-hidden="true"></span>
        <input id="gear-new-${cat}" placeholder="Hinzufügen" aria-label="${esc(cat)} hinzufügen"
               onkeydown="if(event.key==='Enter'){event.preventDefault();gearAddManage('${cat}');}"
               onblur="gearAddManage('${cat}', true)">
      </div>`;
    return `<div class="gruppe-titel">${cat}</div><div class="gruppe">${rows}${newRow}</div>`;
  }).join('');
}
function gearRename(cat,i,val){
  if(!gear[cat]) return;
  const name=(val||'').trim();
  if(!name){ gear[cat].splice(i,1); persistGear(); renderGearManage(); return; }
  gear[cat][i]=name; persistGear(); renderGearManage();
}
function gearRemove(cat,i){ if(!gear[cat]) return; gear[cat].splice(i,1); persistGear(); renderGearManage(); }
function gearAddManage(cat,silent){
  const inp=$('gear-new-'+cat); if(!inp) return;
  const name=inp.value.trim(); if(!name) return;
  if(!gear[cat]) gear[cat]=[];
  if(!gearAll().includes(name)) gear[cat].push(name);
  persistGear(); renderGearManage();
  if(!silent){ const n=$('gear-new-'+cat); if(n) n.focus(); }
}

/* Ausrüstung pro Foto-Ort aus der Liste wählen (nach Kategorien gruppiert) */
let _gearPickId=null, _gearItems=[];
function openGearPicker(placeId){ _gearPickId=placeId; renderGearChoices(); oeffneOverlay('gear-overlay', closeGearPicker); }
function closeGearPicker(){ schliesseOverlay('gear-overlay'); _gearPickId=null; renderTabContent(); loadFotoImages(); }
function renderGearChoices(){
  const p=activities.find(x=>x.id===_gearPickId); if(!p) return;
  const sel=p.equipment||[];
  const all=gearAll();
  _gearItems=[];
  const check=SYMBOL.haken;
  let html='';
  GEAR_CATS.forEach(cat=>{
    let items=[...(gear[cat]||[])];
    if(cat==='Zubehör'){ sel.forEach(s=>{ if(!all.includes(s) && !items.includes(s)) items.push(s); }); }
    if(!items.length) return;
    html+=`<div class="gruppe-titel">${cat}</div><div class="gruppe">`;
    items.forEach(it=>{
      const idx=_gearItems.length; _gearItems.push(it);
      const on=sel.includes(it);
      html+=`<button type="button" class="gear-choice${on?' on':''}" onclick="toggleGearForPlace(${idx})"><span class="gc-label">${esc(it)}</span><span class="gc-check">${check}</span></button>`;
    });
    html+='</div>';
  });
  $('gear-choices').innerHTML = html || leerHTML({ symbol: 'kamera', titel: 'Keine Ausrüstung', text: 'Lege sie in den Einstellungen unter Ausrüstung an.', klein: true });
}
function toggleGearForPlace(idx){
  const item=_gearItems[idx]; if(item===undefined) return;
  const p=activities.find(x=>x.id===_gearPickId); if(!p) return;
  if(!p.equipment) p.equipment=[];
  const i=p.equipment.indexOf(item);
  if(i>=0) p.equipment.splice(i,1); else p.equipment.push(item);
  persist('activity');
  renderGearChoices();
}

/* Sheet nach unten wegwischen zum Schließen (nur vom oberen Rand aus) */
// Wischgeste fuer Blaetter liegt im Kern (attachSheetSwipe).

/* Checkliste im Apple-Notizen-Stil: rahmenlos, direkt eintippbar,
   erledigte werden durchgestrichen und ans Ende geschoben. */
function renderTodosSection(t){
  const list = todos.filter(s=>s.tripId===t.id);
  const open = list.filter(i=>!i.checked);
  const done = list.filter(i=>i.checked);
  const ordered = [...open, ...done];
  const rows = ordered.map(i => `
    <div class="todo-row${i.checked?' checked':''}">
      <button class="todo-check${i.checked?' checked':''}" onclick="toggleTodo('${i.id}')" aria-label="Erledigt">
        ${SYMBOL.haken}
      </button>
      <input class="todo-text" value="${esc(i.name)}" onchange="renameTodo('${i.id}', this.value)"
             onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}">
      <button class="todo-del" onclick="removeTodo('${i.id}')" aria-label="Löschen">✕</button>
    </div>`).join('');
  const newRow = `
    <div class="todo-row">
      <span class="todo-check ghost"></span>
      <input class="todo-text" id="todo-new" placeholder="Neue Aufgabe …"
             onkeydown="if(event.key==='Enter'){event.preventDefault();addTodoInline();}"
             onblur="addTodoInline(true)">
    </div>`;
  const count = list.length ? ` <span class="sl-count">${done.length}/${list.length}</span>` : '';
  return `<div class="sub-header"><div class="sub-header-text"><h1>Checkliste${count}</h1><p>Vor der Abreise erledigen</p></div></div><div class="todo-list">${rows}${newRow}</div>`;
}
function toggleTodo(id){ const i=todos.find(x=>x.id===id); if(!i) return; i.checked=!i.checked; persist('todo'); renderTabContent(); }
function renameTodo(id, val){
  const i=todos.find(x=>x.id===id); if(!i) return;
  const name=val.trim();
  if (!name) { setArr('todo', todos.filter(x=>x.id!==id)); persist('todo'); renderTabContent(); return; }
  i.name=name; persist('todo');
}
function removeTodo(id){ setArr('todo', todos.filter(x=>x.id!==id)); persist('todo'); renderTabContent(); }
function addTodoInline(silent){
  const inp=$('todo-new'); if(!inp) return;
  const name=inp.value.trim();
  if (!name) return;
  todos.push({ id:neueId(), tripId:currentTripId, name, checked:false });
  persist('todo');
  renderTabContent();
  // Nach dem Anlegen direkt weitertippen können
  if (!silent) { const next=$('todo-new'); if(next) next.focus(); }
}

/* ===== EINTRAG-ANSICHT (nur lesen) =====
   Antippen einer Zeile im Zeitstrahl oeffnet diese Ansicht. Bearbeiten und Loeschen
   laufen unveraendert ueber das Wischen - deshalb steht hier bewusst kein Formular. */
/* Ansicht eines Eintrags.
   Grundsatz: Innerhalb einer Kategorie sieht JEDER Eintrag gleich aus. Fehlende Werte
   werden nicht ausgeblendet, sondern als "—" gezeigt - sonst haette ein Hotel ohne GPS
   eine Zeile weniger als eines mit, und die Karten waeren nie vergleichbar. */
const DV_LEER = '<span class="dv-leer">—</span>';
function dvWert(label, wert){
  const v = (wert === undefined || wert === null) ? '' : String(wert).trim();
  if (!v) return DV_LEER;
  if (label === 'Telefon' || label === 'Notruf')
    return `<a class="rt-tel" href="tel:${esc(v.replace(/[^+0-9]/g,''))}">${esc(v)}</a>`;
  if (label === 'E-Mail') return `<a class="rt-tel" href="mailto:${esc(v)}">${esc(v)}</a>`;
  return esc(v);
}
function dvKV(titel, paare){
  const zeilen = paare
    .map(([k,v]) => `<div class="dv-row"><span class="dv-k">${esc(k)}</span><span class="dv-v">${dvWert(k, v)}</span></div>`)
    .join('');
  return (titel ? `<div class="section-label">${esc(titel)}</div>` : '') + `<div class="dv-card karte">${zeilen}</div>`;
}
/* Freitext mit echten Absaetzen: Leerzeile trennt Absaetze, einzelner Umbruch bleibt Umbruch. */
function dvProse(titel, txt){
  const t = String(txt||'').trim();
  const inhalt = t
    ? t.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('')
    : `<p>${DV_LEER}</p>`;
  return `<div class="section-label">${esc(titel)}</div><div class="dv-card karte dv-prose">${inhalt}</div>`;
}
/* Eine Zeile pro Punkt -> Aufzaehlung */
function dvListe(titel, txt){
  const zeilen = String(txt||'').split('\n').map(s=>s.trim()).filter(Boolean);
  const inhalt = zeilen.length
    ? `<ul class="dv-bullets">${zeilen.map(z=>`<li>${esc(z)}</li>`).join('')}</ul>`
    : `<div class="dv-prose"><p>${DV_LEER}</p></div>`;
  return `<div class="section-label">${esc(titel)}</div><div class="dv-card karte">${inhalt}</div>`;
}
function dvZeitraum(a, b){
  if (!a && !b) return '';
  return `${displayDate(a)||'?'} – ${displayDate(b)||'?'}`;
}
function dvNaechte(a, b){
  const n = nightsBetween(a, b);
  return n ? `${n} ${n===1?'Nacht':'Nächte'}` : '';
}
function dvUhr(v){ const t = String(v||'').trim(); return t ? t+' Uhr' : ''; }
function dvBody(type, o){
  if (type==='hotel'){
    return dvKV('Aufenthalt', [
        ['Zeitraum', dvZeitraum(o.checkin, o.checkout)],
        ['Nächte', dvNaechte(o.checkin, o.checkout)],
        ['Zimmer', o.room], ['Verpflegung', o.board],
        ['Check-in ab', dvUhr(o.checkinTime)],
        ['Check-out bis', dvUhr(o.checkoutTime)]
      ])
      + dvListe('Inklusive', dvOhneVerpflegung(o.included, o.board))
      + dvKV('Ort & Kontakt', [['Ort', o.city], ['GPS', o.gps], ['Telefon', o.phone], ['Ansprechpartner', o.contact]])
      + dvProse('Notizen', o.notes);
  }
  if (type==='transfer'){
    return dvKV('Fahrt', [
        ['Von', o.from], ['Nach', o.to],
        ['Datum', displayDate(o.date)], ['Abfahrt', dvUhr(o.time)],
        ['Entfernung', o.distance], ['Fahrzeit', o.duration]
      ])
      + dvProse('Wegbeschreibung', o.notes);
  }
  if (type==='flight'){
    const plus = arrivalDayOffset(o);
    return dvKV('Flug', [
        ['Von', o.from], ['Nach', o.to],
        ['Abflug', [displayDate(o.date), dvUhr(o.time)].filter(Boolean).join(' · ')],
        ['Ankunft', [displayDate(o.arrivalDate), dvUhr(o.arrivalTime), plus>0?`(+${plus} Tag${plus===1?'':'e'})`:''].filter(Boolean).join(' · ')],
        ['Flugdauer', o.duration], ['Airline', o.airline], ['Flugnummer', o.flightNo],
        ['Klasse', o.cabin], ['Sitzplatz', o.seat], ['Buchungsnummer', o.bookingRef]
      ])
      + dvProse('Notizen', o.notes);
  }
  if (type==='car'){
    return dvKV('Mietwagen', [
        ['Anbieter', o.company], ['Fahrzeug', o.vehicle],
        ['Abholung', [o.pickupPlace, displayDate(o.pickupDate), dvUhr(o.pickupTime)].filter(Boolean).join(' · ')],
        ['Rückgabe', [o.dropoffPlace, displayDate(o.dropoffDate), dvUhr(o.dropoffTime)].filter(Boolean).join(' · ')],
        ['Buchungsnummer', o.bookingRef], ['Telefon', o.phone]
      ])
      + dvProse('Notizen', o.notes);
  }
  if (type==='activity'){
    return dvKV('Aktivität', [['Datum', displayDate(o.date)], ['Uhrzeit', dvUhr(o.time)], ['Telefon', o.phone]])
      + dvProse('Notizen', o.notes);
  }
  // stop
  return dvKV('Stopp', [['Zeitraum', dvZeitraum(o.arrival, o.departure)], ['Nächte', dvNaechte(o.arrival, o.departure)]])
    + dvProse('Beschreibung', o.notes);
}
/* Steht die Verpflegung bereits oben als eigene Zeile, taucht sie oft zusaetzlich als
   erste Inklusive-Zeile auf ("Übernachtung und Frühstück" doppelt). Entfernt genau die
   Zeile, die dem Verpflegungstext entspricht - alle anderen Zeilen bleiben unberuehrt. */
function dvOhneVerpflegung(included, board){
  const b = String(board||'').trim().toLowerCase();
  if (!b || !included) return included;
  return String(included).split('\n').filter(z => z.trim().toLowerCase() !== b).join('\n');
}
function dvKopf(type, o){
  if (type==='flight' || type==='transfer') return [o.from, o.to].filter(Boolean).join(' → ') || TITLES[type];
  if (type==='car') return [o.company, o.vehicle].filter(Boolean).join(' · ') || TITLES[type];
  return o.name || TITLES[type];
}
function rpOpenDetail(type, id){
  const o = arr(type).find(x=>x.id===id); if(!o) return;
  $('dv-title').textContent = dvKopf(type, o);
  $('dv-sub').textContent = TITLES[type] || '\u00A0';
  $('dv-body').innerHTML = rpAktionenHTML(type, o) + dvBody(type, o);
  screenOeffnen('detail-screen');
}
/* Was sich mit einem Eintrag ausserhalb der App anfangen laesst: in Apple Karten
   zeigen, die Route dorthin, als Termin in den Kalender. */
function rpAktionenHTML(type, o){
  const z = [];
  if (type === 'hotel' || type === 'stop' || type === 'activity'){
    z.push(['In Karten öffnen', `rpKarte('${type}','${o.id}')`], ['Route hierhin', `rpKarte('${type}','${o.id}',true)`]);
  }
  if (type === 'transfer' && o.from && o.to) z.push(['Route in Karten', `rpKarte('transfer','${o.id}',true)`]);
  if (type === 'car' && o.pickupPlace) z.push(['Abholung in Karten', `rpKarte('car','${o.id}')`]);
  if (rpEintragTermin(type, o)) z.push(['Zum Kalender hinzufügen', `rpEintragKalender('${type}','${o.id}')`]);
  return z.length ? `<div class="liste dv-aktionen">${z.map(([t, f]) => `<button class="zeile aktion" type="button" onclick="${f}">${t}</button>`).join('')}</div>` : '';
}
function rpKarte(type, id, route){
  const o = arr(type).find(x => x.id === id); if (!o) return;
  const r = trips.find(t => t.id === o.tripId);
  const land = (r && r.country) || '';
  if (type === 'transfer') return kartenOeffnen({ route: true, von: [o.from, land].filter(Boolean).join(', '), name: o.to, land });
  if (type === 'car') return kartenOeffnen({ name: o.pickupPlace, land });
  kartenOeffnen({ name: o.name, ort: o.city, land, gps: o.gps, route });
}
function rpFotoKarte(id){
  const p = activities.find(x => x.id === id); if (!p) return;
  if (!(p.name || '').trim()){ notify('Bitte zuerst den Ort eintragen.'); return; }
  const r = trips.find(t => t.id === p.tripId);
  kartenOeffnen({ name: p.name, land: (r && r.country) || '' });
}

/* ===== Kalender ===== */
function rpDauerMin(txt){ const m = String(txt || '').match(/(\d+)\s*(?:h|std|:)\s*(\d+)?/i); return m ? (+m[1]) * 60 + (+(m[2] || 0)) : 0; }
const rpZeitOk = z => /^\d{1,2}:\d{2}$/.test(String(z || '').trim());
function rpFlugTermin(f){
  const zeit = rpZeitOk(f.time) ? f.time.trim() : '';
  return { id: 'flug-' + f.id, titel: 'Flug ' + [f.from, f.to].filter(Boolean).join(' → ') + (f.flightNo ? ' (' + f.flightNo + ')' : ''),
    datum: f.date, zeit, dauerMin: rpDauerMin(f.duration) || 60, ort: f.from || '',
    notiz: [f.airline, f.flightNo && 'Flug ' + f.flightNo, f.seat && 'Sitz ' + f.seat, f.bookingRef && 'Buchung ' + f.bookingRef].filter(Boolean).join('\n'),
    erinnerungMin: zeit ? 180 : undefined, erinnerungTage: zeit ? undefined : 1 };
}
function rpReiseTermin(r){
  return { id: 'reise-' + r.id, titel: r.name, datum: r.start, bis: r.end || r.start, ort: r.country || '', erinnerungTage: 1 };
}
/* Termin zu einem einzelnen Eintrag - null, wenn ihm das Datum fehlt. */
function rpEintragTermin(type, o){
  const zeitVon = z => rpZeitOk(z) ? String(z).trim() : '';
  if (type === 'flight') return o.date ? rpFlugTermin(o) : null;
  if (type === 'hotel') return o.checkin ? { id: 'hotel-' + o.id, titel: o.name, datum: o.checkin, bis: o.checkout || o.checkin, ort: [o.city].filter(Boolean).join(', '), notiz: [o.room, o.board].filter(Boolean).join(' · ') } : null;
  if (type === 'activity') return o.date ? { id: 'akt-' + o.id, titel: o.name, datum: o.date, zeit: zeitVon(o.time), notiz: o.notes || '' } : null;
  if (type === 'transfer') return o.date ? { id: 'trf-' + o.id, titel: 'Transfer ' + [o.from, o.to].filter(Boolean).join(' → '), datum: o.date, zeit: zeitVon(o.time), dauerMin: rpDauerMin(o.duration) || 60, notiz: o.notes || '' } : null;
  if (type === 'car') return o.pickupDate ? { id: 'car-' + o.id, titel: 'Mietwagen ' + [o.company, o.vehicle].filter(Boolean).join(' · '), datum: o.pickupDate, zeit: zeitVon(o.pickupTime), ort: o.pickupPlace || '' } : null;
  return null;
}
function rpEintragKalender(type, id){
  const o = arr(type).find(x => x.id === id); const t = o && rpEintragTermin(type, o);
  if (t) kalenderExport([t], t.titel);
}
/* Fuer "Alle Termine": kommende Reisen und ihre Fluege. */
function rpKalenderTermine(){
  const heute = todayISO(), out = [];
  trips.filter(r => r.start && (r.end || r.start) >= heute).forEach(r => {
    out.push(rpReiseTermin(r));
    flights.filter(f => f.tripId === r.id && f.date && f.date >= heute).forEach(f => out.push(rpFlugTermin(f)));
  });
  return out;
}

/* ===== Teilen ===== */
function rpZeileText(n){
  const o = n.o, ein = n.child ? '    ' : '', d = v => (v ? displayDate(v) : '');
  const uhr = z => rpZeitOk(z) ? ' ' + String(z).trim() : '';
  switch (n.art){
    case 'stop':     return '\n' + [d(o.arrival), o.departure && o.departure !== o.arrival ? d(o.departure) : ''].filter(Boolean).join(' – ') + '  ' + (o.name || 'Stopp');
    case 'flight':   return ein + d(o.date) + uhr(o.time) + '  Flug ' + [o.from, o.to].filter(Boolean).join(' → ') + (o.flightNo ? ' (' + o.flightNo + ')' : '');
    case 'hotel':    return ein + [d(o.checkin), d(o.checkout)].filter(Boolean).join(' – ') + '  ' + (o.name || 'Hotel') + (o.city ? ', ' + o.city : '');
    case 'car':      return ein + d(o.pickupDate) + uhr(o.pickupTime) + '  Mietwagen ' + [o.company, o.vehicle].filter(Boolean).join(' · ') + (o.pickupPlace ? ', ' + o.pickupPlace : '');
    case 'transfer': return ein + d(o.date) + uhr(o.time) + '  Transfer ' + [o.from, o.to].filter(Boolean).join(' → ');
    case 'activity': return ein + d(o.date) + uhr(o.time) + '  ' + (o.name || 'Aktivität');
  }
  return '';
}
function rpReiseplanText(t){
  const z = [t.name + (t.country && t.country !== t.name ? ' – ' + t.country : '')];
  const zr = [t.start || t.end ? dvZeitraum(t.start, t.end) : '', tripDuration(t)].filter(Boolean).join(' · ');
  if (zr) z.push(zr);
  routeSequenz(t).forEach(n => z.push(rpZeileText(n)));
  if (t.operator) z.push('\nVeranstalter: ' + t.operator + (t.opPhone ? ' · ' + t.opPhone : '') + (t.opEmergency ? ' · Notruf ' + t.opEmergency : ''));
  return z.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
function rpListeText(typ, t){
  const titel = typ === 'pack' ? 'Packliste' : 'Checkliste';
  const liste = arr(typ).filter(x => x.tripId === t.id);
  const zeilen = [...liste.filter(i => !i.checked), ...liste.filter(i => i.checked)].map(i => (i.checked ? '☑ ' : '☐ ') + i.name);
  return titel + ' – ' + t.name + '\n\n' + (zeilen.join('\n') || '(leer)');
}
function rpTeilenMenu(anker){
  const t = currentTrip(); if (!t) return;
  menuOeffnen(anker, [
    { text: 'Reiseplan teilen',  symbol: 'teilen', tun: () => teilen({ titel: t.name, text: rpReiseplanText(t) }) },
    { text: 'Packliste teilen',  symbol: 'liste',  tun: () => teilen({ titel: 'Packliste ' + t.name, text: rpListeText('pack', t) }) },
    { text: 'Checkliste teilen', symbol: 'liste',  tun: () => teilen({ titel: 'Checkliste ' + t.name, text: rpListeText('todo', t) }) },
    '-',
    { text: 'Zum Kalender hinzufügen', symbol: 'kalender', tun: () => {
        if (!t.start){ notify('Die Reise hat noch kein Datum.'); return; }
        kalenderExport([rpReiseTermin(t), ...flights.filter(f => f.tripId === t.id && f.date).map(rpFlugTermin)], t.name);
      } }
  ]);
}

/* ===== Heute (Startseite) ===== */
function rpHeute(){
  const heute = todayISO();
  const r = trips.filter(t => t.start && (t.end || t.start) >= heute).sort((a, b) => a.start.localeCompare(b.start))[0];
  if (!r) return [];
  const du = daysUntil(r.start);
  const laeuft = du !== null && du < 0;
  return [{ tage: laeuft ? 0 : du, titel: r.name, wann: laeuft ? 'läuft' : undefined,
    unter: [r.country && r.country !== r.name ? r.country : '', dvZeitraum(r.start, r.end)].filter(Boolean).join(' · '),
    symbol: 'koffer', aktion: () => zuBereich('reisen', () => openTripScreen(r.id)) }];
}
function rpCloseDetail(){ screenSchliessen('detail-screen'); }

/* ===== FORMULAR-MODAL ===== */
const TITLES = { trip:'Reise', stop:'Stopp', hotel:'Hotel', flight:'Flug', car:'Mietwagen', transfer:'Transfer', activity:'Aktivität', photo:'Fotografie', pack:'Gegenstand', todo:'Aufgabe' };
/* Überschriften der Formulare – „Neuer Stopp" / „Stopp bearbeiten" statt „Neu – Stopp" */
const TITLE_NEW = { trip:'Neue Reise', stop:'Neuer Stopp', hotel:'Neues Hotel', flight:'Neuer Flug', car:'Neuer Mietwagen', transfer:'Neuer Transfer',
  activity:'Neue Aktivität', photo:'Neue Foto-Session', pack:'Neuer Gegenstand', todo:'Neue Aufgabe' };
function modalTitle(type, id){ return id ? `${TITLES[type]} bearbeiten` : (TITLE_NEW[type] || 'Neuer Eintrag'); }
/* Felder je Typ. gruppe: beginnt eine neue Gruppe (Text = Ueberschrift darueber).
   Mehrzeiliger Text steht immer in einer eigenen Gruppe mit seiner Bezeichnung als
   Ueberschrift. Die Platzhalter sind kurz gehalten - sie stehen rechtsbuendig
   neben der Bezeichnung. */
const SCHEMAS = {
  trip: [
    { key:'name', label:'Name', type:'text', required:true, placeholder:'z.B. Namibia' },
    { key:'country', label:'Land', type:'text', placeholder:'z.B. Namibia' },
    { key:'start', label:'Start', type:'text', date:true, gruppe:true },
    { key:'end', label:'Ende', type:'text', date:true },
    { key:'operator', label:'Veranstalter', type:'text', placeholder:'Optional', gruppe:'Veranstalter' },
    { key:'opContact', label:'Ansprechpartner', type:'text', placeholder:'Optional' },
    { key:'opPhone', label:'Telefon', type:'text', placeholder:'+264 …' },
    { key:'opEmergency', label:'Notruf', type:'text', placeholder:'+264 …' },
    { key:'opOffice', label:'Weiteres Büro', type:'text', placeholder:'Telefon' },
    { key:'opEmail', label:'E-Mail', type:'text', placeholder:'name@anbieter.com' },
    { key:'opNotes', label:'Hinweise zum Veranstalter', type:'textarea' }
  ],
  stop: [
    { key:'name', label:'Ort', type:'text', required:true, placeholder:'z.B. NamibRand' },
    { key:'arrival', label:'Ankunft', type:'text', date:true, gruppe:true },
    { key:'departure', label:'Abfahrt', type:'text', date:true },
    { key:'notes', label:'Notizen', type:'textarea' }
  ],
  hotel: [
    { key:'name', label:'Hotel', type:'text', required:true, placeholder:'z.B. Kulala Lodge' },
    { key:'city', label:'Ort', type:'text', placeholder:'z.B. Windhoek' },
    { key:'checkin', label:'Check-in', type:'text', date:true, gruppe:'Aufenthalt' },
    { key:'checkout', label:'Check-out', type:'text', date:true },
    { key:'checkinTime', label:'Check-in ab', type:'time' },
    { key:'checkoutTime', label:'Check-out bis', type:'time' },
    { key:'room', label:'Zimmer', type:'text', placeholder:'z.B. Zelt', gruppe:true },
    { key:'board', label:'Verpflegung', type:'text', placeholder:'z.B. Frühstück' },
    { key:'included', label:'Inklusive', type:'textarea', placeholder:'Eine Zeile pro Leistung' },
    { key:'phone', label:'Telefon', type:'text', placeholder:'+264 …', gruppe:'Kontakt' },
    { key:'contact', label:'Ansprechpartner', type:'text', placeholder:'Optional' },
    { key:'gps', label:'GPS', type:'text', placeholder:'S 22° 33′, E 17° 05′' },
    { key:'notes', label:'Notizen', type:'textarea' }
  ],
  transfer: [
    { key:'from', label:'Von', type:'text', required:true, placeholder:'z.B. Windhoek' },
    { key:'to', label:'Nach', type:'text', required:true, placeholder:'z.B. Wolwedans' },
    { key:'date', label:'Datum', type:'text', date:true, gruppe:true },
    { key:'time', label:'Abfahrt', type:'time' },
    { key:'distance', label:'Entfernung', type:'text', placeholder:'ca. 422 km', gruppe:true },
    { key:'duration', label:'Fahrzeit', type:'text', placeholder:'ca. 6 Std.' },
    { key:'notes', label:'Wegbeschreibung', type:'textarea', placeholder:'Leerzeile trennt die Absätze' }
  ],
  flight: [
    { key:'from', label:'Von', type:'text', required:true, placeholder:'Frankfurt (FRA)' },
    { key:'to', label:'Nach', type:'text', required:true, placeholder:'Windhoek (WDH)' },
    { key:'date', label:'Datum', type:'text', date:true, gruppe:'Abflug' },
    { key:'time', label:'Uhrzeit', type:'time' },
    { key:'arrivalDate', label:'Datum', type:'text', date:true, gruppe:'Ankunft' },
    { key:'arrivalTime', label:'Uhrzeit', type:'time' },
    { key:'duration', label:'Flugdauer', type:'text', placeholder:'10h 15min', gruppe:true },
    { key:'airline', label:'Airline', type:'text', placeholder:'z.B. Condor' },
    { key:'flightNo', label:'Flugnummer', type:'text', placeholder:'4Y 132' },
    { key:'cabin', label:'Klasse', type:'text', placeholder:'Economy' },
    { key:'seat', label:'Sitzplatz', type:'text', placeholder:'32A' },
    { key:'bookingRef', label:'Buchungsnummer', type:'text', placeholder:'9DXP4O' },
    { key:'notes', label:'Notizen', type:'textarea' }
  ],
  car: [
    { key:'company', label:'Anbieter', type:'text', required:true, placeholder:'z.B. Europcar' },
    { key:'vehicle', label:'Fahrzeug', type:'text', placeholder:'z.B. Hilux' },
    { key:'pickupPlace', label:'Ort', type:'text', placeholder:'z.B. Flughafen', gruppe:'Abholung' },
    { key:'pickupDate', label:'Datum', type:'text', date:true },
    { key:'pickupTime', label:'Uhrzeit', type:'time' },
    { key:'dropoffPlace', label:'Ort', type:'text', placeholder:'z.B. Flughafen', gruppe:'Rückgabe' },
    { key:'dropoffDate', label:'Datum', type:'text', date:true },
    { key:'dropoffTime', label:'Uhrzeit', type:'time' },
    { key:'bookingRef', label:'Buchungsnummer', type:'text', placeholder:'9DXP4O', gruppe:true },
    { key:'phone', label:'Telefon', type:'text', placeholder:'+264 …' },
    { key:'notes', label:'Notizen', type:'textarea' }
  ],
  activity: [
    { key:'name', label:'Aktivität', type:'text', required:true, placeholder:'z.B. Sundowner' },
    { key:'date', label:'Datum', type:'text', date:true, gruppe:true },
    { key:'time', label:'Uhrzeit', type:'time' },
    { key:'phone', label:'Telefon', type:'text', placeholder:'+264 …', gruppe:true },
    { key:'notes', label:'Notizen', type:'textarea' }
  ],
  photo: [
    { key:'name', label:'Session', type:'text', required:true, placeholder:'z.B. Milchstraße' },
    { key:'date', label:'Datum', type:'text', date:true, gruppe:true },
    { key:'time', label:'Uhrzeit', type:'time' },
    { key:'notes', label:'Notizen', type:'textarea' },
    { key:'equipment', label:'Equipment', type:'text', placeholder:'Komma-getrennt', gruppe:true },
    { key:'motives', label:'Motive', type:'textarea', placeholder:'Eine Zeile pro Motiv' }
  ],
  pack: [ { key:'name', label:'Gegenstand', type:'text', required:true }, { key:'category', label:'Kategorie', type:'text', placeholder:'z.B. Technik' } ],
  todo: [ { key:'name', label:'Aufgabe', type:'text', required:true, placeholder:'z.B. Visum beantragen' } ]
};

let modalType=null, modalId=null;
/* Eine Formularzeile: Bezeichnung links, Eingabe rechts. Datum und Uhrzeit sind
   Textfelder mit Eingabehilfe - tippen ist schneller als das iOS-Rad. */
function fieldHTML(f, value){
  const v = value ?? '';
  const id = `f_${f.key}`;
  const lab = `<label for="${id}">${esc(f.label)}</label>`;
  if (f.date) return `<div class="feld">${lab}<input type="text" id="${id}" value="${esc(isoToDE(v))}" placeholder="TT.MM.JJJJ" inputmode="decimal" autocomplete="off" oninput="autoDate(this)" onblur="fixDate(this)"></div>`;
  if (f.type==='time') return `<div class="feld">${lab}<input type="text" id="${id}" value="${esc(v)}" placeholder="HH:MM" inputmode="decimal" autocomplete="off" oninput="autoTime(this)" onblur="fixTime(this)"></div>`;
  if (f.type==='textarea') return `<div class="feld lang"><textarea id="${id}" placeholder="${esc(f.placeholder||'')}" aria-label="${esc(f.label)}">${esc(v)}</textarea></div>`;
  return `<div class="feld">${lab}<input type="${f.type}" id="${id}" value="${esc(v)}" placeholder="${esc(f.placeholder||'')}" autocomplete="off"></div>`;
}
/* Baut die Gruppen: Felder sammeln sich, bis eines mit gruppe eine neue beginnt;
   mehrzeiliger Text steht immer fuer sich, mit Ueberschrift. */
function buildFields(list, entry){
  const gruppen = [];
  let akt = null;
  const neu = (titel) => { akt = { titel: titel || '', zeilen: [] }; gruppen.push(akt); };
  for (const f of list){
    const v = entry ? entry[f.key] : '';
    if (f.type === 'textarea'){ neu(f.label); akt.zeilen.push(fieldHTML(f, v)); akt = null; continue; }
    if (!akt || f.gruppe) neu(typeof f.gruppe === 'string' ? f.gruppe : '');
    akt.zeilen.push(fieldHTML(f, v));
  }
  return gruppen.map(g => (g.titel ? `<div class="gruppe-titel">${esc(g.titel)}</div>` : '') + `<div class="gruppe">${g.zeilen.join('')}</div>`).join('');
}
function resizeImage(file, maxW=900, q=0.72){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>{ const img=new Image(); img.onload=()=>{ let w=img.width,h=img.height; if(w>maxW){h=Math.round(h*maxW/w);w=maxW;} const cv=document.createElement('canvas'); cv.width=w;cv.height=h; cv.getContext('2d').drawImage(img,0,0,w,h); res(cv.toDataURL('image/jpeg',q)); }; img.onerror=rej; img.src=e.target.result; }; r.onerror=rej; r.readAsDataURL(file); }); }


function rpOpenModal(type, id){
  modalType=type; modalId=id||null;
  const schema=SCHEMAS[type];
  const entry = id ? arr(type).find(x=>x.id===id) : null;
  $('form-title').textContent = modalTitle(type, id);
  $('form-fields').innerHTML = buildFields(schema, entry);
  oeffneOverlay('form-overlay', rpCloseModal);
}
function rpCloseModal(){ schliesseOverlay('form-overlay'); modalType=null; modalId=null; }
async function saveModal(){
  if(!modalType || !SCHEMAS[modalType]) return;   // kein Formular offen
  const type=modalType, schema=SCHEMAS[type], obj={};
  for (const f of schema){
    const el=$('f_'+f.key); let val=el?el.value.trim():'';
    if (f.date){
      const iso=deToISO(val);
      // Etwas eingegeben, aber kein gültiges Datum -> nachfragen statt still verwerfen
      if (val && !iso){ await notify(`„${val}" ist kein gültiges Datum. Bitte im Format TT.MM.JJJJ eingeben.`,'Datum prüfen'); return; }
      obj[f.key]=iso; continue;
    }
    if (f.required && !val){ await notify(`Bitte "${f.label}" ausfüllen.`,'Angabe fehlt'); return; }
    obj[f.key]=val;
  }
  if (type!=='trip') obj.tripId=currentTripId;
  // Typ wird nicht mehr im Formular gewählt, sondern ergibt sich aus dem Bereich
  if (type==='activity') obj.type='normal';
  if (modalId){
    const alt = arr(type).find(x=>x.id===modalId);
    // Waehrend das Formular offen war, verschwunden (z.B. Wiederherstellen einer Sicherung)
    if (!alt){ rpCloseModal(); await notify('Der Eintrag existiert nicht mehr.'); return; }
    Object.assign(alt, obj);
  }
  else { obj.id=neueId(); if(type==='pack'||type==='todo') obj.checked=false; arr(type).push(obj); }
  persist(type);
  // Wurde diese Reise aus Finanzen heraus angelegt, ziehen Name/Zeitraum/Land dort nach.
  // Ruft finSyncFromReisen() direkt auf statt saveUrlaub(), damit kein Ruecksync nach
  // Reisen entsteht - jede Seite schreibt nur einmal, nicht wechselseitig endlos.
  if (type==='trip' && modalId){
    const t = trips.find(x=>x.id===modalId);
    if (t && t.finId && typeof finSyncFromReisen === 'function'){
      finSyncFromReisen(t.finId, { name:t.name, start:t.start, end:t.end, country:t.country||'' });
    }
  }
  rpCloseModal();
  if (type==='trip'){ renderHome(); if(currentTripId) renderTripScreen(); }
  else renderTabContent();
  showToast('Gespeichert');
}

/* ===== BACKUP (Payload) – von Cloud-Backup genutzt ===== */
function rpBuildBackupPayload(){ return { app:'reiseplaner', version:1, exportedAt:new Date().toISOString(), trips, stops, hotels, flights, cars, transfers, activities, packing, todos, visited, autoTrips, gear }; }
async function rpBuildBackupPayloadFull(){ const base=rpBuildBackupPayload(); if(idbReady) base.imageStore = await idbAll(); return base; }
/* Uebernimmt nur noch Daten. Rueckfrage, Erfolgsmeldung und das Neuzeichnen macht der
   Kern in applyCombined – vorher fragte dieser Bereich zusaetzlich selbst nach, sodass
   beim Laden aus der Cloud mehrere Rueckfragen hintereinander kamen. */
async function rpApplyBackup(rawText){
  let p; try { p=JSON.parse(rawText); } catch(e){ return false; }
  if (!p || !Array.isArray(p.trips)) return false;
  trips=p.trips||[]; stops=p.stops||[]; hotels=p.hotels||[]; flights=p.flights||[]; cars=p.cars||[]; transfers=p.transfers||[]; activities=p.activities||[]; packing=p.packing||[]; todos=p.todos||[];
  visited=Array.isArray(p.visited)?p.visited:[]; store.set(KEYS.visited, JSON.stringify(visited));
  autoTrips=Array.isArray(p.autoTrips)?p.autoTrips:[]; store.set(KEYS.autoTrips, JSON.stringify(autoTrips));
  if (p.gear){ if (Array.isArray(p.gear)){ const flat=p.gear; gear=emptyGear(); flat.forEach(n=>{ if(n) gear[gearClassify(n)].push(n); }); } else { gear=normalizeGear(p.gear); } store.set(KEYS.gear, JSON.stringify(gear)); }
  ['trip','stop','hotel','flight','car','transfer','activity','pack','todo'].forEach(persist);
  if (idbReady) { await idbClear(); if (Array.isArray(p.imageStore)) { for (const rec of p.imageStore) { if (rec && rec.id) await idbPut(rec.id, rec.data); } } }
  await migrateInlineImages();
  return true;
}

/* ===== INIT ===== */
async function rpInit(){
  await idbInit();
  await migrateInlineImages();
  renderHome();
  // Fotografie-Karten sind dauerhaft im Bearbeiten-Modus. Ist ein Feld fokussiert,
  // verbraucht iOS den ersten Tab-Tap nur zum Schließen der Tastatur. Deshalb ein evtl.
  // fokussiertes Feld schon beim pointerdown auf die Tab-Leiste defokussieren -> ein Tap reicht.
  const tb = $('tab-bar');
  if (tb) {
    const blurActive = () => {
      const ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) ae.blur();
    };
    tb.addEventListener('pointerdown', blurActive, { passive: true });
    tb.addEventListener('touchstart', blurActive, { passive: true });
  }
}


registerModule({
  id: 'reisen', name: 'Reisen', tagline: 'Planung & Fotografie', order: 2,
  heute: () => rpHeute(),
  kalender: () => rpKalenderTermine(),
  keys: KEYS,
  buildPayload: () => rpBuildBackupPayloadFull(),
  applyBackup: (t) => rpApplyBackup(t),
  restoreInfo: p => ((p && p.trips || []).length) + ' Reise(n)',
  migrate: () => rpMigrate(),
  detect: p => !!(p && Array.isArray(p.trips)),
  init: () => rpInit(),
  onOpen: () => { try { renderHome(); } catch(e){} },
  einstellungen: () => gearZeilenWert(),
  summary: () => {
    try {
      const heute = heuteBerlin();
      const kommend = trips.filter(t => t.start).map(t => ({ t, d: new Date(t.start + 'T00:00:00') }))
        .filter(x => !isNaN(x.d) && x.d >= heute).sort((a,b) => a.d - b.d)[0];
      if (kommend) {
        const tage = Math.round((kommend.d - heute) / 86400000);
        const ziel = kommend.t.name || '';
        if (tage === 0) return { sub: ziel, value: 'Heute', unit: '', note: 'Abreise',
                 art: (kommend.t.country ? tripMapSVG(kommend.t.country) : '') };
        return { sub: ziel, value: tage, unit: tage === 1 ? 'Tag' : 'Tage', note: 'bis zur Abreise',
                 art: (kommend.t.country ? tripMapSVG(kommend.t.country) : '') };
      }
      return { sub: trips.length ? 'Keine kommende Reise' : 'Noch keine Reise',
               value: trips.length, unit: trips.length === 1 ? 'Reise' : 'Reisen', note: 'gespeichert' };
    } catch(e) { return { sub: 'Planung & Fotografie' }; }
  }
});
