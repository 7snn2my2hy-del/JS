/* ================= BEREICH: FOTOGRAFIE =================
   Eigenständiges Modul. Optik und Bausteine kommen aus dem gemeinsamen Kern in
   index.html (.bento/.bento-tile, .screen, .glass, .rt-row-Zeitleiste …) – dieses
   Modul bringt keine eigene Gestaltung mit, nur eine Handvoll Farbwerte und kleine
   selbst gebaute Icons, die es aus den vorhandenen CSS-Variablen des Kerns schöpft.

   Zwei Teile:
   1) Guides – kuratierte Aufnahme-Rezepte. Anlegen, Ändern und Löschen passiert
      bewusst NICHT in der App, sondern hier im Gespräch direkt im Code
      (fgStartbestand) – die App zeigt sie nur an. Einzige Ausnahme: ein freies
      Notizen-Feld pro Guide, das in der App selbst editiert und gespeichert wird.
      Liste als Bento-Grid (2 pro Zeile); jede Kachel zeigt Titel, ISO/Blende/Zeit auf
      einen Blick und ein kleines Icon-Badge oben rechts. Antippen öffnet eine reine
      Leseansicht: Ausrüstung, Komposition und Bearbeitung als Listen, die
      Kamera-Einstellungen als Zeilenliste in vier Gruppen (Aufnahme, Farbe & Format,
      Einmalig im Menü, Workflow) mit optischer Trennung dazwischen.
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

  <div style="height:1px;background:var(--stroke);margin:28px 0"></div>
  <div class="section-label">Astro-Kalender</div>
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
   Kleines, festes Icon-Badge oben rechts in der Kachel – eigene, selbst gebaute
   Glyphe je Guide, viewBox 0 0 24 24, einfarbig Violett, feste Größe/Position
   unabhängig von Titel- oder Wertlänge. */
const FG_GUIDE_ICON = {
  'ms-shot': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 16 Q12 4 22 16"/></svg>',
  'ms-timelapse': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 13 Q12 3 22 13"/><path d="M4 18 Q12 10 20 18" stroke-dasharray="1 4" opacity="0.6"/></svg>',
  'ms-stacking': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 9 Q12 1 22 9"/><path d="M2 14 Q12 6 22 14" opacity="0.6"/><path d="M2 19 Q12 11 22 19" opacity="0.35"/></svg>',
  'ms-panorama': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 15 Q12 5 22 15"/><rect x="3" y="8" width="18" height="11" rx="1" opacity="0.45"/><path d="M9 8 L9 19 M15 8 L15 19" opacity="0.45"/></svg>',
  'star-trails': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
  'meteoriten': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none"/><path d="M5 5 L13 13"/><circle cx="18" cy="7" r="1.2" fill="currentColor" stroke="none"/><path d="M18 7 L22 11"/></svg>',
  'mond-detail': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.5" cy="14" r="1.8" fill="currentColor" stroke="none"/><circle cx="15" cy="8" r="0.9" fill="currentColor" stroke="none"/></svg>',
  'sonne-detail': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/><circle cx="10.5" cy="12.5" r="0.8" fill="currentColor" stroke="none"/></svg>',
  'ms-vollbogen': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 15 Q12 2 23 15"/><path d="M6 10.6 L6 8.6M12 6.3 L12 4.3M18 10.6 L18 8.6" stroke-width="1.4" opacity="0.6"/></svg>',
  'wildtiere-slowmo': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="16.5" rx="5.2" ry="4"/><circle cx="6.2" cy="8.2" r="1.6"/><circle cx="11.5" cy="5.5" r="1.6"/><circle cx="16.8" cy="6.6" r="1.6"/><circle cx="19.8" cy="10.6" r="1.4"/></svg>'
};

/* ---------------- Daten ---------------- */
const FG_KEYS = { szenarien: 'fg_szenarien_v1' };

/* Gemeinsame Basis-Ausrüstung, die bei jedem Guide zusätzlich zu Kamera/Objektiv/
   Stativ dazukommt – separat gehalten, damit sie nicht in jedem Guide neu getippt
   werden muss. */
const FG_ZUBEHOER_BASIS = [
  'Objektivheizung/Taukappe', 'Rotlicht-Stirnlampe', 'Ersatzakkus',
  'Klarsicht-/UV-Filter abnehmen (sonst Reflexionshalos um helle Sterne)',
  'SD-Karte UHS-II V60 oder schneller – 33MP-RAW beläuft sich auf gut 60–70 MB je Bild'
];

/* Die "Einmalig im Menü"-Gruppe ist bei fast allen Guides identisch – als Funktion,
   damit sie nicht sechsmal dupliziert werden muss. bildwiedergabeHinweis ist bei
   Serienaufnahmen gesetzt (Akku sparen), bei der Einzelaufnahme leer. */
function fgMenuGruppe(bildwiedergabeHinweis){
  const zeilen = [
    { label: 'AF/MF-Schalter', wert: 'Am Objektiv auf MF (nicht nur im Menü)' },
    { label: 'Blendenring', wert: 'Bewusst gesetzt bzw. auf A' },
    { label: 'Verschluss', wert: 'Elektronisch' },
    { label: 'SteadyShot', wert: 'Aus' },
    { label: 'Langzeit-Rauschunterdrückung', wert: 'Aus' },
    { label: 'Hohe-ISO-Rauschminderung', wert: 'Aus bzw. Niedrig' },
    { label: 'Helle Überwachung', wert: 'Auf Custom-Taste legen – macht das Bildfeld nachts im Live-View sichtbar' },
    { label: 'Energiesparen', wert: 'Auto-Ausschaltzeit aus' },
    { label: 'Displayhelligkeit', wert: 'Runter (Nachtsicht erhalten)' },
    { label: 'Sensorreinigung beim Ausschalten', wert: 'Aus' }
  ];
  if (bildwiedergabeHinweis) zeilen.push({ label: 'Bildwiedergabe', wert: bildwiedergabeHinweis });
  return { titel: 'Einmalig im Menü', zeilen };
}

/* Kuratierter Bestand – Anlegen/Ändern/Löschen passiert hier im Code, nicht in der
   App (siehe Kopfkommentar). "einstellungen" ist eine Liste von Gruppen
   { titel, zeilen:[{label,wert}] } für die Leseansicht, in fester Reihenfolge:
   Aufnahme (Modus/ISO/Blende/Zeit/Objektiv/Fokus zuerst), Farbe & Format,
   Einmalig im Menü, Workflow (nur wo relevant, z.B. Dark Frames). */
function fgStartbestand(){
  return [
    {
      id: neueId(), name: 'Milchstraße (Shot)', art: 'ms-shot',
      kachelIso: '3200–6400', kachelBlende: 'f/1.8', kachelZeit: '10–15s',
      equipment: ['Sony α7V', 'Sony FE 14mm F1.8 GM', 'Stativ mit Kugelkopf', 'Fernauslöser/Timer', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '3200–6400' },
          { label: 'Blende', wert: 'f/1.8 (Offenblende) – auf f/2.0 abblenden, falls Koma an den Bildrändern sichtbar wird' },
          { label: 'Verschlusszeit', wert: '10–15s (NPF-Regel bei 14mm)' },
          { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
          { label: 'Fokus', wert: 'Manuell, auf ∞ bzw. hellen Stern per Fokuslupe + Peaking – nach Temperaturwechsel erneut prüfen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: '3800–4200K (RAW), in Lightroom feinjustieren' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        fgMenuGruppe(null)
      ],
      ausrichtung: 'Süden bis Südosten, Querformat (weiter Blickwinkel für Kernregion + Horizont)',
      komposition: [
        'Festes Vordergrundmotiv mit Kern darüber positionieren',
        'Diagonale statt mittige Aufteilung der Milchstraße',
        'Spiegelung nutzen, z.B. See oder nasser Sand',
        'Person als Silhouette für Maßstab einbauen',
        'Leading Lines im Vordergrund zum Kern führen'
      ],
      bearbeitung: ['Lightroom'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Milchstraße (Timelapse)', art: 'ms-timelapse',
      kachelIso: '3200–6400', kachelBlende: 'f/1.8–2.0', kachelZeit: '10–13s',
      equipment: ['Sony α7V', 'Sony FE 14mm F1.8 GM', 'Stabiles Stativ mit Kugelkopf', 'Intervalltimer', 'Große Karte: 300 Bilder ≈ 20 GB, für eine ganze Nacht 128 GB einplanen', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '3200–6400 (über die ganze Serie konstant halten)' },
          { label: 'Blende', wert: 'f/1.8–2.0 (leicht abgeblendet für gleichmäßigere Schärfe)' },
          { label: 'Verschlusszeit', wert: '10–13s Einzelbelichtung, 1–2s Pause' },
          { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
          { label: 'Fokus', wert: 'Manuell, auf ∞, vor Start fixieren und nicht mehr verändern – per Fokuslupe + Peaking, nach Temperaturwechsel erneut prüfen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: 'Fest einstellen (nicht Auto), sonst flackert die Serie' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        (() => { const g = fgMenuGruppe('Aus (spart Akku über die lange Serie)');
                  g.zeilen[1] = { label: 'Blendenring', wert: 'Bewusst gesetzt bzw. auf A, De-Klick aktivieren' };
                  return g; })(),
        { titel: 'Workflow', zeilen: [
          { label: 'AE-Verfolgung bei Intervall', wert: 'Aus' },
          { label: 'Bildanzahl', wert: '25 Bilder ≈ 1s Video – für 12s Clip ca. 300 Bilder' }
        ]}
      ],
      ausrichtung: 'Süden, Querformat – Kern wandert im Bildverlauf von links nach rechts durchs Bild',
      komposition: [
        'Ruhiges Vordergrundmotiv am Bildrand platzieren',
        'Etwas Bewegtes einbauen, z.B. ziehende Wolken oder Wasser',
        'Weiten Horizont für den vollen Bogen wählen',
        'Festen Ankerpunkt im Bild behalten',
        'Dämmerungsübergang am Anfang/Ende mit einplanen'
      ],
      bearbeitung: ['LRTimelapse', 'Lightroom', 'Premiere'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Milchstraße (Stacking)', art: 'ms-stacking',
      kachelIso: '1600–3200', kachelBlende: 'f/1.8–2.0', kachelZeit: '10–15s',
      equipment: ['Sony α7V', 'Sony FE 14mm F1.8 GM', 'Stativ mit Kugelkopf', 'Fernauslöser/Timer', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO (Himmel-Serie)', wert: '1600–3200 (niedriger als bei der Einzelaufnahme, das Stacking reduziert Rauschen)' },
          { label: 'Blende', wert: 'f/1.8–2.0' },
          { label: 'Verschlusszeit (Himmel)', wert: '8–10 Bilder à 10–15s, identischer Ausschnitt' },
          { label: 'ISO/Zeit (Vordergrund)', wert: '2–4 Bilder à 20–30s bei ISO 400–800' },
          { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
          { label: 'Fokus', wert: 'Manuell, auf ∞ – zwischen den Serien nicht verändern, per Fokuslupe + Peaking, nach Temperaturwechsel erneut prüfen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: 'Fest einstellen (nicht Auto), für konsistentes Stacking' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        fgMenuGruppe('Aus (Akku für die mehreren Serien schonen)'),
        { titel: 'Workflow', zeilen: [
          { label: 'Dark Frames', wert: '5–10 Aufnahmen mit aufgesetztem Objektivdeckel bei identischen Werten am Session-Ende (Hot-Pixel-Entfernung)' }
        ]}
      ],
      ausrichtung: 'Süden bis Südosten, Querformat – Kamera zwischen den Serien nicht bewegen (identischer Ausschnitt nötig)',
      komposition: [
        'Gleiche Bildideen wie beim Einzelbild, Vordergrund aber ruhig halten',
        'Nebel-/Staubstrukturen im Kern gezielt einfangen',
        'Kontrastreiches Vordergrundmotiv wählen',
        'Kern im Drittel-Raster positionieren',
        'Wasserfläche für Spiegelung nutzen'
      ],
      bearbeitung: ['Sequator', 'Starry Landscape Stacker', 'Photoshop', 'Lightroom'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Milchstraße (Panorama)', art: 'ms-panorama',
      kachelIso: '1600–3200', kachelBlende: 'f/1.8–2.0', kachelZeit: '8–13s',
      equipment: ['Sony α7V', 'Sony FE 35mm F1.4 GM', 'Stativ mit Nivellierbasis und Nodalpunkt-Kopf', 'L-Bracket', 'Fernauslöser/Timer', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '1600–3200 (jedes Feld wird gestackt, daher niedriger als beim Einzelbild)' },
          { label: 'Blende', wert: 'f/1.8–2.0' },
          { label: 'Verschlusszeit', wert: '8–13s (NPF-Regel bei 35mm), 6–8 Bilder je Feld' },
          { label: 'Objektiv', wert: 'Sony FE 35mm F1.4 GM' },
          { label: 'Raster', wert: '3 Reihen × 5–6 Bilder, ca. 30% Überlappung' },
          { label: 'Drehpunkt', wert: 'Möglichst nodalpunktnah drehen, Kopf gerastet – zwischen den Feldern nichts verstellen' },
          { label: 'Fokus', wert: 'Manuell, auf ∞ – über alle Felder identisch lassen, per Fokuslupe + Peaking, nach Temperaturwechsel erneut prüfen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: 'Fest einstellen (nicht Auto) – sonst driften die Felder auseinander' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        fgMenuGruppe('Aus (Akku für die vielen Felder schonen)'),
        { titel: 'Workflow', zeilen: [
          { label: 'Dark Frames', wert: '5–10 Aufnahmen mit aufgesetztem Objektivdeckel bei identischen Werten am Session-Ende' },
          { label: 'Vordergrund', wert: 'Separate, längere Belichtungen bei ISO 400–800, ungetrackt' }
        ]}
      ],
      ausrichtung: 'Süden bis Südosten, Kamera im Hochformat schwenken (mehr Höhe je Feld) · untere Reihe auf den Vordergrund, mittlere auf die Kernregion, obere auf den Bogen',
      komposition: [
        'Untere Reihe auf den Vordergrund, mittlere auf die Kernregion, obere auf den Bogen ausrichten',
        'Horizont in der unteren Bildreihe gerade halten',
        'Vordergrundmotiv mittig unter dem Kern platzieren',
        'Genug Überlappung für sauberes Stitching einplanen',
        'Bogen möglichst symmetrisch ins Panorama einpassen'
      ],
      bearbeitung: ['Sequator', 'Starry Landscape Stacker', 'PTGui', 'Lightroom'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Star Trails', art: 'star-trails',
      kachelIso: '400–800', kachelBlende: 'f/2.8–4', kachelZeit: '30s × 1–3 Std.',
      equipment: ['Sony α7V', 'Sony FE 14mm F1.8 GM', 'Stativ mit Kugelkopf und L-Bracket (Hochformat)', 'Intervalltimer', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '400–800' },
          { label: 'Blende', wert: 'f/2.8–4 (abgeblendet für Schärfe)' },
          { label: 'Verschlusszeit', wert: '30s Belichtung, 33s Intervall (3s Speicherpuffer) – Minimum 30 Min, ideal 1–3 Std. Bei 2 Std. rund 220 Bilder' },
          { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
          { label: 'Fokus', wert: 'Manuell, auf ∞ – per Fokuslupe + Peaking, nach Temperaturwechsel erneut prüfen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: '3800–4200K, je nach Lichtverschmutzung anpassen' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        (() => { const g = fgMenuGruppe('Aus (Akku für die lange Serie schonen)');
                  g.zeilen[4] = { label: 'Langzeit-Rauschunterdrückung', wert: 'Zwingend Aus (sonst Lücken zwischen den Trails durch Verarbeitungspause)' };
                  return g; })(),
        { titel: 'Workflow', zeilen: [
          { label: 'Intervall-Hinweis', wert: 'Die Sony-Intervallfunktion misst von Start zu Start, nicht ab Belichtungsende – mind. 3s Puffer einplanen, sonst Lücken in den Spuren' },
          { label: 'Dark Frames', wert: '5–10 Aufnahmen mit aufgesetztem Objektivdeckel bei identischen Werten am Session-Ende' }
        ]}
      ],
      ausrichtung: 'Norden zum Polarstern, Hochformat (konzentrische Kreise, mehr Himmel im Bild)',
      komposition: [
        'Silhouette direkt unter dem Polarstern platzieren',
        'Vordergrund leicht versetzt vom Zentrum',
        'Wolkenlücken oder Nebel als zusätzliche Struktur nutzen',
        'Reflektierende Fläche für gespiegelte Kreise',
        'Möglichst viel Himmel für lange Bögen einplanen'
      ],
      bearbeitung: ['Star Trail CleanR', 'StarStaX', 'Star Stacker (iPad)', 'Lightroom'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Meteoriten', art: 'meteoriten',
      kachelIso: '3200–6400', kachelBlende: 'f/1.8', kachelZeit: '10–15s',
      equipment: ['Sony α7V', 'Sony FE 14mm F1.8 GM', 'Stativ mit Kugelkopf', 'Intervalltimer', 'Große Karte: durchgehende Nachtserie kommt schnell auf 60–100 GB', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '3200–6400' },
          { label: 'Blende', wert: 'f/1.8 (Offenblende, für möglichst viele/schwache Meteore) – auf f/2.0 abblenden bei sichtbarer Koma' },
          { label: 'Verschlusszeit', wert: '10–15s Einzelbelichtung, minimale Pause' },
          { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
          { label: 'Fokus', wert: 'Manuell, auf ∞ – per Fokuslupe + Peaking, nach Temperaturwechsel erneut prüfen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: '3800–4200K (RAW), in Lightroom feinjustieren' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        fgMenuGruppe('Aus (Akku für die durchgehende Serie schonen)')
      ],
      ausrichtung: 'Radiant (Ursprungspunkt des Schauers) etwa 30–40° neben der Bildmitte – dort erscheinen die Spuren am längsten · Querformat für großes Sichtfeld',
      komposition: [
        'Markantes Vordergrundmotiv, kein leerer Himmel',
        'Radiant im Drittel-Raster platzieren',
        'Mehrere Bildebenen für Tiefe einbauen',
        'Ruhiges Motiv über die ganze Session',
        'Hellste Treffer hinterher als Bonus-Shots markieren'
      ],
      bearbeitung: ['Lightroom', 'Photoshop'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Mond (Detail)', art: 'mond-detail',
      kachelIso: '100–200', kachelBlende: 'f/8', kachelZeit: '1/125–1/250s',
      equipment: ['Sony α7V', 'Sony FE 200–600mm F5.6–6.3 G', 'Stabiles Stativ mit Gimbalkopf', 'Fernauslöser/Timer', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '100–200' },
          { label: 'Blende', wert: 'f/8 (Schärfe-Sweet-Spot des Objektivs)' },
          { label: 'Verschlusszeit', wert: '1/125–1/250s als Startwert, per Histogramm anpassen (entspricht der Looney-11-Regel f/11 bei 1/ISO, hier auf f/8 umgerechnet)' },
          { label: 'Objektiv', wert: 'Sony FE 200–600mm F5.6–6.3 G' },
          { label: 'Fokus', wert: 'Manuell, per Fokuslupe direkt auf Kraterkante bzw. Terminator scharfstellen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: 'Tageslicht bzw. fest (nicht Auto)' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        { titel: 'Einmalig im Menü', zeilen: [
          { label: 'AF/MF-Schalter', wert: 'Am Objektiv auf MF (nicht nur im Menü)' },
          { label: 'Verschluss', wert: 'Elektronisch' },
          { label: 'SteadyShot', wert: 'Aus (Stativbetrieb)' },
          { label: 'Serienbildmodus', wert: 'Hohe Geschwindigkeit (für die Lucky-Imaging-Serie)' },
          { label: 'Energiesparen', wert: 'Auto-Ausschaltzeit aus' }
        ]},
        { titel: 'Workflow', zeilen: [
          { label: 'Serienaufnahme', wert: '50–100 Bilder als Burst für Stacking (Lucky Imaging gegen Luftunruhe) – schnelle Karte (V90/CFexpress) leert den Puffer spürbar zügiger' },
          { label: 'Zeitpunkt', wert: 'Mond möglichst hoch am Himmel, ruhige Luft (gutes Seeing) – nicht bei Vollmond (flaches Licht ohne Schattenrelief)' }
        ]}
      ],
      ausrichtung: 'Position wechselt mit Datum/Uhrzeit – vorher per Kompass-App/Stellarium prüfen, Kamera folgt der Bewegung nach',
      komposition: [
        'Terminator (Licht-Schatten-Grenze) für Reliefeffekt nutzen, nicht bei Vollmond fotografieren',
        'Bekannte Krater wie Tycho oder Copernicus am Terminator gezielt anvisieren',
        'Ausschnitt statt ganzer Mondscheibe für mehr Detail',
        'Verschiedene Mondphasen über mehrere Nächte vergleichen',
        'Bei schmaler Sichel optional das Erdlicht mit einfangen (deutlich längere Belichtung, separater Ansatz)'
      ],
      bearbeitung: ['AutoStakkert', 'Registax', 'Lightroom'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Sonne (Detail)', art: 'sonne-detail',
      kachelIso: '100', kachelBlende: 'f/8', kachelZeit: '1/500–1/2000s',
      equipment: [
        'Sony α7V', 'Sony FE 200–600mm F5.6–6.3 G', 'Stabiles Stativ mit Gimbalkopf', 'Fernauslöser/Timer',
        'Sonnenfilter ND ≈100.000 (z.B. Baader AstroSolar) – noch zu besorgen, zwingend vor jeder Nutzung',
        'Objektivdeckel griffbereit als Sofortschutz beim Filterwechsel'
      ],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '100' },
          { label: 'Blende', wert: 'f/8–11 (Schärfe-Sweet-Spot) – ab f/16 Beugungsunschärfe' },
          { label: 'Verschlusszeit', wert: '1/125–1/500s als Startwert bei ND-5.0-Folie, je nach Filterdichte per Histogramm anpassen' },
          { label: 'Objektiv', wert: 'Sony FE 200–600mm F5.6–6.3 G' },
          { label: 'Fokus', wert: 'Manuell, per Fokuslupe auf Sonnenrand oder Fleckengruppe scharfstellen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: 'Tageslicht bzw. fest (nicht Auto)' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        { titel: 'Einmalig im Menü', zeilen: [
          { label: 'AF/MF-Schalter', wert: 'Am Objektiv auf MF (nicht nur im Menü)' },
          { label: 'Verschluss', wert: 'Elektronisch' },
          { label: 'SteadyShot', wert: 'Aus (Stativbetrieb)' },
          { label: 'Serienbildmodus', wert: 'Hohe Geschwindigkeit (für die Lucky-Imaging-Serie)' },
          { label: 'Energiesparen', wert: 'Auto-Ausschaltzeit aus' }
        ]},
        { titel: 'Workflow', zeilen: [
          { label: 'Augenschutz', wert: 'Sonnenfinsternisbrille nach Norm ISO 12312-2 tragen – niemals ungeschützt in die Sonne blicken, auch nicht kurz. Selbst mit Brille NIE durch ungefilterte Optik schauen: das gebündelte Licht überfordert die Brille' },
          { label: 'Kameraschutz', wert: 'Zertifizierten Sonnenfilter fest vor der Frontlinse prüfen, BEVOR die Kamera auf die Sonne gerichtet wird – ohne Filter brennt das Licht binnen Sekunden durch den Sensor' },
          { label: 'Fokus fixieren', wert: 'Fokusring nach dem Scharfstellen mit Tape fixieren – verrutscht sonst beim Nachführen' },
          { label: 'Serienaufnahme', wert: '50–100 Bilder als Burst für Stacking – schnelle Karte (V90/CFexpress) leert den Puffer spürbar zügiger' },
          { label: 'Vorbereitung', wert: 'Aktive Fleckenregionen vorab online prüfen (z.B. spaceweather.com)' }
        ]}
      ],
      ausrichtung: 'Position wechselt mit Datum/Uhrzeit – vorher per Kompass-App/Stellarium prüfen, Kamera folgt der Bewegung nach',
      komposition: [
        'Aktive Sonnenfleckenregionen gezielt anvisieren',
        'Sonnenrand (Limb) mit feinen Strukturen einfangen',
        'Ausschnitt statt ganzer Sonnenscheibe für mehr Detail',
        'Ruhige Luftschichten am späten Vormittag/frühen Nachmittag nutzen',
        'Mehrere Tage vergleichen, um die Sonnenrotation/Fleckenwanderung zu zeigen'
      ],
      bearbeitung: ['AutoStakkert', 'Registax', 'Lightroom'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Milchstraße (Vollbogen)', art: 'ms-vollbogen',
      kachelIso: '3200–6400', kachelBlende: 'f/1.8', kachelZeit: '10–15s',
      equipment: ['Sony α7V', 'Sony FE 14mm F1.8 GM', 'Stativ mit Nivellierbasis und Nodalpunkt-Kopf', 'Fernauslöser/Timer', ...FG_ZUBEHOER_BASIS],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Manuell (M)' },
          { label: 'ISO', wert: '3200–6400' },
          { label: 'Blende', wert: 'f/1.8 (Offenblende) – auf f/2.0 abblenden, falls Koma an den Bildrändern sichtbar wird' },
          { label: 'Verschlusszeit', wert: '10–15s (NPF-Regel bei 14mm)' },
          { label: 'Objektiv', wert: 'Sony FE 14mm F1.8 GM' },
          { label: 'Raster', wert: '5–7 Segmente in einer Reihe, horizontal geschwenkt, ca. 25–30% Überlappung' },
          { label: 'Fokus', wert: 'Manuell, auf ∞ – über alle Segmente identisch lassen, per Fokuslupe + Peaking, nach Temperaturwechsel erneut prüfen' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Weißabgleich', wert: 'Fest einstellen (nicht Auto) – sonst driften die Segmente auseinander' },
          { label: 'Dateiformat', wert: 'RAW (verlustfrei komprimiert)' }
        ]},
        fgMenuGruppe('Aus (Akku für die vielen Segmente schonen)'),
        { titel: 'Workflow', zeilen: [
          { label: 'Nivellierung', wert: 'Horizontlinie über alle Segmente auf gleicher Höhe halten – Nivellierbasis vorher justieren' },
          { label: 'Wetter', wert: 'Nur bei durchgehend klarem Himmel aufnehmen – eine Wolke in einem Segment stört das ganze Panorama' }
        ]}
      ],
      ausrichtung: 'Süden bis Südosten, Querformat – Kamera horizontal von einem Ende des Bogens zum anderen schwenken',
      komposition: [
        'Horizontlinie über alle Segmente gleich halten',
        'Bogen mittig im Panorama zentrieren',
        'Markante Silhouette am Fußpunkt des Bogens platzieren',
        'Genug Überlappung für sauberes Stitching einplanen',
        'Nur bei komplett klarem Himmel – eine Wolke ruiniert das ganze Panorama'
      ],
      bearbeitung: ['PTGui', 'Lightroom'],
      notizen: ''
    },
    {
      id: neueId(), name: 'Wildtiere (Slowmo)', art: 'wildtiere-slowmo',
      kachelIso: 'Auto', kachelBlende: 'f/5.6–8', kachelZeit: '1/240s',
      equipment: [
        'Sony α7V', 'Sony FE 200–600mm F5.6–6.3 G', 'CFexpress Type A (VPG200) bzw. SD UHS-II V90 – 4K120p in 10-bit 4:2:2 braucht dauerhaft hohe Schreibrate, langsamere Karten brechen die Aufnahme ab',
        'Ersatzakkus', 'Fahrzeug-Fensterauflage/Beanbag (im Fahrzeug) bzw. Monopod mit Fluid-Videokopf (zu Fuß/Hide) – klassisches Stativ bei sich bewegenden Tieren meist unpraktisch'
      ],
      einstellungen: [
        { titel: 'Aufnahme', zeilen: [
          { label: 'Modus', wert: 'Video S&Q' },
          { label: 'Bildrate', wert: '4K 120p (5-fache Zeitlupe) oder FHD 240p (10-fache, weniger Auflösung)' },
          { label: 'Blende', wert: 'f/5.6–8' },
          { label: 'Verschlusszeit', wert: '180°-Regel – bei 120fps 1/240s, bei 240fps 1/480s' },
          { label: 'ISO', wert: 'Auto mit Obergrenze (tagsüber meist niedrig)' },
          { label: 'Objektiv', wert: 'Sony FE 200–600mm F5.6–6.3 G' },
          { label: 'Fokus', wert: 'AF-C mit Tier-Motiverkennung (Real-time Recognition AF) – viele Kameras versagen bei 120fps beim AF; im Zweifel etwas abblenden für mehr Schärfentiefe' }
        ]},
        { titel: 'Farbe & Format', zeilen: [
          { label: 'Farbprofil', wert: 'S-Cinetone (einfacher zu graden) bzw. S-Log3 (mehr Grading-Spielraum)' },
          { label: 'Dateiformat', wert: 'XAVC HS 10-bit 4:2:2' }
        ]},
        { titel: 'Einmalig im Menü', zeilen: [
          { label: 'Motiverkennung', wert: 'Tiere/Vögel aktivieren' },
          { label: 'SteadyShot', wert: 'Active Mode' },
          { label: 'Kartenkapazität', wert: 'Vorher prüfen – hohe Datenrate bei 120p' },
          { label: 'Wind-Rauschunterdrückung', wert: 'Ein (falls Ton relevant)' }
        ]},
        { titel: 'Workflow', zeilen: [
          { label: 'Cliplänge', wert: 'Deutlich länger filmen als gedacht – Zeitlupe „frisst“ Sekunden' },
          { label: 'Vibration', wert: 'Motor/Fahrzeug wenn möglich aus' },
          { label: 'Puffer', wert: 'Vor und nach der Aktion mitfilmen' }
        ]}
      ],
      ausrichtung: 'Position folgt dem Tier – auf Fluchtdistanz und Windrichtung achten (Wind nicht zum Tier hin tragen)',
      komposition: [
        'Raum in Blickrichtung des Tieres lassen (Headroom in Bewegungsrichtung)',
        'Auf Actionmomente warten (Sprung, Angriff, Rennen) statt Dauerfilmen',
        'Augenhöhe des Tieres anstreben für Wirkung',
        'Erst Kontext einfangen, dann näher für Detail',
        'Mehrere kurze Clips statt einem langen für Schnittvarianz'
      ],
      bearbeitung: ['DaVinci Resolve', 'Premiere Pro'],
      notizen: ''
    }
  ];
}

let szenarien = safeParse(store.get(FG_KEYS.szenarien), null);
if (!Array.isArray(szenarien)) szenarien = fgStartbestand();
// Bestehende Speicherstände (vor der Umstellung auf Listen/Gruppen) nachrüsten.
szenarien.forEach(s => {
  if (typeof s.notizen !== 'string') s.notizen = '';
  if (typeof s.equipment === 'string') s.equipment = s.equipment.split(' · ').map(t => t.trim()).filter(Boolean);
  if (!Array.isArray(s.equipment)) s.equipment = [];
  if (Array.isArray(s.einstellungen) && s.einstellungen.length && !s.einstellungen[0].titel) {
    s.einstellungen = [{ titel: 'Kamera', zeilen: s.einstellungen }];
  }
  if (!Array.isArray(s.einstellungen)) s.einstellungen = [];
  if (!Array.isArray(s.komposition)) s.komposition = s.inspiration ? [s.inspiration] : [];
  if (typeof s.bearbeitung === 'string') s.bearbeitung = s.bearbeitung.split(' · ').map(t => t.trim()).filter(Boolean);
  if (!Array.isArray(s.bearbeitung)) s.bearbeitung = [];
  delete s.photopills;
  delete s.inspiration;
  if (!s.art) s.art = 'ms-shot';
  if (!s.kachelIso) s.kachelIso = '';
  if (!s.kachelBlende) s.kachelBlende = '';
  if (!s.kachelZeit) s.kachelZeit = '';
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

/* Für Ausrüstung/Komposition/Bearbeitung: einfache Aufzählung statt Fließtext. */
function fgListeAbschnitt(label, items){
  if (!items || !items.length) return '';
  const li = items.map(t => `<li style="margin-bottom:6px">${esc(t)}</li>`).join('');
  return `<div class="glass" style="padding:16px 18px;margin-bottom:12px">
    <div class="bento-title" style="margin-bottom:8px">${esc(label)}</div>
    <ul style="margin:0;padding-left:18px;font-size:0.88rem;color:var(--text);line-height:1.5">${li}</ul>
  </div>`;
}

/* Kamera-Einstellungen: mehrere Gruppen (Aufnahme, Farbe & Format, Einmalig im Menü,
   Workflow) in einer Karte, mit dünner Trennlinie + kleinem Gruppentitel zwischen den
   Abschnitten. Zeilen selbst wie gehabt Label links / Wert rechts, Wert darf bei
   Bedarf mehrzeilig umbrechen, bleibt dabei rechtsbündig. */
function fgEinstellungenHTML(gruppen){
  const sichtbar = (gruppen || []).filter(g => g.zeilen && g.zeilen.length);
  if (!sichtbar.length) return '';
  const teile = sichtbar.map((g, gi) => {
    const zeilen = g.zeilen.map((z, i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:14px;padding:9px 0;${i < g.zeilen.length - 1 ? 'border-bottom:1px solid var(--stroke)' : ''}">
        <span style="font-size:0.82rem;color:var(--text);font-weight:600;flex-shrink:0">${esc(z.label)}</span>
        <span style="font-size:0.82rem;color:var(--muted);text-align:right">${esc(z.wert)}</span>
      </div>`).join('');
    return `<div style="${gi > 0 ? 'margin-top:16px;padding-top:14px;border-top:1px solid var(--stroke)' : ''}">
      <div style="font-size:0.66rem;text-transform:uppercase;letter-spacing:0.05em;color:var(--muted-2);font-weight:700;margin-bottom:2px">${esc(g.titel)}</div>
      ${zeilen}
    </div>`;
  }).join('');
  return `<div class="glass" style="padding:16px 18px;margin-bottom:12px">
    <div class="bento-title" style="margin-bottom:2px">Kamera-Einstellungen</div>
    ${teile}
  </div>`;
}

function fgOpenDetail(id){
  const s = szenarien.find(x => x.id === id); if (!s) return;
  fgDetailId = id;
  $('fg-detail-title').textContent = s.name;
  $('fg-detail-body').innerHTML =
    fgListeAbschnitt('Ausrüstung', s.equipment) +
    fgEinstellungenHTML(s.einstellungen) +
    fgAbschnitt('Ausrichtung', s.ausrichtung) +
    fgListeAbschnitt('Komposition', s.komposition) +
    fgListeAbschnitt('Bearbeitung', s.bearbeitung) +
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
    if (typeof s.equipment === 'string') s.equipment = s.equipment.split(' · ').map(t => t.trim()).filter(Boolean);
    if (!Array.isArray(s.equipment)) s.equipment = [];
    if (Array.isArray(s.einstellungen) && s.einstellungen.length && !s.einstellungen[0].titel) {
      s.einstellungen = [{ titel: 'Kamera', zeilen: s.einstellungen }];
    }
    if (!Array.isArray(s.einstellungen)) s.einstellungen = [];
    if (!Array.isArray(s.komposition)) s.komposition = s.inspiration ? [s.inspiration] : [];
    if (typeof s.bearbeitung === 'string') s.bearbeitung = s.bearbeitung.split(' · ').map(t => t.trim()).filter(Boolean);
    if (!Array.isArray(s.bearbeitung)) s.bearbeitung = [];
    delete s.photopills;
    delete s.inspiration;
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
