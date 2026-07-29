/* ================= BEREICH: FINANZEN =================
   Eigenständiges Modul. Nutzt den gemeinsamen Unterbau aus index.html.
   Die Optik ist auf diesen Bereich begrenzt, damit sie Reisen nicht beeinflusst. */

document.head.insertAdjacentHTML('beforeend', '<style>' + "#mod-finanzen header{ margin: 8px 0 26px; }\n#mod-finanzen header h1{ font-size: 2rem; font-weight: 800; letter-spacing: -0.04em; }\n#mod-finanzen header p{ color: var(--muted); font-size: 0.88rem; margin-top: 3px; }\n#mod-finanzen .summary{\n    display: flex;\n    align-items: stretch;\n    padding: 4px 4px;\n    margin-bottom: 8px;\n  }\n#mod-finanzen .filter-row{ display: flex; justify-content: flex-end; margin-bottom: 8px; }\n#mod-finanzen .account-filter{\n    font: inherit; font-size: 0.78rem; font-weight: 500;\n    color: var(--text); cursor: pointer;\n    background: var(--glass); border: 1px solid var(--stroke);\n    border-radius: var(--r-pill); padding: 6px 30px 6px 14px; outline: none;\n    -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%);\n    appearance: none; -webkit-appearance: none;\n    background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='3' stroke-linecap='round'><path d='M6 9l6 6 6-6'/></svg>\");\n    background-repeat: no-repeat; background-position: right 12px center;\n  }\n#mod-finanzen .account-filter:focus{ border-color: var(--accent); }\n#mod-finanzen .account-filter option{ background: #1c1c1e; color: var(--text); }\n#mod-finanzen .income-bar{\n    display: block; padding: 12px 18px; margin-bottom: 6px;\n  }\n#mod-finanzen .settings-topbar{ display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }\n#mod-finanzen .settings-back{ width: 40px; height: 40px; border-radius: var(--r-pill); border: 1px solid var(--stroke); background: var(--glass); color: var(--text); font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform 0.3s var(--spring); }\n#mod-finanzen .settings-back:active{ transform: scale(0.9); }\n#mod-finanzen .income-left, #mod-finanzen .income-right{ display: flex; flex-direction: column; gap: 3px; }\n#mod-finanzen .income-right{ align-items: flex-end; }\n#mod-finanzen .income-label{ font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted-2); }\n#mod-finanzen .income-top{ display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n#mod-finanzen .income-meta{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--stroke); cursor: pointer; }\n#mod-finanzen .im-col{ display: flex; flex-direction: column; gap: 3px; min-width: 0; }\n#mod-finanzen .im-val{ font-size: 0.95rem; font-weight: 600; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n#mod-finanzen .im-add{ grid-column: 1 / -1; font-size: 0.72rem; color: var(--muted-2); }\n#mod-finanzen .income-input-wrap{ display: flex; align-items: baseline; gap: 3px; }\n#mod-finanzen #income-input{\n    width: 110px; background: transparent; border: none; outline: none;\n    color: var(--text); font: inherit; font-size: 1.25rem; font-weight: 600;\n    letter-spacing: -0.02em; font-variant-numeric: tabular-nums; padding: 0;\n    border-bottom: 1px solid var(--stroke);\n  }\n#mod-finanzen #income-input:focus{ border-bottom-color: var(--accent); }\n#mod-finanzen #income-input::placeholder{ color: var(--muted-2); }\n#mod-finanzen .income-eur{ font-size: 1.05rem; font-weight: 600; color: var(--muted); }\n#mod-finanzen .income-avail{ font-size: 1.25rem; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; color: var(--green); }\n#mod-finanzen .income-avail.negative{ color: var(--danger); }\n#mod-finanzen .income-divider{ height: 1px; background: var(--stroke); margin: 40px 0 4px; }\n#mod-finanzen /* Hero: Gesamtvermögen */\n  .hero{ text-align: center; padding: 22px 0 24px; cursor: pointer; }\n#mod-finanzen /* Detail-Sheet (öffnet über Hero/Bento) */\n  .detail-sheet{ position: fixed; inset: 0; z-index: 380; background: var(--bg); overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; transform: translateX(100%); transition: transform 0.4s var(--ease-ios), visibility 0s linear 0.4s; padding: calc(12px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom)); visibility: hidden; }\n#mod-finanzen .detail-sheet.open{ transform: translateX(0); visibility: visible; transition: transform 0.4s var(--ease-ios), visibility 0s; }\n#mod-finanzen .detail-panel{ display: none; }\n#mod-finanzen .detail-panel .dashboard, #mod-finanzen .detail-panel .av-dash{ margin: 0 0 14px; }\n#mod-finanzen .detail-panel.on{ display: block; }\n#mod-finanzen .hero-label{ font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--petrol); font-weight: 700; }\n#mod-finanzen .hero-val{ font-size: 3rem; font-weight: 800; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; margin-top: 6px; line-height: 1; }\n#mod-finanzen .hero-delta{ display: inline-block; margin-top: 12px; font-size: 0.88rem; font-weight: 700; padding: 5px 12px; border-radius: var(--r-pill); }\n#mod-finanzen .hero-delta.up{ color: var(--green); background: rgba(48,209,55,0.12); }\n#mod-finanzen .hero-delta.down{ color: var(--danger); background: rgba(255,69,58,0.12); }\n#mod-finanzen .hero-spark, #mod-finanzen #hero-spark{ width: 100%; }\n#mod-finanzen #hero-spark svg{ width: 100%; height: 64px; margin-top: 16px; display: block; }\n#mod-finanzen .hero-sub{ display: block; font-size: 0.76rem; color: var(--muted-2); margin-top: 14px; }\n#mod-finanzen .tag{ font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted-2); margin: 6px 2px 10px; font-weight: 700; }\n#mod-finanzen /* Bento – einheitlicher Apple-Stil */\n  .bento{ display: grid; grid-template-columns: 1fr 1fr; grid-auto-rows: 1fr; gap: 12px; max-width: 100%; }\n#mod-finanzen .bento-tile{ height: 100%; }\n#mod-finanzen .bento-head{ margin-bottom: 3px; }\n#mod-finanzen .bento-title{ font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.03em; font-weight: 700; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }\n#mod-finanzen .bento-primary{ font-size: 1.4rem; font-weight: 800; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1.15; margin-top: 5px; white-space: nowrap; }\n#mod-finanzen .bento-primary.pos{ color: var(--text); }\n#mod-finanzen .bento-primary.neg{ color: var(--danger); }\n#mod-finanzen .bento-unit{ font-size: 0.78rem; color: var(--muted); font-weight: 600; margin-left: 3px; letter-spacing: 0; }\n#mod-finanzen .bento-caption{ font-size: 0.74rem; color: var(--muted); margin-top: 4px; line-height: 1.3; }\n#mod-finanzen .bento-foot{ margin-top: 14px; }\n#mod-finanzen /* Konten */\n  .bento-foot{ display: flex; align-items: center; gap: 12px; }\n#mod-finanzen .bento-foot-col{ flex-direction: column; align-items: stretch; gap: 8px; }\n#mod-finanzen .bento-segbar{ display: flex; height: 7px; border-radius: var(--r-pill); overflow: hidden; gap: 2px; }\n#mod-finanzen .bento-seg{ border-radius: var(--r-pill); min-width: 4px; }\n#mod-finanzen .bento-break{ flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }\n#mod-finanzen .bento-break-row{ display: flex; justify-content: space-between; align-items: baseline; font-size: 0.7rem; color: var(--muted); }\n#mod-finanzen .bento-break-row .bl{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }\n#mod-finanzen .bento-break-row .bv{ white-space: nowrap; flex-shrink: 0; padding-left: 8px; font-variant-numeric: tabular-nums; }\n#mod-finanzen .bento-break-row span:last-child{ font-variant-numeric: tabular-nums; white-space: nowrap; padding-left: 8px; }\n#mod-finanzen .bento-leg-dot{ display: inline-block; width: 6px; height: 6px; border-radius: var(--r-pill); margin-right: 5px; vertical-align: middle; }\n#mod-finanzen /* Timeline (Verträge + Urlaube) */\n  .bento-timeline{ display: flex; align-items: flex-start; justify-content: space-between; width: 100%; gap: 3px; }\n#mod-finanzen .bento-tl-stop{ display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1 1 0; min-width: 0; }\n#mod-finanzen .bento-tl-node{ width: 7px; height: 7px; border-radius: var(--r-pill); background: var(--violet); }\n#mod-finanzen .bento-tl-node.warn{ background: var(--danger); }\n#mod-finanzen .bento-tl-name{ font-size: 0.58rem; color: var(--text); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; text-align: center; }\n#mod-finanzen .bento-tl-lbl{ font-size: 0.56rem; color: var(--muted-2); white-space: nowrap; }\n#mod-finanzen .bento-tl-line{ display: none; }\n#mod-finanzen .bento-mini{ font-size: 0.72rem; color: var(--muted-2); }\n#mod-finanzen /* Listen-Zeilen (Verträge/Urlaube/AV) */\n  .bento-list{ display: flex; flex-direction: column; gap: 5px; width: 100%; }\n#mod-finanzen .bento-list-row{ display: flex; justify-content: space-between; align-items: baseline; font-size: 0.78rem; }\n#mod-finanzen .bento-list-row .bl{ color: var(--text); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }\n#mod-finanzen .bento-list-row .bl.warn{ color: var(--danger); }\n#mod-finanzen .bento-list-row.av{ font-size: 0.74rem; }\n#mod-finanzen .bento-list-row.av .bl{ flex-shrink: 0; }\n#mod-finanzen .bento-list-row .bv{ color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; flex-shrink: 0; padding-left: 10px; }\n#mod-finanzen /* Urlaubs-Weltkarte */\n  .bento-map-wrap{ width: 100%; }\n#mod-finanzen .bento-map{ width: 100%; height: auto; aspect-ratio: 100 / 34; display: block; }\n#mod-finanzen .bento-map-legend{ display: flex; gap: 8px; justify-content: center; margin-top: 9px; font-size: 0.56rem; color: var(--muted-2); }\n#mod-finanzen .bento-map-legend i{ display: inline-block; width: 6px; height: 6px; border-radius: var(--r-pill); margin-right: 4px; }\n#mod-finanzen /* Fortschrittsbalken bis 67 */\n  .bento-progress{ height: 6px; border-radius: var(--r-pill); background: rgba(255,255,255,0.08); overflow: hidden; }\n#mod-finanzen .bento-progress-fill{ display: block; height: 100%; border-radius: var(--r-pill); background: var(--green); }\n#mod-finanzen .dash-swipe{ margin: 40px 0 0; position: relative; }\n#mod-finanzen /* Farb-Glow hinter dem Dashboard-Bereich – hebt ihn als eigene Zone ab */\n  .dash-swipe::before{\n    content: ''; position: absolute; z-index: -1;\n    inset: -6% 0 -8% 0;\n    background:\n      radial-gradient(55% 50% at 28% 22%, rgba(90,120,255,0.20), transparent 70%),\n      radial-gradient(50% 46% at 82% 82%, rgba(170,90,240,0.16), transparent 72%);\n    filter: blur(28px);\n    pointer-events: none;\n  }\n#mod-finanzen .dashboard{ padding: 22px; margin: 40px 0 0; }\n#mod-finanzen /* Dashboard-Karten kräftiger absetzen: tiefere Schatten, #mod-finanzen deutlichere Glaskante.\n     Bewusst OHNE backdrop-filter (solider Hintergrund) – das hält das Wischen flüssig, #mod-finanzen da Safari keinen Live-Blur der bewegten Karte berechnen muss. */\n  .dash-title{ font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text); font-weight: 700; margin-bottom: 14px; }\n#mod-finanzen .dash-grid{ display: flex; gap: 16px; align-items: center; }\n#mod-finanzen .dash-donut{ position: relative; width: 100px; height: 100px; flex-shrink: 0; }\n#mod-finanzen .donut-center{ position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; padding: 0 4px; }\n#mod-finanzen .donut-center-label{ font-size: 0.52rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-2); }\n#mod-finanzen .donut-center-val{ font-size: 0.75rem; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; margin-top: 2px; max-width: 72px; text-align: center; line-height: 1.15; }\n#mod-finanzen .dash-sub-label{ font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--petrol); font-weight: 700; display: block; margin-bottom: 4px; }\n#mod-finanzen .dash-saverate{ }\n#mod-finanzen .uy-konto-head .wealth-sub-row{ display: flex; align-items: center; gap: 7px; margin-top: 2px; flex-wrap: nowrap; text-transform: none; min-height: 18px; }\n#mod-finanzen .uy-konto-head .wealth-sub-row .saverate-eur{ margin-top: 0; margin-bottom: 0; display: inline; flex: 0 1 auto; min-width: 0; }\n#mod-finanzen .uy-konto-head span.saverate-eur{ font-size: 0.68rem; color: var(--muted); display: block; margin-top: 2px; font-weight: 600; text-transform: none; letter-spacing: 0; min-height: 18px; line-height: 18px; }\n#mod-finanzen .info-i{ flex-shrink: 0; width: 16px; height: 16px; border-radius: 50%; border: none; background: var(--stroke-hi); color: var(--text); font-size: 0.6rem; font-weight: 700; font-style: italic; font-family: Georgia, \"Times New Roman\", serif; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; transition: transform 0.15s, background 0.2s; }\n#mod-finanzen .info-i:active{ transform: scale(0.88); background: var(--accent); }\n#mod-finanzen .saverate-eur{ font-size: 0.68rem; color: var(--muted); display: block; margin-top: 2px; font-weight: 600; }\n#mod-finanzen .dash-legend{ flex: 1; display: flex; flex-direction: column; gap: 5px; justify-content: center; }\n#mod-finanzen .legend-row{ display: flex; align-items: center; gap: 6px; font-size: 0.68rem; line-height: 1.3; }\n#mod-finanzen .legend-dot{ width: 7px; height: 7px; border-radius: 2px; flex-shrink: 0; display: inline-block; }\n#mod-finanzen .legend-name{ color: var(--text); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n#mod-finanzen .legend-val{ color: var(--muted); font-variant-numeric: tabular-nums; font-weight: 600; text-align: right; flex-shrink: 0; }\n#mod-finanzen .legend-pct{ display: none; }\n#mod-finanzen .dash-accounts{ margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--stroke); }\n#mod-finanzen .acct-row{ display: flex; align-items: center; gap: 8px; font-size: 0.82rem; line-height: 1.4; }\n#mod-finanzen .acct-row-name{ flex: 1; min-width: 0; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n#mod-finanzen .acct-row-val{ color: var(--muted); font-variant-numeric: tabular-nums; font-weight: 600; width: 92px; text-align: right; flex-shrink: 0; }\n#mod-finanzen .acct-row-pct{ width: 40px; text-align: right; color: var(--muted-2); font-variant-numeric: tabular-nums; flex-shrink: 0; }\n#mod-finanzen .bal-acct-row{ padding-left: 0; }\n#mod-finanzen #saverate-bars, #mod-finanzen #account-bars, #mod-finanzen #balance-bars{ display: flex; flex-direction: column; gap: 8px; }\n#mod-finanzen .bal-acct-head{ display: flex; justify-content: space-between; align-items: baseline; }\n#mod-finanzen .bal-acct-name{ font-size: 0.82rem; font-weight: 600; }\n#mod-finanzen .bal-acct-total{ font-size: 0.82rem; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }\n#mod-finanzen .bal-acct-break{ font-size: 0.74rem; color: var(--muted); margin-top: 4px; display: flex; flex-direction: column; gap: 2px; }\n#mod-finanzen .bal-break-row{ display: flex; justify-content: space-between; align-items: baseline; }\n#mod-finanzen .bal-break-row span:last-child{ font-variant-numeric: tabular-nums; flex-shrink: 0; padding-left: 10px; }\n#mod-finanzen .balance-box{ padding: 14px 16px; margin-bottom: 6px; }\n#mod-finanzen .bb-head{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--stroke); }\n#mod-finanzen .bb-head span:first-child{ font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-2); }\n#mod-finanzen .bb-total{ font-size: 1.05rem; font-weight: 700; color: var(--green); font-variant-numeric: tabular-nums; }\n#mod-finanzen .bb-row{ display: flex; justify-content: space-between; font-size: 0.8rem; padding: 3px 0; }\n#mod-finanzen .bb-name{ color: var(--muted); }\n#mod-finanzen .bb-val{ color: var(--text); font-variant-numeric: tabular-nums; font-weight: 500; }\n#mod-finanzen .dash-empty{ color: var(--muted-2); font-size: 0.82rem; text-align: center; padding: 10px 0; }\n#mod-finanzen .account-filter{\n    font: inherit; font-size: 0.78rem; font-weight: 500;\n    color: var(--text); cursor: pointer;\n    background: var(--glass); border: 1px solid var(--stroke);\n    border-radius: var(--r-pill); padding: 6px 30px 6px 14px; outline: none;\n    -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%);\n    appearance: none; -webkit-appearance: none;\n    background-image: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='3' stroke-linecap='round'><path d='M6 9l6 6 6-6'/></svg>\");\n    background-repeat: no-repeat; background-position: right 12px center;\n  }\n#mod-finanzen .account-filter:focus{ border-color: var(--accent); }\n#mod-finanzen .account-filter option{ background: #1c1c1e; color: var(--text); }\n#mod-finanzen .stat-value.year{ color: var(--text); }\n#mod-finanzen .stat-value.count{ color: var(--text); }\n#mod-finanzen .stat-value.month{ color: var(--text); }\n#mod-finanzen .group-divider{\n    height: 1px;\n    background: var(--stroke);\n    margin: 40px 0 4px;\n  }\n#mod-finanzen .sub-header{ margin: 24px 0 22px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; -webkit-tap-highlight-color: transparent; }\n#mod-finanzen .sub-header h1{ font-size: 1.95rem; font-weight: 800; letter-spacing: -0.04em; }\n#mod-finanzen .sub-header p{ color: var(--muted); font-size: 0.88rem; margin-top: 3px; }\n#mod-finanzen .section-chevron{ font-size: 1.4rem; color: var(--muted-2); flex-shrink: 0; transition: transform 0.35s var(--spring); line-height: 1; }\n#mod-finanzen .sub-header.collapsed .section-chevron{ transform: rotate(-90deg); }\n#mod-finanzen .section-body{ overflow: hidden; }\n#mod-finanzen .section-body.collapsed{ display: none; }\n#mod-finanzen .settings-row.sr-danger .sr-title{ color: var(--danger); }\n#mod-finanzen .backup-btn:hover{ background: var(--glass-hi); border-color: var(--stroke-hi); }\n#mod-finanzen .entry-wrap{ margin-bottom: 10px; }\n#mod-finanzen .entry-wrap:last-child{ margin-bottom: 0; }\n#mod-finanzen .entry-name-prov{ font-weight: 500; font-size: 0.8rem; color: var(--muted); letter-spacing: 0; }\n#mod-finanzen .entry-sub > div{ }\n#mod-finanzen .entry-paysched{ font-size: 0.74rem; color: var(--muted-2); margin-top: 2px; font-variant-numeric: tabular-nums; }\n#mod-finanzen .cat-Abonnement{ background: rgba(176,110,235,0.16); color: #c39bf0; }\n#mod-finanzen .cat-Versicherung{ background: rgba(55,195,230,0.16);  color: #3fc8e6; }\n#mod-finanzen .cat-Verein{ background: rgba(255,150,50,0.16);  color: #ff9f43; }\n#mod-finanzen .cat-Vertrag{ background: rgba(235,95,195,0.16);  color: #f06fce; }\n#mod-finanzen .cat-Sparen{ background: rgba(150,175,210,0.16); color: #97b0d4; }\n#mod-finanzen .cat-Urlaub{ background: rgba(235,190,75,0.16);  color: #ecc24f; }\n#mod-finanzen .cat-Konsum{ background: rgba(125,130,250,0.16); color: #8f95ff; }\n#mod-finanzen .cat-Gesetzlich{ background: rgba(200,160,100,0.16); color: #c9a46a; }\n#mod-finanzen .cat-Betrieblich{ background: rgba(45,195,175,0.16);  color: #34c8b4; }\n#mod-finanzen .cat-Privat{ background: rgba(255,125,160,0.16); color: #ff8fae; }\n#mod-finanzen .entry-pills{flex-wrap: nowrap}\n#mod-finanzen .acct-pill{ display: inline-block; font-size: 0.6rem; font-weight: 600; padding: 2px 7px; border-radius: var(--r-pill); letter-spacing: 0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; flex: 0 1 auto; }\n#mod-finanzen .acct-DBGiro{ background: rgba(90,200,250,0.16);  color: #5ac8fa; }\n#mod-finanzen .acct-DBSpar{ background: rgba(120,140,255,0.16); color: #8a9cff; }\n#mod-finanzen .acct-DBROBIN{ background: rgba(125,210,140,0.18); color: #7dd28c; }\n#mod-finanzen .acct-DKBGiro{ background: rgba(48,209,170,0.16);  color: #30d1aa; }\n#mod-finanzen .acct-ScalableBroker{ background: rgba(255,180,90,0.16);  color: #ffb45a; }\n#mod-finanzen .acct-ScalableTagesgeld{ background: rgba(215,200,120,0.16); color: #d7c878; }\n#mod-finanzen .acct-ScalableWealthWeltreise{ background: rgba(255,140,160,0.16); color: #ff8ca0; }\n#mod-finanzen .acct-EquatePlus{ background: rgba(190,150,255,0.16); color: #be96ff; }\n#mod-finanzen .entry-amount{ font-weight: 600; font-size: 0.97rem; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }\n#mod-finanzen .entry-period{ font-size: 0.7rem; color: var(--muted-2); text-align: right; margin-top: 2px; }\n#mod-finanzen .entry-yearly{ font-size: 0.7rem; color: var(--muted); text-align: right; margin-top: 3px; font-variant-numeric: tabular-nums; }\n#mod-finanzen .entry-balance{ font-size: 0.74rem; font-weight: 600; color: var(--petrol); text-align: left; margin-top: 7px; font-variant-numeric: tabular-nums; cursor: pointer; display: flex; align-items: center; gap: 6px; min-height: 18px; }\n#mod-finanzen .balance-inline{ font-family: inherit; font-size: 0.74rem; font-weight: 600; line-height: 1.2; color: var(--petrol); background: rgba(0,179,184,0.10); border: 1px solid rgba(0,179,184,0.35); border-radius: 6px; padding: 2px 6px; width: 108px; max-width: 55%; outline: none; font-variant-numeric: tabular-nums; -webkit-appearance: none; box-sizing: border-box; }\n#mod-finanzen .balance-inline:focus{ border-color: var(--petrol); }\n#mod-finanzen .entry-pension{ display: flex; flex-wrap: wrap; gap: 1px 12px; margin-top: 7px; font-size: 0.78rem; line-height: 1.35; font-variant-numeric: tabular-nums; }\n#mod-finanzen .entry-sub + .entry-pension{ margin-top: 1px; }\n#mod-finanzen .entry-pension .pv-date{ color: var(--muted); }\n#mod-finanzen .growth-auto-note{ font-size: 0.72rem; color: var(--muted); line-height: 1.4; background: rgba(255,255,255,0.03); border: 1px solid var(--stroke); border-radius: 10px; padding: 8px 10px; }\n#mod-finanzen .av-dash{ padding: 22px; margin-bottom: 14px; }\n#mod-finanzen .av-cards{ display: flex; flex-direction: column; gap: 10px; }\n#mod-finanzen .av-group{ display: flex; flex-direction: column; gap: 8px; }\n#mod-finanzen .av-group-head{ display: flex; justify-content: space-between; align-items: baseline; padding: 4px 2px 0; }\n#mod-finanzen .av-group-cat{ font-size: 0.66rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }\n#mod-finanzen .av-group-cat[data-cat=\"Gesetzlich\"]{ color: #c9a46a; }\n#mod-finanzen .av-group-cat[data-cat=\"Betrieblich\"]{ color: #34c8b4; }\n#mod-finanzen .av-group-cat[data-cat=\"Privat\"]{ color: #ff8fae; }\n#mod-finanzen .av-group-cur{ font-size: 0.7rem; color: var(--muted-2); font-variant-numeric: tabular-nums; }\n#mod-finanzen .av-card{ background: rgba(255,255,255,0.04); border: 1px solid var(--stroke); border-radius: var(--r-control); padding: 14px 16px; }\n#mod-finanzen .vd-group{ margin-top: 18px; }\n#mod-finanzen .vd-group .dash-sub-label{ margin-bottom: 10px; }\n#mod-finanzen .vd-card{ background: rgba(255,255,255,0.04); border: 1px solid var(--stroke); border-radius: 14px; padding: 11px 14px; margin-bottom: 8px; }\n#mod-finanzen .vd-card:last-child{ margin-bottom: 0; }\n#mod-finanzen .vd-head{ display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 7px; }\n#mod-finanzen .vd-name{ font-size: 0.88rem; font-weight: 700; color: var(--text); letter-spacing: -0.01em; }\n#mod-finanzen .vd-prov{ font-size: 0.7rem; color: var(--muted-2); flex-shrink: 0; }\n#mod-finanzen .vd-row{ display: flex; align-items: baseline; justify-content: space-between; gap: 12px; font-size: 0.75rem; line-height: 1.45; }\n#mod-finanzen .vd-key{ color: var(--text); flex-shrink: 0; }\n#mod-finanzen .vd-val{ color: var(--muted); font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; min-width: 0; }\n#mod-finanzen .vd-urgent{ border-color: rgba(255,69,58,0.4); background: rgba(255,69,58,0.06); }\n#mod-finanzen .vd-val-urgent{ color: var(--danger); font-weight: 700; }\n#mod-finanzen .av-card-head{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }\n#mod-finanzen .av-card-cat{ font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted-2); }\n#mod-finanzen .av-card-name{ text-transform: none; letter-spacing: 0; color: var(--text); font-size: 0.82rem; }\n#mod-finanzen .av-card-cur{ font-size: 0.78rem; color: var(--muted); font-variant-numeric: tabular-nums; }\n#mod-finanzen .av-card-metrics{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }\n#mod-finanzen .av-card-metric{ background: rgba(255,255,255,0.03); border-radius: 10px; padding: 8px 4px; text-align: center; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }\n#mod-finanzen .av-card-metric-label{ font-size: 0.56rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--muted-2); display: block; margin-bottom: 4px; }\n#mod-finanzen .av-card-metric-val{ font-size: 0.8rem; font-weight: 700; font-variant-numeric: tabular-nums; display: block; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }\n#mod-finanzen .av-card-metric-type{ font-size: 0.58rem; color: var(--muted-2); display: block; margin-top: 2px; }\n#mod-finanzen .av-card-metric.base .av-card-metric-val{ color: var(--text); }\n#mod-finanzen .av-card-metric.s1 .av-card-metric-val{ color: var(--text); }\n#mod-finanzen .av-card-metric.s2 .av-card-metric-val{ color: var(--text); }\n#mod-finanzen .av-card-metric.s3 .av-card-metric-val{ color: var(--text); }\n#mod-finanzen .av-card-total{ background: transparent; border: none; border-radius: 0; padding: 16px 0; border-top: 1px solid var(--stroke); border-bottom: 1px solid var(--stroke); margin-bottom: 6px; }\n#mod-finanzen .av-hist-block{ margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--stroke); }\n#mod-finanzen .av-cards > .av-hist-block:first-child{ border-top: none; margin-top: 0; padding-top: 0; }\n#mod-finanzen .av-legend{ font-size: 0.62rem; color: var(--muted-2); text-align: center; margin-top: 10px; }\n#mod-finanzen .av-empty{ font-size: 0.82rem; color: var(--muted-2); text-align: center; padding: 30px 12px; line-height: 1.5; }\n#mod-finanzen .hist-svg{ flex: 1; min-width: 0; height: 90px; display: block; }\n#mod-finanzen .hist-plot{ display: flex; align-items: stretch; gap: 8px; }\n#mod-finanzen .hist-axis{ display: flex; flex-direction: column; justify-content: space-between; padding: 4px 0 1px; font-size: 0.58rem; color: var(--muted-2); font-variant-numeric: tabular-nums; text-align: right; flex-shrink: 0; }\n#mod-finanzen .hist-empty{ font-size: 0.74rem; color: var(--muted-2); line-height: 1.4; padding: 8px 0; }\n#mod-finanzen .hist-range{ font-size: 0.6rem; color: var(--muted-2); text-align: center; margin-top: 4px; }\n#mod-finanzen .hist-up{ color: var(--green); }\n#mod-finanzen .hist-down{ color: var(--danger); }\n#mod-finanzen .due-list{ display: flex; flex-direction: column; gap: 7px; margin-top: 10px; }\n#mod-finanzen .due-row{ display: flex; align-items: baseline; gap: 8px; font-size: 0.78rem; }\n#mod-finanzen .due-date{ color: var(--muted-2); font-variant-numeric: tabular-nums; flex-shrink: 0; }\n#mod-finanzen .due-name{ color: var(--text); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }\n#mod-finanzen .due-prov{ color: var(--muted-2); }\n#mod-finanzen .due-amount{ color: var(--muted); font-weight: 600; font-variant-numeric: tabular-nums; flex-shrink: 0; }\n#mod-finanzen .hist-head{ display: flex; align-items: center; justify-content: space-between; gap: 8px; }\n#mod-finanzen .hist-range-ctl{ display: flex; gap: 3px; background: rgba(0,0,0,0.25); border-radius: var(--r-pill); padding: 2px; }\n#mod-finanzen .hist-range-btn{ border: none; background: transparent; color: var(--muted-2); font: inherit; font-size: 0.6rem; font-weight: 600; padding: 3px 9px; border-radius: var(--r-pill); cursor: pointer; transition: all 0.2s var(--ease-ios); }\n#mod-finanzen .hist-range-btn.active{ background: var(--accent); color: #fff; }\n#mod-finanzen .av-mode-toggle{ display: flex; gap: 4px; background: rgba(0,0,0,0.25); border-radius: 9px; padding: 3px; margin-bottom: 10px; }\n#mod-finanzen .av-mode-btn{ flex: 1; border: none; background: transparent; color: var(--muted); font: inherit; font-size: 0.74rem; font-weight: 600; padding: 6px; border-radius: 7px; cursor: pointer; transition: all 0.15s; }\n#mod-finanzen .av-mode-btn.active{ background: var(--accent); color: #fff; }\n#mod-finanzen .av-card-total-scenario{ display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }\n#mod-finanzen .av-scenario-select{ background: rgba(255,255,255,0.08); border: 1px solid var(--stroke); border-radius: 8px; color: var(--muted); font: inherit; font-size: 0.72rem; padding: 4px 8px; outline: none; cursor: pointer; flex-shrink: 0; }\n#mod-finanzen .av-card-total-val{ font-size: 0.82rem; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; flex: 1; text-align: right; }\n#mod-finanzen .field-group-label{ font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted-2); margin: 0 0 -4px; font-weight: 600; }\n#mod-finanzen .urlaub-year-head{ margin-top: 22px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.045); }\n#mod-finanzen .urlaub-year-head.first-year{ border-top: none; margin-top: 4px; padding-top: 0; }\n#mod-finanzen .uy-konto-head{ margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--stroke); }\n#mod-finanzen .uy-konto-head span{ font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--petrol); font-weight: 700; display: block; margin-bottom: 4px; }\n#mod-finanzen .uy-konto-head b{ font-size: 1.2rem; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: -0.03em; display: block; }\n#mod-finanzen .uy-konto-sub{ display: flex; justify-content: space-between; align-items: baseline; font-size: 0.78rem; color: var(--muted); margin-top: 6px; }\n#mod-finanzen .uy-konto-sub b{ font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }\n#mod-finanzen .uy-konto-sub.negative b{ color: var(--danger); }\n#mod-finanzen .uy-konto-hint{ font-size: 0.72rem; color: var(--muted-2); margin-top: 10px; line-height: 1.4; }\n#mod-finanzen .uy-section-label{ font-size: 1.05rem; letter-spacing: -0.01em; color: var(--text); font-weight: 700; margin: 34px 0 16px; padding-top: 28px; border-top: 2px solid var(--stroke-hi); }\n#mod-finanzen .uy-meta-pair{ display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 2px; }\n#mod-finanzen .uy-meta-pair .uy-mc{ display: inline-flex; align-items: baseline; gap: 6px; font-size: 0.72rem; line-height: 1.3; }\n#mod-finanzen .uy-meta-pair .uy-ml::after{ content: ' |'; }\n#mod-finanzen .kv-editable{ cursor: pointer; }\n#mod-finanzen .kv-input{ width: 128px; max-width: 70%; text-align: right; }\n#mod-finanzen .kv-saldo.manuell{ text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 3px; }\n#mod-finanzen .kv-manual{ color: var(--accent); margin-left: 5px; font-size: 0.9em; }\n#mod-finanzen .uy-konto-head + .uy-section-label{ margin-top: 0; padding-top: 0; border-top: none; }\n#mod-finanzen .kv-year{ font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-2); margin: 16px 0 6px; }\n#mod-finanzen .kv-month{ padding: 9px 0; border-top: 1px solid rgba(255,255,255,0.045); }\n#mod-finanzen .kv-head{ display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }\n#mod-finanzen .kv-mon{ font-size: 0.85rem; color: var(--text); font-weight: 600; }\n#mod-finanzen .kv-saldo{ font-size: 0.85rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }\n#mod-finanzen .kv-saldo.negative{ color: var(--danger); }\n#mod-finanzen .kv-move{ display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-size: 0.74rem; margin-top: 3px; }\n#mod-finanzen .kv-lbl{ color: var(--muted-2); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n#mod-finanzen .kv-in{ color: var(--green); font-variant-numeric: tabular-nums; flex-shrink: 0; }\n#mod-finanzen .kv-out{ color: var(--muted); font-variant-numeric: tabular-nums; flex-shrink: 0; }\n#mod-finanzen .urlaub-combined{ padding: 16px 18px; margin-bottom: 12px; }\n#mod-finanzen .uc-budget-row{ display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n#mod-finanzen .uc-divider{ height: 1px; background: var(--stroke); margin: 14px 0; }\n#mod-finanzen .ub-auto-val{ font-size: 0.95rem; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }\n#mod-finanzen .ub-label{ font-size: 0.78rem; color: var(--muted); }\n#mod-finanzen .ud-head{ display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n#mod-finanzen .ud-add{ background: none; border: none; color: var(--accent); font: inherit; font-size: 0.85rem; font-weight: 600; padding: 2px 0; cursor: pointer; }\n#mod-finanzen #deposit-list{ display: flex; flex-direction: column; }\n#mod-finanzen #deposit-list:not(:empty){ margin-top: 10px; gap: 8px; }\n#mod-finanzen .depo-row{ display: flex; align-items: center; gap: 10px; }\n#mod-finanzen .depo-main{ flex: 1 1 auto; min-width: 0; }\n#mod-finanzen .depo-when{ font-size: 0.9rem; color: var(--text); font-variant-numeric: tabular-nums; }\n#mod-finanzen .depo-note{ font-size: 0.74rem; color: var(--muted-2); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n#mod-finanzen .depo-amount{ font-size: 0.95rem; font-weight: 600; color: var(--text); font-variant-numeric: tabular-nums; }\n#mod-finanzen .depo-actions{ display: flex; gap: 2px; flex: 0 0 auto; }\n#mod-finanzen .uy-top{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 9px; }\n#mod-finanzen .uy-year{ font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--petrol); }\n#mod-finanzen .uy-remaining{ font-size: 0.95rem; font-weight: 600; color: var(--green); font-variant-numeric: tabular-nums; }\n#mod-finanzen .uy-remaining.negative{ color: var(--danger); }\n#mod-finanzen .uy-bar{ height: 4px; background: rgba(255,255,255,0.06); border-radius: var(--r-pill); overflow: hidden; margin-bottom: 6px; }\n#mod-finanzen .uy-bar-fill{ height: 100%; border-radius: var(--r-pill); background: var(--danger); transition: width 0.45s var(--ease-ios); }\n#mod-finanzen .uy-bar-fill.over{ background: var(--danger); }\n#mod-finanzen .uy-meta{ display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--muted-2); font-variant-numeric: tabular-nums; }\n#mod-finanzen .uy-meta-grid{ display: grid; grid-template-columns: 1fr 1fr; gap: 4px 18px; margin-bottom: 2px; }\n#mod-finanzen .uy-mc{ display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-size: 0.72rem; line-height: 1.3; }\n#mod-finanzen .uy-ml{ color: var(--muted-2); }\n#mod-finanzen .uy-mv{ color: var(--muted); font-variant-numeric: tabular-nums; }\n#mod-finanzen .uy-trips{ margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--stroke); display: flex; flex-direction: column; gap: 7px; }\n#mod-finanzen .uy-trip{ display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-size: 0.85rem; }\n#mod-finanzen .uy-trip-name{ color: var(--text); }\n#mod-finanzen .uy-trip-mon{ color: var(--muted); }\n#mod-finanzen .uy-trip-meta{ color: var(--muted); font-variant-numeric: tabular-nums; }\n#mod-finanzen .urlaub-year-label{ font-size: 0.8rem; font-weight: 600; color: var(--muted); margin: 12px 2px 6px; }\n#mod-finanzen .urlaub-year-label:first-child{ margin-top: 2px; }\n#mod-finanzen .btn-icon{ background: none; border: none; cursor: pointer; color: var(--muted-2); width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; transition: color 0.15s, background 0.15s; }\n#mod-finanzen .btn-icon svg{ width: 17px; height: 17px; }\n#mod-finanzen .btn-icon.edit:hover{ color: var(--accent); background: rgba(10,132,255,0.14); }\n#mod-finanzen .btn-icon.del:hover{ color: var(--danger); background: rgba(255,69,58,0.14); }\n#mod-finanzen .field{ margin-bottom: 0; }\n#mod-finanzen .field input[type=\"date\"]::-webkit-date-and-time-value{ text-align: left; margin: 0; }\n#mod-finanzen .f-dyn-group{ display: flex; flex-direction: column; gap: 14px; }\n#mod-finanzen .f-dyn-group:empty{ display: none; }\n#mod-finanzen .f-toggle .f-toggle-lab{white-space: nowrap}\n#mod-finanzen #urlaub-payments{ display: flex; flex-direction: column; gap: 8px; }\n#mod-finanzen .pay-row{ display: flex; gap: 8px; align-items: center; }\n#mod-finanzen .pay-row input{ padding: 10px 10px; font-size: 0.95rem; }\n#mod-finanzen .pay-row .pay-month{ flex: 0 0 52px; width: 52px; text-align: center; }\n#mod-finanzen .pay-row .pay-year{ flex: 0 0 64px; width: 64px; text-align: center; }\n#mod-finanzen .pay-row .pay-amount{ flex: 1 1 auto; min-width: 0; text-align: right; font-variant-numeric: tabular-nums; }\n#mod-finanzen .pay-del{ flex: 0 0 auto; background: none; border: none; color: var(--muted-2); padding: 6px; cursor: pointer; border-radius: 8px; line-height: 0; }\n#mod-finanzen .pay-del:hover{ color: var(--danger); }\n#mod-finanzen .pay-del svg{ width: 18px; height: 18px; display: block; }\n#mod-finanzen .btn-add-pay{ background: none; border: none; color: var(--accent); font: inherit; font-size: 0.85rem; font-weight: 600; padding: 8px 2px; cursor: pointer; }\n#mod-finanzen .pay-hint{ font-size: 0.8rem; color: var(--muted); margin-top: 6px; font-variant-numeric: tabular-nums; }\n#mod-finanzen .pay-hint b{ color: var(--text); font-weight: 600; }\n#mod-finanzen .pay-hint.over b{ color: var(--danger); }\n#mod-finanzen .btn-primary:hover{ opacity: 0.9; }\n#mod-finanzen .btn-secondary:hover{ background: rgba(255,255,255,0.12); }\n@media (max-width: 520px){\n#mod-finanzen .stat{ padding: 10px 8px; }\n#mod-finanzen .stat-value{ font-size: 0.95rem; }\n}\n@media (prefers-reduced-motion: reduce){\n#mod-finanzen *{ animation: none !important; transition: none !important; }\n}" + '</style>');
document.getElementById('mod-finanzen').insertAdjacentHTML('beforeend', "<div class=\"wrap\">\n  \n\n  <div class=\"app-header\"><button class=\"screen-back\" aria-label=\"Zurück\" onclick=\"closeModule()\">‹</button><span>Jörg's Finanzen</span></div>\n\n  <div class=\"income-bar glass\">\n    <div class=\"income-top\">\n      <div class=\"income-left\">\n        <span class=\"income-label\">Netto / Monat</span>\n        <div class=\"income-input-wrap\">\n          <input type=\"text\" id=\"income-input\" placeholder=\"z.B. 0,00\" oninput=\"onIncomeInput()\">\n          <span class=\"income-eur\">€</span>\n        </div>\n      </div>\n      <div class=\"income-right\">\n        <span class=\"income-label\">Verfügbar</span>\n        <span class=\"income-avail\" id=\"income-avail\">0,00 €</span>\n      </div>\n    </div>\n    <div class=\"income-meta\" id=\"income-meta\" onclick=\"openIncomeMeta()\"></div>\n  </div>\n\n  <!-- Einkommens-Details (nur Info, keine Logik) -->\n  <div class=\"overlay\" id=\"income-meta-overlay\" onclick=\"if(event.target===this)closeIncomeMeta()\">\n    <div class=\"modal\">\n      <div class=\"grabber\"></div>\n      <h2>Einkommen</h2>\n      <div style=\"display:flex;flex-direction:column;gap:14px\">\n        <div class=\"field\">\n          <label>Arbeitgeber</label>\n          <input type=\"text\" id=\"im-employer\" placeholder=\"z.B. Siemens\" autocomplete=\"off\">\n        </div>\n        <div class=\"field field-row\">\n          <div>\n            <label>Zieleinkommen</label>\n            <input type=\"text\" id=\"im-target\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n          <div>\n            <label>Brutto / Monat</label>\n            <input type=\"text\" id=\"im-gross-m\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n        </div>\n        <div class=\"field field-row\">\n          <div>\n            <label>Brutto / Jahr</label>\n            <input type=\"text\" id=\"im-gross-y\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n          <div>\n            <label>Bonus</label>\n            <input type=\"text\" id=\"im-bonus\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n        </div>\n        <div class=\"field field-row\">\n          <div>\n            <label>Altersvorsorge</label>\n            <input type=\"text\" id=\"im-pension\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n          <div>\n            <label>Aktien</label>\n            <input type=\"text\" id=\"im-stocks\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n        </div>\n      </div>\n      <div class=\"modal-actions\">\n        <button class=\"btn btn-secondary\" onclick=\"closeIncomeMeta()\">Abbrechen</button>\n        <button class=\"btn btn-primary\" onclick=\"saveIncomeMeta()\">Speichern</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Hero: Gesamtvermögen -->\n  <div class=\"hero\" id=\"hero\" onclick=\"openDetail('uebersicht')\">\n    <div class=\"hero-label\">Gesamtvermögen</div>\n    <div class=\"hero-val\" id=\"hero-val\">–</div>\n    <div class=\"hero-delta\" id=\"hero-delta\" style=\"display:none\"></div>\n    <div id=\"hero-spark\"></div>\n    <span class=\"hero-sub\" id=\"hero-sub\"></span>\n  </div>\n\n  <!-- Bento: Kennzahlen auf einen Blick -->\n  <div class=\"tag\" id=\"bento-tag\" style=\"display:none\">Auf einen Blick</div>\n  <div class=\"bento\" id=\"bento\" style=\"display:none\"></div>\n\n  <!-- Detail-Ansichten: werden über die Bento-Kacheln geöffnet (alle Render-Ziele unverändert) -->\n  <div class=\"detail-sheet\" id=\"detail-sheet\">\n    <div class=\"settings-topbar\">\n      <button class=\"settings-back\" aria-label=\"Zurück\" onclick=\"closeDetail()\">‹</button>\n      <h2 id=\"detail-title\">Details</h2>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-uebersicht\">\n      <div class=\"dashboard glass\" id=\"dashboard\">\n        <div class=\"uy-konto-head\">\n          <span>Gesamtvermögen</span>\n          <b id=\"wealth-val\">–</b>\n          <span class=\"wealth-sub-row\"><span class=\"saverate-eur\" id=\"wealth-sub\"></span><button class=\"info-i\" aria-label=\"Info\" onclick=\"showWealthInfo()\">i</button></span>\n        </div>\n        <div class=\"dash-accounts\" style=\"margin-top:0;border-top:none;padding-top:0\">\n          <div class=\"dash-sub-label\">Ausgaben nach Kategorie</div>\n          <div class=\"dash-grid\">\n            <div class=\"dash-donut\">\n              <svg viewBox=\"0 0 120 120\" id=\"donut-svg\" width=\"100\" height=\"100\"></svg>\n              <div class=\"donut-center\">\n                <span class=\"donut-center-label\">Netto</span>\n                <span class=\"donut-center-val\" id=\"donut-center-val\">–</span>\n              </div>\n            </div>\n            <div class=\"dash-legend\" id=\"dash-legend\"></div>\n          </div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-wealth-hist\" style=\"display:none\">\n          <div class=\"hist-head\"><span class=\"dash-sub-label\">Gesamtvermögensverlauf</span><span class=\"hist-range-ctl\" data-target=\"wealth\"></span></div>\n          <div id=\"wealth-hist-chart\"></div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-balances\">\n          <div class=\"dash-sub-label\">Kontostände</div>\n          <div id=\"balance-bars\"></div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-saverates\" style=\"display:none\">\n          <div class=\"dash-sub-label\">Sparquoten</div>\n          <div id=\"saverate-bars\"></div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-accounts\">\n          <div class=\"dash-sub-label\">Ausgaben nach Konto</div>\n          <div id=\"account-bars\"></div>\n        </div>\n      </div>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-a\">\n      <div class=\"av-dash glass\" id=\"av-dash\">\n        <div id=\"av-kontostand\"></div>\n        <div id=\"av-table\"></div>\n      </div>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-urlaub\">\n      <div class=\"av-dash glass\" id=\"urlaub-dash\">\n        <div id=\"urlaub-dash-body\"></div>\n      </div>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-v\">\n      <div class=\"av-dash glass\" id=\"vertrag-dash\">\n        <div id=\"vertrag-dash-body\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"income-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('b')\">\n    <div class=\"sub-header-text\">\n      <h1>Konsum, Urlaub &amp; Sparen</h1>\n      <p>Sparpläne und monatliche Budgets im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-b\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-b\">\n  <div class=\"filter-row\">\n    <select class=\"account-filter\" id=\"filter-b\" onchange=\"renderSection('b')\"></select>\n  </div>\n  <div class=\"summary glass\">\n    <div class=\"stat\"><div class=\"stat-label\">Monatlich</div><div class=\"stat-value month\" id=\"sum-month-b\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Jährlich</div><div class=\"stat-value year\" id=\"sum-year-b\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Einträge</div><div class=\"stat-value count\" id=\"sum-count-b\">0</div></div>\n  </div>\n  <div class=\"balance-box glass\" id=\"balance-box-b\" style=\"display:none\"></div>\n\n  <div class=\"section-label\">Konsum, Urlaub &amp; Sparen</div>\n  <div class=\"list\" id=\"list-b\"></div>\n  <div class=\"empty\" id=\"empty-b\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"finOpenModal('b')\">＋ Eintrag hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('a')\">\n    <div class=\"sub-header-text\">\n      <h1>Altersvorsorge</h1>\n      <p>Vorsorge und Rente im Blick · Renteneintrittsalter 67</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-a\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-a\">\n  <div class=\"filter-row\">\n    <select class=\"account-filter\" id=\"filter-a\" onchange=\"renderSection('a')\"></select>\n  </div>\n  <div class=\"summary glass\">\n    <div class=\"stat\"><div class=\"stat-label\">Monatlich</div><div class=\"stat-value month\" id=\"sum-month-a\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Jährlich</div><div class=\"stat-value year\" id=\"sum-year-a\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Einträge</div><div class=\"stat-value count\" id=\"sum-count-a\">0</div></div>\n  </div>\n\n  <div class=\"section-label\">Altersvorsorge</div>\n  <div class=\"list\" id=\"list-a\"></div>\n  <div class=\"empty\" id=\"empty-a\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"finOpenModal('a')\">＋ Eintrag hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('v')\">\n    <div class=\"sub-header-text\">\n      <h1>Versicherungen &amp; Verträge</h1>\n      <p>Alle laufenden Ausgaben im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-v\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-v\">\n  <div class=\"filter-row\">\n    <select class=\"account-filter\" id=\"filter-v\" onchange=\"renderSection('v')\"></select>\n  </div>\n  <div class=\"summary glass\">\n    <div class=\"stat\"><div class=\"stat-label\">Monatlich</div><div class=\"stat-value month\" id=\"sum-month\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Jährlich</div><div class=\"stat-value year\" id=\"sum-year\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Einträge</div><div class=\"stat-value count\" id=\"sum-count\">0</div></div>\n  </div>\n\n  <div class=\"section-label\">Versicherungen &amp; Verträge</div>\n  <div class=\"list\" id=\"list-v\"></div>\n  <div class=\"empty\" id=\"empty-v\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"finOpenModal('v')\">＋ Eintrag hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('urlaub')\">\n    <div class=\"sub-header-text\">\n      <h1>Urlaube</h1>\n      <p>Geplante Reisen &amp; Jahresbudget im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-urlaub\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-urlaub\">\n  <div class=\"section-label\">Urlaube</div>\n  <div class=\"urlaub-combined glass\">\n    <div class=\"uc-budget-row\">\n      <span class=\"ub-label\">Jahresbudget (pro Jahr)</span>\n      <span class=\"ub-auto-val\" id=\"urlaub-budget-auto\">0,00 €</span>\n    </div>\n    <div class=\"uc-divider\"></div>\n    <div class=\"ud-head\">\n      <span class=\"ub-label\">Einmaleinzahlungen</span>\n      <button class=\"ud-add\" onclick=\"openDepositModal()\">＋ Einzahlung</button>\n    </div>\n    <div id=\"deposit-list\"></div>\n    <div class=\"uc-divider\"></div>\n    <div class=\"ud-head\">\n      <span class=\"ub-label\">Urlaubstage</span>\n      <button class=\"ud-add\" onclick=\"openManualDayModal()\">＋ Urlaubstag</button>\n    </div>\n    <div id=\"manual-day-list\"></div>\n  </div>\n  <div id=\"urlaub-years\"></div>\n  <div class=\"empty\" id=\"empty-urlaub\" style=\"display:none\">Noch keine Urlaube geplant. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"openUrlaubModal()\">＋ Urlaub hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('bonus')\">\n    <div class=\"sub-header-text\">\n      <h1>Bonusprogramme</h1>\n      <p>Punkte, Meilen &amp; Verfall im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-bonus\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-bonus\">\n  <div class=\"section-label\">Bonusprogramme</div>\n  <div class=\"list\" id=\"list-bonus\"></div>\n  <div class=\"empty\" id=\"empty-bonus\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"openBonusModal()\">＋ Eintrag hinzufügen</button>\n  </div>\n\n\n\n</div>\n\n<!-- Vollbild-Einstellungen (Zahnrad) -->\n\n\n<!-- Custom dialog (works where native confirm/alert are blocked) -->\n\n\n<div class=\"overlay\" id=\"overlay\" onclick=\"closeIfBg(event)\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"modal-title\">Neuer Eintrag</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Name</label>\n      <input type=\"text\" id=\"f-name\" placeholder=\"z.B. Netflix\" autocomplete=\"off\">\n    </div>\n    <div class=\"field field-row\" id=\"f-prov-acct-row\">\n      <div id=\"f-provider-wrap\">\n        <label id=\"f-provider-label\">Anbieter (optional)</label>\n        <input type=\"text\" id=\"f-provider\" placeholder=\"z.B. Allianz\" autocomplete=\"off\">\n      </div>\n      <div id=\"f-extra-wrap\">\n        <label id=\"f-extra-label\">Vertragsnummer (optional)</label>\n        <input type=\"text\" id=\"f-extra-input\" placeholder=\"—\" autocomplete=\"off\">\n        <select id=\"f-extra-select\" style=\"display:none\"></select>\n      </div>\n    </div>\n    <div class=\"field field-row\">\n      <div>\n        <label>Betrag</label>\n        <input type=\"text\" id=\"f-amount\" placeholder=\"z.B. 1.000,00 €\">\n      </div>\n      <div id=\"f-period-wrap\">\n        <label>Intervall</label>\n        <select id=\"f-period\">\n          <option value=\"monatlich\">Monatlich</option>\n          <option value=\"jährlich\">Jährlich</option>\n          <option value=\"vierteljährlich\">Vierteljährlich</option>\n          <option value=\"wöchentlich\">Wöchentlich</option>\n        </select>\n      </div>\n      <div id=\"f-amount-value-wrap\" style=\"display:none\">\n        <label id=\"f-amount-value-label\"></label>\n        <input type=\"text\" id=\"f-amount-value-input\" placeholder=\"\" autocomplete=\"transaction-amount\">\n      </div>\n    </div>\n    <div class=\"field field-row\" id=\"f-cat-extra-row\">\n      <div>\n        <label>Konto</label>\n        <select id=\"f-account\">\n          <option value=\"\">— kein Konto —</option>\n          <option>DB Giro</option>\n          <option>DB Spar</option>\n          <option>DB ROBIN</option>\n          <option>DKB Giro</option>\n          <option>Scalable Broker</option>\n          <option>Scalable Wealth (Weltreise)</option>\n          <option>Scalable Tagesgeld</option>\n          <option>EquatePlus</option>\n        </select>\n      </div>\n      <div>\n        <label>Kategorie</label>\n        <select id=\"f-cat\"></select>\n      </div>\n    </div>\n    <div id=\"f-values\" class=\"f-dyn-group\"></div>\n    <div class=\"field field-row\" id=\"f-units-projtype-row\" style=\"display:none\">\n      <div id=\"f-units-wrap\" style=\"display:none\">\n        <label id=\"f-units-label\">Einheiten (optional)</label>\n        <input type=\"text\" id=\"f-units-input\" placeholder=\"z.B. 12 Stück\" autocomplete=\"off\">\n      </div>\n      <div id=\"f-projtype\" style=\"display:none\">\n        <label>Art der Beträge</label>\n        <select id=\"f-projtype-select\">\n          <option value=\"einmal\">Einmalbetrag</option>\n          <option value=\"monatlich\">Monatlich</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"field f-toggle\" id=\"f-autogrow-wrap\" style=\"display:none\">\n      <input type=\"checkbox\" id=\"f-autogrow\" class=\"f-toggle-cb\">\n      <label class=\"f-toggle-lab\" for=\"f-autogrow\">Stand monatlich automatisch erhöhen</label>\n    </div>\n    <div id=\"f-growth\" class=\"f-dyn-group\"></div>\n    <div id=\"f-texts\" class=\"f-dyn-group\"></div>\n    </div><!-- end gap wrapper -->\n    <button type=\"button\" class=\"add-btn\" id=\"btn-duplicate\" style=\"display:none\" onclick=\"duplicateEntry()\">⧉ Eintrag duplizieren</button>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" id=\"cancel-btn\" onclick=\"finCloseModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" id=\"save-btn\" onclick=\"saveEntry()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"bonus-overlay\" onclick=\"if(event.target===this)closeBonusModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"bonus-title\">Neues Bonusprogramm</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Bonusprogramm</label>\n      <input type=\"text\" id=\"bonus-name\" placeholder=\"z.B. Miles & More\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Punkte / Meilen</label>\n      <input type=\"text\" id=\"bonus-points\" placeholder=\"z.B. 25.000 Meilen\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Verfall</label>\n      <input type=\"text\" id=\"bonus-expiry\" placeholder=\"z.B. 31.12.2026\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"autoDate(this)\" onblur=\"fixDate(this)\">\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeBonusModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveBonus()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"urlaub-overlay\" onclick=\"if(event.target===this)closeUrlaubModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"urlaub-title\">Neuer Urlaub</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Reiseziel / Name</label>\n      <input type=\"text\" id=\"urlaub-name\" placeholder=\"z.B. Namibia\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Land (für die Karte)</label>\n      <input type=\"text\" id=\"urlaub-country\" placeholder=\"z.B. Namibia\" autocomplete=\"off\" list=\"country-list\">\n      <datalist id=\"country-list\"></datalist>\n    </div>\n    <div class=\"field field-row\">\n      <div>\n        <label>Von</label>\n        <input type=\"text\" id=\"urlaub-from\" placeholder=\"TT.MM.JJJJ\" autocomplete=\"off\" inputmode=\"decimal\" oninput=\"autoDate(this)\" onblur=\"fixDate(this);checkUrlaubYearSpan()\">\n      </div>\n      <div>\n        <label>Bis</label>\n        <input type=\"text\" id=\"urlaub-to\" placeholder=\"TT.MM.JJJJ\" autocomplete=\"off\" inputmode=\"decimal\" oninput=\"autoDate(this)\" onblur=\"fixDate(this);checkUrlaubYearSpan()\">\n      </div>\n    </div>\n    <div class=\"field field-row\" id=\"urlaub-split-row\" style=\"display:none\">\n      <div>\n        <label id=\"urlaub-split-label-1\">Urlaubstage Jahr 1</label>\n        <input type=\"text\" id=\"urlaub-days-y1\" placeholder=\"z.B. 3\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"updateUrlaubDaysTotal()\">\n      </div>\n      <div>\n        <label id=\"urlaub-split-label-2\">Urlaubstage Jahr 2</label>\n        <input type=\"text\" id=\"urlaub-days-y2\" placeholder=\"z.B. 7\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"updateUrlaubDaysTotal()\">\n      </div>\n    </div>\n    <div class=\"field field-row\">\n      <div id=\"urlaub-days-wrap\">\n        <label>Verbrauchte Urlaubstage</label>\n        <input type=\"text\" id=\"urlaub-days\" placeholder=\"z.B. 10\" inputmode=\"decimal\" autocomplete=\"off\">\n      </div>\n      <div id=\"urlaub-budget-year-field\" style=\"display:none\">\n        <label>Budget-Jahr</label>\n        <select id=\"urlaub-budget-year\"></select>\n      </div>\n      <div>\n        <label>Gesamtkosten</label>\n        <input type=\"text\" id=\"urlaub-cost\" placeholder=\"z.B. 1.000,00 €\" autocomplete=\"transaction-amount\" oninput=\"updatePayHint()\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Anzahlungen (optional)</label>\n      <div id=\"urlaub-payments\"></div>\n      <button type=\"button\" class=\"btn-add-pay\" onclick=\"addPaymentRow()\">+ Anzahlung hinzufügen</button>\n      <div class=\"pay-hint\" id=\"urlaub-pay-hint\"></div>\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeUrlaubModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveUrlaub()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"deposit-overlay\" onclick=\"if(event.target===this)closeDepositModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"deposit-title\">Neue Einzahlung</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field field-row\">\n      <div>\n        <label>Jahr</label>\n        <input type=\"text\" id=\"deposit-year\" placeholder=\"z.B. 2026\" autocomplete=\"off\" inputmode=\"numeric\">\n      </div>\n      <div>\n        <label>Monat</label>\n        <input type=\"text\" id=\"deposit-month\" placeholder=\"z.B. 01\" autocomplete=\"off\" inputmode=\"numeric\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Betrag</label>\n      <input type=\"text\" id=\"deposit-amount\" placeholder=\"z.B. 1.000,00 €\" autocomplete=\"transaction-amount\">\n    </div>\n    <div class=\"field\">\n      <label>Notiz (optional)</label>\n      <input type=\"text\" id=\"deposit-note\" placeholder=\"z.B. Bonus, Defizitausgleich\" autocomplete=\"off\">\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeDepositModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveDeposit()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"manual-day-overlay\" onclick=\"if(event.target===this)closeManualDayModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"manual-day-title\">Neuer Urlaubstag</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Datum</label>\n      <input type=\"text\" id=\"manual-day-date\" placeholder=\"TT.MM.JJJJ\" autocomplete=\"off\" inputmode=\"decimal\" oninput=\"autoDate(this)\" onblur=\"fixDate(this)\">\n    </div>\n    <div class=\"field\">\n      <label>Tage</label>\n      <input type=\"text\" id=\"manual-day-count\" placeholder=\"z.B. 1\" inputmode=\"decimal\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Notiz (optional)</label>\n      <input type=\"text\" id=\"manual-day-note\" placeholder=\"z.B. Brückentag\" autocomplete=\"off\">\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeManualDayModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveManualDay()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n");



/* Einmalige, nicht-destruktive Migration: bestehende Keys ohne Präfix auf 'fin_' kopieren.
   Läuft VOR dem ersten Datenzugriff. Alte Keys bleiben als Sicherheitskopie erhalten. */
(function migrateKeyPrefix(){
  if (!store.persistent) return;
  const ls = window.localStorage;
  const keys = ['abos_v1','budgets_v1','altersvorsorge_v1','income_v1','bonus_v1','urlaube_v1','urlaub_budget_v1','urlaub_deposits_v1','urlaub_rate_hist_v1','history_v1','income_meta_v1','av_view_mode_v1','hist_range_v1','collapsed_sections_v1','cloud_backup_v1','applock_v1'];
  for (const k of keys){
    try { if (ls.getItem('fin_'+k) === null && ls.getItem(k) !== null) ls.setItem('fin_'+k, ls.getItem(k)); } catch(e){}
  }
})();

// Per-section configuration
const SECTIONS = {
  v: {
    storageKey: 'abos_v1',
    cats: ['Abonnement','Versicherung','Verein','Vertrag'],
    defaultCat: 'Abonnement',
    providerLabel: 'Anbieter (optional)',
    providerPlaceholder: 'z.B. Allianz',
    showPeriod: true,
    extra: { kind: 'text', label: 'Vertragsnummer (optional)', placeholder: '—' },
    textFields: [
      { key:'startDate', label:'Stichtag (optional)', placeholder:'z.B. TT.MM.JJJJ', display:'Stichtag', half:true, date:true, iso:true },
      { key:'noticePeriod', label:'Kündigungsfrist (optional)', placeholder:'z.B. 4 Monate', display:'Kündigungsfrist', half:true },
      { key:'debitDate', label:'Abbuchungsdatum (optional)', placeholder:'z.B. TT.MM.JJJJ', display:'Abbuchung', half:true, date:true },
      { key:'benefit', label:'Leistung (optional)', placeholder:'z.B. 1.000,00 €', display:'Leistung', kind:'money', half:true }
    ],
    namePlaceholder: 'z.B. Netflix',
    showYearlyPerEntry: true,
    ids: { list:'list-v', empty:'empty-v', month:'sum-month', year:'sum-year', count:'sum-count' }
  },
  b: {
    storageKey: 'budgets_v1',
    cats: ['Urlaub','Konsum','Sparen'],
    defaultCat: 'Sparen',
    hideProvider: true,
    providerLabel: 'Bezeichnung (optional)',
    providerPlaceholder: 'z.B. Sparkonto DKB',
    showPeriod: false,           // always monthly
    fixedPeriod: 'monatlich',
    namePlaceholder: 'z.B. Notgroschen',
    showYearlyPerEntry: true,
    autoGrowOption: true,        // Schalter „Stand monatlich automatisch erhöhen" anbieten
    amountWithValue: 'balance',  // Betrag + Stand in einer Zeile
    valueFields: [
      { key:'balance', label:'Aktueller Stand', placeholder:'z.B. 1.000,00 €', display:'Stand', color:'now' }
    ],
    ids: { list:'list-b', empty:'empty-b', month:'sum-month-b', year:'sum-year-b', count:'sum-count-b' }
  },
  a: {
    storageKey: 'altersvorsorge_v1',
    cats: ['Gesetzlich','Betrieblich','Privat'],
    defaultCat: 'Privat',
    providerLabel: 'Anbieter (optional)',
    providerPlaceholder: 'z.B. Allianz',
    showPeriod: true,
    extra: { kind: 'text', label: 'Vertragsnummer (optional)', placeholder: '—' },
    namePlaceholder: 'z.B. Riester-Rente',
    showYearlyPerEntry: true,
    unitsField: { key: 'units', label: 'Einheiten (optional)', placeholder: 'z.B. 12 Stück oder 65,3 Punkte' },
    valueFields: [
      { key:'current',   label:'Aktueller Wert',     placeholder:'z.B. 1.000,00 €', display:'Aktuell', color:'now', row:true },
      { key:'projected', label:'Bei Renteneintritt', placeholder:'z.B. 1.000,00 €', display:'Rente',   color:'end', row:true }
    ],
    projectedTypeField: true,
    growthFields: [
      { key:'growth1', label:'bei 1 %', placeholder:'z.B. 1.000,00 €', display:'1 %' },
      { key:'growth2', label:'bei 2 %', placeholder:'z.B. 1.000,00 €', display:'2 %' },
      { key:'growth3', label:'bei 3 %', placeholder:'z.B. 1.000,00 €', display:'3 %' }
    ],
    ids: { list:'list-a', empty:'empty-a', month:'sum-month-a', year:'sum-year-a', count:'sum-count-a' }
  }
};

const ACCOUNTS = ['DB Giro','DB Spar','DB ROBIN','DKB Giro','Scalable Broker','Scalable Wealth (Weltreise)','Scalable Tagesgeld','EquatePlus'];
const isGiro = e => /giro/i.test(e.account || '');   // Girokonto = Kontoname enthält "Giro" (aus Vermögen & Sparquote ausgenommen)
// Kontoname -> CSS-sicherer Slug für Pill-Farbe
const acctSlug = name => (name || '').replace(/[^a-zA-Z0-9]/g, '');
const INCOME_KEY = 'income_v1';
const BONUS_KEY = 'bonus_v1';
const URLAUB_KEY = 'urlaube_v1';
const URLAUB_BUDGET_KEY = 'urlaub_budget_v1';
const URLAUB_DEPOSITS_KEY = 'urlaub_deposits_v1';
const URLAUB_MANUAL_DAYS_KEY = 'urlaub_manual_days_v1';
const URLAUB_KONTO_OVERRIDE_KEY = 'urlaub_konto_override_v1';

// Sicheres Parsen: korrupte Storage-Daten crashen nicht die App, sondern fallen auf den Default zurück

let data = {
  v: safeParse(store.get(SECTIONS.v.storageKey), []),
  b: safeParse(store.get(SECTIONS.b.storageKey), []),
  a: safeParse(store.get(SECTIONS.a.storageKey), [])
};

let income = parseFloat(store.get(INCOME_KEY) || '0') || 0;
let bonus = safeParse(store.get(BONUS_KEY), []);
let editBonusId = null;
let urlaube = safeParse(store.get(URLAUB_KEY), []);
let urlaubBudget = parseFloat(store.get(URLAUB_BUDGET_KEY) || '0') || 0;  // wird automatisch aus "Urlaub I" berechnet
let urlaubDeposits = safeParse(store.get(URLAUB_DEPOSITS_KEY), []);
let manuelleUrlaubstage = safeParse(store.get(URLAUB_MANUAL_DAYS_KEY), []);
if (!Array.isArray(manuelleUrlaubstage)) manuelleUrlaubstage = [];
/* Manuell gesetzte Monats-Endsalden im Kontoverlauf, Schluessel = Jahr*12+Monatsindex.
   Ein Eintrag wirkt als Ankerpunkt: ab dort rechnet die Automatik wieder normal weiter. */
let urlaubKontoOverrides = safeParse(store.get(URLAUB_KONTO_OVERRIDE_KEY), {});
if (!urlaubKontoOverrides || typeof urlaubKontoOverrides !== 'object' || Array.isArray(urlaubKontoOverrides)) urlaubKontoOverrides = {};
let editManualDayId = null;
/* Manuell erfasste Urlaubstage ohne Reise (z.B. Brueckentage), summiert nach Jahr. */
function manuelleTageJahr(j) {
  return manuelleUrlaubstage
    .filter(m => m.date && m.date.slice(0, 4) === String(j))
    .reduce((s, m) => s + (Number(m.days) || 0), 0);
}
let editUrlaubId = null;
let editDepositId = null;

let editId = null;
let activeSection = 'v';

// fmt und fmtShort kommen aus dem Kern (index.html).

// Parse German-style money input -> number or null
// Handles "12.000,50" (de), "12000.5" (en), "3.000" (de thousands), "1500"


// Formatiert ein Eingabefeld bei Verlassen auf "1.234,56 €" (leer bleibt leer)

// Hängt Auto-Format an ein Money-Input (on blur)


function toMonthly(a, p) {
  if (p === 'monatlich') return a;
  if (p === 'jährlich') return a / 12;
  if (p === 'vierteljährlich') return a / 3;
  if (p === 'wöchentlich') return a * 4.33;
  return a;
}

// --- Retirement projection (private pension) ---
const BIRTH_DATE = new Date(1988, 0, 13);   // 13.01.1988
const RETIREMENT_AGE = 67;

// Months from now until 67th birthday (0 if already reached)
function monthsToRetirement() {
  const now = new Date();
  const ret = new Date(BIRTH_DATE.getFullYear() + RETIREMENT_AGE, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate());
  let months = (ret.getFullYear() - now.getFullYear()) * 12 + (ret.getMonth() - now.getMonth());
  if (ret.getDate() < now.getDate()) months -= 1;
  return Math.max(0, months);
}

// Future value: current capital compounded + monthly contributions compounded, at annual rate over given months
function projectValue(current, monthlyContribution, annualRate, months) {
  const r = annualRate / 12;          // monthly rate
  const fvCurrent = current * Math.pow(1 + r, months);
  let fvContrib;
  if (r === 0) fvContrib = monthlyContribution * months;
  else fvContrib = monthlyContribution * ((Math.pow(1 + r, months) - 1) / r);
  return fvCurrent + fvContrib;
}

// Returns [{rate, value}] scenarios for a private-pension entry

// --- Inflation assumption (editable, persisted) ---
let avViewMode = store.get('av_view_mode_v1') || 'nominal';  // 'nominal' | 'real'

// --- Monthly history snapshots (auto, on app open) ---
const HISTORY_KEY = 'history_v1';
let history = safeParse(store.get(HISTORY_KEY), []);  // [{ ym:'2026-06', wealth, pension }]

function currentWealthSnapshot() {
  const wealth = data.b.reduce((s,e) => s + (isGiro(e) ? 0 : (e.balance || 0)), 0)
               + data.a.reduce((s,e) => s + (e.cat === 'Privat' ? (e.current || 0) : 0), 0);
  const pension = data.a.reduce((s,e) => s + (e.current || 0), 0);
  return { wealth, pension };
}

// Records/refreshes the snapshot for the current month. Last write in a month wins,
// so the value always reflects the latest known balances for that month.
function recordSnapshot() {
  const now = new Date();
  const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const date = ym + '-' + String(now.getDate()).padStart(2, '0');  // Tages-Snapshot
  const snap = currentWealthSnapshot();
  if (snap.wealth === 0 && snap.pension === 0) return;
  const existing = history.find(h => h.date === date);
  if (existing) {
    existing.wealth = snap.wealth; existing.pension = snap.pension;
  } else {
    history.push({ ym, date, wealth: snap.wealth, pension: snap.pension });
  }
  history.sort((a,b) => String(a.date).localeCompare(String(b.date)));
  history = history.slice(-1100);  // ~3 Jahre Tageswerte
  store.set(HISTORY_KEY, JSON.stringify(history));
}
function histDate(h) { return h.date || (h.ym + '-01'); }

// Renders a simple SVG line chart. series = [{points:[v,...], color, label}]
// Zeitraum-Auswahl für Verlaufs-Charts (6M / 1J / Alle), geteilt für beide Charts
let histRange = store.get('hist_range_v1') || 'all';
function histLabel(h) {
  const d = histDate(h);
  return d.slice(8,10) + '.' + d.slice(5,7) + '.';
}
function histSlice(arr) {
  if (histRange === 'all') return arr;
  const cut = new Date();
  cut.setMonth(cut.getMonth() - (histRange === '6m' ? 6 : 12));
  const cs = cut.toISOString().slice(0,10);
  return arr.filter(h => histDate(h) >= cs);
}
function setHistRange(r) {
  histRange = r;
  store.set('hist_range_v1', r);
  renderHistRangeCtls();
  renderDashboard();
  if (typeof renderPensionHistory === 'function') renderPensionHistory();
}
function renderHistRangeCtls() {
  document.querySelectorAll('.hist-range-ctl').forEach(el => {
    el.innerHTML = [['6m','6M'],['1y','1J'],['all','Alle']].map(([v,l]) =>
      `<button type="button" class="hist-range-btn${histRange===v?' active':''}" onclick="setHistRange('${v}')">${l}</button>`
    ).join('');
  });
}

function renderHistoryChart(containerId, labels, series, opts) {
  const el = $(containerId);
  if (!el) return;
  // Beim Gesamtvermoegensverlauf ist die Zeitraum-/Wertzeile unter dem Graph nicht
  // erwuenscht (die Zahlen stehen dort ohnehin schon darueber). Andere Verlaeufe behalten sie.
  const showRange = !(opts && opts.hideRange);
  const n = labels.length;
  if (n < 1) {
    el.innerHTML = '<div class="hist-empty">Noch kein Stand erfasst. Trage deine Kontostände bzw. aktuellen Vorsorgewerte ein.</div>';
    return;
  }
  if (n === 1) {
    // Einzelner Startwert: Punkt + aktueller Betrag; echter Verlauf folgt ab dem 2. Monat
    const W = 300, H = 90, yMid = H / 2;
    let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="hist-svg">`;
    svg += `<line x1="0" y1="${yMid}" x2="${W}" y2="${yMid}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    series.forEach(s => { svg += `<circle cx="${(W/2).toFixed(1)}" cy="${yMid}" r="3" fill="${s.color}"/>`; });
    svg += `</svg>`;
    el.innerHTML = svg + (showRange ? `<div class="hist-range">Startwert ${labels[0]}: ${fmtShort(series[0].points[0])} · Verlauf ab dem 2. Tag</div>` : '');
    return;
  }
  const W = 300, H = 90, padL = 4, padR = 4, padT = 8, padB = 4;
  const all = series.flatMap(s => s.points).filter(v => v != null);
  // Skala an Datenspanne (nicht ab 0), mit 10% Puffer — sonst wirken kleine Änderungen unsichtbar flach
  let dMin = Math.min(...all), dMax = Math.max(...all);
  if (dMax === dMin) { const b = Math.abs(dMax) * 0.01 || 1; dMin -= b; dMax += b; }
  const bandPad = (dMax - dMin) * 0.1;
  const min = dMin - bandPad, max = dMax + bandPad;
  const range = max - min || 1;
  const xAt = i => padL + (i / (n - 1)) * (W - padL - padR);
  const yAt = v => padT + (1 - (v - min) / range) * (H - padT - padB);
  let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="hist-svg">`;
  // Dezente Gitterlinien oben/Mitte/unten
  [yAt(max), yAt((max + min) / 2), yAt(min)].forEach(y => {
    svg += `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  });
  series.forEach(s => {
    const pts = s.points.map((v,i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
    svg += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    svg += `<circle cx="${xAt(n-1).toFixed(1)}" cy="${yAt(s.points[n-1]).toFixed(1)}" r="2.6" fill="${s.color}"/>`;
  });
  svg += `</svg>`;
  // Y-Achsenwerte als HTML-Spalte links (SVG-Text würde durch preserveAspectRatio verzerrt)
  const axis = `<div class="hist-axis"><span>${fmtShort(max)}</span><span>${fmtShort((max + min) / 2)}</span><span>${fmtShort(min)}</span></div>`;
  const s0 = series[0];
  const last = s0.points[n-1];
  el.innerHTML = `<div class="hist-plot">${axis}${svg}</div>` + (showRange ? `<div class="hist-range">${labels[0]} – ${labels[n-1]} · ${fmtShort(last)}</div>` : '');
}

// Adjust a nominal future value to its inflation-adjusted value (purchasing power today).
// Taxes are intentionally NOT modelled (too individual); values are after inflation, before tax.
function toRealValue(nominal) {
  if (avViewMode !== 'real' || !nominal) return nominal;
  const years = monthsToRetirement() / 12;
  return nominal / Math.pow(1 + 2.0 / 100, years);
}

// Gemeinsames Gerüst für swipebare Einträge (Haupteinträge, Bonus, Urlaub):
// Gerüst kommt aus dem Kern (swipeInnerHTML): Karte (main + right) plus Swipe-Buttons.
function entryCardHTML(mainHtml, rightHtml, onTap) {
  const tap = onTap ? ` onclick="${onTap}"` : '';
  return `<div class="entry glass"${tap}>
          <div class="entry-main">${mainHtml}</div>
          <div class="entry-right">${rightHtml}</div>
        </div>`;
}

function renderSection(sec) {
  const cfg = SECTIONS[sec];
  const filterEl = $('filter-' + sec);
  const acctFilter = filterEl ? filterEl.value : '';
  const entries = acctFilter ? data[sec].filter(e => (e.account || '') === acctFilter) : data[sec];
  const list = $(cfg.ids.list);
  const empty = $(cfg.ids.empty);
  list.innerHTML = '';
  if (!entries.length) {
    empty.style.display = 'block';
    empty.textContent = acctFilter
      ? `Keine Einträge für „${acctFilter}".`
      : 'Noch keine Einträge. Tippe unten, um zu beginnen.';
  } else {
    empty.style.display = 'none';
  }

  let monthTotal = 0;
  entries.forEach(e => monthTotal += toMonthly(e.amount, e.period));
  $(cfg.ids.month).textContent = fmt(monthTotal);
  $(cfg.ids.year).textContent  = fmt(monthTotal * 12);
  $(cfg.ids.count).textContent = entries.length;

  // Balance breakdown box (sections that track a 'balance' value, when a single account is selected)
  const hasBalance = (cfg.valueFields || []).some(f => f.key === 'balance');
  if (hasBalance) {
    const box = $('balance-box-b');
    if (acctFilter) {
      const rows = entries.filter(e => e.balance != null);
      const total = rows.reduce((s,e) => s + e.balance, 0);
      if (rows.length) {
        const items = rows.sort((a,b)=>b.balance-a.balance).map(e =>
          `<div class="bb-row"><span class="bb-name">${esc(e.name)}</span><span class="bb-val">${fmt(e.balance)}</span></div>`).join('');
        box.innerHTML = `<div class="bb-head"><span>Kontostand ${esc(acctFilter)}</span><span class="bb-total">${fmt(total)}</span></div>${items}`;
        box.style.display = '';
      } else {
        box.style.display = 'none';
      }
    } else {
      box.style.display = 'none';
    }
  }

  const catOrder = cfg.cats || [];
  [...entries]
    .sort((a,b) => {
      const ci = catOrder.indexOf(a.cat) - catOrder.indexOf(b.cat);
      return ci !== 0 ? ci : a.name.localeCompare(b.name, 'de');
    })
    .forEach(e => {
    const subLines = [];
    const extraVal = e.extra ?? e.contract;
    // Vertragsnummer nur zeigen, wenn die Sektion ein extra-Feld kennt (nicht bei Konsum/Urlaub/Sparen)
    if (extraVal && cfg.extra && !cfg.hideExtraInList) subLines.push('Vertragsnummer: ' + esc(extraVal));
    const yearly = cfg.showYearlyPerEntry
      ? `<div class="entry-yearly">${fmt(toMonthly(e.amount, e.period) * 12)} / Jahr</div>`
      : '';
    let valuesHtml = '';
    // Optionales "Einheiten"-Feld (z.B. Aktien-Stückzahl, Rentenpunkte) statt Aktuell/Rente
    if (cfg.unitsField && e[cfg.unitsField.key]) {
      valuesHtml = `<div class="entry-pension"><span class="pv-date">${esc(e[cfg.unitsField.key])}</span></div>`;
    }
    // textFields (außer dashOnly) in der Liste anzeigen
    const tfShown = (cfg.textFields || []).filter(f => e[f.key] != null && e[f.key] !== '' && !f.dashOnly);
    if (tfShown.length) {
      valuesHtml += `<div class="entry-pension">` + tfShown.map(f => {
        let val;
        if (f.kind === 'money') val = `${fmt(Number(e[f.key]))} (m)`;
        else if (f.key === 'startDate' || f.key === 'debitDate') val = displayDate(e[f.key]);
        else val = esc(e[f.key]);
        return `<span class="pv-date">${f.display}: ${val}</span>`;
      }).join('') + `</div>`;
    }
    const balanceLine = (sec === 'b' && e.balance != null)
      ? `<div class="entry-balance" onclick="event.stopPropagation(); startInlineBalance('b', '${e.id}', this)"><span>Stand:</span> <span>${fmt(e.balance)}</span></div>`
      : (sec === 'a' && e.cat === 'Privat' && e.current != null)
      ? `<div class="entry-balance" onclick="event.stopPropagation(); startInlineBalance('a', '${e.id}', this)"><span>Stand:</span> <span>${fmt(e.current)}</span></div>`
      : '';
    const acctPill = e.account
      ? `<span class="acct-pill acct-${acctSlug(e.account)}">${esc(e.account)}</span>`
      : '';
    const subLinesHtml = subLines.length
      ? `<div class="entry-sub">${subLines.map(l => `<div>${l}</div>`).join('')}</div>`
      : '';
    const nameHtml = e.provider
      ? `${esc(e.name)}<span class="entry-name-prov"> | ${esc(e.provider)}</span>`
      : esc(e.name);
    const div = swipeWrapEl(sec, e.id, entryCardHTML(
      `<div class="entry-name">${nameHtml}</div>
            <div class="entry-pills">
              <span class="cat-pill cat-${esc(e.cat)}">${esc(e.cat)}</span>
              ${acctPill}
            </div>
            ${subLinesHtml}
            ${balanceLine}
            ${valuesHtml}`,
      `<div class="entry-amount">${fmt(e.amount)}</div>
            <div class="entry-period">${esc(e.period)}</div>
            ${yearly}`,
      `finOpenModal('${sec}','${e.id}')`
    ));
    list.appendChild(div);
    attachSwipe(div, sec, e.id);
  });

  if (sec === 'a' && typeof renderAvDash === 'function') renderAvDash();
  if (sec === 'v' && typeof renderVertragDash === 'function') renderVertragDash();
}

// Swipe-Logik liegt im Kern (attachSwipeGeneric): tile-slider verschiebt sich nach links.
// "Tippen woanders schliesst die Zeile" erledigt der Kern bereits pro Zeile –
// ein eigener globaler Handler hier störte die Zurück-Geste (schloss die Zeile
// bei jedem Touch irgendwo im Dokument, auch beim Start der Geste).

function attachSwipe(wrap, sec, id) {
  attachSwipeGeneric(wrap, () => deleteEntry(sec, id), () => finOpenModal(sec, id));
}

function sectionMonthlyTotal(sec) {
  return data[sec].reduce((s,e) => s + toMonthly(e.amount, e.period), 0);
}

// Einkommens-Details (reine Info, keine Logik)
const INCOME_META_KEY = 'income_meta_v1';
let incomeMeta = safeParse(store.get(INCOME_META_KEY), {});
function renderIncomeMeta() {
  const el = $('income-meta');
  if (!el) return;
  const cols = [];
  if (incomeMeta.employer) cols.push(`<div class="im-col"><span class="income-label">Arbeitgeber</span><span class="im-val">${esc(incomeMeta.employer)}</span></div>`);
  if (incomeMeta.target > 0) cols.push(`<div class="im-col"><span class="income-label">Zieleinkommen</span><span class="im-val">${fmt(incomeMeta.target)}</span></div>`);
  if (incomeMeta.grossM > 0) cols.push(`<div class="im-col"><span class="income-label">Brutto / Monat</span><span class="im-val">${fmt(incomeMeta.grossM)}</span></div>`);
  if (incomeMeta.grossY > 0) cols.push(`<div class="im-col"><span class="income-label">Brutto / Jahr</span><span class="im-val">${fmt(incomeMeta.grossY)}</span></div>`);
  if (incomeMeta.bonus > 0) cols.push(`<div class="im-col"><span class="income-label">Bonus</span><span class="im-val">${fmt(incomeMeta.bonus)}</span></div>`);
  if (incomeMeta.pension > 0) cols.push(`<div class="im-col"><span class="income-label">Altersvorsorge</span><span class="im-val">${fmt(incomeMeta.pension)}</span></div>`);
  if (incomeMeta.stocks > 0) cols.push(`<div class="im-col"><span class="income-label">Aktien</span><span class="im-val">${fmt(incomeMeta.stocks)}</span></div>`);
  el.innerHTML = cols.length ? cols.join('') : '<span class="im-add">Brutto & Arbeitgeber ergänzen</span>';
}
function openIncomeMeta() {
  $('im-employer').value = incomeMeta.employer || '';
  $('im-target').value = incomeMeta.target > 0 ? fmt(incomeMeta.target).replace(' €','') : '';
  $('im-gross-m').value = incomeMeta.grossM > 0 ? fmt(incomeMeta.grossM).replace(' €','') : '';
  $('im-gross-y').value = incomeMeta.grossY > 0 ? fmt(incomeMeta.grossY).replace(' €','') : '';
  $('im-bonus').value = incomeMeta.bonus > 0 ? fmt(incomeMeta.bonus).replace(' €','') : '';
  $('im-pension').value = incomeMeta.pension > 0 ? fmt(incomeMeta.pension).replace(' €','') : '';
  $('im-stocks').value = incomeMeta.stocks > 0 ? fmt(incomeMeta.stocks).replace(' €','') : '';
  ['im-target','im-gross-m','im-gross-y','im-bonus','im-pension','im-stocks'].forEach(id => bindMoneyInput($(id)));
  oeffneOverlay('income-meta-overlay', closeIncomeMeta);
}
function closeIncomeMeta() { schliesseOverlay('income-meta-overlay'); }
function saveIncomeMeta() {
  incomeMeta = {
    employer: $('im-employer').value.trim(),
    target: parseMoney($('im-target').value) || 0,
    grossM: parseMoney($('im-gross-m').value) || 0,
    grossY: parseMoney($('im-gross-y').value) || 0,
    bonus: parseMoney($('im-bonus').value) || 0,
    pension: parseMoney($('im-pension').value) || 0,
    stocks: parseMoney($('im-stocks').value) || 0
  };
  store.set(INCOME_META_KEY, JSON.stringify(incomeMeta));
  renderIncomeMeta();
  closeIncomeMeta();
}
function updateIncome() {
  renderIncomeMeta();
  const totalExpenses = sectionMonthlyTotal('v') + sectionMonthlyTotal('b') + sectionMonthlyTotal('a');
  const avail = income - totalExpenses;
  const el = $('income-avail');
  el.textContent = fmt(avail);
  el.classList.toggle('negative', avail < 0);
  renderDashboard();
}

// Monthly total of a specific category within a section
// Hero (Gesamtvermögen) + Bento-Kacheln – nutzt exakt dieselben Berechnungen wie das Dashboard
function openDetail(which) {
  const titles = { uebersicht: 'Konten', a: 'Altersvorsorge', urlaub: 'Urlaube', v: 'Verträge & Versicherungen' };
  document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('on'));
  const panel = $('panel-' + which);
  if (panel) panel.classList.add('on');
  const t = $('detail-title'); if (t) t.textContent = titles[which] || 'Details';
  const sheet = $('detail-sheet'); if (sheet) sheet.classList.add('open');
}
function closeDetail() {
  const sheet = $('detail-sheet'); if (sheet) sheet.classList.remove('open');
}

function renderHeroBento() {
  // Gesamtvermögen (identische Formel wie im Dashboard)
  const balanceSum = data.b.reduce((s,e) => s + (isGiro(e) ? 0 : (e.balance || 0)), 0);
  const pensionSum = data.a.reduce((s,e) => s + (e.cat === 'Privat' ? (e.current || 0) : 0), 0);
  const wealth = balanceSum + pensionSum;
  const hv = $('hero-val'), hSub = $('hero-sub'), hDelta = $('hero-delta'), hSpark = $('hero-spark');
  if (!hv) return;
  if (wealth > 0) {
    hv.textContent = fmt(wealth);
    const parts = [];
    if (balanceSum > 0) parts.push('Vermögen ' + fmt(balanceSum));
    if (pensionSum > 0) parts.push('Vorsorge ' + fmt(pensionSum));
    hSub.textContent = parts.join(' · ');
  } else {
    hv.textContent = '–';
    hSub.textContent = 'Stände eintragen';
  }
  // Delta + Sparkline aus der Verlaufs-History
  const hist = histSlice(history);
  if (hist.length >= 2 && wealth > 0) {
    // Badge: rollierende 30-Tage-Differenz (heute vs. Wert vor 30 Tagen), unabhängig vom Chart-Zeitraum
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
    const cs = cutoff.toISOString().slice(0,10);
    const base = history.filter(h => histDate(h) <= cs).pop() || history[0];
    const last = history[history.length-1].wealth;
    const delta = last - base.wealth;
    const baseDays = Math.max(1, Math.round((new Date(histDate(history[history.length-1])) - new Date(histDate(base))) / 86400000));
    const span = baseDays >= 30 ? '30 Tagen' : baseDays + (baseDays === 1 ? ' Tag' : ' Tagen');
    hDelta.style.display = 'none';   // Der Wert steht jetzt in der Legende unter der Linie

    // Sparkline mit dezenter Legende, damit die Linie einen Bezug bekommt
    const vals = hist.map(h => h.wealth);
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = (mx - mn) || 1;
    const W = 320, H = 64, n = vals.length;
    const xAt = i => (i / (n - 1)) * W;
    const yAt = v => 6 + (1 - (v - mn) / rng) * (H - 12);
    const line = vals.map((v,i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
    const area = `M0,${yAt(vals[0]).toFixed(1)} ` + vals.map((v,i) => `L${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ') + ` L${W},${H} L0,${H} Z`;
    // Legende und Farbe beziehen sich auf den GEZEIGTEN Zeitraum,
    // nicht auf die rollierenden 30 Tage der frueheren Pille.
    const spanne = vals[n-1] - vals[0];
    const col = spanne >= 0 ? 'var(--green)' : 'var(--danger)';
    const netz = [yAt(mx), yAt((mx + mn) / 2), yAt(mn)]
      .map(y => `<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`).join('');
    const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${spanne>=0?'rgba(48,209,55,0.28)':'rgba(255,69,58,0.28)'}"/>
        <stop offset="1" stop-color="rgba(0,0,0,0)"/>
      </linearGradient></defs>
      ${netz}
      <path d="${area}" fill="url(#hg)"/>
      <polyline points="${line}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${xAt(n-1).toFixed(1)}" cy="${yAt(vals[n-1]).toFixed(1)}" r="3" fill="${col}"/>
    </svg>`;
    const achse = `<div class="hero-axis"><span>${fmtShort(mx)}</span><span>${fmtShort((mx + mn) / 2)}</span><span>${fmtShort(mn)}</span></div>`;
    // Die Zeitraum-/Wertzeile unter dem Sparkline entfaellt bewusst – die Zahlen
    // stehen bereits darueber im Hero. (Eigene Umsetzung, nicht die .hist-range
    // der Detail-Graphen; deshalb war sie von deren Entfernung nicht betroffen.)
    hSpark.innerHTML = `<div class="hero-plot">${achse}${svg}</div>`;
  } else {
    hDelta.style.display = 'none';
    hSpark.innerHTML = '';
  }

  // --- Bento-Kacheln (einheitlicher Apple-Stil) ---
  const tiles = [];

  // ÜBERWEISUNGEN: monatliche Fälligkeiten für die wichtigsten Girokonten am Monatsanfang –
  // automatisch aus "Ausgaben nach Konto" abgeleitet, keine doppelte Datenpflege.
  {
    const UEB_ACCOUNTS = ['Scalable Tagesgeld', 'DKB Giro', 'DB Spar'];
    const uebTotals = {};
    ['v','b','a'].forEach(sec => data[sec].forEach(e => {
      if (!UEB_ACCOUNTS.includes(e.account)) return;
      uebTotals[e.account] = (uebTotals[e.account] || 0) + toMonthly(Number(e.amount)||0, e.period);
    }));
    const uebNamen = UEB_ACCOUNTS.filter(a => uebTotals[a] > 0);
    if (uebNamen.length) {
      const uebSumme = uebNamen.reduce((s,a) => s + uebTotals[a], 0);
      const rows = uebNamen.map(a => `<div class="bento-list-row"><span class="bl">${esc(a)}</span><span class="bv">${fmt(uebTotals[a])}</span></div>`).join('');
      tiles.push(`<div class="bento-tile" onclick="openDetail('uebersicht')">
        <div class="bento-head"><span class="bento-title">Überweisungen</span></div>
        <div class="bento-primary">${uebNamen.length}<span class="bento-unit">${uebNamen.length === 1 ? 'Überweisung' : 'Überweisungen'}</span></div>
        <div class="bento-foot"><div class="bento-list">${rows}</div></div>
      </div>`);
    }
  }

  // KONTEN: Scalable Tagesgeld + Mini-Donut der Aufteilung
  {
    const acct = 'Scalable Tagesgeld';
    const cats = {};
    let total = 0;
    data.b.forEach(e => {
      if (isGiro(e) || !(e.balance > 0)) return;
      if ((e.account || '') !== acct) return;
      cats[e.cat] = (cats[e.cat] || 0) + e.balance;
      total += e.balance;
    });
    if (total > 0) {
      const CAT_COL = { Urlaub: 'var(--violet)', Sparen: 'var(--green)', Konsum: 'var(--accent)' };
      const order = Object.entries(cats).sort((a,b) => b[1] - a[1]);
      const bar = order.map(([cat,v]) => `<span class="bento-seg" style="flex:${(v/total).toFixed(4)};background:${CAT_COL[cat]||'var(--muted)'}"></span>`).join('');
      const legend = order.map(([cat,v]) => `<div class="bento-break-row"><span class="bl"><span class="bento-leg-dot" style="background:${CAT_COL[cat]||'var(--muted)'}"></span>${esc(cat)}</span><span class="bv">${fmt(v)}</span></div>`).join('');
      tiles.push(`<div class="bento-tile" onclick="openDetail('uebersicht')">
        <div class="bento-head"><span class="bento-title">${esc(acct)}</span></div>
        <div class="bento-primary">${fmt(total)}</div>
        <div class="bento-foot bento-foot-col"><div class="bento-segbar">${bar}</div><div class="bento-break">${legend}</div></div>
      </div>`);
    }
  }

  // URLAUBE: Restbudget + Timeline mit Zielen
  {
    const urlaubRest = currentYearUrlaubBalance();
    if (urlaubRest !== null) {
      const pos = urlaubRest >= 0;
      const jahr = new Date().getFullYear();
      const trips = urlaube.map(u => ({ u, y: parseInt(finTripYear(u),10), m: tripMonthNum(u) }))
        .filter(t => t.y && (t.y > jahr || (t.y === jahr && t.m >= (new Date().getMonth()+1))))
        .sort((a,b) => (a.y-b.y) || (a.m-b.m)).slice(0,3);
      const MON = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
      let timeline;
      if (trips.length) {
        timeline = `<div class="bento-list">` + trips.map(t => `<div class="bento-list-row"><span class="bl">${esc(t.u.name)}</span><span class="bv">${MON[t.m-1]||''} ${String(t.y).slice(2)}</span></div>`).join('') + `</div>`;
      } else {
        timeline = `<div class="bento-mini">Keine Reisen geplant</div>`;
      }
      // Weltkarte: Reisen mit Land als Punkte, Jahr farblich (26 violett, 27 petrol)
      const yearNow = jahr, yearNext = jahr + 1;
      const mapTrips = urlaube.map(u => ({ u, y: parseInt(finTripYear(u),10) }))
        .filter(t => (t.y === yearNow || t.y === yearNext) && t.u.country && COUNTRY_COORDS[t.u.country]);
      let map = '';
      if (mapTrips.length) {
        const dots = mapTrips.map(t => {
          const col = t.y === yearNow ? 'var(--violet)' : 'var(--petrol)';
          const cp = FIN_COUNTRY_PATHS[t.u.country];
          if (cp) return `<path d="${cp}" fill="${col}" opacity="0.9"/>`;
          const [x,y] = COUNTRY_COORDS[t.u.country];
          return `<circle cx="${x}" cy="${y}" r="1.3" fill="${col}"/><circle cx="${x}" cy="${y}" r="2.4" fill="${col}" opacity="0.25"/>`;
        }).join('');
        map = `<div class="bento-map-wrap"><svg class="bento-map" viewBox="0 6 100 34" preserveAspectRatio="xMidYMid meet">
          <path fill="rgba(255,255,255,0.10)" d="M37.5,46.7L37.8,46.8L37.9,47.0L38.0,47.1L38.0,47.2L37.5,47.3L37.1,47.4L36.6,47.5L36.0,47.5L35.3,47.5L35.0,47.4L35.0,47.3L35.6,47.2L35.8,47.1L36.0,47.0L36.1,46.9L36.3,46.8L36.5,46.7L36.6,46.7L37.0,46.6L37.5,46.7ZM31.0,44.7L31.0,44.8L31.0,44.9L30.9,45.0L30.6,45.1L30.3,45.1L29.9,45.1L30.0,45.0L29.7,45.1L29.4,45.1L29.2,45.0L29.2,44.9L29.5,44.8L29.7,44.8L30.0,44.8L30.1,44.6L30.1,44.5L30.1,44.3L30.2,44.2L30.5,44.1L30.6,44.2L30.7,44.3L30.8,44.5L30.9,44.6L31.0,44.7ZM0.0,48.5L0.8,48.5L1.0,48.4L1.1,48.4L1.9,48.4L3.1,48.4L4.4,48.6L6.9,48.6L9.5,48.7L9.2,48.5L7.3,48.2L7.6,47.9L6.9,47.6L7.8,47.5L9.1,47.4L8.9,47.1L7.4,47.0L6.3,46.8L6.1,46.4L7.3,46.4L8.3,46.4L9.4,46.2L9.4,45.9L10.3,45.9L11.4,45.8L12.4,45.6L13.3,45.6L14.4,45.6L15.6,45.7L16.7,45.7L17.7,45.6L18.5,45.6L19.1,45.7L20.1,45.9L21.3,45.8L22.2,45.8L21.5,45.6L21.2,45.2L22.1,45.2L22.9,45.4L24.0,45.4L25.0,45.4L25.8,45.3L26.7,45.4L27.6,45.4L28.4,45.4L29.2,45.5L30.1,45.4L31.1,45.2L31.3,44.9L31.0,44.6L31.0,44.3L31.3,43.9L31.3,43.6L31.8,43.3L32.3,43.0L32.9,42.9L33.6,42.7L34.1,42.6L33.6,42.9L33.0,42.9L32.6,43.2L32.6,43.5L32.0,43.7L31.9,44.0L32.4,44.2L32.7,44.6L33.0,45.0L33.1,45.3L32.8,45.7L32.1,45.9L31.0,46.1L29.9,46.3L28.5,46.3L29.4,46.5L28.8,46.7L28.3,47.0L29.1,47.3L30.6,47.5L32.4,47.7L33.7,48.0L34.6,47.9L36.2,47.7L38.1,47.8L39.4,47.6L41.0,47.4L41.9,47.2L41.2,47.0L40.0,47.0L40.6,46.6L41.7,46.4L42.7,46.2L43.8,46.1L44.7,46.0L45.6,45.7L45.5,45.4L46.3,45.2L46.9,44.9L47.6,44.9L48.1,44.7L48.8,44.9L49.8,44.8L50.5,44.8L51.4,44.6L52.2,44.4L52.8,44.6L53.4,44.5L54.2,44.6L55.1,44.4L56.0,44.5L56.6,44.6L57.5,44.6L58.3,44.4L59.1,44.3L59.7,44.1L60.3,44.2L61.0,44.3L61.7,44.1L62.5,43.9L63.2,43.8L63.9,43.6L64.4,43.4L65.1,43.3L65.9,43.4L66.3,43.7L67.1,43.9L67.8,43.7L68.6,43.8L69.4,44.2L69.1,44.4L69.2,44.6L68.9,45.0L69.7,45.0L70.1,44.7L70.5,44.4L71.3,44.3L71.8,44.1L72.5,43.9L73.0,43.7L73.8,43.6L74.4,43.4L74.9,43.7L75.7,43.7L76.4,43.7L77.2,43.7L77.9,43.6L78.6,43.2L79.1,43.4L80.0,43.6L80.8,43.5L81.6,43.3L82.1,43.5L82.9,43.7L83.8,43.6L84.5,43.5L85.3,43.5L86.0,43.5L86.9,43.4L87.5,43.3L87.7,43.3L88.2,43.6L89.1,43.6L90.1,43.6L90.6,43.8L91.3,44.0L92.4,44.1L93.1,44.1L93.9,44.3L94.7,44.5L95.5,44.6L96.5,44.7L97.4,44.8L97.4,45.1L97.0,45.5L96.1,45.7L95.6,46.0L95.4,46.3L95.6,46.6L96.4,46.9L94.9,47.0L94.5,47.4L94.9,47.7L95.9,48.0L97.1,48.3L98.1,48.4ZM31.2,40.0L31.5,40.1L31.9,40.2L31.8,40.3L31.5,40.3L31.4,40.2L31.3,40.4L31.1,40.4L30.8,40.4L30.6,40.3L30.3,40.3L29.9,40.1L29.6,40.0L29.3,39.7L29.5,39.7L29.9,39.9L30.2,40.0L30.4,39.9L30.5,39.7L30.7,39.6L30.9,39.6L31.0,39.8L31.2,40.0ZM98.1,36.4L98.1,36.5L98.3,36.4L98.4,36.5L98.4,36.6L98.3,36.7L98.1,36.9L98.0,37.0L98.1,37.2L97.9,37.2L97.6,37.3L97.6,37.5L97.4,37.8L97.2,37.9L97.0,38.0L96.8,37.9L96.6,37.9L96.3,37.8L96.3,37.7L96.4,37.5L96.8,37.3L96.9,37.2L97.1,37.1L97.4,37.0L97.5,36.8L97.7,36.6L97.8,36.5L97.8,36.4L98.0,36.2L98.1,36.4ZM98.5,35.0L98.7,35.3L98.7,35.1L98.8,35.2L98.9,35.4L99.1,35.5L99.3,35.5L99.4,35.4L99.6,35.5L99.5,35.7L99.4,35.9L99.2,35.9L99.1,36.0L99.2,36.1L99.1,36.1L99.0,36.3L98.9,36.5L98.7,36.6L98.6,36.5L98.5,36.5L98.7,36.2L98.6,36.1L98.3,36.0L98.3,35.9L98.5,35.8L98.5,35.6L98.5,35.4L98.4,35.2L98.4,35.1L98.3,35.0L98.1,34.8L98.0,34.6L98.1,34.6L98.2,34.7L98.4,34.8L98.5,35.0ZM63.9,28.8L63.9,29.1L64.0,29.2L64.0,29.4L63.9,29.4L63.9,29.3L63.8,29.4L63.9,29.6L63.8,29.7L63.7,29.8L63.7,30.0L63.6,30.3L63.5,30.7L63.3,31.2L63.2,31.6L63.1,31.9L62.9,32.0L62.6,32.1L62.5,32.0L62.2,31.9L62.2,31.8L62.1,31.5L62.0,31.3L62.0,31.1L62.1,30.9L62.2,30.9L62.2,30.8L62.3,30.6L62.4,30.4L62.3,30.3L62.2,30.1L62.2,29.8L62.3,29.7L62.3,29.5L62.5,29.5L62.6,29.4L62.7,29.4L62.9,29.4L63.0,29.2L63.3,29.1L63.3,28.9L63.3,28.8L63.4,28.8L63.6,28.6L63.6,28.5L63.7,28.3L63.8,28.5L63.8,28.6L63.9,28.8ZM89.9,28.8L90.0,29.0L90.2,28.9L90.2,29.1L90.4,29.2L90.4,29.3L90.4,29.5L90.5,29.7L90.5,29.7L90.6,29.9L90.6,30.1L90.7,30.3L91.0,30.4L91.2,30.5L91.3,30.7L91.3,30.7L91.5,30.9L91.6,31.2L91.7,31.1L91.8,31.3L91.9,31.2L91.9,31.5L92.1,31.7L92.2,31.8L92.5,32.0L92.5,32.2L92.5,32.4L92.5,32.6L92.7,32.8L92.6,33.1L92.6,33.2L92.5,33.4L92.5,33.6L92.5,33.8L92.3,34.0L92.1,34.2L92.0,34.4L91.9,34.5L91.9,34.8L91.8,34.9L91.7,35.1L91.7,35.3L91.7,35.4L91.5,35.5L91.2,35.5L90.9,35.6L90.8,35.7L90.6,35.8L90.4,35.7L90.2,35.7L90.3,35.5L90.1,35.6L89.9,35.8L89.7,35.7L89.5,35.7L89.3,35.6L89.1,35.6L88.9,35.4L88.8,35.2L88.8,35.0L88.6,34.9L88.4,34.9L88.5,34.8L88.4,34.6L88.3,34.7L88.0,34.8L88.2,34.6L88.2,34.5L88.3,34.3L88.3,34.1L88.1,34.4L87.9,34.5L87.8,34.7L87.6,34.6L87.6,34.4L87.4,34.2L87.2,34.1L87.3,34.1L86.9,33.9L86.7,33.9L86.5,33.7L86.0,33.8L85.6,33.9L85.3,34.0L85.0,33.9L84.7,34.1L84.5,34.2L84.5,34.3L84.3,34.4L84.1,34.4L83.9,34.4L83.7,34.4L83.5,34.4L83.3,34.4L83.1,34.6L83.1,34.6L82.9,34.7L82.8,34.7L82.6,34.7L82.4,34.7L82.1,34.6L82.0,34.5L82.0,34.3L82.1,34.3L82.1,34.2L82.1,34.1L82.2,33.9L82.1,33.8L82.0,33.5L81.9,33.3L82.0,33.2L81.8,33.0L81.8,32.9L81.7,32.8L81.7,32.6L81.5,32.4L81.5,32.3L81.6,32.4L81.5,32.1L81.6,32.2L81.7,32.3L81.7,32.2L81.6,31.9L81.6,31.9L81.5,31.8L81.5,31.6L81.6,31.5L81.6,31.4L81.6,31.2L81.7,31.0L81.7,31.3L81.8,31.1L82.1,31.0L82.2,30.9L82.4,30.8L82.5,30.7L82.6,30.8L82.8,30.7L83.0,30.6L83.1,30.6L83.1,30.5L83.3,30.5L83.6,30.5L83.7,30.3L83.8,30.2L84.0,30.1L84.0,29.9L84.0,29.8L84.2,29.6L84.3,29.8L84.4,29.7L84.3,29.6L84.4,29.5L84.5,29.5L84.5,29.3L84.7,29.2L84.8,29.1L84.9,29.0L84.9,29.0L85.0,29.0L85.0,28.9L85.2,28.9L85.3,28.8L85.5,29.0L85.7,29.1L85.8,29.1L86.0,29.2L85.9,29.0L86.1,28.8L86.2,28.7L86.2,28.6L86.3,28.5L86.5,28.4L86.6,28.4L86.8,28.4L86.8,28.2L86.6,28.1L86.8,28.1L86.9,28.2L87.1,28.3L87.3,28.3L87.4,28.3L87.6,28.4L87.7,28.3L87.8,28.3L87.9,28.3L88.0,28.4L88.0,28.6L87.9,28.7L87.8,28.7L87.8,28.8L87.7,29.0L87.6,29.1L87.6,29.2L87.9,29.3L88.1,29.4L88.2,29.5L88.4,29.7L88.5,29.7L88.6,29.7L88.7,29.8L88.9,29.9L89.1,29.8L89.2,29.7L89.2,29.6L89.3,29.4L89.4,29.2L89.3,29.0L89.3,29.0L89.3,28.8L89.3,28.6L89.4,28.5L89.4,28.4L89.4,28.3L89.5,28.1L89.5,28.1L89.6,28.0L89.7,28.1L89.7,28.3L89.8,28.3L89.8,28.4L89.9,28.6L89.9,28.7L89.9,28.8ZM80.2,26.9L80.7,26.9L80.8,26.8L81.3,26.9L81.4,27.1L81.8,27.2L82.1,27.3L81.8,27.4L81.5,27.3L81.3,27.3L81.0,27.3L80.7,27.3L80.4,27.2L80.2,27.1L80.1,27.2L79.6,27.0L79.5,26.9L79.3,26.9L79.5,26.6L79.8,26.7L80.0,26.8L80.1,26.8L80.2,26.9ZM87.3,25.3L87.3,25.8L87.6,25.9L87.9,25.6L88.2,25.5L88.4,25.5L88.7,25.6L88.9,25.7L89.2,25.7L89.6,25.9L90.2,26.1L90.4,26.2L90.5,26.4L90.6,26.5L91.0,26.7L91.1,26.8L90.8,26.9L90.9,27.1L91.1,27.2L91.3,27.5L91.5,27.5L91.5,27.6L91.7,27.7L91.6,27.7L91.9,27.9L91.9,27.9L91.7,28.0L91.6,27.9L91.4,27.9L91.1,27.8L90.9,27.6L90.7,27.5L90.6,27.2L90.2,27.1L90.0,27.2L89.8,27.3L89.8,27.5L89.6,27.6L89.5,27.5L89.2,27.5L88.9,27.3L88.6,27.2L88.6,27.3L88.2,27.3L88.3,27.1L88.5,27.0L88.4,26.7L88.3,26.5L87.8,26.3L87.5,26.2L87.1,26.0L87.0,26.1L86.9,26.1L86.9,26.0L86.9,25.9L86.7,25.8L87.0,25.7L87.2,25.7L87.1,25.6L86.7,25.6L86.6,25.4L86.4,25.4L86.3,25.3L86.6,25.2L86.8,25.1L87.2,25.2L87.3,25.3ZM84.8,24.6L84.6,24.9L84.4,24.9L84.1,24.9L83.6,24.9L83.4,24.9L83.3,25.1L83.6,25.4L83.7,25.3L84.3,25.2L84.2,25.3L84.1,25.3L84.0,25.4L83.8,25.5L84.0,25.9L84.0,26.0L84.2,26.3L84.2,26.5L84.1,26.6L84.0,26.5L84.1,26.2L83.8,26.3L83.7,26.3L83.8,26.2L83.6,26.0L83.6,25.7L83.4,25.8L83.4,26.1L83.5,26.5L83.3,26.6L83.2,26.5L83.2,26.2L83.2,26.0L83.1,26.0L83.0,25.8L83.1,25.6L83.1,25.4L83.3,25.0L83.3,24.8L83.6,24.6L83.8,24.7L84.1,24.8L84.5,24.7L84.7,24.5L84.8,24.6ZM79.4,26.6L79.1,26.6L78.9,26.4L78.5,26.2L78.4,26.0L78.2,25.8L78.0,25.6L77.8,25.2L77.6,24.9L77.5,24.7L77.4,24.5L77.1,24.3L77.0,24.1L76.8,23.9L76.5,23.6L76.5,23.5L76.6,23.5L77.1,23.5L77.3,23.8L77.5,24.0L77.7,24.1L78.0,24.4L78.2,24.4L78.5,24.6L78.6,24.8L78.8,25.0L78.7,25.2L78.9,25.3L79.0,25.3L79.0,25.5L79.1,25.7L79.3,25.7L79.5,25.9L79.4,26.2L79.4,26.6ZM82.7,24.5L83.1,24.7L82.7,24.8L82.6,25.0L82.6,25.2L82.4,25.4L82.4,25.7L82.3,26.1L82.2,26.0L81.9,26.1L81.8,26.0L81.6,26.0L81.5,25.9L81.1,26.0L81.0,25.8L80.8,25.8L80.6,25.8L80.6,25.4L80.4,25.4L80.3,25.1L80.3,24.9L80.3,24.6L80.5,24.4L80.7,24.5L80.9,24.5L80.9,24.3L81.1,24.2L81.4,24.1L81.6,23.9L81.7,23.7L81.8,23.6L82.1,23.5L82.3,23.3L82.4,23.1L82.5,23.1L82.7,23.2L82.7,23.3L82.9,23.4L83.1,23.5L83.1,23.6L82.9,23.6L82.9,23.8L82.7,23.9L82.6,24.1L82.8,24.4L82.7,24.5ZM83.7,19.9L83.9,19.9L84.0,19.9L84.0,19.9L83.9,20.1L84.0,20.3L84.0,20.5L83.8,20.6L83.8,20.8L83.8,21.0L84.0,21.1L84.1,21.0L84.4,21.2L84.4,21.3L84.5,21.4L84.5,21.5L84.2,21.4L84.1,21.2L84.1,21.3L83.9,21.2L83.6,21.2L83.5,21.2L83.5,21.0L83.6,21.0L83.5,20.9L83.5,21.0L83.4,20.8L83.3,20.7L83.3,20.5L83.4,20.5L83.4,20.1L83.5,19.9L83.7,19.9ZM27.9,18.7L28.0,18.8L28.2,18.7L28.3,18.8L28.6,19.0L28.7,19.1L28.8,19.1L29.0,19.2L29.0,19.2L29.2,19.3L29.4,19.4L29.4,19.4L29.2,19.5L29.0,19.5L28.8,19.5L28.4,19.5L28.6,19.3L28.5,19.3L28.3,19.2L28.2,19.2L28.1,19.0L28.0,19.0L27.7,18.9L27.6,18.9L27.3,18.8L27.2,18.8L27.3,18.7L27.0,18.7L26.8,18.8L26.7,18.8L26.7,18.9L26.5,18.9L26.4,18.9L26.5,18.8L26.6,18.7L26.7,18.7L26.9,18.6L27.1,18.6L27.1,18.6L27.4,18.6L27.6,18.6L27.9,18.7ZM89.2,14.7L89.1,14.9L89.1,15.0L89.0,15.2L88.6,15.4L88.1,15.4L87.7,15.7L87.5,15.6L87.5,15.4L87.0,15.5L86.7,15.6L86.4,15.6L86.7,15.8L86.5,16.3L86.3,16.4L86.2,16.3L86.2,16.0L86.1,15.9L85.9,15.8L86.2,15.7L86.4,15.5L86.6,15.3L86.8,15.2L87.4,15.1L87.7,15.1L88.0,14.6L88.2,14.8L88.6,14.5L88.7,14.4L88.9,14.0L88.9,13.7L89.0,13.6L89.3,13.5L89.4,13.9L89.4,14.1L89.2,14.4L89.2,14.7ZM90.0,12.7L90.2,12.8L90.4,12.7L90.4,13.0L90.0,13.1L89.8,13.3L89.3,13.1L89.2,13.4L88.9,13.5L88.8,13.2L89.0,13.0L89.3,12.9L89.4,12.6L89.4,12.3L89.8,12.6L90.0,12.7ZM34.4,10.9L34.2,11.2L34.4,11.1L34.6,11.1L34.5,11.2L34.7,11.3L34.9,11.2L35.1,11.3L35.1,11.5L35.3,11.5L35.3,11.6L35.4,11.8L35.3,12.0L35.1,12.1L35.0,12.0L35.0,11.8L34.9,11.7L34.6,12.0L34.4,12.0L34.6,11.8L34.4,11.8L34.1,11.8L33.5,11.8L33.5,11.7L33.7,11.6L33.5,11.5L33.8,11.4L34.1,10.9L34.2,10.8L34.5,10.7L34.6,10.7L34.6,10.7L34.4,10.9ZM89.9,10.9L90.2,11.4L89.8,11.3L89.6,11.7L89.9,12.0L89.9,12.2L89.7,12.0L89.5,12.2L89.4,12.0L89.4,11.7L89.4,11.4L89.5,11.2L89.5,10.8L89.3,10.6L89.4,10.2L89.6,10.1L89.5,9.9L89.6,9.9L89.7,10.1L89.8,10.3L89.8,10.6L89.9,10.9ZM49.2,8.7L48.9,9.0L49.2,9.0L49.5,9.0L49.4,9.2L49.1,9.5L49.4,9.5L49.7,9.8L49.9,9.9L50.1,10.2L50.1,10.3L50.5,10.4L50.4,10.5L50.3,10.6L50.4,10.8L50.2,10.9L49.8,10.9L49.3,11.0L49.2,10.9L49.0,11.0L48.7,11.0L48.5,11.1L48.4,11.1L48.8,10.8L49.1,10.7L48.6,10.7L48.5,10.6L48.8,10.5L48.7,10.3L48.7,10.1L49.1,10.2L49.2,10.0L49.0,9.8L48.7,9.8L48.6,9.7L48.7,9.6L48.6,9.5L48.4,9.6L48.4,9.4L48.3,9.2L48.4,8.9L48.6,8.7L48.8,8.7L49.2,8.7ZM46.0,6.5L45.9,6.7L46.2,6.9L45.9,7.1L45.1,7.3L44.8,7.4L44.5,7.3L43.7,7.2L44.0,7.1L43.3,7.0L43.8,6.9L43.8,6.8L43.2,6.8L43.4,6.6L43.9,6.6L44.3,6.7L44.7,6.6L45.1,6.7L45.5,6.5L46.0,6.5ZM0.0,5.8L2.1,6.8L0.3,6.7ZM99.7,7.4L97.3,8.4L95.3,9.0L93.6,10.8L95.0,8.2L93.1,8.6L87.5,9.8L89.0,11.1L86.7,13.0L85.7,13.8L86.0,15.1L85.0,14.5L84.8,14.2L83.7,14.0L83.0,14.5L83.2,15.1L83.9,16.7L81.9,18.7L80.5,19.1L80.2,20.8L79.0,22.1L77.6,22.0L78.4,23.3L79.0,24.6L77.8,23.2L77.3,22.0L76.5,20.6L75.6,19.1L74.8,18.9L73.1,20.1L72.2,21.7L71.1,22.1L70.2,19.3L68.7,18.1L65.7,17.5L63.6,16.6L63.9,17.6L64.2,17.7L65.0,18.3L65.8,18.3L66.5,19.0L65.7,19.8L64.8,20.4L63.2,21.2L62.1,21.5L61.9,20.5L60.9,19.1L60.2,17.8L59.6,16.9L59.3,17.3L60.3,19.2L61.4,21.0L62.1,21.9L63.6,21.8L64.1,22.1L62.0,24.9L61.0,26.2L61.0,27.5L61.1,29.5L59.8,30.9L59.5,31.9L58.8,33.1L57.2,34.4L55.6,34.7L55.1,34.0L54.1,32.1L53.3,29.8L53.8,28.1L53.4,26.7L52.5,25.1L52.4,23.8L51.0,23.3L48.9,23.6L47.0,23.3L46.0,22.2L45.4,21.6L45.4,20.4L45.3,18.9L46.0,17.7L47.4,16.1L49.0,15.2L51.5,14.8L53.1,14.7L53.2,15.8L55.4,16.5L56.6,16.1L58.6,16.2L59.7,16.1L59.9,14.9L58.2,15.0L58.1,13.6L61.5,13.5L60.4,12.4L59.7,12.1L59.0,12.4L58.2,12.5L58.0,13.6L56.8,13.9L56.7,14.4L55.9,14.4L55.4,13.4L54.3,12.7L53.7,12.3L54.5,13.4L54.6,13.9L54.4,14.0L52.9,13.1L50.9,13.0L49.9,14.4L48.3,14.9L47.4,14.2L47.4,13.0L49.4,11.9L50.5,10.8L52.3,10.1L52.7,9.0L52.8,9.7L54.5,9.9L56.0,9.1L56.8,8.5L56.2,8.2L56.6,6.7L55.0,8.6L53.1,8.7L52.9,7.1L57.8,5.2L61.4,6.4L60.3,7.1L62.4,6.5L63.3,6.4L66.3,5.9L68.9,5.8L70.2,4.8L70.1,6.6L70.7,5.4L71.5,4.9L74.2,4.1L78.1,3.6L81.5,3.8L81.5,4.6L85.7,4.7L88.4,5.1L94.4,5.4L97.2,5.7ZM24.8,5.7L26.0,6.1L27.4,5.9L26.2,6.5L24.8,7.3L23.7,8.6L25.5,9.3L27.1,9.9L28.0,10.0L28.5,8.9L29.0,7.7L30.7,8.0L31.9,8.4L33.2,9.5L34.5,10.2L32.9,11.1L30.6,11.7L32.2,11.5L33.2,11.9L31.8,12.9L31.4,12.6L30.3,13.2L30.4,13.5L29.9,13.6L29.5,13.8L29.1,14.2L29.0,14.5L28.8,14.5L28.5,15.4L27.5,16.1L27.6,17.2L27.5,18.0L27.0,17.1L26.2,16.6L25.2,16.7L24.8,16.9L23.4,17.0L23.0,17.8L22.8,18.8L23.4,19.8L24.6,19.8L25.4,19.0L25.7,19.5L25.5,19.9L25.5,20.3L25.4,20.6L25.7,20.6L26.3,20.6L26.7,20.7L26.8,21.1L26.7,21.7L26.9,22.2L27.4,22.6L28.0,22.4L28.9,22.4L29.4,21.9L30.2,21.6L30.0,22.3L30.5,21.8L31.1,22.1L32.1,22.0L33.1,22.4L33.8,23.1L34.7,23.3L35.7,23.8L36.0,25.0L37.7,25.6L39.7,26.3L40.2,27.5L39.2,28.8L38.7,30.8L37.4,31.6L36.5,32.8L35.4,34.2L34.1,34.6L34.2,35.1L32.7,36.0L31.9,36.4L31.9,37.1L31.5,38.1L30.8,39.1L30.3,39.7L29.1,39.3L29.0,38.0L29.5,37.0L29.6,35.3L30.2,33.4L30.5,30.5L28.9,29.1L27.9,27.2L27.5,26.1L27.6,25.5L27.9,24.7L28.4,24.3L28.5,23.4L28.2,22.7L27.7,22.7L27.5,22.8L27.0,22.7L26.8,22.5L26.4,22.3L26.2,22.0L25.8,21.5L25.6,21.3L25.0,21.2L23.9,20.6L22.8,20.5L21.5,20.0L20.7,19.3L20.5,18.7L19.6,17.7L18.8,17.0L18.3,16.2L18.4,16.9L18.8,17.4L19.3,18.3L19.4,18.7L18.8,17.8L18.0,17.3L17.9,16.8L17.2,15.7L16.5,15.4L15.6,14.2L15.5,12.9L15.8,11.7L15.3,11.1L14.1,10.1L12.9,9.1L10.9,8.4L8.9,8.3L7.9,8.1L7.4,8.6L6.0,9.4L4.2,9.9L5.5,9.3L6.1,8.7L5.2,8.7L4.3,8.3L4.3,7.5L5.3,7.2L4.6,7.1L4.3,6.5L4.3,6.2L4.7,5.6L6.9,5.2L8.4,5.4L10.8,5.6L13.1,5.7L14.6,5.5L16.3,5.6L18.0,6.1L19.8,6.0L21.3,6.1L23.3,6.0L23.2,5.5L24.3,5.6ZM18.3,4.7L18.1,4.8L18.8,4.7L19.2,4.9L19.5,4.7L19.7,4.8L19.9,5.1L20.1,5.0L19.9,4.7L20.1,4.7L20.4,4.7L20.7,4.8L20.9,5.1L21.0,5.3L21.4,5.4L22.0,5.5L21.9,5.7L21.5,5.7L21.6,5.8L21.5,5.9L21.0,5.9L20.6,5.8L20.2,5.8L19.7,5.9L18.9,5.9L18.5,6.0L18.4,5.8L18.0,5.8L17.7,5.8L17.4,5.6L17.6,5.5L18.0,5.5L18.4,5.5L18.8,5.5L18.2,5.4L17.6,5.4L17.2,5.4L17.1,5.3L17.7,5.2L17.3,5.2L16.8,5.1L17.1,4.9L17.3,4.8L18.0,4.6L18.3,4.7ZM26.0,4.7L26.2,4.9L26.4,4.6L27.1,4.5L27.6,4.8L27.6,5.0L28.1,4.9L28.4,4.8L29.0,4.9L29.4,5.1L29.4,5.2L29.9,5.1L30.2,5.3L30.9,5.4L31.1,5.5L31.4,5.8L30.9,5.9L31.5,6.1L32.0,6.2L32.4,6.4L32.8,6.4L32.7,6.6L32.2,6.9L31.9,6.8L31.5,6.6L31.1,6.6L31.1,6.8L31.4,6.9L31.7,7.0L31.9,7.1L32.0,7.4L31.9,7.6L31.6,7.5L30.9,7.3L31.3,7.5L31.6,7.7L31.6,7.8L30.9,7.7L30.3,7.5L29.9,7.4L30.0,7.3L29.6,7.2L29.2,7.0L29.2,7.1L28.4,7.2L28.2,7.1L28.4,6.9L28.9,6.9L29.5,6.8L29.4,6.7L29.5,6.6L29.8,6.3L29.7,6.2L29.6,6.1L29.2,6.0L28.6,5.9L28.8,5.8L28.5,5.6L28.3,5.6L28.1,5.5L27.9,5.6L27.4,5.6L26.4,5.6L25.8,5.5L25.4,5.4L25.1,5.3L25.4,5.2L25.0,5.2L24.9,4.9L25.2,4.7L25.4,4.6L26.2,4.5L26.0,4.7ZM16.5,5.2L15.8,5.3L15.7,5.2L15.0,5.0L15.1,4.9L15.3,4.7L15.6,4.5L15.3,4.4L16.2,4.3L16.6,4.4L17.3,4.4L17.6,4.5L17.9,4.6L17.6,4.7L16.9,4.9L16.5,5.1L16.5,5.2ZM19.9,3.8L20.1,3.9L20.3,3.9L20.6,3.9L20.6,4.0L20.5,4.2L19.5,4.2L18.8,4.3L18.4,4.3L18.4,4.2L18.9,4.1L17.7,4.2L17.3,4.1L17.7,3.8L17.9,3.8L18.7,3.8L19.2,4.0L19.7,4.0L19.3,3.8L19.6,3.7L19.8,3.7L19.9,3.8ZM66.0,5.4L65.8,5.4L64.9,5.3L64.8,5.2L64.3,5.1L64.3,5.0L64.6,4.9L64.6,4.8L65.1,4.5L64.9,4.5L65.5,4.3L65.5,4.1L66.1,4.0L67.0,3.8L67.9,3.8L68.4,3.7L68.9,3.6L69.1,3.7L68.9,3.8L68.0,4.0L67.1,4.1L66.2,4.4L65.8,4.6L65.4,4.9L65.5,5.1L66.0,5.4ZM23.7,3.6L24.0,3.7L24.6,3.7L24.8,3.8L24.7,3.9L25.0,3.9L25.2,4.0L25.6,4.0L26.0,4.0L26.4,4.0L27.0,3.9L27.5,4.0L27.8,4.1L27.8,4.2L27.7,4.3L27.2,4.3L26.9,4.3L26.1,4.3L25.5,4.3L25.1,4.3L24.3,4.2L24.2,4.1L24.2,3.9L23.9,3.8L23.3,3.8L23.0,3.7L23.1,3.6L23.7,3.6ZM55.1,2.9L56.0,3.1L55.3,3.2L55.1,3.4L54.9,3.4L54.8,3.7L54.4,3.7L53.8,3.5L54.1,3.4L53.7,3.3L53.1,3.1L52.9,2.9L53.7,2.8L53.8,2.9L54.2,2.9L54.3,2.8L54.7,2.8L55.1,2.9ZM77.8,3.1L77.2,3.1L76.4,3.0L75.9,2.9L75.7,2.7L75.3,2.7L76.0,2.5L76.6,2.4L77.2,2.6L77.8,2.8L77.8,3.1ZM25.8,2.9L26.2,3.0L25.8,3.0L25.3,3.3L24.8,3.3L24.2,3.2L23.9,3.1L23.9,3.0L24.1,3.0L23.6,3.0L23.3,2.9L23.1,2.7L23.3,2.6L23.5,2.5L23.8,2.5L23.7,2.4L24.3,2.4L24.7,2.6L25.2,2.6L25.6,2.7L25.8,2.9ZM31.0,1.9L31.7,1.9L32.3,2.0L32.8,2.0L32.8,2.1L32.1,2.2L31.5,2.3L31.2,2.4L31.8,2.4L31.2,2.5L30.7,2.6L30.2,2.8L29.7,2.9L29.5,2.9L28.6,3.0L29.0,3.0L28.8,3.1L29.1,3.2L28.8,3.3L28.4,3.4L28.2,3.5L27.8,3.6L27.9,3.6L28.4,3.6L28.4,3.7L27.6,3.8L26.9,3.8L26.1,3.8L25.7,3.8L25.1,3.8L25.1,3.6L25.6,3.6L25.5,3.4L25.7,3.3L26.4,3.5L26.0,3.3L25.6,3.2L25.8,3.1L26.3,3.1L26.4,3.0L26.0,2.9L25.9,2.7L26.6,2.7L26.8,2.8L27.3,2.6L26.6,2.6L25.7,2.6L25.2,2.5L24.9,2.4L24.6,2.3L24.6,2.3L25.0,2.2L25.3,2.2L25.8,2.1L26.3,2.0L26.6,2.1L26.9,2.1L27.1,2.0L27.5,1.9L28.0,1.9L28.8,1.9L29.0,1.9L29.8,1.9L30.4,1.9L31.0,1.9ZM42.5,1.8L44.2,2.0L43.7,2.1L42.6,2.1L41.1,2.2L41.3,2.2L42.3,2.2L43.1,2.3L43.6,2.2L43.9,2.3L43.6,2.5L44.3,2.4L45.6,2.2L46.5,2.3L46.6,2.4L45.5,2.6L45.3,2.7L44.4,2.7L45.1,2.7L44.8,2.9L44.5,3.1L44.5,3.4L44.9,3.6L44.4,3.6L44.0,3.7L44.5,3.9L44.6,4.1L44.3,4.1L44.6,4.4L44.0,4.4L44.3,4.5L44.2,4.6L43.8,4.6L43.5,4.6L43.8,4.8L43.8,4.9L43.3,4.8L43.1,4.9L43.5,5.0L43.9,5.1L44.0,5.4L43.5,5.4L43.2,5.3L42.9,5.2L43.0,5.3L42.7,5.5L43.4,5.5L43.8,5.5L43.0,5.8L42.3,6.0L41.5,6.1L41.2,6.1L40.9,6.2L40.5,6.5L39.9,6.7L39.7,6.7L39.3,6.8L38.9,6.8L38.7,7.0L38.7,7.2L38.6,7.4L38.1,7.6L38.2,7.8L38.1,8.0L38.0,8.3L37.6,8.3L37.1,8.1L36.6,8.1L36.3,7.9L36.1,7.7L35.7,7.3L35.5,7.1L35.5,6.9L35.1,6.6L35.2,6.4L35.0,6.3L35.3,6.0L35.7,5.9L35.8,5.8L35.9,5.6L35.6,5.7L35.4,5.7L35.2,5.8L34.8,5.7L34.8,5.5L34.9,5.3L35.2,5.3L35.7,5.4L35.2,5.2L35.0,5.1L34.7,5.2L34.5,5.1L34.8,4.8L34.6,4.7L34.4,4.5L34.1,4.2L33.7,4.1L33.7,4.0L33.0,3.9L32.4,3.8L31.6,3.9L31.0,3.9L30.6,3.8L30.2,3.6L30.9,3.5L31.5,3.5L30.3,3.4L29.6,3.3L29.7,3.2L30.7,3.1L31.7,2.9L31.9,2.8L31.1,2.7L31.3,2.6L32.3,2.4L32.7,2.4L32.6,2.3L33.3,2.2L34.1,2.2L35.0,2.2L35.3,2.3L36.0,2.1L36.7,2.2L37.1,2.2L37.6,2.3L37.0,2.2L37.0,2.0L37.9,1.9L38.9,1.9L39.3,1.8L40.3,1.8L42.5,1.8Z"/>
          ${dots}
        </svg><div class="bento-map-legend"><span><i style="background:var(--violet)"></i>${String(yearNow).slice(2)}</span><span><i style="background:var(--petrol)"></i>${String(yearNext).slice(2)}</span></div></div>`;
      }
      tiles.push(`<div class="bento-tile" onclick="openDetail('urlaub')">
        <div class="bento-head"><span class="bento-title">Urlaubsbudget ${jahr}</span></div>
        <div class="bento-primary ${pos?'pos':'neg'}">${fmt(urlaubRest)}</div>
        <div class="bento-foot bento-foot-col">${map}</div>
      </div>`);
    }
  }

  // RESTURLAUB: laufendes und kommendes Jahr
  {
    const j0 = new Date().getFullYear();
    const a0 = resturlaubJahr(j0), a1 = resturlaubJahr(j0 + 1);
    // Balkenfarbe bleibt gruen/orange/rot als Signal, die Zahlen selbst sind weiss –
    // eine Warnfarbe erscheint dort nur bei knappem oder aufgebrauchtem Resturlaub.
    const farbe = r => r < 0 ? 'var(--danger)' : r <= 5 ? 'var(--orange)' : 'var(--green)';
    const textFarbe = r => r < 0 ? 'var(--danger)' : r <= 5 ? 'var(--orange)' : 'var(--text)';
    const zahl = r => Number.isInteger(r) ? String(r) : r.toFixed(1).replace('.', ',');
    const zeile = a => {
      const pct = Math.max(0, Math.min(100, (a.rest / URLAUB_ANSPRUCH) * 100));
      return `<div class="ru-mini">
        <div class="ru-mini-top"><span>${a.jahr}</span><span style="color:${textFarbe(a.rest)}">${zahl(a.rest)} / ${URLAUB_ANSPRUCH}</span></div>
        <div class="bento-progress"><span class="bento-progress-fill" style="width:${pct}%;background:${farbe(a.rest)}"></span></div>
      </div>`;
    };
    tiles.push(`<div class="bento-tile" onclick="openDetail('urlaub')">
      <div class="bento-head"><span class="bento-title">Resturlaub ${j0}</span></div>
      <div class="bento-primary" style="color:${textFarbe(a0.rest)}">${zahl(a0.rest)}<span class="bento-unit">Tage</span></div>
      <div class="bento-foot bento-foot-col">${zeile(a0)}${zeile(a1)}</div>
    </div>`);
  }

  // VERTRÄGE & VERSICHERUNGEN: Anzahl + Monatssumme + Kündigungs-Timeline
  {
    const vAll = data.v.slice();
    if (vAll.length) {
      const monatlich = vAll.reduce((s,e) => s + toMonthly(Number(e.amount)||0, e.period), 0);
      const today = new Date(); today.setHours(0,0,0,0);
      const MS = 86400000;
      const radar = [];
      vAll.forEach(e => {
        const st = parseDeDate(e.startDate);
        const days = parseNoticeDays(e.noticePeriod);
        if (!st || days == null) return;
        const deadline = new Date(st.getTime() - days * MS);
        radar.push({ e, deadline, daysLeft: Math.round((deadline - today)/MS) });
      });
      radar.sort((a,b) => a.deadline - b.deadline);
      const upcoming = radar.slice(0,3);
      const MON = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
      let timeline = '';
      if (upcoming.length) {
        timeline = upcoming.map(r => { const d = r.deadline; const warn = r.daysLeft <= 60; return `<div class="bento-list-row"><span class="bl${warn?' warn':''}">${esc(r.e.name)}</span><span class="bv">${MON[d.getMonth()]} ${String(d.getFullYear()).slice(2)}</span></div>`; }).join('');
        timeline = `<div class="bento-list">${timeline}</div>`;
      } else {
        timeline = `<div class="bento-mini">Keine Kündigungsfristen</div>`;
      }
      tiles.push(`<div class="bento-tile" onclick="openDetail('v')">
        <div class="bento-head"><span class="bento-title">Verträge</span></div>
        <div class="bento-primary">${fmt(monatlich)}<span class="bento-unit">mtl.</span></div>
        <div class="bento-foot">${timeline}</div>
      </div>`);
    }
  }

  // ALTERSVORSORGE: m + e gleichformatig, Fortschrittsbalken bis 67
  if (data.a.length) {
    const { m, e } = avNominalBase();
    if (m > 0 || e > 0) {
      const rows = [];
      if (m > 0) rows.push(`<div class="bento-list-row av"><span class="bl">Monatlich</span><span class="bv">${fmt(m)}</span></div>`);
      if (e > 0) rows.push(`<div class="bento-list-row av"><span class="bl">Einmalig</span><span class="bv">${fmt(e)}</span></div>`);
      // Fortschritt: Anteil der Lebensarbeitszeit bis 67 bereits vergangen
      const now = new Date();
      const totalMs = new Date(BIRTH_DATE.getFullYear() + RETIREMENT_AGE, BIRTH_DATE.getMonth(), BIRTH_DATE.getDate()) - BIRTH_DATE;
      const pct = Math.min(100, Math.max(0, Math.round(((now - BIRTH_DATE) / totalMs) * 100)));
      const yearsLeft = Math.max(0, Math.round(monthsToRetirement() / 12));
      const avRate = data.a.reduce((s,x) => s + toMonthly(Number(x.amount)||0, x.period), 0);
      tiles.push(`<div class="bento-tile" onclick="openDetail('a')">
        <div class="bento-head"><span class="bento-title">Altersvorsorge</span></div>
        <div class="bento-primary">${fmt(avRate)}<span class="bento-unit">mtl.</span></div>
        <div class="bento-list" style="margin-top:8px">${rows.join('')}</div>
        <div class="bento-foot bento-foot-col"><div class="bento-progress"><span class="bento-progress-fill" style="width:${pct}%"></span></div><div class="bento-caption" style="margin-top:4px">noch ${yearsLeft} Jahre bis 67</div></div>
      </div>`);
    }
  }

  const bento = $('bento'), bentoTag = $('bento-tag');
  if (tiles.length) {
    bento.innerHTML = tiles.join('');
    bento.style.display = '';
    bentoTag.style.display = '';
  } else {
    bento.style.display = 'none';
    bentoTag.style.display = 'none';
  }
}

function renderDashboard() {
  recordSnapshot();
  renderHeroBento();
  const tV = sectionMonthlyTotal('v');
  const tB = sectionMonthlyTotal('b');
  const tA = sectionMonthlyTotal('a');
  const totalExpenses = tV + tB + tA;
  const avail = Math.max(income - totalExpenses, 0);

  // Donut segments
  const COLORS = { v: '#0a84ff', b: '#bf5af2', a: '#30d158', avail: 'rgba(235,235,245,0.35)' };
  const segs = [
    { key:'v', name:'Versicherungen & Verträge', val:tV, color:COLORS.v },
    { key:'b', name:'Konsum, Urlaub & Sparen',    val:tB, color:COLORS.b },
    { key:'a', name:'Altersvorsorge',             val:tA, color:COLORS.a },
  ];
  if (income > 0) segs.push({ key:'avail', name:'Verfügbar', val:avail, color:COLORS.avail });

  const donutBase = income > 0 ? income : totalExpenses;
  const svg = $('donut-svg');
  const cx=60, cy=60, rad=46, sw=15, C=2*Math.PI*rad;
  let parts = `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"/>`;
  if (donutBase > 0) {
    let offset = 0;
    segs.forEach(s => {
      if (s.val <= 0) return;
      const frac = s.val / donutBase;
      const len = frac * C;
      parts += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
      offset += len;
    });
  }
  svg.innerHTML = parts;
  $('donut-center-val').textContent = income > 0 ? fmtShort(income) : (totalExpenses > 0 ? fmtShort(totalExpenses) : '–');
  document.querySelector('.donut-center-label').textContent = income > 0 ? 'Netto' : 'Ausgaben';

  // Legend
  const legend = $('dash-legend');
  if (donutBase > 0) {
    legend.innerHTML = segs.filter(s => s.val > 0).map(s => {
      const pct = Math.round(s.val / donutBase * 100);
      return `<div class="legend-row"><span class="legend-dot" style="background:${s.color}"></span><span class="legend-name">${s.name}</span><span class="legend-val">${fmt(s.val)}</span><span class="legend-pct">${pct}%</span></div>`;
    }).join('');
    if (income > 0 && totalExpenses > income) {
      legend.innerHTML += `<div class="legend-row" style="margin-top:2px"><span class="legend-dot" style="background:var(--danger)"></span><span class="legend-name" style="color:var(--danger)">Über Budget</span><span class="legend-val" style="color:var(--danger)">${fmt(totalExpenses - income)}</span><span class="legend-pct"></span></div>`;
    }
  } else {
    legend.innerHTML = '<div class="dash-empty">Noch keine Daten.</div>';
  }

  // Gesamtvermögen = Kontostände (außer Girokonten) + private Altersvorsorge
  const balanceSum = data.b.reduce((s,e) => s + (isGiro(e) ? 0 : (e.balance || 0)), 0);
  const pensionSum = data.a.reduce((s,e) => s + (e.cat === 'Privat' ? (e.current || 0) : 0), 0);
  const wealth = balanceSum + pensionSum;
  const wEl = $('wealth-val');
  const wSub = $('wealth-sub');
  if (wealth > 0) {
    wEl.textContent = fmt(wealth);
    const parts = [];
    if (balanceSum > 0) parts.push('Vermögen ' + fmt(balanceSum));
    if (pensionSum > 0) parts.push('Vorsorge ' + fmt(pensionSum));
    wSub.textContent = parts.join(' · ');
  } else {
    wEl.textContent = '–';
    wSub.textContent = 'Stände eintragen';
  }

  // Sparquoten: Anteil vom Netto-Einkommen, konsistent je Kategorie abgeleitet (AV / Sparen / Urlaub)
  const srWrap = $('dash-saverates');
  const srBars = $('saverate-bars');
  if (income > 0) {
    const avMonthly = data.a.reduce((s,e) => s + toMonthly(e.amount, e.period), 0);
    const sparMonthly = data.b.reduce((s,e) => s + (isGiro(e) || e.cat !== 'Sparen' ? 0 : toMonthly(e.amount, e.period)), 0);
    const urlaubMonthly = data.b.reduce((s,e) => s + (isGiro(e) || e.cat !== 'Urlaub' ? 0 : toMonthly(e.amount, e.period)), 0);
    const rows = [
      { name: 'Altersvorsorge', val: avMonthly, color: COLORS.a },
      { name: 'Sparen',         val: sparMonthly, color: COLORS.b },
      { name: 'Urlaub',         val: urlaubMonthly, color: '#f0c060' }
    ].filter(r => r.val > 0);
    if (rows.length) {
      srWrap.style.display = '';
      srBars.innerHTML = rows.map(r => {
        const pct = Math.round(r.val / income * 100);
        return `<div class="acct-row"><span class="acct-row-name">${r.name}</span><span class="acct-row-val">${fmt(r.val)}</span><span class="acct-row-pct">${pct}%</span></div>`;
      }).join('');
    } else {
      srWrap.style.display = 'none';
    }
  } else {
    srWrap.style.display = 'none';
  }

  // Gesamtvermögensverlauf (history)
  const whWrap = $('dash-wealth-hist');
  if (history.length >= 1) {
    whWrap.style.display = '';
    const wh = histSlice(history);
    renderHistoryChart('wealth-hist-chart', wh.map(histLabel), [
      { points: wh.map(h => h.wealth), color: COLORS.a, label: 'Gesamtvermögen' }
    ], { hideRange: true });
  } else {
    whWrap.style.display = 'none';
  }

  // Expenses by account (across all sections)
  const acctTotals = {};
  ['v','b','a'].forEach(sec => data[sec].forEach(e => {
    const acc = e.account || '— ohne Konto —';
    acctTotals[acc] = (acctTotals[acc] || 0) + toMonthly(e.amount, e.period);
  }));
  const accRows = Object.entries(acctTotals).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]);
  const accTotal = accRows.reduce((s,[,v]) => s + v, 0);
  const accWrap = $('dash-accounts');
  const barsEl = $('account-bars');
  if (accRows.length) {
    accWrap.style.display = '';
    barsEl.innerHTML = accRows.map(([name,val]) => {
      const pct = accTotal > 0 ? Math.round(val/accTotal*100) : 0;
      return `<div class="acct-row"><span class="acct-row-name">${esc(name)}</span><span class="acct-row-val">${fmt(val)}</span><span class="acct-row-pct">${pct}%</span></div>`;
    }).join('');
  } else {
    accWrap.style.display = 'none';
  }

  // Account balances: only show selected accounts (per account total + breakdown by category)
  const BALANCE_ACCOUNTS = ['Scalable Tagesgeld'];
  const balByAcct = {};
  data.b.forEach(e => {
    if (e.balance == null) return;
    if (!BALANCE_ACCOUNTS.includes(e.account)) return;
    const acc = e.account || '— ohne Konto —';
    if (!balByAcct[acc]) balByAcct[acc] = { total: 0, cats: {} };
    balByAcct[acc].total += e.balance;
    balByAcct[acc].cats[e.cat] = (balByAcct[acc].cats[e.cat] || 0) + e.balance;
  });
  const balRows = Object.entries(balByAcct).filter(([,o]) => o.total > 0).sort((a,b) => b[1].total - a[1].total);
  const balWrap = $('dash-balances');
  const balEl = $('balance-bars');
  if (balRows.length) {
    balWrap.style.display = '';
    balEl.innerHTML = balRows.map(([name,o]) => {
      const breakdown = Object.entries(o.cats).filter(([,v]) => v > 0).sort((a,b)=>b[1]-a[1])
        .map(([c,v]) => `<div class="bal-break-row"><span>${esc(c)}</span><span>${fmt(v)}</span></div>`).join('');
      return `<div class="bal-acct-row"><div class="bal-acct-head"><span class="bal-acct-name">${esc(name)}</span><span class="bal-acct-total">${fmt(o.total)}</span></div><div class="bal-acct-break">${breakdown}</div></div>`;
    }).join('');
  } else {
    balWrap.style.display = 'none';
  }
}

function onIncomeInput() {
  income = parseMoney($('income-input').value) || 0;
  store.set(INCOME_KEY, String(income));
  updateIncome();
}

// Stand ausgewählter Sparen-Einträge am Monatsersten einmalig um die Rate erhöhen.
// Aktueller (ggf. manuell korrigierter) Stand + Monatsrate. Verpasste Monate werden nicht nachgebucht.
function applyAutoGrow() {
  const ymNow = new Date().getFullYear() * 12 + new Date().getMonth();
  let changed = false;
  (data.b || []).forEach(e => {
    if (!e.autoGrow) return;
    if (e.autoGrowYM == null) { e.autoGrowYM = ymNow; changed = true; return; }  // verankern, nicht buchen
    if (ymNow > e.autoGrowYM) {
      e.balance = (e.balance || 0) + toMonthly(e.amount || 0, e.period || 'monatlich');
      e.autoGrowYM = ymNow;        // nur einmal pro Monat, keine Mehrfach-Nachbuchung
      changed = true;
    }
  });
  if (changed) store.set(SECTIONS.b.storageKey, JSON.stringify(data.b));
}

function renderAll() { renderSection('v'); renderSection('b'); renderSection('a'); renderAvDash(); renderBonus(); renderUrlaubeAll(); renderVertragDash(); updateIncome(); }

// 4. Dashboard: alle Versicherungen & Verträge (nicht Abonnement/Verein)
// Parst "TT.MM.JJJJ" -> Date (oder null)


// Stichtag immer als TT.MM.JJJJ anzeigen (egal ob intern ISO oder deutsch)


/* --- Datums-Eingabehelfer (identisch zur Reisen-App) ---
   Tippen ohne Trennzeichen (10092026 -> 10.09.2026) und Normalisieren beim Verlassen
   (10.9.26 -> 10.09.2026). Gespeichert wird weiterhin als TT.MM.JJJJ. */

/* Normalisiert beim Verlassen auf TT.MM.JJJJ. Ungültiges bleibt stehen zum Korrigieren. */

/* Einmalige Migration: gespeicherte Datumsangaben (Stichtag, Abbuchung, Bonus-Verfall)
   von TT.MM.JJJJ auf ISO umstellen. Anzeige & Parsing lesen beide Formate -> gefahrlos. */
(function migrateDatesToISO(){
  const changed = { v:false, b:false, a:false, bonus:false };
  const conv = (obj, key, flag) => {
    const v = obj && obj[key];
    if (typeof v === 'string' && /^\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}$/.test(v)) {
      const iso = deToISO(v);
      if (iso && iso !== v) { obj[key] = iso; changed[flag] = true; }
    }
  };
  ['v','b','a'].forEach(sec => { (data[sec] || []).forEach(e => { conv(e,'startDate',sec); }); });
  (typeof bonus !== 'undefined' ? bonus : []).forEach(e => conv(e,'expiry','bonus'));
  if (changed.v) store.set(SECTIONS.v.storageKey, JSON.stringify(data.v));
  if (changed.b) store.set(SECTIONS.b.storageKey, JSON.stringify(data.b));
  if (changed.a) store.set(SECTIONS.a.storageKey, JSON.stringify(data.a));
  if (changed.bonus) store.set(BONUS_KEY, JSON.stringify(bonus));
})();

// Parst Kündigungsfrist-Freitext ("4 Monate", "6 Wochen", "30 Tage") -> Tage (oder null)
function parseNoticeDays(s) {
  if (!s) return null;
  const m = String(s).trim().match(/(\d+)\s*(jahr|monat|woche|tag)/i);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit.startsWith('jahr')) return n * 365;
  if (unit.startsWith('monat')) return n * 30;
  if (unit.startsWith('woche')) return n * 7;
  return n; // Tage
}

// --- Fällig diesen Monat: anstehende Abbuchungen aus den Vertragsdaten ---
// Nutzt das Abbuchungsdatum (Tag, ggf. Monat) + Intervall des Eintrags.
function dueThisMonth() {
  const today = new Date();
  const curM = today.getMonth() + 1, curY = today.getFullYear(), curD = today.getDate();
  const daysInM = new Date(curY, curM, 0).getDate();
  const out = [];
  data.v.forEach(e => {
    if (!e.debitDate) return;
    const m = String(e.debitDate).trim().match(/^(\d{1,2})(?:\.(\d{1,2}))?/);
    if (!m) return;
    const day = Math.min(parseInt(m[1], 10), daysInM);
    if (day < 1) return;
    const anchorMonth = m[2] ? parseInt(m[2], 10) : null;
    const per = e.period || 'monatlich';
    let due = false;
    if (per === 'monatlich') due = true;
    else if (per === 'vierteljährlich') due = anchorMonth != null && (((curM - anchorMonth) % 3) + 3) % 3 === 0;
    else if (per === 'jährlich') due = anchorMonth === curM;
    if (!due || day < curD) return;  // nicht fällig oder schon abgebucht
    out.push({ e, day });
  });
  out.sort((a, b) => a.day - b.day || (a.e.name || '').localeCompare(b.e.name || '', 'de'));
  return out;
}

function dueThisMonthHTML() {
  const due = dueThisMonth();
  if (!due.length) return '';
  const curM = String(new Date().getMonth() + 1).padStart(2, '0');
  const sum = due.reduce((s, d) => s + (Number(d.e.amount) || 0), 0);
  let html = `<div class="uy-konto-head"><span>Fällig diesen Monat</span><b>${fmt(sum)}</b><span class="saverate-eur">${due.length === 1 ? '1 Abbuchung steht an' : due.length + ' Abbuchungen stehen an'}</span></div>`;
  html += `<div class="due-list">`;
  due.forEach(d => {
    html += `<div class="due-row"><span class="due-date">${String(d.day).padStart(2, '0')}.${curM}.</span><span class="due-name">${esc(d.e.name)}${d.e.provider ? `<span class="due-prov"> · ${esc(d.e.provider)}</span>` : ''}</span><span class="due-amount">${fmt(d.e.amount)}</span></div>`;
  });
  html += `</div><div class="uc-divider" style="margin:14px 0"></div>`;
  return html;
}

function renderVertragDash() {
  const body = $('vertrag-dash-body');
  if (!body) return;
  const cats = ['Versicherung', 'Vertrag'];
  const all = data.v.filter(e => cats.includes(e.cat));

  // Nur Einträge mit Stichtag UND Kündigungsfrist, beide parsebar
  const today = new Date(); today.setHours(0,0,0,0);
  const MS = 86400000;
  const radar = [];
  all.forEach(e => {
    const stichtag = parseDeDate(e.startDate);
    const days = parseNoticeDays(e.noticePeriod);
    if (!stichtag || days == null) return;
    const deadline = new Date(stichtag.getTime() - days * MS);
    const daysLeft = Math.round((deadline - today) / MS);
    radar.push({ e, stichtag, deadline, daysLeft });
  });
  radar.sort((a,b) => a.deadline - b.deadline);

  const nTotal = all.length;
  const nRadar = radar.length;
  const fmtD = (d) => `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;

  let html = dueThisMonthHTML();
  html += `<div class="uy-konto-head"><span>Kündigungs-Radar</span><b>${nRadar}</b><span class="saverate-eur">${nRadar === 1 ? '1 Vertrag mit Frist' : nRadar + ' Verträge mit Frist'}${nTotal > nRadar ? ` · ${nTotal - nRadar} ohne Daten` : ''}</span></div>`;

  if (!nRadar) {
    html += `<div class="av-empty">Keine Verträge mit Stichtag und Kündigungsfrist hinterlegt.</div>`;
    body.innerHTML = html;
    return;
  }

  const restLabel = (d) => {
    if (d < 0) return `seit ${Math.abs(d)} ${Math.abs(d) === 1 ? 'Tag' : 'Tagen'} vorbei`;
    if (d === 0) return 'heute';
    if (d < 60) return `in ${d} ${d === 1 ? 'Tag' : 'Tagen'}`;
    const months = Math.round(d / 30);
    return `in ca. ${months} ${months === 1 ? 'Monat' : 'Monaten'}`;
  };

  html += `<div class="vd-group">`;
  radar.forEach(r => {
    const urgent = r.daysLeft < 60;
    html += `<div class="vd-card${urgent ? ' vd-urgent' : ''}">
      <div class="vd-head"><span class="vd-name">${esc(r.e.name)}</span>${r.e.provider ? `<span class="vd-prov">${esc(r.e.provider)}</span>` : ''}</div>
      <div class="vd-row"><span class="vd-key">Vertragsende</span><span class="vd-val">${fmtD(r.stichtag)}</span></div>
      <div class="vd-row"><span class="vd-key">Kündbar bis</span><span class="vd-val${urgent ? ' vd-val-urgent' : ''}">${fmtD(r.deadline)}</span></div>
      <div class="vd-row"><span class="vd-key">Restzeit</span><span class="vd-val${urgent ? ' vd-val-urgent' : ''}">${restLabel(r.daysLeft)}</span></div>
    </div>`;
  });
  html += `</div>`;
  body.innerHTML = html;
}
function renderAvDash() {
  const dash = $('av-dash');
  if (!dash) return;
  const entries = data.a;
  dash.style.display = '';
  if (!entries.length) {
    $('av-table').innerHTML = '<div class="av-empty">Noch keine Altersvorsorge-Einträge. Lege unten in der Altersvorsorge-Sektion welche an.</div>';
    renderPensionHistory();
    return;
  }

  const mo = monthsToRetirement();
  const CATS = ['Gesetzlich','Betrieblich','Privat'];

  // Totals card with scenario dropdown
  const totalCurReal = entries.reduce((s,e) => s + (e.current||0), 0);
  const avKontoEl = $('av-kontostand');
  if (avKontoEl) avKontoEl.innerHTML = `
    <div class="uy-konto-head">
      <span>Aktueller Kontostand</span>
      <b>${fmt(totalCurReal)}</b>
      <span class="saverate-eur">&nbsp;</span>
    </div>`;
  let totalBaseM = 0, totalBaseE = 0;
  entries.forEach(e => {
    let proj, ptype;
    if (e.cat === 'Privat') {
      proj = toRealValue((e.current||0) + toMonthly(e.amount||0, e.period) * mo);
      ptype = 'einmal';
    } else { proj = toRealValue(e.projected); ptype = e.cat === 'Gesetzlich' ? 'monatlich' : e.projectedType; }
    if (!proj) return;
    if (ptype === 'monatlich') totalBaseM += proj;
    else totalBaseE += proj;
  });
  const totalBaseParts = [];
  if (totalBaseM > 0) totalBaseParts.push(fmt(totalBaseM) + ' (m)');
  if (totalBaseE > 0) totalBaseParts.push(fmt(totalBaseE) + ' (e)');

  const SCENARIO_OPTS = [
    {label:'Basis', val:'base'},
    {label:'1 %', val:'1'},
    {label:'2 %', val:'2'},
    {label:'3 %', val:'3'},
    {label:'4 %', val:'4'},
    {label:'6 %', val:'6'}
  ];
  const gesamtCard = `<div class="av-card av-card-total">
    <div class="av-mode-toggle">
      <button class="av-mode-btn ${avViewMode==='nominal'?'active':''}" onclick="setAvViewMode('nominal')">Nominal</button>
      <button class="av-mode-btn ${avViewMode==='real'?'active':''}" onclick="setAvViewMode('real')">Inflation 2 %</button>
    </div>
    <div class="av-card-total-scenario">
      <select class="av-scenario-select" id="av-scenario-sel" onchange="updateAvScenario()">
        ${SCENARIO_OPTS.map(o=>`<option value="${o.val}">${o.label}</option>`).join('')}
      </select>
      <span class="av-card-total-val" id="av-scenario-val">${totalBaseParts.join(' + ') || '–'}</span>
    </div>
  </div>`;

  function metricCell(cls, label, amt, type) {
    const typeLine = type ? `<span class="av-card-metric-type">${type}</span>` : '';
    return `<div class="av-card-metric ${cls}">
      <span class="av-card-metric-label">${label}</span>
      <span class="av-card-metric-val">${amt}</span>
      ${typeLine}
    </div>`;
  }

  // Build a single card for one position (entry)
  function buildPositionCard(e) {
    const cat = e.cat;
    const isPrivat = cat === 'Privat';
    const cur = e.current || 0;
    const curTxt = cur > 0 ? fmtShort(cur) : '–';

    // Base "Rente" – immer nominal (Inflation nur auf Gesamtsumme oben)
    let baseAmt = '–', baseType = '';
    if (isPrivat) {
      const v = (e.current||0) + toMonthly(e.amount||0, e.period) * mo;
      if (v > 0) { baseAmt = fmtShort(v); baseType = '(e)'; }
    } else if (e.projected != null) {
      const ptype = cat === 'Gesetzlich' ? 'monatlich' : e.projectedType;
      baseAmt = fmtShort(e.projected);
      baseType = ptype === 'monatlich' ? '(m)' : '(e)';
    }

    // Scenarios – immer nominal
    let s1amt='–', s2amt='–', s3amt='–', sType='';
    let s1label, s2label, s3label;
    if (isPrivat) {
      s1label='2 %'; s2label='4 %'; s3label='6 %'; sType='(e)';
      const cu=e.current||0, mon=toMonthly(e.amount||0,e.period);
      s1amt=fmtShort(projectValue(cu,mon,0.02,mo));
      s2amt=fmtShort(projectValue(cu,mon,0.04,mo));
      s3amt=fmtShort(projectValue(cu,mon,0.06,mo));
    } else {
      s1label='1 %'; s2label='2 %'; s3label='3 %';
      sType = cat === 'Gesetzlich' ? '(m)' : (e.growthType === 'monatlich' ? '(m)' : '(e)');
      if (e.growth1) s1amt = fmtShort(e.growth1);
      if (e.growth2) s2amt = fmtShort(e.growth2);
      if (e.growth3) s3amt = fmtShort(e.growth3);
    }

    return `<div class="av-card">
      <div class="av-card-head">
        <span class="av-card-cat av-card-name">${esc(e.name)}</span>
        <span class="av-card-cur">Aktuell: ${curTxt}</span>
      </div>
      <div class="av-card-metrics">
        ${metricCell('base','Rente', baseAmt, baseType)}
        ${metricCell('s1', s1label, s1amt, s1amt !== '–' ? sType : '')}
        ${metricCell('s2', s2label, s2amt, s2amt !== '–' ? sType : '')}
        ${metricCell('s3', s3label, s3amt, s3amt !== '–' ? sType : '')}
      </div>
    </div>`;
  }

  // Group cards by category with a category heading
  const groups = CATS.map(cat => {
    const es = entries.filter(e => e.cat === cat);
    if (!es.length) return '';
    const catCur = es.reduce((s,e) => s + (e.current||0), 0);
    const positionCards = es.map(buildPositionCard).join('');
    return `<div class="av-group">
      <div class="av-group-head">
        <span class="av-group-cat" data-cat="${cat}">${cat}</span>
        <span class="av-group-cur">Aktuell: ${fmtShort(catCur)}</span>
      </div>
      ${positionCards}
    </div>`;
  }).join('');

  const pensionHistBlock = `<div id="dash-pension-hist" class="av-hist-block">
      <div class="hist-head"><span class="dash-sub-label">Altersvorsorgeverlauf</span><span class="hist-range-ctl" data-target="pension"></span></div>
          <div id="pension-hist-chart"></div>
    </div>`;
  $('av-table').innerHTML = `<div class="av-cards">${pensionHistBlock}${gesamtCard}${groups}</div><div class="av-legend">(m) = monatlich · (e) = einmalig</div>`;
  // Init scenario display
  updateAvScenario();
  renderPensionHistory();
}

function renderPensionHistory() {
  const phWrap = $('dash-pension-hist');
  if (!phWrap) return;
  if (history.length >= 1 && data.a.length) {
    phWrap.style.display = '';
    const ph = histSlice(history);
    renderHistoryChart('pension-hist-chart', ph.map(histLabel), [
      { points: ph.map(h => h.pension), color: '#30d158', label: 'Vorsorge gesamt' }
    ]);
  } else {
    phWrap.style.display = 'none';
  }
}

function updateAvScenario() {
  const sel = $('av-scenario-sel');
  const val = $('av-scenario-val');
  if (!sel || !val) return;
  const pct = sel.value;
  const mo = monthsToRetirement();
  let monthly = 0, einmal = 0;
  if (pct === 'base') {
    data.a.forEach(e => {
      let proj, ptype;
      if (e.cat === 'Privat') { proj=toRealValue((e.current||0)+toMonthly(e.amount||0,e.period)*mo); ptype='einmal'; }
      else { proj=toRealValue(e.projected); ptype = e.cat === 'Gesetzlich' ? 'monatlich' : e.projectedType; }
      if (!proj) return;
      if (ptype==='monatlich') monthly+=proj; else einmal+=proj;
    });
  } else {
    const p = parseInt(pct);
    data.a.forEach(e => {
      if (e.cat === 'Privat') {
        const rate = p >= 6 ? 0.06 : p >= 4 ? 0.04 : 0.02;
        einmal += toRealValue(projectValue(e.current||0, toMonthly(e.amount||0,e.period), rate, mo));
      } else {
        // Gesetzlich is always monthly; Betrieblich uses its stored type
        const gtype = e.cat === 'Gesetzlich' ? 'monatlich' : (e.growthType || 'einmal');
        const g1=e.growth1||0, g2=e.growth2||0, g3=e.growth3||0;
        const vRaw = p >= 3 ? (g3||g2||g1) : p === 2 ? (g2||g1) : g1;
        if (!vRaw) return;
        const v = toRealValue(vRaw);
        if (gtype==='monatlich') monthly+=v; else einmal+=v;
      }
    });
  }
  const parts = [];
  if (monthly > 0) parts.push(fmt(monthly) + ' (m)');
  if (einmal  > 0) parts.push(fmt(einmal)  + ' (e)');
  val.textContent = parts.join(' + ') || '–';
}

function setAvViewMode(mode) {
  avViewMode = mode;
  store.set('av_view_mode_v1', mode);
  renderAvDash();
}

const COLLAPSE_KEY = 'collapsed_sections_v1';
let collapsedSections = safeParse(store.get(COLLAPSE_KEY), []);
function applyCollapsedStates() {
  ['v','b','a','bonus','urlaub'].forEach(s => {
    const body = $('body-' + s);
    const head = body ? body.previousElementSibling : null;
    const collapsed = collapsedSections.includes(s);
    if (body) body.classList.toggle('collapsed', collapsed);
    if (head && head.classList.contains('sub-header')) head.classList.toggle('collapsed', collapsed);
  });
}
function toggleSection(s) {
  const i = collapsedSections.indexOf(s);
  if (i >= 0) collapsedSections.splice(i, 1);
  else collapsedSections.push(s);
  store.set(COLLAPSE_KEY, JSON.stringify(collapsedSections));
  applyCollapsedStates();
}

function renderBonus() {
  const list = $('list-bonus');
  const empty = $('empty-bonus');
  list.innerHTML = '';
  empty.style.display = bonus.length ? 'none' : 'block';
  [...bonus].sort((a,b)=>a.name.localeCompare(b.name)).forEach(e => {
    const subLines = [];
    if (e.expiry) subLines.push('Verfall: ' + esc(displayDate(e.expiry)));
    const subLinesHtml = subLines.length
      ? `<div class="entry-sub">${subLines.map(l => `<div>${l}</div>`).join('')}</div>`
      : '';
    const div = swipeWrapEl('bonus', e.id, entryCardHTML(
      `<div class="entry-name">${esc(e.name)}</div>
            ${subLinesHtml}`,
      e.points ? `<div class="entry-amount">${esc(e.points)}</div>` : '',
      `openBonusModal('${e.id}')`
    ));
    list.appendChild(div);
    attachSwipeBonus(div, e.id);
  });
}

function attachSwipeBonus(wrap, id) {
  attachSwipeGeneric(wrap, () => deleteBonus(id), () => openBonusModal(id));
}

function openBonusModal(id) {
  editBonusId = id || null;
  $('bonus-title').textContent = id ? 'Bonusprogramm bearbeiten' : 'Neues Bonusprogramm';
  const e = id ? bonus.find(x => x.id === id) : null;
  $('bonus-name').value   = e ? e.name : '';
  $('bonus-points').value = e ? (e.points || '') : '';
  $('bonus-expiry').value = e ? isoToDE(e.expiry || '') : '';
  oeffneOverlay('bonus-overlay', closeBonusModal);
  setTimeout(() => $('bonus-name').focus(), 60);
}

function closeBonusModal(){ schliesseOverlay('bonus-overlay'); }

function saveBonus() {
  const name   = $('bonus-name').value.trim();
  const points = $('bonus-points').value.trim();
  const expiryRaw = $('bonus-expiry').value.trim();
  const expiry = deToISO(expiryRaw) || expiryRaw;
  if (!name) { notify('Bitte einen Namen eingeben.'); return; }
  if (editBonusId) {
    const i = bonus.findIndex(x => x.id === editBonusId);
    bonus[i] = { ...bonus[i], name, points, expiry };
  } else {
    bonus.push({ id: neueId(), name, points, expiry });
  }
  store.set(BONUS_KEY, JSON.stringify(bonus));
  closeBonusModal();
  renderBonus();
}

async function deleteBonus(id) {
  await loeschenMitRueckfrage({
    liste: bonus, id,
    speichern: () => store.set(BONUS_KEY, JSON.stringify(bonus)),
    zeichnen: () => renderBonus()
  });
}

// ---- Urlaube (vacations grouped by year, budget = Urlaub-savings ×12) ----
function urlaubYear(monthStr) {
  // Expect "MM.JJJJ" or "JJJJ" -> return 4-digit year string, or null
  const m = String(monthStr || '').match(/(\d{4})/);
  return m ? m[1] : null;
}

// Monatsrate des Sparen-Eintrags "Urlaub I"
function urlaubMonthlyRate() {
  const e = data.b.find(x => x.name && x.name.trim() === 'Urlaub I');
  return e ? toMonthly(e.amount || 0, e.period || 'monatlich') : 0;
}

/* Summe aller noch nicht faelligen, bereits geplanten Zahlungen (Anzahlungen bzw. volle
   Reisekosten ohne Anzahlungsplan) ab dem aktuellen Monat - unabhaengig vom Reisejahr.
   Zeigt, wie viel vom heutigen Kontostand rechnerisch schon "verplant" ist, weil es
   demnaechst vom Konto abgebucht wird (z.B. Anzahlungen fuer einen Urlaub im Folgejahr). */
function urlaubOffeneZahlungen() {
  const now = new Date();
  const ymNow = now.getFullYear() * 12 + now.getMonth();
  let sum = 0;
  urlaube.forEach(u => {
    if (Array.isArray(u.payments) && u.payments.length) {
      u.payments.forEach(p => {
        const y = parseInt(p.y || finTripYear(u), 10);
        const m = p.m;
        if (!y || !m) return;
        if ((y * 12 + (m - 1)) >= ymNow) sum += (p.amount || 0);
      });
    } else {
      const y = parseInt(finTripYear(u), 10);
      const m = tripMonthNum(u);
      if (!y || !m) return;
      if ((y * 12 + (m - 1)) >= ymNow) sum += tripCost(u);
    }
  });
  return sum;
}

/* Tatsaechliches Reisejahr - ignoriert bewusst das u.budgetYear-Override. Fuer den
   Kontoverlauf zaehlt, wann das Geld wirklich abfliesst, nicht welches Jahresbudget
   die Reise planerisch belastet. */
function tripRealYear(u) {
  if (u.year) { const m = String(u.year).match(/\d{4}/); if (m) return m[0]; }
  return urlaubYear(u.month);
}

/* Monatsweiser Kontoverlauf (Ist-Sicht) ab dem laufenden Monat.
   Zufluesse: monatliche Sparrate + Einmaleinzahlungen (Ausgleiche bei Budgetueberschreitung).
   Abfluesse: Anzahlungen bzw. - ohne Anzahlungsplan - die vollen Reisekosten im Reisemonat.
   Startsaldo ist der heutige Kontostand; vergangene Monate werden bewusst nicht
   rekonstruiert, da dafuer keine historischen Kontodaten vorliegen. */
function urlaubKontoVerlauf(startSaldo) {
  const now = new Date();
  // Der laufende Monat ist in der Regel bereits gebucht - der Verlauf beginnt daher
  // mit dem Folgemonat, ausgehend vom heutigen Kontostand.
  const ymNow = now.getFullYear() * 12 + now.getMonth() + 1;
  const buckets = {};
  const bucket = ym => (buckets[ym] = buckets[ym] || { ym, zu: [], ab: [] });

  // Abfluesse aus Reisen
  urlaube.forEach(u => {
    if (Array.isArray(u.payments) && u.payments.length) {
      u.payments.forEach(p => {
        const y = parseInt(p.y || tripRealYear(u), 10), m = p.m;
        if (!y || !m || !(p.amount > 0)) return;
        const ym = y * 12 + (m - 1);
        if (ym >= ymNow) bucket(ym).ab.push({ label: 'Anzahlung ' + u.name, amount: p.amount });
      });
    } else {
      const y = parseInt(tripRealYear(u), 10), m = tripMonthNum(u), c = tripCost(u);
      if (!y || !m || !(c > 0)) return;
      const ym = y * 12 + (m - 1);
      if (ym >= ymNow) bucket(ym).ab.push({ label: u.name, amount: c });
    }
  });

  // Einmaleinzahlungen (Ausgleiche)
  urlaubDeposits.forEach(d => {
    const y = parseInt(String(d.y), 10), m = parseInt(String(d.m), 10), a = d.amount || 0;
    if (!y || !(m >= 1 && m <= 12) || !(a > 0)) return;
    const ym = y * 12 + (m - 1);
    if (ym >= ymNow) bucket(ym).zu.push({ label: d.note ? 'Einzahlung · ' + d.note : 'Einzahlung', amount: a });
  });

  // Zeitraum: immer bis Ende des Folgejahres, unabhaengig davon, wann die letzte
  // geplante Bewegung liegt.
  const ymEnd = (now.getFullYear() + 1) * 12 + 11;
  if (ymNow > ymEnd) return [];

  const zeilen = [];
  let saldo = startSaldo;
  for (let ym = ymNow; ym <= ymEnd; ym++) {
    const b = buckets[ym] || { ym, zu: [], ab: [] };
    const rate = rateAtYm(ym);
    const zu = (rate > 0 ? [{ label: 'Monatliche Sparrate', amount: rate }] : []).concat(b.zu);
    const summeZu = zu.reduce((s,x) => s + x.amount, 0);
    const summeAb = b.ab.reduce((s,x) => s + x.amount, 0);
    saldo += summeZu - summeAb;
    const ov = urlaubKontoOverrides[ym];
    const manuell = typeof ov === 'number' && !isNaN(ov);
    if (manuell) saldo = ov;   // Ankerpunkt: ab hier rechnet die Automatik weiter
    zeilen.push({ ym, jahr: Math.floor(ym/12), monat: (ym % 12) + 1, zu, ab: b.ab, saldo, manuell });
  }
  return zeilen;
}

/* Monats-Endsaldo manuell setzen bzw. (bei leerer Eingabe) wieder freigeben. */
function startInlineKontoSaldo(ym, el) {
  if (el.querySelector('input')) return;
  const alt = urlaubKontoOverrides[ym];
  // Vorbelegt wird immer der aktuell angezeigte Wert - so ist sichtbar, was ueberschrieben
  // wird, und es braucht keinen Platzhalter, der im schmalen Feld abgeschnitten wuerde.
  const angezeigt = typeof alt === 'number' ? alt : parseMoney(el.textContent);
  el.innerHTML = `<input type="text" class="balance-inline kv-input" inputmode="decimal" autocomplete="transaction-amount">`;
  const inp = el.querySelector('input');
  inp.value = (angezeigt != null && !isNaN(angezeigt)) ? fmt(angezeigt) : '';
  inp.focus(); inp.select && inp.select();
  let done = false;
  const commit = () => {
    if (done) return; done = true;
    const roh = inp.value.trim();
    if (!roh) delete urlaubKontoOverrides[ym];
    else {
      const v = parseMoney(roh);
      if (v != null && !isNaN(v)) urlaubKontoOverrides[ym] = v;
    }
    store.set(URLAUB_KONTO_OVERRIDE_KEY, JSON.stringify(urlaubKontoOverrides));
    renderUrlaubeAll();
  };
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); inp.blur(); } });
}

/* Startwert des Verlaufs = realer Kontostand des Sparen-Eintrags "Urlaub I". */
function startInlineKontoStart(el) {
  const e = data.b.find(x => x.name && x.name.trim() === 'Urlaub I');
  if (!e || el.querySelector('input')) return;
  el.innerHTML = `<input type="text" class="balance-inline" inputmode="decimal" autocomplete="transaction-amount">`;
  const inp = el.querySelector('input');
  inp.value = fmt(e.balance || 0);
  inp.focus(); inp.select && inp.select();
  let done = false;
  const commit = () => {
    if (done) return; done = true;
    const v = parseMoney(inp.value);
    if (v != null && !isNaN(v)) {
      e.balance = v;
      store.set(SECTIONS.b.storageKey, JSON.stringify(data.b));
      renderSection('b'); renderDashboard(); updateIncome();
    }
    renderUrlaubeAll();
  };
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); inp.blur(); } });
}

// Historie der Ratenänderungen [{ym, rate}] (ym = Jahr*12+Monat). Nur Änderungen ab jetzt.
const URLAUB_RATE_HIST_KEY = 'urlaub_rate_hist_v1';
let urlaubRateHist = safeParse(store.get(URLAUB_RATE_HIST_KEY), []);

function updateUrlaubRateHist() {
  const rate = urlaubMonthlyRate();
  const ymNow = new Date().getFullYear() * 12 + new Date().getMonth();
  const last = urlaubRateHist[urlaubRateHist.length - 1];
  if (!last) {
    urlaubRateHist.push({ ym: ymNow, rate });
  } else if (last.rate !== rate) {
    if (last.ym === ymNow) last.rate = rate;        // gleiche Monat: überschreiben
    else urlaubRateHist.push({ ym: ymNow, rate });  // neuer Monat: anhängen
  }
  store.set(URLAUB_RATE_HIST_KEY, JSON.stringify(urlaubRateHist));
}

// Rate, die in einem bestimmten Monat (ym) galt
function rateAtYm(ym) {
  let r = urlaubMonthlyRate();   // Fallback: aktuelle Rate (für Monate vor jeder Historie)
  for (const h of urlaubRateHist) { if (h.ym <= ym) r = h.rate; }
  return r;
}

// Auto-Jahresbudget = Summe der je Monat gültigen Rate, Jan–Dez des aktuellen Jahres
function computeUrlaubBudget() {
  const year = new Date().getFullYear();
  let sum = 0;
  for (let m = 0; m < 12; m++) sum += rateAtYm(year * 12 + m);
  return sum;
}

const MONTH_FULL = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function urlaubMonthNum(monthStr) {
  const m = String(monthStr || '').match(/^(\d{1,2})\./);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return (n >= 1 && n <= 12) ? n : null;
}

// Monatszahl 1-12 aus freier Eingabe ("3", "03")
function parseMonthOnly(s) {
  const m = String(s || '').match(/(\d{1,2})/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return (n >= 1 && n <= 12) ? n : null;
}

// Reisejahr eines Urlaubs (neu: u.year, alt: aus u.month MM.JJJJ)
/* ================= URLAUBSTAGE =================
   Verbrauchte Urlaubstage werden pro Reise manuell im Formular eingetragen
   (Feld "Verbrauchte Urlaubstage", u.days) statt automatisch aus Werktagen
   und Feiertagen berechnet. */
const URLAUB_ANSPRUCH = 30;   // Urlaubstage pro Jahr

/* Reisezeitraum einer Reise - faellt auf den Monatsersten zurueck, solange
   noch kein genauer Zeitraum eingetragen ist. */
function tripFrom(u){
  if(u.from) return u.from;
  const y = finTripYear(u), m = tripMonthNum(u);
  return (y && m) ? `${y}-${String(m).padStart(2,'0')}-01` : '';
}
function tripTo(u){ return u.to || tripFrom(u); }

/* Zeitraum als Text: "05.09. – 24.09.2026", bei einem Tag nur das Datum. */
function tripZeitraumText(u){
  const v = tripFrom(u), b = tripTo(u);
  if(!v) return '';
  if(!b || b === v) return isoToDE(v);
  const dv = isoToDE(v), db = isoToDE(b);
  return dv.slice(6) === db.slice(6) ? `${dv.slice(0,6)} – ${db}` : `${dv} – ${db}`;
}

function finTripYear(u) {
  if (u.budgetYear) { const m = String(u.budgetYear).match(/\d{4}/); if (m) return m[0]; }
  if (u.year) { const m = String(u.year).match(/\d{4}/); return m ? m[0] : null; }
  return urlaubYear(u.month);
}

// Reisemonat 1-12 (neu: u.month als Zahl; alt: letzte Zahlung im Plan; Legacy: MM.JJJJ)
function tripMonthNum(u) {
  if (typeof u.month === 'number' && u.month >= 1 && u.month <= 12) return u.month;
  if (Array.isArray(u.payments) && u.payments.length) {
    const ms = u.payments.map(p => (typeof p.m === 'number' ? p.m : urlaubMonthNum(p.month))).filter(Boolean);
    if (ms.length) return Math.max(...ms);
  }
  return urlaubMonthNum(u.month) || 12;
}

// Gesamtkosten der Reise (neu/Legacy: u.cost; alt: Summe der Zahlungen)
function tripCost(u) {
  if (typeof u.cost === 'number') return u.cost;
  if (Array.isArray(u.payments) && u.payments.length) return u.payments.reduce((s,p) => s + (p.amount || 0), 0);
  return 0;
}

function urlaubGroups() {
  const groups = {};
  urlaube.forEach(u => { const y = finTripYear(u) || 'ohne'; (groups[y] = groups[y] || []).push(u); });
  const years = Object.keys(groups).sort((a,b) => { if (a === 'ohne') return 1; if (b === 'ohne') return -1; return a.localeCompare(b); });
  return { groups, years };
}

function urlaubItems(group) {
  return group.slice().sort((a,b) => tripMonthNum(a) - tripMonthNum(b));
}

// Reisen je Jahr als kompakte Liste: Reisemonat + Gesamtkosten
function tripList(items) {
  if (!items.length) return '';
  const rows = items.map(u =>
    `<div class="uy-trip"><span class="uy-trip-name">${esc(u.name)} <span class="uy-trip-mon">| ${MONTH_FULL[tripMonthNum(u)-1]}</span></span><span class="uy-trip-meta">${fmt(tripCost(u))}</span></div>`
  ).join('');
  return `<div class="uy-trips">${rows}</div>`;
}

// Oben: grafisches Urlaube-Dashboard (Kontostand-Kopf + Jahresübersicht + Reisen)
// Restbudget des laufenden Jahres – identische Formel wie im Urlaube-Dashboard

// Länder → Kartenkoordinaten (vereinfachte Zentroide; x=(lon+180)/3.6, y=(90-lat)/3.6)
const COUNTRY_COORDS = {
  'Deutschland':[52.6,10.6],'Österreich':[53.9,11.9],'Schweiz':[52.3,11.9],'Italien':[53.5,13.3],'Frankreich':[50.6,11.9],
  'Spanien':[48.9,13.9],'Portugal':[47.8,14.1],'Griechenland':[56.1,14.2],'Kroatien':[54.4,12.5],'Niederlande':[51.5,10.5],
  'Belgien':[51.2,11.1],'Dänemark':[52.8,9.6],'Norwegen':[52.4,7.9],'Schweden':[55.0,8.1],'Finnland':[57.2,7.3],
  'Island':[45.0,7.1],'Irland':[47.8,10.2],'Großbritannien':[49.4,9.7],'Polen':[55.3,10.6],'Tschechien':[54.3,11.3],
  'Ungarn':[55.4,11.9],'Türkei':[59.7,14.1],'USA':[23.3,14.4],'Kanada':[20.4,9.4],'Mexiko':[22.2,18.6],
  'Costa Rica':[26.7,22.2],'Kuba':[27.8,18.9],'Dominikanische Republik':[30.4,19.8],'Brasilien':[35.3,28.9],'Argentinien':[32.2,34.7],
  'Chile':[30.3,33.9],'Peru':[28.9,27.5],'Kolumbien':[29.4,23.9],'Namibia':[54.7,31.1],'Südafrika':[57.1,33.3],
  'Kenia':[60.6,25.1],'Tansania':[59.7,26.7],'Marokko':[48.6,16.1],'Ägypten':[58.3,17.5],'Mauritius':[65.9,30.6],
  'Seychellen':[65.3,26.3],'Thailand':[77.9,20.8],'Vietnam':[79.6,20.6],'Indonesien':[82.9,26.4],'Malaysia':[80.3,23.9],
  'Singapur':[78.9,24.6],'Japan':[88.3,15.0],'Südkorea':[85.6,15.1],'China':[79.2,15.0],'Indien':[71.9,19.2],
  'Sri Lanka':[72.4,22.8],'Malediven':[70.3,24.0],'VAE':[65.1,18.1],'Katar':[64.3,17.9],'Israel':[59.7,16.2],
  'Australien':[87.1,32.4],'Neuseeland':[97.4,36.6],'Fidschi':[99.6,29.7],'Palau':[87.2,23.0],'Philippinen':[83.6,21.6],
  'Bali':[82.6,27.4],'Hawaii':[6.1,19.4],'Kanaren':[45.6,17.1],'Madeira':[45.3,16.0],'Mallorca':[50.8,14.1]
};
const FIN_COUNTRY_PATHS = {"Deutschland":"M53.9,10.1L54.0,10.2L53.9,10.3L54.0,10.4L54.1,10.5L54.1,10.6L54.2,10.8L54.0,10.8L54.0,10.8L53.9,10.9L53.7,10.9L53.6,11.0L53.4,11.0L53.4,11.1L53.5,11.2L53.6,11.3L53.8,11.4L53.7,11.6L53.6,11.6L53.6,11.8L53.6,11.8L53.5,11.8L53.4,11.7L53.2,11.8L52.9,11.8L52.9,11.9L52.7,11.8L52.7,11.8L52.4,11.7L52.3,11.8L52.1,11.8L52.1,11.6L52.2,11.4L51.8,11.3L51.7,11.3L51.7,11.1L51.7,11.1L51.7,10.9L51.7,10.6L51.8,10.6L51.9,10.5L52.0,10.2L51.9,10.1L52.0,10.1L52.2,10.1L52.3,10.1L52.4,10.0L52.4,9.9L52.4,9.7L52.6,9.8L52.8,9.7L52.8,9.8L53.0,9.9L53.0,10.0L53.3,9.9L53.5,9.9L53.8,10.0L53.9,10.1Z","Österreich":"M54.7,11.6L54.7,11.7L54.5,11.7L54.6,11.8L54.5,12.0L54.4,12.0L54.2,12.0L54.1,12.1L53.8,12.1L53.4,12.0L53.4,11.9L53.1,12.0L53.1,12.0L52.9,12.0L52.8,12.0L52.6,11.9L52.7,11.8L52.7,11.8L52.7,11.8L52.9,11.9L52.9,11.8L53.2,11.8L53.4,11.7L53.5,11.8L53.6,11.8L53.6,11.8L53.6,11.6L53.7,11.6L53.8,11.4L54.0,11.5L54.1,11.4L54.2,11.4L54.5,11.5L54.6,11.4L54.7,11.5L54.7,11.5L54.7,11.6Z","Schweiz":"","Italien":"M52.9,12.0L53.1,12.0L53.1,12.0L53.4,11.9L53.4,12.0L53.8,12.1L53.8,12.2L53.9,12.3L53.7,12.3L53.4,12.4L53.4,12.5L53.4,12.6L53.5,12.8L53.8,12.9L53.9,13.1L54.2,13.3L54.4,13.3L54.5,13.4L54.4,13.5L54.7,13.6L54.9,13.6L55.1,13.8L55.1,13.8L55.1,13.9L54.9,13.8L54.7,13.8L54.6,13.9L54.8,14.0L54.7,14.2L54.6,14.2L54.5,14.4L54.4,14.5L54.4,14.4L54.4,14.2L54.5,14.2L54.4,14.0L54.3,13.9L54.2,13.8L54.1,13.7L53.9,13.7L53.8,13.6L53.6,13.5L53.4,13.4L53.1,13.2L52.9,13.1L52.8,12.8L52.7,12.8L52.5,12.7L52.3,12.7L52.2,12.8L52.1,12.9L52.1,12.7L51.9,12.7L51.9,12.5L52.0,12.4L51.9,12.3L51.9,12.2L52.0,12.3L52.2,12.3L52.3,12.2L52.4,12.2L52.5,12.2L52.6,12.1L52.8,12.1L52.9,12.1L52.9,12.0Z","Frankreich":"M51.7,11.3L51.8,11.3L52.2,11.4L52.1,11.6L52.1,11.8L52.0,11.8L51.9,11.8L51.9,11.9L51.7,12.0L51.7,12.1L51.8,12.1L51.9,12.2L51.9,12.3L52.0,12.4L51.9,12.5L51.9,12.7L52.1,12.7L52.1,12.9L51.8,13.0L51.3,12.9L50.9,13.0L50.8,13.2L50.5,13.2L50.2,13.1L50.1,13.2L49.6,13.0L49.5,12.9L49.6,12.8L49.7,12.2L49.4,11.9L49.2,11.8L48.8,11.7L48.7,11.5L49.1,11.4L49.6,11.5L49.5,11.2L49.7,11.3L50.4,11.1L50.5,10.8L50.7,10.8L50.7,10.9L50.9,10.9L51.0,11.0L51.2,11.1L51.3,11.1L51.6,11.2L51.6,11.3L51.7,11.3Z","Spanien":"M47.9,14.7L47.9,14.6L48.0,14.5L48.0,14.4L48.0,14.3L48.0,14.2L47.9,14.0L48.0,14.0L48.0,13.8L48.1,13.8L48.1,13.6L48.2,13.5L48.1,13.4L48.0,13.4L47.9,13.4L47.8,13.4L47.7,13.3L47.6,13.3L47.5,13.4L47.5,13.2L47.4,13.0L47.8,12.8L48.1,12.9L48.5,12.9L48.8,12.9L49.0,12.9L49.5,12.9L49.6,13.0L50.1,13.2L50.2,13.1L50.5,13.2L50.8,13.2L50.8,13.4L50.6,13.5L50.2,13.6L50.2,13.7L50.0,13.9L49.9,14.1L50.0,14.2L49.9,14.4L49.8,14.5L49.6,14.6L49.4,14.8L49.1,14.8L48.8,14.8L48.6,14.9L48.5,15.0L48.4,15.0L48.3,14.9L48.2,14.7L47.9,14.7Z","Portugal":"","Griechenland":"M56.4,13.5L56.6,13.5L56.8,13.4L57.0,13.5L57.3,13.5L57.3,13.4L57.4,13.5L57.3,13.6L57.2,13.7L57.1,13.7L56.9,13.6L56.6,13.7L56.8,13.9L56.6,13.9L56.5,13.9L56.3,13.8L56.3,13.8L56.3,14.0L56.5,14.1L56.4,14.2L56.5,14.3L56.7,14.4L56.7,14.5L56.4,14.5L56.5,14.6L56.3,14.6L56.4,14.9L56.2,14.9L56.0,14.8L55.9,14.5L55.9,14.4L55.8,14.2L55.6,14.1L55.6,14.0L55.7,13.9L55.7,13.8L55.8,13.7L55.8,13.7L56.0,13.6L56.1,13.6L56.3,13.6L56.3,13.5L56.4,13.5Z","Kroatien":"M54.6,12.1L54.7,12.1L54.9,12.2L55.1,12.3L55.2,12.2L55.3,12.4L55.4,12.4L55.3,12.5L55.2,12.5L55.0,12.5L54.7,12.4L54.6,12.4L54.5,12.5L54.4,12.4L54.4,12.6L54.5,12.7L54.6,12.8L54.7,12.9L54.8,12.9L54.9,13.0L55.2,13.2L55.1,13.2L54.9,13.1L54.7,13.0L54.4,12.9L54.2,12.7L54.3,12.7L54.1,12.6L54.1,12.5L54.0,12.4L53.9,12.6L53.8,12.5L53.8,12.4L53.8,12.4L54.0,12.4L54.1,12.3L54.1,12.4L54.3,12.4L54.3,12.3L54.4,12.3L54.4,12.2L54.6,12.1Z","Niederlande":"","Belgien":"","Dänemark":"","Norwegen":"M54.2,2.9L54.3,2.8L54.7,2.8L55.1,2.9L56.0,3.1L55.3,3.2L55.1,3.4L54.9,3.4L54.8,3.7L54.4,3.7L53.8,3.5L54.1,3.4L53.7,3.3L53.1,3.1L52.9,2.9L53.7,2.8L53.8,2.9L54.2,2.9ZM58.6,5.7L58.2,5.8L57.9,5.8L58.1,5.6L57.7,5.5L57.3,5.6L57.1,5.8L56.9,5.9L56.6,5.9L56.2,5.9L55.9,5.7L55.7,5.8L55.6,5.8L55.5,6.0L55.0,6.0L54.9,6.1L54.7,6.1L54.5,6.3L54.2,6.6L53.8,7.0L53.9,7.1L53.8,7.2L53.5,7.2L53.3,7.5L53.3,7.8L53.5,8.0L53.4,8.3L53.2,8.5L53.1,8.7L52.9,8.5L52.3,8.8L52.0,8.9L51.6,8.7L51.5,8.4L51.4,7.8L51.6,7.6L52.4,7.4L52.9,7.1L53.4,6.7L54.1,6.2L54.6,6.0L55.3,5.6L55.9,5.5L56.4,5.5L56.8,5.3L57.3,5.3L57.8,5.2L58.7,5.4L58.3,5.5L58.6,5.7Z","Schweden":"M53.1,8.7L53.2,8.5L53.4,8.3L53.5,8.0L53.3,7.8L53.3,7.5L53.5,7.2L53.8,7.2L53.9,7.1L53.8,7.0L54.2,6.6L54.5,6.3L54.7,6.1L54.9,6.1L55.0,6.0L55.5,6.0L55.6,5.8L55.7,5.8L56.1,5.9L56.5,6.1L56.5,6.6L56.6,6.7L56.2,6.7L55.9,6.9L55.9,7.1L55.5,7.3L55.0,7.6L54.8,8.0L55.0,8.2L55.2,8.3L55.0,8.6L54.7,8.7L54.6,9.2L54.4,9.4L54.1,9.4L53.9,9.6L53.6,9.6L53.5,9.4L53.3,9.0L53.1,8.7Z","Finnland":"M57.9,5.8L57.9,6.0L58.3,6.2L58.1,6.4L58.4,6.7L58.2,7.0L58.5,7.2L58.3,7.3L58.8,7.5L58.6,7.7L58.4,7.8L57.8,8.2L57.3,8.2L56.8,8.3L56.4,8.4L56.2,8.2L55.9,8.1L56.0,7.9L55.8,7.6L56.0,7.4L56.2,7.3L56.9,7.0L57.1,6.9L57.0,6.8L56.6,6.7L56.5,6.6L56.5,6.1L56.1,5.9L55.7,5.8L55.9,5.7L56.2,5.9L56.6,5.9L56.9,5.9L57.1,5.8L57.3,5.6L57.7,5.5L58.1,5.6L57.9,5.8Z","Island":"M46.0,6.5L45.9,6.7L46.2,6.9L45.9,7.1L45.1,7.3L44.8,7.4L44.5,7.3L43.7,7.2L44.0,7.1L43.3,7.0L43.8,6.9L43.8,6.8L43.2,6.8L43.4,6.6L43.9,6.6L44.3,6.7L44.7,6.6L45.1,6.7L45.5,6.5L46.0,6.5Z","Irland":"","Großbritannien":"M49.1,10.2L49.1,10.2L49.2,10.0L49.0,9.8L49.0,9.8L48.7,9.8L48.6,9.7L48.7,9.6L48.6,9.5L48.4,9.6L48.4,9.4L48.3,9.2L48.4,8.9L48.6,8.7L48.8,8.7L49.2,8.7L48.9,9.0L49.2,9.0L49.5,9.0L49.4,9.2L49.1,9.5L49.4,9.5L49.4,9.5L49.7,9.8L49.9,9.9L50.1,10.2L50.1,10.3L50.5,10.4L50.4,10.5L50.3,10.6L50.4,10.8L50.2,10.9L49.8,10.9L49.3,11.0L49.2,10.9L49.0,11.0L48.7,11.0L48.5,11.1L48.4,11.1L48.8,10.8L49.1,10.7L49.0,10.7L48.6,10.7L48.5,10.6L48.8,10.5L48.7,10.3L48.7,10.1L49.1,10.2Z","Polen":"M56.5,10.0L56.5,10.1L56.6,10.3L56.6,10.4L56.4,10.4L56.5,10.5L56.5,10.7L56.7,10.9L56.6,11.0L56.5,11.0L56.3,11.3L56.3,11.4L56.3,11.4L56.0,11.3L55.8,11.3L55.7,11.3L55.5,11.3L55.4,11.2L55.3,11.3L55.2,11.3L55.1,11.1L54.9,11.1L54.9,11.0L54.7,11.0L54.6,11.1L54.5,11.0L54.5,10.9L54.3,10.9L54.2,10.8L54.1,10.6L54.1,10.5L54.0,10.4L53.9,10.3L54.0,10.2L53.9,10.1L54.1,10.0L54.5,9.9L54.9,9.8L55.2,9.8L55.2,9.9L55.5,9.9L55.8,9.9L56.3,9.9L56.5,9.9L56.5,10.0Z","Tschechien":"","Ungarn":"","Türkei":"M62.4,14.7L62.3,14.7L62.2,14.7L61.9,14.6L61.8,14.7L61.4,14.7L61.3,14.7L61.0,14.8L60.7,14.8L60.6,14.7L60.3,14.8L60.2,14.8L60.2,14.9L60.1,15.0L60.0,15.0L59.9,14.9L60.0,14.8L59.9,14.8L59.6,14.8L59.5,14.9L59.0,15.0L58.8,14.8L58.5,14.8L58.4,14.9L58.2,15.0L58.0,14.8L57.7,14.8L57.5,14.5L57.3,14.4L57.4,14.2L57.3,14.0L57.6,13.8L58.0,13.8L58.1,13.6L58.7,13.6L59.0,13.4L59.3,13.3L59.8,13.3L60.3,13.5L60.7,13.6L61.0,13.6L61.2,13.6L61.5,13.5L61.8,13.4L62.1,13.6L62.2,13.7L62.1,13.8L62.3,13.9L62.4,14.0L62.3,14.0L62.3,14.4L62.3,14.5L62.4,14.7Z","USA":"M15.9,11.4L17.8,11.4L20.3,11.4L23.0,11.4L23.7,11.3L24.0,11.5L24.8,11.6L25.5,11.6L26.2,11.9L26.5,12.1L26.6,12.1L26.8,12.2L27.1,12.4L27.1,13.1L26.9,13.3L27.1,13.4L28.1,13.1L28.0,12.9L28.7,12.9L29.1,12.6L30.1,12.5L30.4,12.4L30.8,11.8L31.2,11.9L31.4,12.6L30.5,12.9L30.3,13.2L30.5,13.3L30.4,13.5L29.9,13.5L29.9,13.6L29.4,13.7L29.5,13.8L29.2,14.1L29.1,14.2L29.1,14.4L29.0,14.5L28.7,14.2L28.8,14.5L28.9,14.8L28.5,15.4L28.0,15.7L27.5,16.1L27.4,16.7L27.6,17.2L27.7,17.8L27.5,18.0L27.2,17.6L27.0,17.1L26.6,16.6L26.2,16.6L25.4,16.6L25.2,16.7L25.2,16.9L24.8,16.9L24.1,16.7L23.4,17.0L23.0,17.4L23.0,17.8L22.5,17.7L22.2,17.2L21.8,16.7L21.1,16.9L20.8,16.5L20.4,16.2L19.7,16.3L18.1,16.0L17.5,16.0L17.1,15.6L16.8,15.5L16.5,15.2L16.0,14.5L15.6,14.0L15.5,13.3L15.6,12.6L15.4,11.7L15.8,11.7L16.0,11.6ZM10.8,5.6L10.8,8.2L11.4,8.3L11.8,8.6L12.4,8.4L12.7,8.6L13.1,9.0L13.9,9.5L13.7,9.8L13.3,9.6L12.9,9.1L12.5,8.8L11.7,8.7L10.9,8.4L10.0,8.3L9.1,8.1L8.9,8.3L8.4,8.4L7.9,8.6L7.9,8.1L8.2,8.0L7.6,8.3L7.4,8.6L6.9,9.0L6.5,9.2L6.0,9.4L5.5,9.5L4.9,9.7L4.2,9.9L4.5,9.7L5.1,9.5L5.5,9.3L6.0,9.1L6.2,8.8L6.1,8.7L5.8,8.8L5.6,8.7L5.2,8.7L5.0,8.5L4.9,8.3L4.3,8.3L4.1,8.0L4.0,7.8L4.3,7.5L4.7,7.5L5.1,7.4L5.3,7.2L5.3,7.0L4.9,7.1L4.6,7.1L3.8,7.0L3.3,6.8L4.3,6.5L4.5,6.6L4.9,6.5L4.3,6.2L3.7,6.0L4.3,5.9L4.7,5.6L5.3,5.4L6.1,5.3L6.9,5.2L7.3,5.3L7.7,5.4L8.4,5.4L9.5,5.5L10.1,5.5L10.8,5.6Z","Kanada":"M15.9,11.4L14.6,10.9L14.1,10.1L13.9,9.5L12.7,8.6L11.8,8.6L10.8,8.2L11.8,5.8L13.1,5.7L14.3,5.6L15.4,5.5L16.3,5.6L18.0,5.9L19.2,6.2L19.8,6.0L20.7,6.0L22.2,6.2L23.3,6.0L23.8,5.8L23.6,5.0L24.3,5.6L25.6,5.9L26.2,5.9L27.4,5.8L27.4,6.4L26.1,6.7L25.0,7.2L24.1,7.8L24.1,8.7L25.3,9.2L26.4,9.6L27.2,10.2L28.2,10.4L28.6,9.5L28.2,8.7L28.5,7.6L29.7,7.7L30.7,8.3L31.6,8.7L32.6,8.8L33.5,9.7L34.4,10.1L34.1,10.7L32.3,11.0L31.0,11.4L30.9,11.6L31.9,11.6L32.9,12.3L33.0,12.4L31.6,12.9L31.4,12.5L30.9,11.9L30.4,12.4L29.6,12.5L28.8,12.8L28.0,12.9L27.7,13.2L26.9,13.4L27.1,13.1L26.8,12.3L26.6,12.1L26.5,12.1L26.0,11.8L25.1,11.7L24.0,11.5L23.6,11.3L21.1,11.4L17.8,11.4ZM25.5,4.3L25.1,4.3L24.3,4.2L24.2,4.1L24.2,3.9L23.9,3.8L23.3,3.8L23.0,3.7L23.1,3.6L23.7,3.6L24.0,3.7L24.6,3.7L24.8,3.8L24.7,3.9L25.0,3.9L25.2,4.0L25.6,4.0L26.0,4.0L26.4,4.0L27.0,3.9L27.5,4.0L27.8,4.1L27.8,4.2L27.7,4.3L27.2,4.3L26.9,4.3L26.1,4.3L25.5,4.3ZM34.6,10.7L34.4,10.9L34.2,11.2L34.4,11.1L34.6,11.1L34.5,11.2L34.7,11.3L34.9,11.2L35.1,11.3L35.1,11.5L35.3,11.5L35.3,11.6L35.4,11.8L35.3,12.0L35.1,12.1L35.0,12.0L35.0,11.8L34.9,11.7L34.6,12.0L34.4,12.0L34.6,11.8L34.4,11.8L34.1,11.8L33.5,11.8L33.5,11.7L33.7,11.6L33.5,11.5L33.8,11.4L34.1,10.9L34.2,10.8L34.5,10.7L34.6,10.7L34.6,10.7ZM28.1,4.9L28.4,4.8L29.0,4.9L29.4,5.1L29.4,5.2L29.9,5.1L30.2,5.3L30.9,5.4L31.1,5.5L31.4,5.8L30.9,5.9L31.5,6.1L32.0,6.2L32.4,6.4L32.8,6.4L32.7,6.6L32.2,6.9L31.9,6.8L31.5,6.6L31.1,6.6L31.1,6.8L31.4,6.9L31.7,7.0L31.9,7.1L32.0,7.4L31.9,7.6L31.6,7.5L30.9,7.3L31.3,7.5L31.6,7.7L31.6,7.8L30.9,7.7L30.3,7.5L29.9,7.4L30.0,7.3L29.6,7.2L29.2,7.0L29.2,7.1L28.4,7.2L28.2,7.1L28.4,6.9L28.9,6.9L29.5,6.8L29.4,6.7L29.5,6.6L29.8,6.3L29.7,6.2L29.6,6.1L29.2,6.0L28.6,5.9L28.8,5.8L28.5,5.6L28.3,5.6L28.1,5.5L27.9,5.6L27.4,5.6L26.4,5.6L25.8,5.5L25.4,5.4L25.1,5.3L25.4,5.2L25.0,5.2L24.9,4.9L25.2,4.7L25.4,4.6L26.2,4.5L26.0,4.7L26.2,4.9L26.4,4.6L27.1,4.5L27.6,4.8L27.6,5.0L28.1,4.9ZM16.2,4.3L16.6,4.4L17.3,4.4L17.6,4.5L17.9,4.6L17.6,4.7L16.9,4.9L16.5,5.1L16.5,5.2L15.8,5.3L15.7,5.2L15.0,5.0L15.1,4.9L15.3,4.7L15.6,4.5L15.3,4.4L16.2,4.3ZM20.1,3.9L20.3,3.9L20.6,3.9L20.6,4.0L20.5,4.2L19.5,4.2L18.8,4.3L18.4,4.3L18.4,4.2L18.9,4.1L17.7,4.2L17.3,4.1L17.7,3.8L17.9,3.8L18.7,3.8L19.2,4.0L19.7,4.0L19.3,3.8L19.6,3.7L19.8,3.7L19.9,3.8L20.1,3.9ZM20.4,4.7L20.7,4.8L20.9,5.1L21.0,5.3L21.4,5.4L22.0,5.5L21.9,5.7L21.5,5.7L21.6,5.8L21.5,5.9L21.0,5.9L20.6,5.8L20.2,5.8L19.7,5.9L19.0,5.9L18.5,6.0L18.4,5.8L18.0,5.8L17.7,5.8L17.4,5.6L17.6,5.5L18.0,5.5L18.4,5.5L18.8,5.5L18.2,5.4L17.6,5.4L17.2,5.4L17.1,5.3L17.7,5.2L17.3,5.2L16.8,5.1L17.1,4.9L17.3,4.8L18.0,4.6L18.3,4.7L18.1,4.8L18.8,4.7L19.2,4.9L19.5,4.7L19.7,4.8L19.9,5.1L20.1,5.0L19.9,4.7L20.1,4.7L20.4,4.7ZM23.3,2.6L23.5,2.5L23.8,2.5L23.7,2.4L24.3,2.4L24.7,2.6L25.2,2.6L25.6,2.7L25.8,2.9L26.2,3.0L25.8,3.0L25.3,3.3L24.8,3.3L24.2,3.2L23.9,3.1L23.9,3.0L24.1,3.0L23.6,3.0L23.3,2.9L23.1,2.7L23.3,2.6ZM24.6,2.3L25.0,2.2L25.3,2.2L25.8,2.1L26.3,2.0L26.6,2.1L26.9,2.1L27.1,2.0L27.5,1.9L28.0,1.9L28.8,1.9L29.0,1.9L29.8,1.9L30.4,1.9L31.0,1.9L31.7,1.9L32.3,2.0L32.8,2.0L32.8,2.1L32.1,2.2L31.5,2.3L31.2,2.4L31.8,2.4L31.2,2.5L30.7,2.6L30.2,2.8L29.7,2.9L29.5,2.9L28.6,3.0L29.0,3.0L28.8,3.1L29.1,3.2L28.8,3.3L28.4,3.4L28.2,3.5L27.8,3.6L27.9,3.6L28.4,3.6L28.4,3.7L27.6,3.8L26.9,3.8L26.1,3.8L25.7,3.8L25.1,3.8L25.1,3.6L25.6,3.6L25.5,3.4L25.7,3.3L26.4,3.5L26.0,3.3L25.6,3.2L25.8,3.1L26.3,3.1L26.4,3.0L26.0,2.9L25.9,2.7L26.6,2.7L26.8,2.8L27.3,2.6L26.6,2.6L25.7,2.6L25.2,2.5L24.9,2.4L24.6,2.3L24.6,2.3Z","Mexiko":"M17.5,16.0L18.1,15.9L18.5,16.1L19.7,16.3L19.9,16.2L20.5,16.3L20.8,16.5L21.0,16.8L21.4,17.0L21.8,16.7L22.1,17.0L22.4,17.3L22.5,17.7L22.9,17.8L22.9,18.1L22.8,18.6L22.9,18.9L23.0,19.3L23.3,19.6L23.7,19.8L24.0,19.9L24.4,19.8L24.8,19.6L24.9,19.2L25.1,19.1L25.7,19.0L25.9,19.1L25.7,19.4L25.7,19.6L25.6,19.9L25.5,19.9L25.3,20.0L25.2,20.0L25.0,20.1L24.7,20.2L24.7,20.3L24.8,20.4L24.9,20.5L24.4,20.8L24.4,20.9L24.1,20.7L23.7,20.5L23.3,20.6L23.0,20.6L22.5,20.4L22.0,20.2L21.7,20.0L21.3,19.9L20.8,19.6L20.6,19.3L20.7,19.2L20.8,19.0L20.6,18.8L20.3,18.4L19.9,18.0L19.6,17.8L19.5,17.6L19.3,17.3L19.0,17.1L18.8,16.9L18.6,16.4L18.4,16.2L18.1,16.2L18.1,16.4L18.2,16.7L18.5,17.0L18.6,17.1L18.7,17.3L18.8,17.5L19.1,17.9L19.2,18.1L19.4,18.3L19.6,18.5L19.5,18.7L19.4,18.5L19.0,18.2L18.8,17.9L18.7,17.7L18.4,17.6L18.2,17.5L18.1,17.3L18.3,17.2L18.1,16.9L17.8,16.6L17.6,16.2Z","Costa Rica":"","Kuba":"M27.1,18.6L27.4,18.6L27.6,18.6L27.9,18.7L28.0,18.8L28.2,18.7L28.3,18.8L28.6,19.0L28.7,19.1L28.8,19.1L29.0,19.2L29.0,19.2L29.2,19.3L29.4,19.4L29.4,19.4L29.2,19.5L29.0,19.5L28.8,19.5L28.4,19.5L28.6,19.3L28.5,19.3L28.3,19.2L28.2,19.2L28.1,19.0L28.0,19.0L27.7,18.9L27.6,18.9L27.3,18.8L27.2,18.8L27.3,18.7L27.0,18.7L26.8,18.8L26.7,18.8L26.7,18.9L26.5,18.9L26.4,18.9L26.5,18.8L26.6,18.7L26.7,18.7L26.9,18.6L27.1,18.6L27.1,18.6Z","Dominikanische Republik":"","Brasilien":"M35.2,34.4L35.1,33.9L34.5,33.6L34.4,33.0L35.1,32.5L34.8,32.1L34.9,31.7L34.6,31.7L34.5,31.2L33.9,31.1L33.9,30.5L34.0,30.0L33.8,29.7L33.2,29.2L33.2,29.0L32.9,28.7L32.4,28.5L31.9,28.0L31.5,27.8L31.0,28.1L30.5,28.1L30.2,27.8L29.7,27.6L29.4,27.1L29.7,26.8L29.8,26.5L30.3,26.2L30.7,25.3L30.6,24.8L30.8,24.7L31.1,24.5L31.4,24.7L31.8,24.8L32.2,24.6L32.4,24.3L32.1,23.9L32.3,23.9L32.8,23.8L33.1,23.6L33.3,23.7L33.4,24.0L33.4,24.5L33.8,24.6L34.1,24.5L34.4,24.5L34.5,24.3L34.9,24.4L35.1,24.4L35.4,24.3L35.7,23.8L36.1,24.5L36.0,25.0L36.7,25.2L37.7,25.6L38.5,25.8L39.7,26.3L40.2,26.5L40.2,27.5L39.5,28.4L39.2,28.8L39.1,30.0L38.7,30.8L38.3,31.4L37.4,31.6L36.5,32.2L36.5,32.8L35.9,33.6L35.4,34.2Z","Argentinien":"M34.0,33.4L33.9,33.6L33.8,33.9L33.9,34.2L33.8,34.2L33.8,34.4L33.8,34.6L34.1,34.8L34.1,35.0L34.2,35.1L34.2,35.3L34.0,35.6L33.5,35.8L33.0,35.8L32.7,35.8L32.7,36.0L32.7,36.2L32.7,36.3L32.6,36.4L32.3,36.4L32.0,36.3L31.9,36.4L32.0,36.7L32.1,36.8L32.3,36.7L32.4,36.8L32.1,36.9L31.9,37.1L31.9,37.4L31.8,37.5L31.5,37.5L31.3,37.7L31.2,37.9L31.5,38.1L31.8,38.1L31.7,38.4L31.3,38.5L31.2,38.9L30.9,39.0L30.8,39.1L30.9,39.4L31.1,39.5L31.0,39.5L30.7,39.5L30.0,39.4L29.9,39.3L29.9,39.1L29.7,39.1L29.6,39.0L29.6,38.7L29.8,38.6L29.9,38.4L29.9,38.3L30.0,38.0L30.1,37.7L30.1,37.5L30.2,37.4L30.2,37.3L30.1,37.3L30.1,37.2L30.0,37.1L30.0,36.7L30.1,36.7L30.0,36.3L30.1,36.1L30.2,35.8L30.3,35.7L30.2,35.4L30.2,35.2L30.5,35.0L30.4,34.8L30.6,34.5L30.6,34.2L30.5,34.2L30.4,33.7L30.6,33.4L30.6,33.2L30.7,32.9L30.8,32.6L31.0,32.5L30.9,32.4L31.0,32.3L31.0,31.8L31.3,31.7L31.4,31.4L31.4,31.3L31.6,31.1L32.0,31.1L32.1,31.3L32.2,31.1L32.5,31.1L32.6,31.2L33.1,31.6L33.3,31.7L33.7,31.9L34.0,32.0L34.0,32.1L33.7,32.5L34.0,32.6L34.3,32.7L34.5,32.6L34.8,32.4L34.8,32.1L35.0,32.1L35.1,32.3L35.1,32.5L34.9,32.6L34.7,32.7L34.4,33.0L34.0,33.4Z","Chile":"M30.9,39.6L30.9,40.2L31.2,40.2L31.4,40.2L31.3,40.4L31.1,40.4L30.9,40.4L30.8,40.4L30.6,40.3L30.3,40.3L29.9,40.1L29.6,40.0L29.3,39.7L29.5,39.7L29.9,39.9L30.2,40.0L30.4,39.9L30.5,39.7L30.7,39.6L30.9,39.6ZM30.7,29.9L30.8,30.1L30.8,30.3L31.0,30.4L30.9,30.7L31.1,31.0L31.2,31.4L31.4,31.3L31.4,31.4L31.3,31.7L31.0,31.8L31.0,32.3L30.9,32.4L31.0,32.5L30.8,32.6L30.7,32.9L30.6,33.2L30.6,33.4L30.4,33.7L30.5,34.2L30.6,34.2L30.6,34.5L30.4,34.8L30.5,35.0L30.2,35.2L30.2,35.4L30.3,35.7L30.2,35.8L30.1,36.1L30.0,36.3L30.1,36.7L30.0,36.7L30.0,37.1L30.1,37.2L30.1,37.3L30.2,37.3L30.2,37.4L30.1,37.5L30.1,37.7L30.0,38.0L29.9,38.3L29.9,38.4L29.8,38.6L29.6,38.7L29.6,39.0L29.7,39.1L29.9,39.1L29.9,39.3L30.0,39.4L30.7,39.5L31.0,39.5L30.7,39.5L30.6,39.6L30.3,39.7L30.3,40.0L30.2,40.0L29.8,39.9L29.5,39.7L29.2,39.5L29.1,39.3L29.2,39.2L29.0,39.0L29.0,38.5L29.1,38.3L29.4,38.0L29.0,38.0L29.3,37.7L29.3,37.3L29.7,37.3L29.8,36.8L29.6,36.7L29.5,37.0L29.4,37.0L29.4,36.6L29.5,36.1L29.7,35.9L29.6,35.6L29.6,35.3L29.7,35.3L29.8,34.9L30.0,34.4L30.2,34.0L30.1,33.6L30.2,33.4L30.1,33.0L30.3,32.7L30.4,32.1L30.4,31.6L30.5,30.9L30.5,30.5L30.5,30.1L30.6,30.0L30.7,29.9Z","Peru":"M30.6,26.2L30.3,26.2L30.3,26.2L30.1,26.3L29.8,26.5L29.7,26.6L29.7,26.7L29.7,26.8L29.5,26.9L29.5,27.0L29.4,27.1L29.6,27.3L29.7,27.5L29.7,27.6L29.8,27.6L29.9,27.8L30.2,27.8L30.4,27.6L30.4,28.1L30.5,28.1L30.7,28.0L30.9,28.5L30.9,28.6L30.9,28.8L30.8,29.0L30.7,29.2L30.8,29.3L30.7,29.4L30.8,29.6L30.7,29.9L30.6,30.0L30.5,30.1L30.2,29.9L30.1,29.8L29.6,29.5L29.1,29.2L28.9,29.1L28.8,28.8L28.8,28.8L28.6,28.4L28.3,27.9L28.0,27.3L27.9,27.2L27.8,27.0L27.6,26.8L27.4,26.7L27.5,26.6L27.4,26.3L27.5,26.1L27.7,25.9L27.7,26.1L27.6,26.1L27.7,26.2L27.8,26.2L27.9,26.2L28.0,26.4L28.2,26.3L28.2,26.1L28.4,25.8L28.7,25.7L29.0,25.4L29.1,25.3L29.1,25.0L29.1,25.0L29.3,25.1L29.4,25.3L29.5,25.4L29.7,25.6L29.9,25.7L30.1,25.6L30.2,25.7L30.3,25.6L30.5,25.8L30.4,26.0L30.4,26.0L30.6,26.2Z","Kolumbien":"M31.4,24.7L31.4,24.7L31.3,24.5L31.2,24.4L31.1,24.5L30.6,24.5L30.6,24.7L30.8,24.7L30.8,24.8L30.7,24.8L30.6,24.8L30.6,25.1L30.7,25.2L30.7,25.3L30.7,25.4L30.6,26.2L30.4,26.0L30.4,26.0L30.5,25.8L30.3,25.6L30.2,25.7L30.1,25.6L29.9,25.7L29.7,25.6L29.5,25.4L29.4,25.3L29.3,25.1L29.1,25.0L29.1,25.0L28.9,25.0L28.8,24.9L28.7,24.9L28.5,24.9L28.4,24.8L28.4,24.8L28.1,24.6L28.1,24.5L28.2,24.5L28.1,24.4L28.2,24.3L28.4,24.3L28.5,24.1L28.6,23.9L28.5,23.9L28.5,23.7L28.5,23.4L28.5,23.4L28.5,23.1L28.4,23.0L28.4,22.9L28.5,22.9L28.5,22.8L28.5,22.6L28.5,22.6L28.7,22.6L28.9,22.4L29.0,22.4L29.0,22.3L29.0,22.1L29.2,21.9L29.4,21.9L29.4,21.9L29.6,21.9L29.8,21.7L29.9,21.7L30.1,21.5L30.2,21.6L30.2,21.6L30.2,21.7L30.0,21.8L29.9,21.9L29.8,22.0L29.7,22.1L29.7,22.3L29.6,22.5L29.8,22.5L29.8,22.6L29.9,22.7L29.9,22.8L29.9,22.9L29.9,22.9L29.9,23.0L30.0,23.1L30.4,23.0L30.5,23.1L30.7,23.3L30.8,23.3L31.0,23.3L31.2,23.3L31.3,23.3L31.2,23.5L31.2,23.5L31.2,23.7L31.2,23.9L31.3,24.0L31.3,24.1L31.2,24.2L31.3,24.3L31.3,24.4L31.4,24.7Z","Namibia":"M55.5,31.9L55.5,32.9L55.3,33.0L55.1,33.1L55.0,33.0L54.8,33.0L54.8,32.9L54.7,32.8L54.5,32.9L54.3,32.7L54.2,32.5L54.2,32.3L54.1,32.1L54.0,31.6L54.0,31.3L54.0,31.1L53.9,31.0L53.7,30.8L53.6,30.5L53.5,30.3L53.3,30.0L53.3,29.8L53.4,29.8L53.6,29.7L53.7,29.7L53.9,29.8L53.9,29.8L55.1,29.8L55.3,29.9L55.9,30.0L56.4,29.9L56.7,29.8L56.9,29.8L57.0,29.9L57.0,29.9L56.8,30.0L56.7,30.0L56.5,30.1L56.4,30.0L56.0,30.1L55.8,30.1L55.8,31.1L55.5,31.1L55.5,31.9Z","Südafrika":"M54.5,32.9L54.7,32.8L54.8,32.9L54.8,33.0L55.0,33.0L55.1,33.1L55.3,33.0L55.5,32.9L55.5,31.9L55.6,31.9L55.8,32.2L55.7,32.4L55.8,32.5L56.0,32.4L56.1,32.3L56.3,32.2L56.3,32.1L56.5,32.0L56.6,32.1L56.7,32.1L57.0,32.1L57.1,32.1L57.2,32.0L57.2,31.9L57.4,31.8L57.4,31.7L57.5,31.5L57.8,31.3L58.2,31.1L58.3,31.1L58.4,31.2L58.5,31.2L58.7,31.2L58.8,31.6L58.9,31.8L58.8,32.1L58.8,32.2L58.7,32.1L58.6,32.1L58.6,32.2L58.5,32.3L58.5,32.4L58.7,32.6L58.9,32.5L58.9,32.4L59.1,32.4L59.0,32.6L59.0,32.9L58.9,33.0L58.8,33.1L58.7,33.2L58.6,33.3L58.5,33.5L58.3,33.7L58.0,33.9L57.8,34.1L57.6,34.2L57.3,34.3L57.2,34.4L57.2,34.4L57.0,34.4L56.9,34.4L56.6,34.4L56.4,34.4L56.3,34.4L56.0,34.5L55.7,34.6L55.6,34.7L55.4,34.7L55.3,34.6L55.2,34.6L55.1,34.4L55.1,34.5L55.1,34.4L55.1,34.2L55.0,34.1L55.1,34.0L55.1,33.8L54.9,33.5L54.7,33.3L54.7,33.3L54.5,32.9Z","Kenia":"M60.9,26.3L60.5,26.0L60.5,25.9L59.5,25.3L59.4,25.3L59.4,25.0L59.5,24.9L59.6,24.7L59.7,24.5L59.6,24.2L59.6,24.0L59.4,23.8L59.6,23.7L59.8,23.5L59.9,23.5L59.9,23.7L60.0,23.8L60.2,23.8L60.6,24.0L60.7,24.0L60.7,24.0L60.8,24.0L61.0,24.0L61.1,23.9L61.3,23.8L61.4,23.9L61.6,23.9L61.4,24.2L61.4,25.2L61.6,25.5L61.4,25.6L61.3,25.7L61.2,25.7L61.1,25.9L61.1,26.0L61.0,26.2L60.9,26.3Z","Tansania":"M59.4,25.3L59.5,25.3L60.5,25.9L60.5,26.0L60.9,26.3L60.8,26.6L60.8,26.8L61.0,26.9L61.0,27.0L60.9,27.1L60.9,27.2L60.9,27.4L61.0,27.5L61.1,27.8L61.2,27.9L61.0,28.0L60.7,28.1L60.5,28.1L60.4,28.2L60.2,28.2L60.1,28.3L59.8,28.2L59.6,28.2L59.5,27.8L59.4,27.7L59.4,27.6L59.1,27.6L58.9,27.5L58.8,27.4L58.7,27.4L58.5,27.3L58.4,27.0L58.2,26.8L58.2,26.7L58.2,26.5L58.1,26.2L58.3,26.2L58.4,26.1L58.5,26.0L58.5,25.9L58.5,25.8L58.5,25.8L58.5,25.7L58.5,25.6L58.6,25.5L58.4,25.3L58.5,25.3L58.9,25.3L59.4,25.3Z","Marokko":"M49.4,15.2L49.5,15.4L49.5,15.6L49.6,15.9L49.7,15.9L49.6,16.0L49.3,16.1L49.1,16.2L49.0,16.2L49.0,16.4L48.7,16.5L48.5,16.7L48.3,16.7L48.0,16.8L47.6,17.0L47.6,17.3L47.6,17.3L47.6,17.5L47.4,17.5L47.3,17.5L47.2,17.5L47.1,17.5L46.8,17.5L46.7,17.7L46.7,17.8L46.5,18.1L46.1,18.4L46.0,18.8L45.9,18.9L45.9,19.0L45.3,19.1L45.3,19.0L45.3,18.9L45.4,18.8L45.5,18.7L45.5,18.6L45.6,18.4L45.7,18.2L45.8,18.2L45.9,18.0L45.9,17.9L46.0,17.7L46.2,17.6L46.4,17.3L46.4,17.3L46.5,17.2L46.8,17.2L47.0,17.0L47.1,16.9L47.3,16.7L47.3,16.3L47.4,16.1L47.4,16.0L47.6,15.8L47.9,15.6L48.1,15.5L48.3,15.2L48.4,15.1L48.6,15.1L48.7,15.2L49.0,15.2L49.3,15.2L49.4,15.2Z","Ägypten":"M60.2,18.9L59.1,18.9L58.1,18.9L56.9,18.9L56.9,17.9L56.9,16.9L56.9,16.7L56.9,16.5L56.9,16.4L57.0,16.2L57.4,16.2L57.6,16.3L57.9,16.4L58.0,16.4L58.2,16.3L58.4,16.3L58.6,16.2L58.8,16.3L58.9,16.4L58.9,16.3L59.2,16.4L59.4,16.4L59.5,16.3L59.7,16.7L59.7,16.8L59.6,16.9L59.6,17.1L59.5,17.3L59.4,17.3L59.3,17.2L59.2,17.1L59.0,16.7L59.0,16.7L59.1,17.0L59.3,17.3L59.5,17.7L59.6,17.9L59.7,18.0L59.9,18.4L59.9,18.4L59.9,18.6L60.2,18.8L60.2,18.9Z","Thailand":"M79.2,21.0L79.0,21.0L78.6,21.0L78.4,21.3L78.5,21.6L78.2,21.5L78.0,21.5L78.0,21.3L77.8,21.3L77.8,21.6L77.6,22.0L77.5,22.2L77.6,22.4L77.7,22.4L77.9,22.7L77.9,22.9L78.1,23.1L78.2,23.1L78.4,23.3L78.3,23.4L78.1,23.4L78.1,23.3L77.8,23.2L77.8,23.2L77.7,23.1L77.6,23.0L77.5,22.8L77.4,22.7L77.3,22.8L77.3,22.7L77.3,22.5L77.4,22.2L77.5,22.0L77.7,21.7L77.6,21.4L77.6,21.3L77.5,21.2L77.3,20.9L77.3,20.8L77.4,20.7L77.5,20.5L77.4,20.3L77.2,20.1L77.0,19.9L77.2,19.8L77.3,19.5L77.5,19.5L77.7,19.4L77.8,19.3L77.9,19.4L77.9,19.6L78.1,19.6L78.1,19.9L78.1,20.1L78.4,20.0L78.4,20.0L78.6,20.0L78.7,19.9L78.9,19.9L79.1,20.2L79.1,20.4L79.3,20.7L79.3,20.9L79.2,21.0Z","Vietnam":"M79.0,22.1L79.2,22.0L79.5,22.0L79.4,21.8L79.9,21.6L79.9,21.2L79.8,21.1L79.9,20.8L79.8,20.6L79.6,20.4L79.4,20.1L79.2,19.8L78.9,19.6L78.9,19.5L79.1,19.5L79.0,19.2L78.7,19.2L78.5,19.0L78.4,18.8L78.5,18.7L78.8,18.7L79.0,18.7L79.3,18.5L79.4,18.6L79.6,18.7L79.6,18.8L79.7,18.9L80.0,19.0L79.6,19.3L79.4,19.5L79.4,19.7L79.6,20.0L79.8,20.4L80.1,20.5L80.2,20.8L80.4,21.3L80.3,21.8L80.1,21.9L79.8,22.1L79.6,22.4L79.2,22.6L79.1,22.4L79.2,22.2L79.0,22.1Z","Indonesien":"M89.2,25.7L89.2,26.6L89.2,27.5L88.9,27.3L88.6,27.2L88.6,27.3L88.2,27.3L88.3,27.1L88.5,27.0L88.4,26.7L88.3,26.5L87.8,26.3L87.5,26.2L87.1,26.0L87.0,26.1L86.9,26.1L86.9,26.0L86.9,25.9L86.7,25.8L87.0,25.7L87.2,25.7L87.1,25.6L86.7,25.6L86.6,25.4L86.4,25.4L86.3,25.3L86.6,25.2L86.8,25.1L87.2,25.2L87.3,25.3L87.3,25.8L87.6,25.9L87.9,25.6L88.2,25.5L88.4,25.5L88.7,25.6L88.9,25.7L89.2,25.7ZM82.7,23.9L82.6,24.1L82.8,24.4L82.7,24.5L83.1,24.7L82.7,24.8L82.6,25.0L82.6,25.2L82.4,25.4L82.4,25.7L82.3,26.1L82.2,26.0L81.9,26.1L81.8,26.0L81.6,26.0L81.5,25.9L81.1,26.0L81.0,25.8L80.8,25.8L80.6,25.8L80.6,25.4L80.4,25.4L80.3,25.1L80.3,24.9L80.3,24.6L80.5,24.4L80.5,24.6L80.7,24.8L80.9,24.7L81.1,24.7L81.2,24.6L81.3,24.6L81.6,24.7L81.8,24.6L82.0,24.2L82.1,24.1L82.2,23.8L82.5,23.8L82.7,23.9ZM84.1,24.8L84.5,24.7L84.7,24.5L84.8,24.6L84.6,24.9L84.4,24.9L84.1,24.9L83.6,24.9L83.4,24.9L83.3,25.1L83.6,25.4L83.7,25.3L84.3,25.2L84.2,25.3L84.1,25.3L84.0,25.4L83.8,25.5L84.0,25.9L84.0,26.0L84.2,26.3L84.2,26.5L84.1,26.6L84.0,26.5L84.1,26.2L83.8,26.3L83.7,26.3L83.8,26.2L83.6,26.0L83.6,25.7L83.4,25.8L83.4,26.1L83.5,26.5L83.3,26.6L83.2,26.5L83.2,26.2L83.2,26.0L83.1,26.0L83.0,25.8L83.1,25.6L83.1,25.4L83.3,25.0L83.3,24.8L83.6,24.6L83.8,24.7L84.1,24.8ZM80.1,26.8L80.2,26.9L80.7,26.9L80.8,26.8L81.3,26.9L81.4,27.1L81.8,27.2L82.1,27.3L81.8,27.4L81.5,27.3L81.3,27.3L81.0,27.3L80.7,27.3L80.4,27.2L80.2,27.1L80.1,27.2L79.6,27.0L79.5,26.9L79.3,26.9L79.5,26.6L79.8,26.7L80.0,26.8L80.1,26.8ZM79.0,25.3L79.0,25.5L79.1,25.7L79.3,25.7L79.5,25.9L79.4,26.2L79.4,26.6L79.1,26.6L78.9,26.4L78.5,26.2L78.4,26.0L78.2,25.8L78.0,25.6L77.8,25.2L77.6,24.9L77.5,24.7L77.4,24.5L77.1,24.3L77.0,24.1L76.8,23.9L76.5,23.6L76.5,23.5L76.6,23.5L77.1,23.5L77.3,23.8L77.5,24.0L77.7,24.1L78.0,24.4L78.2,24.4L78.5,24.6L78.6,24.8L78.8,25.0L78.7,25.2L78.9,25.3L79.0,25.3Z","Malaysia":"M77.8,23.2L77.8,23.2L78.1,23.3L78.1,23.4L78.3,23.4L78.4,23.3L78.4,23.3L78.6,23.5L78.7,23.7L78.7,23.8L78.7,24.0L78.7,24.1L78.8,24.2L78.8,24.3L79.0,24.5L79.0,24.6L78.8,24.7L78.5,24.5L78.2,24.2L78.1,24.1L78.0,23.9L77.9,23.7L77.8,23.5L77.9,23.3L77.8,23.2ZM82.7,23.9L82.5,23.8L82.2,23.8L82.1,24.1L82.0,24.2L81.8,24.6L81.6,24.7L81.3,24.6L81.2,24.6L81.1,24.7L80.9,24.7L80.7,24.8L80.5,24.6L80.5,24.4L80.7,24.5L80.9,24.5L80.9,24.3L81.1,24.2L81.4,24.1L81.6,23.9L81.7,23.7L81.8,23.9L81.9,23.8L82.0,23.8L82.1,23.6L82.1,23.5L82.3,23.3L82.4,23.1L82.5,23.1L82.7,23.2L82.7,23.3L82.9,23.4L83.1,23.5L83.1,23.6L82.9,23.6L82.9,23.8L82.7,23.9Z","Japan":"M89.4,14.1L89.2,14.4L89.2,14.7L89.1,14.9L89.1,15.0L89.0,15.2L88.6,15.4L88.1,15.4L87.7,15.7L87.5,15.6L87.5,15.4L87.0,15.5L86.7,15.6L86.4,15.6L86.7,15.8L86.5,16.3L86.3,16.4L86.2,16.3L86.2,16.0L86.1,15.9L85.9,15.8L86.2,15.7L86.4,15.5L86.6,15.3L86.8,15.2L87.4,15.1L87.7,15.1L88.0,14.6L88.2,14.8L88.6,14.5L88.7,14.4L88.9,14.0L88.9,13.7L89.0,13.6L89.3,13.5L89.4,13.9L89.4,14.1ZM90.2,12.8L90.4,12.7L90.4,13.0L90.0,13.1L89.8,13.3L89.3,13.1L89.2,13.4L88.9,13.5L88.8,13.2L89.0,13.0L89.3,12.9L89.4,12.6L89.4,12.3L89.8,12.6L90.0,12.7L90.2,12.8Z","Südkorea":"","China":"M72.3,13.2L72.2,12.5L73.1,11.9L73.8,11.5L74.4,11.3L75.1,11.8L75.3,12.4L76.3,12.7L76.8,13.1L78.0,13.1L79.0,13.4L79.9,13.2L80.9,12.9L80.9,12.7L81.5,12.6L82.4,12.1L83.2,12.0L82.8,11.6L82.2,11.7L82.4,11.1L83.1,10.9L83.5,10.4L84.0,10.2L85.0,10.3L85.4,10.9L86.3,11.5L87.0,11.6L87.3,11.9L86.6,12.4L86.4,13.1L86.1,13.1L85.6,13.5L85.1,13.6L84.1,14.0L83.8,14.1L83.8,13.6L83.1,14.1L82.8,14.4L83.3,14.7L84.0,14.6L83.5,15.0L83.4,15.5L83.9,16.2L83.8,16.6L83.8,17.2L83.2,17.8L82.2,18.7L81.6,18.7L80.8,19.1L80.5,19.2L80.0,19.0L79.6,18.7L79.0,18.7L78.4,18.8L78.1,19.1L77.9,19.0L77.6,18.6L77.1,18.4L77.4,17.6L77.2,17.1L76.8,17.0L76.3,16.9L75.5,17.3L75.0,17.1L74.6,17.2L73.8,17.2L73.3,16.9L72.6,16.5L71.9,16.2L72.0,15.8L71.6,15.1L70.9,14.7L70.8,14.3L70.5,14.0L70.8,13.8L71.4,13.6L72.3,13.3Z","Indien":"M77.0,17.1L77.0,17.3L76.8,17.4L76.4,17.8L76.3,18.1L75.9,18.3L75.8,18.7L75.7,18.9L75.5,18.4L75.3,18.5L75.5,18.3L75.5,18.0L75.0,18.0L74.8,17.8L74.5,17.8L74.5,18.1L74.6,18.3L74.7,18.6L74.7,19.0L74.2,19.0L74.0,19.4L73.3,19.9L72.8,20.3L72.7,20.5L72.3,20.6L72.3,21.2L72.2,21.7L72.0,22.1L72.0,22.4L71.7,22.7L71.3,22.5L71.0,21.9L70.8,21.5L70.7,20.9L70.3,20.0L70.2,19.3L69.8,19.2L69.2,18.9L69.3,18.7L69.1,18.2L69.7,18.0L69.5,17.6L69.6,17.2L70.2,17.0L70.7,16.4L70.9,16.0L70.6,15.7L70.6,15.3L71.4,15.4L71.9,15.5L72.0,15.8L71.8,15.9L72.1,16.4L72.4,16.7L72.5,17.1L73.1,17.4L73.7,17.6L74.2,17.7L74.5,17.6L74.5,17.3L74.7,17.4L74.9,17.6L75.3,17.6L75.6,17.4L75.7,17.3L76.3,16.9L76.7,16.8L76.7,17.1Z","Sri Lanka":"","VAE":"","Katar":"","Israel":"","Australien":"M85.0,33.9L84.5,34.3L83.9,34.4L83.3,34.4L82.9,34.7L82.4,34.7L82.0,34.3L82.1,34.1L82.0,33.5L81.8,33.0L81.7,32.6L81.6,32.4L81.7,32.3L81.6,31.9L81.6,31.5L81.7,31.0L82.1,31.0L82.5,30.7L83.0,30.6L83.3,30.5L83.8,30.2L84.0,29.8L84.4,29.7L84.5,29.5L84.8,29.1L85.0,29.0L85.3,28.8L85.8,29.1L86.1,28.8L86.3,28.5L86.8,28.4L86.8,28.1L87.3,28.3L87.7,28.3L88.0,28.4L87.8,28.7L87.6,29.1L88.1,29.4L88.5,29.7L88.9,29.9L89.2,29.6L89.3,29.0L89.3,28.6L89.4,28.3L89.6,28.0L89.8,28.3L89.9,28.7L90.2,28.9L90.4,29.3L90.5,29.7L90.7,30.3L91.3,30.7L91.6,31.2L91.9,31.2L92.2,31.8L92.5,32.4L92.6,33.1L92.5,33.6L92.1,34.2L91.9,34.8L91.7,35.3L91.2,35.5L90.6,35.8L90.3,35.5L89.7,35.7L89.1,35.6L88.8,35.0L88.5,34.8L88.0,34.8L88.3,34.3L87.9,34.5L87.6,34.4L87.3,34.1L86.5,33.7L85.3,34.0Z","Neuseeland":"M99.1,36.1L99.0,36.3L98.9,36.5L98.7,36.6L98.6,36.5L98.5,36.5L98.7,36.2L98.6,36.1L98.3,36.0L98.3,35.9L98.5,35.8L98.5,35.6L98.5,35.4L98.4,35.2L98.4,35.1L98.3,35.0L98.1,34.8L98.0,34.6L98.1,34.6L98.2,34.7L98.4,34.8L98.5,35.0L98.7,35.3L98.7,35.1L98.8,35.2L98.9,35.4L99.1,35.5L99.3,35.5L99.4,35.4L99.6,35.5L99.5,35.7L99.4,35.9L99.2,35.9L99.1,36.0L99.2,36.1L99.1,36.1ZM97.1,37.1L97.4,37.0L97.5,36.8L97.7,36.6L97.8,36.5L97.8,36.4L98.0,36.2L98.1,36.4L98.1,36.5L98.3,36.4L98.4,36.5L98.4,36.6L98.3,36.7L98.1,36.9L98.0,37.0L98.1,37.2L97.9,37.2L97.6,37.3L97.6,37.5L97.4,37.8L97.2,37.9L97.0,38.0L96.8,37.9L96.6,37.9L96.3,37.8L96.3,37.7L96.4,37.5L96.8,37.3L96.9,37.2L97.1,37.1Z","Fidschi":"","Philippinen":"M84.0,19.9L83.9,20.1L84.0,20.3L84.0,20.5L83.8,20.6L83.8,20.8L83.8,21.0L84.0,21.1L84.1,21.0L84.4,21.2L84.4,21.3L84.5,21.4L84.5,21.5L84.2,21.4L84.1,21.2L84.1,21.3L83.9,21.2L83.6,21.2L83.5,21.2L83.5,21.0L83.6,21.0L83.5,20.9L83.5,21.0L83.4,20.8L83.3,20.7L83.3,20.5L83.4,20.5L83.4,20.1L83.5,19.9L83.7,19.9L83.9,19.9L84.0,19.9L84.0,19.9Z"};
function fillCountryDatalist() {
  const dl = $('country-list');
  if (!dl || dl.children.length) return;
  dl.innerHTML = Object.keys(COUNTRY_COORDS).sort((a,b) => a.localeCompare(b,'de')).map(n => `<option value="${n}">`).join('');
}
/* Restbudget des laufenden Jahres - identische Formel wie in der Urlaube-Detailansicht:
   Budget = 12 x Sparrate, ohne Uebertrag zwischen den Jahren und ohne Einmaleinzahlungen
   (die sind Ausgleiche auf dem Konto und gehoeren nur in die Ist-Sicht). */
function currentYearUrlaubBalance() {
  const yearlyBudget = urlaubBudget;
  if (yearlyBudget <= 0) return null;
  const nowY = new Date().getFullYear();
  let geplant = 0, hatJahr = false;
  urlaube.forEach(u => {
    const ry = parseInt(finTripYear(u), 10);
    if (!ry) return;
    hatJahr = true;
    if (ry === nowY) geplant += tripCost(u);
  });
  if (!hatJahr) return null;
  return yearlyBudget - geplant;
}

// Altersvorsorge nominal, ohne Zinsen: monatlich (m) + einmalig (e) – wie im AV-Dashboard
function avNominalBase() {
  const mo = monthsToRetirement();
  let m = 0, e = 0;
  data.a.forEach(x => {
    let proj, ptype;
    if (x.cat === 'Privat') { proj = (x.current||0) + toMonthly(x.amount||0, x.period) * mo; ptype = 'einmal'; }
    else { proj = x.projected; ptype = x.cat === 'Gesetzlich' ? 'monatlich' : x.projectedType; }
    if (!proj) return;
    if (ptype === 'monatlich') m += proj; else e += proj;
  });
  return { m, e };
}

function renderUrlaubeDash() {
  const body = $('urlaub-dash-body');
  if (!body) return;
  if (!urlaube.length) {
    body.innerHTML = '<div class="av-empty">Noch keine Urlaube geplant. Lege unten in der Urlaube-Sektion welche an.</div>';
    return;
  }
  const yearlyBudget = urlaubBudget;
  const { groups, years } = urlaubGroups();

  // Aktueller Kontostand (Ist, global einmal oben) - reales Guthaben auf dem Sparkonto
  // "Urlaub I", manuell gepflegt. Getrennt von der Budget-Planung je Jahr weiter unten:
  // der Kontostand zeigt, was JETZT auf dem Konto liegt; die Jahreskarten zeigen, wie sich
  // das Jahresbudget (Sparrate x 12) rechnerisch auf geplante Reisen verteilt.
  const konto = data.b.reduce((s,e) => s + (e.name && e.name.trim() === 'Urlaub I' ? (e.balance || 0) : 0), 0);
  const rate = urlaubMonthlyRate();
  let html = `<div class="uy-konto-head"><span>Kontostand</span><b class="kv-editable" onclick="startInlineKontoStart(this)">${fmt(konto)}</b><span class="saverate-eur">${rate > 0 ? fmt(rate) + ' mtl. Sparrate' : 'Keine Sparrate hinterlegt'}</span></div>`;

  // --- BUDGET (Soll/Planung) ---
  // Bewusst reine Jahresplanung: Budget = 12 x Sparrate. Einmaleinzahlungen zaehlen NICHT
  // mit, da sie Ausgleiche auf dem Konto sind (Ist-Sicht), und es gibt keinen Uebertrag
  // zwischen den Jahren - jedes Jahr startet mit dem vollen Planbudget. Die reale
  // Unterdeckung wird ausschliesslich im Kontoverlauf weiter unten sichtbar.
  const expByYear = {};
  urlaube.forEach(u => {
    const ry = parseInt(finTripYear(u), 10);
    if (ry) expByYear[ry] = (expByYear[ry] || 0) + tripCost(u);
  });

  const numYears = years.filter(y => y !== 'ohne').map(Number).filter(Boolean).sort((a,b) => a - b);

  if (yearlyBudget > 0 && numYears.length) {
    html += `<div class="uy-section-label">Budget</div>`;
    numYears.forEach(y => {
      const items = urlaubItems(groups[String(y)] || []);
      const geplant = expByYear[y] || 0;
      const balance = yearlyBudget - geplant;                    // große +/- Zahl

      const remTxt = balance >= 0 ? `${fmt(balance)} übrig` : `${fmt(Math.abs(balance))} fehlen`;
      const fillPct = yearlyBudget > 0 ? Math.min(100, Math.round(geplant / yearlyBudget * 100)) : (geplant > 0 ? 100 : 0);

      const metaGrid = `<div class="uy-meta-pair">
          <span class="uy-mc"><span class="uy-ml">Budget</span><span class="uy-mv">${fmt(yearlyBudget)}</span></span>
          <span class="uy-mc"><span class="uy-ml">Geplant</span><span class="uy-mv">${fmt(geplant)}</span></span>
        </div>`;

      html += `<div class="urlaub-year-head${numYears.indexOf(y) === 0 ? ' first-year' : ''}">
          <div class="uy-top"><span class="uy-year">${y}</span><span class="uy-remaining ${balance < 0 ? 'negative' : ''}">${remTxt}</span></div>
          <div class="uy-bar"><div class="uy-bar-fill ${balance < 0 ? 'over' : ''}" style="width:${fillPct}%"></div></div>
          ${metaGrid}
          ${tripList(items)}</div>`;
    });
  } else {
    // Kein Budget gesetzt: nur Ausgaben je Jahr anzeigen
    numYears.forEach(y => {
      const items = urlaubItems(groups[String(y)] || []);
      const spent = items.reduce((s,u) => s + tripCost(u), 0);
      html += `<div class="urlaub-year-head"><div class="uy-top"><span class="uy-year">${y}</span><span class="uy-remaining">Geplant: ${fmt(spent)}</span></div><div class="uy-meta"><span>Lege unten ein Jahresbudget fest, um die Jahresbilanz zu sehen.</span></div>${tripList(items)}</div>`;
    });
  }

  // Urlaube ohne Reisejahr ans Ende
  if (groups['ohne']) {
    const items = urlaubItems(groups['ohne']);
    const spent = items.reduce((s,u) => s + tripCost(u), 0);
    html += `<div class="urlaub-year-head"><div class="uy-top"><span class="uy-year">Ohne Jahr</span><span class="uy-remaining">Geplant: ${fmt(spent)}</span></div><div class="uy-meta"><span>Diese Urlaube haben kein Reisejahr. Setze im Eintrag ein Jahr (JJJJ).</span></div>${tripList(items)}</div>`;
  }

  // --- KONTOSTAND (Ist/Liquiditaet) ---
  // Monatsweiser Verlauf ab dem laufenden Monat: was tatsaechlich aufs Konto geht
  // (Sparrate, Ausgleichs-Einzahlungen) und was abgeht (Anzahlungen, Reisekosten).
  const verlauf = urlaubKontoVerlauf(konto);
  if (verlauf.length) {
    html += `<div class="uy-section-label">Kontostand</div>`;
    let letztesJahr = null;
    verlauf.forEach(z => {
      const jahrLabel = z.jahr !== letztesJahr ? `<div class="kv-year">${z.jahr}</div>` : '';
      letztesJahr = z.jahr;
      const bewegungen =
        z.zu.map(x => `<div class="kv-move"><span class="kv-lbl">${esc(x.label)}</span><span class="kv-in">+${fmt(x.amount)}</span></div>`).join('') +
        z.ab.map(x => `<div class="kv-move"><span class="kv-lbl">${esc(x.label)}</span><span class="kv-out">−${fmt(x.amount)}</span></div>`).join('');
      html += `${jahrLabel}<div class="kv-month">
          <div class="kv-head"><span class="kv-mon">${MONTH_FULL[z.monat-1]}${z.manuell ? '<span class="kv-manual" title="manuell gesetzt">•</span>' : ''}</span><span class="kv-saldo kv-editable${z.saldo < 0 ? ' negative' : ''}${z.manuell ? ' manuell' : ''}" onclick="startInlineKontoSaldo(${z.ym}, this)">${fmt(z.saldo)}</span></div>
          ${bewegungen}
        </div>`;
    });
  }

  body.innerHTML = html;
}

// Unten: schlichte Einträgeliste (nach Jahr gruppiert, ohne Grafik/Status)
/* Resturlaub je Jahr: 30 Tage Anspruch minus die manuell je Reise
   eingetragenen "Verbrauchte Urlaubstage" (u.days), summiert nach Reisejahr.
   Reisen über den Jahreswechsel (u.daysByYear) zaehlen anteilig in beiden Jahren.
   Zusaetzlich fliessen manuell erfasste Urlaubstage ohne Reise (z.B. Brueckentage) ein. */
function resturlaubJahr(j){
  const reisen = urlaube
    .filter(u => {
      if (u.daysByYear && u.daysByYear[j] != null) return true;
      return parseInt(finTripYear(u), 10) === j;
    })
    .map(u => ({ u, tage: (u.daysByYear && u.daysByYear[j] != null) ? (Number(u.daysByYear[j]) || 0) : (Number(u.days) || 0) }))
    .filter(x => x.tage > 0)
    .sort((a, b) => tripFrom(a.u).localeCompare(tripFrom(b.u)));
  const verplant = reisen.reduce((s, x) => s + x.tage, 0);
  const manuell = manuelleTageJahr(j);
  return { jahr: j, reisen, verplant: verplant + manuell, manuell, rest: URLAUB_ANSPRUCH - verplant - manuell };
}

function renderUrlaube() {
  const wrap = $('urlaub-years');
  const empty = $('empty-urlaub');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (empty) empty.style.display = urlaube.length ? 'none' : 'block';
  const { groups, years } = urlaubGroups();

  years.forEach(y => {
    const items = urlaubItems(groups[y]);
    const lbl = document.createElement('div');
    lbl.className = 'urlaub-year-label';
    lbl.textContent = y === 'ohne' ? 'Ohne Jahr' : y;
    wrap.appendChild(lbl);

    const list = document.createElement('div');
    list.className = 'list';
    items.forEach(u => {
      const zeitraum = tripZeitraumText(u);
      let sched = '';
      if (Array.isArray(u.payments) && u.payments.length) {
        sched = u.payments.slice()
          .sort((a,b) => (a.m||0)-(b.m||0))
          .map(p => {
            const mm = MONTH_FULL[(p.m||tripMonthNum(u))-1];
            const py = p.y || finTripYear(u) || '';
            return `${mm} ${py}: ${fmt(p.amount||0)}`.trim();
          })
          .join(' · ');
      }
      const div = swipeWrapEl('urlaub', u.id, entryCardHTML(
        `<div class="entry-name">${esc(u.name)}</div>
              <div class="entry-sub">${esc(zeitraum)}</div>
              ${sched ? `<div class="entry-paysched">${sched}</div>` : ''}`,
        `<div class="entry-amount">${fmt(tripCost(u))}</div>`,
        `openUrlaubModal('${u.id}')`
      ));
      list.appendChild(div);
      attachSwipeGeneric(div, () => deleteUrlaub(u.id), () => openUrlaubModal(u.id));
    });
    wrap.appendChild(list);
  });
}

function renderUrlaubeAll() {
  updateUrlaubRateHist();
  urlaubBudget = computeUrlaubBudget();
  store.set(URLAUB_BUDGET_KEY, String(urlaubBudget));
  const autoEl = $('urlaub-budget-auto');
  if (autoEl) autoEl.textContent = fmt(urlaubBudget);
  renderUrlaubeDash(); renderUrlaube(); renderDeposits(); renderManualDays();
}

// Liste der Einmaleinzahlungen (unter dem Budget)
function renderDeposits() {
  const wrap = $('deposit-list');
  if (!wrap) return;
  wrap.innerHTML = '';
  const list = urlaubDeposits.slice().sort((a,b) =>
    (parseInt(b.y,10)-parseInt(a.y,10)) || (parseInt(b.m,10)-parseInt(a.m,10))
  );
  list.forEach(d => {
    const m = parseInt(d.m, 10);
    const when = `${m >= 1 && m <= 12 ? MONTH_FULL[m-1] : '–'} ${d.y || ''}`.trim();
    const row = document.createElement('div');
    row.className = 'depo-row';
    row.innerHTML = `
      <div class="depo-main">
        <div class="depo-when">${esc(when)}</div>
        ${d.note ? `<div class="depo-note">${esc(d.note)}</div>` : ''}
      </div>
      <div class="depo-amount">+ ${fmt(d.amount || 0)}</div>
      <div class="depo-actions">
        <button class="btn-icon edit" aria-label="Bearbeiten" onclick="openDepositModal('${d.id}')">${ICON_EDIT}</button>
        <button class="btn-icon del" aria-label="Löschen" onclick="deleteDeposit('${d.id}')">${ICON_DEL}</button>
      </div>`;
    wrap.appendChild(row);
  });
}

function openDepositModal(id) {
  editDepositId = id || null;
  $('deposit-title').textContent = id ? 'Einzahlung bearbeiten' : 'Neue Einzahlung';
  const e = id ? urlaubDeposits.find(x => x.id === id) : null;
  $('deposit-year').value = e ? (e.y || '') : '';
  $('deposit-month').value = e ? String(e.m || '').padStart(2,'0') : '';
  $('deposit-amount').value = e ? fmt(e.amount || 0) : '';
  $('deposit-note').value = e ? (e.note || '') : '';
  oeffneOverlay('deposit-overlay', closeDepositModal);
  setTimeout(() => $('deposit-amount').focus(), 60);
}

function closeDepositModal(){ schliesseOverlay('deposit-overlay'); }

function saveDeposit() {
  const ym = String($('deposit-year').value).match(/\d{4}/);
  const year = ym ? ym[0] : '';
  const month = parseMonthOnly($('deposit-month').value);
  const amount = parseMoney($('deposit-amount').value) || 0;
  const note = $('deposit-note').value.trim();
  if (!year) { notify('Bitte ein Jahr (JJJJ) angeben.'); return; }
  if (!month) { notify('Bitte einen Monat (1–12) angeben.'); return; }
  if (amount <= 0) { notify('Bitte einen Betrag eingeben.'); return; }
  const obj = { y: year, m: month, amount, note };
  if (editDepositId) {
    const i = urlaubDeposits.findIndex(x => x.id === editDepositId);
    urlaubDeposits[i] = { ...urlaubDeposits[i], ...obj };
  } else {
    urlaubDeposits.push({ id: neueId(), ...obj });
  }
  store.set(URLAUB_DEPOSITS_KEY, JSON.stringify(urlaubDeposits));
  closeDepositModal();
  renderUrlaubeAll();
}

async function deleteDeposit(id) {
  await loeschenMitRueckfrage({
    liste: urlaubDeposits, id, name: 'Einzahlung',
    text: 'Einzahlung wirklich löschen?',
    speichern: () => store.set(URLAUB_DEPOSITS_KEY, JSON.stringify(urlaubDeposits)),
    zeichnen: () => renderUrlaubeAll()
  });
}

// Liste der manuell erfassten Urlaubstage ohne Reise (z.B. Brueckentage)
function renderManualDays() {
  const wrap = $('manual-day-list');
  if (!wrap) return;
  wrap.innerHTML = '';
  const list = manuelleUrlaubstage.slice().sort((a,b) => (b.date||'').localeCompare(a.date||''));
  list.forEach(m => {
    const row = document.createElement('div');
    row.className = 'depo-row';
    row.innerHTML = `
      <div class="depo-main">
        <div class="depo-when">${esc(isoToDE(m.date))}</div>
        ${m.note ? `<div class="depo-note">${esc(m.note)}</div>` : ''}
      </div>
      <div class="depo-amount">${Number(m.days)===1 ? '1 Tag' : (String(m.days).replace('.', ',') + ' Tage')}</div>
      <div class="depo-actions">
        <button class="btn-icon edit" aria-label="Bearbeiten" onclick="openManualDayModal('${m.id}')">${ICON_EDIT}</button>
        <button class="btn-icon del" aria-label="Löschen" onclick="deleteManualDay('${m.id}')">${ICON_DEL}</button>
      </div>`;
    wrap.appendChild(row);
  });
}

function openManualDayModal(id) {
  editManualDayId = id || null;
  $('manual-day-title').textContent = id ? 'Urlaubstag bearbeiten' : 'Neuer Urlaubstag';
  const e = id ? manuelleUrlaubstage.find(x => x.id === id) : null;
  $('manual-day-date').value = e ? isoToDE(e.date) : '';
  $('manual-day-count').value = e ? String(e.days).replace('.', ',') : '1';
  $('manual-day-note').value = e ? (e.note || '') : '';
  oeffneOverlay('manual-day-overlay', closeManualDayModal);
  setTimeout(() => $('manual-day-date').focus(), 60);
}

function closeManualDayModal(){ schliesseOverlay('manual-day-overlay'); editManualDayId = null; }

function saveManualDay() {
  const date = deToISO($('manual-day-date').value.trim());
  const days = parseMoney($('manual-day-count').value);
  const note = $('manual-day-note').value.trim();
  if (!date) { notify('Bitte ein Datum angeben.'); return; }
  if (days === null || days <= 0) { notify('Bitte eine gültige Anzahl Tage angeben.'); return; }
  const obj = { date, days, note };
  if (editManualDayId) {
    const i = manuelleUrlaubstage.findIndex(x => x.id === editManualDayId);
    if (i > -1) manuelleUrlaubstage[i] = { ...manuelleUrlaubstage[i], ...obj };
  } else {
    manuelleUrlaubstage.push({ id: neueId(), ...obj });
  }
  store.set(URLAUB_MANUAL_DAYS_KEY, JSON.stringify(manuelleUrlaubstage));
  closeManualDayModal();
  renderUrlaubeAll();
}

async function deleteManualDay(id) {
  await loeschenMitRueckfrage({
    liste: manuelleUrlaubstage, id, name: 'Urlaubstag',
    text: 'Diesen Urlaubstag wirklich löschen?',
    speichern: () => store.set(URLAUB_MANUAL_DAYS_KEY, JSON.stringify(manuelleUrlaubstage)),
    zeichnen: () => renderUrlaubeAll()
  });
}

function urlaubPaymentRowHTML(m, amount, y) {
  const a = (amount != null && amount !== '') ? fmt(amount) : '';
  const mv = (m != null && m !== '') ? String(m).padStart(2,'0') : '';
  const yv = (y != null && y !== '') ? String(y) : '';
  return `<div class="pay-row">
    <input type="text" class="pay-month" placeholder="z.B. MM" inputmode="numeric" value="${esc(mv)}" autocomplete="off" oninput="updatePayHint()">
    <input type="text" class="pay-year" placeholder="z.B. JJJJ" inputmode="numeric" value="${esc(yv)}" autocomplete="off" oninput="updatePayHint()">
    <input type="text" class="pay-amount" placeholder="z.B. 1.000,00 €" value="${a ? esc(a) : ''}" autocomplete="off" oninput="updatePayHint()">
    <button type="button" class="pay-del" aria-label="Anzahlung entfernen" onclick="removePaymentRow(this)">${ICON_DEL}</button>
  </div>`;
}

function addPaymentRow(m, amount, y) {
  $('urlaub-payments').insertAdjacentHTML('beforeend', urlaubPaymentRowHTML((m != null ? m : ''), (amount != null ? amount : ''), (y != null ? y : '')));
  updatePayHint();
}

function removePaymentRow(btn) {
  const row = btn.closest('.pay-row');
  if (row) row.remove();
  updatePayHint();
}

function readUrlaubPayments() {
  return [...$('urlaub-payments').querySelectorAll('.pay-row')].map(r => {
    const ym = String(r.querySelector('.pay-year').value).match(/\d{4}/);
    return {
      m: parseMonthOnly(r.querySelector('.pay-month').value),
      y: ym ? ym[0] : '',
      amount: parseMoney(r.querySelector('.pay-amount').value) || 0
    };
  });
}

// Zeigt, was nach den Anzahlungen als Rest im Reisemonat fällig wird
function updatePayHint() {
  const hint = $('urlaub-pay-hint');
  if (!hint) return;
  const cost = parseMoney($('urlaub-cost').value) || 0;
  const von = deToISO($('urlaub-from').value.trim());
  const month = von ? parseInt(von.slice(5,7), 10) : 0;
  const explicit = readUrlaubPayments().reduce((s,p) => s + (p.amount || 0), 0);
  if (explicit <= 0) { hint.textContent = 'Ohne Anzahlung wird der Gesamtbetrag im Reisemonat fällig.'; hint.classList.remove('over'); return; }
  const rest = cost - explicit;
  const mName = month ? MONTH_FULL[month-1] : 'Reisemonat';
  if (rest < -0.005) {
    hint.classList.add('over');
    hint.innerHTML = `Angezahlt: <b>${fmt(explicit)}</b> – das sind <b>${fmt(Math.abs(rest))}</b> mehr als die Gesamtkosten.`;
  } else {
    hint.classList.remove('over');
    hint.innerHTML = `Angezahlt: <b>${fmt(explicit)}</b> · Rest im ${mName}: <b>${fmt(rest)}</b>`;
  }
}

function openUrlaubModal(id) {
  editUrlaubId = id || null;
  fillCountryDatalist();
  $('urlaub-title').textContent = id ? 'Urlaub bearbeiten' : 'Neuer Urlaub';
  const e = id ? urlaube.find(x => x.id === id) : null;
  $('urlaub-name').value = e ? e.name : '';
  if ($('urlaub-country')) $('urlaub-country').value = (e && e.country) || '';
  $('urlaub-from').value = e ? isoToDE(tripFrom(e)) : '';
  $('urlaub-to').value   = e ? isoToDE(tripTo(e))   : '';
  $('urlaub-days').value = (e && e.days) ? String(e.days).replace('.', ',') : '';
  $('urlaub-days-y1').value = '';
  $('urlaub-days-y2').value = '';
  $('urlaub-cost').value = e ? fmt(tripCost(e)) : '';
  $('urlaub-payments').innerHTML = '';
  if (e && Array.isArray(e.payments)) {
    e.payments.slice().sort((a,b) => (a.m||0)-(b.m||0)).forEach(p => {
      const m = (typeof p.m === 'number') ? p.m : (urlaubMonthNum(p.month) || parseMonthOnly(p.month));
      if (m && p.amount) addPaymentRow(m, p.amount, p.y || finTripYear(e) || '');
    });
  }
  updatePayHint();
  checkUrlaubYearSpan();
  if (e && e.daysByYear) {
    const jahre = Object.keys(e.daysByYear).sort();
    if (jahre[0] != null) $('urlaub-days-y1').value = String(e.daysByYear[jahre[0]]).replace('.', ',');
    if (jahre[1] != null) $('urlaub-days-y2').value = String(e.daysByYear[jahre[1]]).replace('.', ',');
  }
  if (e && e.budgetYear && $('urlaub-budget-year')) {
    $('urlaub-budget-year').value = String(e.budgetYear);
  }
  oeffneOverlay('urlaub-overlay', closeUrlaubModal);
  setTimeout(() => $('urlaub-name').focus(), 60);
}

/* Prueft, ob die Reise (Von/Bis) den Jahreswechsel ueberschreitet. Nur dann
   werden zwei separate Tages-Felder je Jahr eingeblendet - ansonsten bleibt
   das gewohnte einzelne Feld "Verbrauchte Urlaubstage" bestehen. */
function checkUrlaubYearSpan() {
  const from = deToISO($('urlaub-from').value.trim());
  const to   = deToISO($('urlaub-to').value.trim()) || from;
  const splitRow = $('urlaub-split-row');
  const daysWrap = $('urlaub-days-wrap');
  const byField = $('urlaub-budget-year-field');
  const bySelect = $('urlaub-budget-year');
  if (!splitRow || !daysWrap) return;
  const jahrVon = from ? from.slice(0, 4) : '';
  const jahrBis = to ? to.slice(0, 4) : '';
  if (jahrVon && jahrBis && jahrVon !== jahrBis) {
    splitRow.style.display = '';
    daysWrap.style.display = 'none';
    $('urlaub-split-label-1').textContent = 'Urlaubstage ' + jahrVon;
    $('urlaub-split-label-2').textContent = 'Urlaubstage ' + jahrBis;
    updateUrlaubDaysTotal();
    if (byField && bySelect) {
      const prevVal = bySelect.value;
      bySelect.innerHTML = `<option value="${jahrVon}">${jahrVon}</option><option value="${jahrBis}">${jahrBis}</option>`;
      bySelect.value = (prevVal === jahrVon || prevVal === jahrBis) ? prevVal : jahrVon;
      byField.style.display = '';
    }
  } else {
    splitRow.style.display = 'none';
    daysWrap.style.display = '';
    if (byField) byField.style.display = 'none';
  }
}

/* Haelt das (dann versteckte) Gesamt-Tage-Feld synchron zur Summe der beiden
   Jahres-Felder, damit an anderer Stelle (Reiseliste, Backup) weiterhin ein
   einziger Gesamtwert zur Verfuegung steht. */
function updateUrlaubDaysTotal() {
  const y1 = parseMoney($('urlaub-days-y1').value) || 0;
  const y2 = parseMoney($('urlaub-days-y2').value) || 0;
  $('urlaub-days').value = (y1 + y2) ? String(y1 + y2).replace('.', ',') : '';
}

function closeUrlaubModal(){ schliesseOverlay('urlaub-overlay'); }

function saveUrlaub() {
  const name = $('urlaub-name').value.trim();
  const from = deToISO($('urlaub-from').value.trim());
  const to   = deToISO($('urlaub-to').value.trim()) || from;
  const year  = from ? from.slice(0, 4) : '';
  const month = from ? parseInt(from.slice(5, 7), 10) : 0;
  const cost = parseMoney($('urlaub-cost').value) || 0;
  if (!name) { notify('Bitte ein Reiseziel eingeben.'); return; }
  if (!from) { notify('Bitte den Reisebeginn angeben.'); return; }
  if (to < from) { notify('Das Ende darf nicht vor dem Beginn liegen.'); return; }
  if (parseMoney($('urlaub-cost').value) === null && $('urlaub-cost').value.trim() !== '') { notify('Bitte gültige Gesamtkosten eingeben.'); return; }
  if ($('urlaub-cost').value.includes('-')) { notify('Gesamtkosten können nicht negativ sein.'); return; }
  const splitAktiv = $('urlaub-split-row') && $('urlaub-split-row').style.display !== 'none';
  let daysByYear = null;
  let budgetYear = null;
  if (splitAktiv) {
    const jahrBis = to.slice(0, 4);
    const y1 = parseMoney($('urlaub-days-y1').value) || 0;
    const y2 = parseMoney($('urlaub-days-y2').value) || 0;
    if (y1 < 0 || y2 < 0) { notify('Bitte gültige Urlaubstage je Jahr eingeben.'); return; }
    daysByYear = { [year]: y1, [jahrBis]: y2 };
    updateUrlaubDaysTotal();
    if ($('urlaub-budget-year') && $('urlaub-budget-year').value) {
      budgetYear = $('urlaub-budget-year').value;
    }
  }
  const daysRaw = $('urlaub-days').value.trim();
  const days = daysRaw ? parseMoney(daysRaw) : 0;
  if (daysRaw && (days === null || days < 0)) { notify('Bitte eine gültige Anzahl Urlaubstage eingeben.'); return; }
  const raw = readUrlaubPayments();
  if (raw.some(p => (p.amount > 0) !== !!p.m)) { notify('Bitte für jede Anzahlung Monat und Betrag angeben (oder die Zeile entfernen).'); return; }
  const payments = raw.filter(p => p.m && p.amount > 0).map(p => ({ m: p.m, amount: p.amount, y: p.y || year }));
  const country = ($('urlaub-country') ? $('urlaub-country').value.trim() : '');
  const obj = { name, year, month, cost, from, to, days: days || 0 };
  if (country) obj.country = country;
  if (payments.length) obj.payments = payments;
  if (daysByYear) obj.daysByYear = daysByYear;
  if (budgetYear) obj.budgetYear = budgetYear;
  if (editUrlaubId) {
    const i = urlaube.findIndex(x => x.id === editUrlaubId);
    const { payments: _old, month: _m, daysByYear: _dby, budgetYear: _by, ...rest } = urlaube[i];
    urlaube[i] = { ...rest, ...obj };
  } else {
    urlaube.push({ id: neueId(), ...obj });
  }
  store.set(URLAUB_KEY, JSON.stringify(urlaube));
  closeUrlaubModal();
  renderUrlaubeAll();
}

async function deleteUrlaub(id) {
  await loeschenMitRueckfrage({
    liste: urlaube, id,
    speichern: () => store.set(URLAUB_KEY, JSON.stringify(urlaube)),
    zeichnen: () => renderUrlaubeAll()
  });
}

function buildValueFields(sec, vEntry) {
  const cfg = SECTIONS[sec];
  let vf = cfg.valueFields || [];
  const isPrivat = (sec === 'a' && $('f-cat').value === 'Privat');
  // For Privat: only the current value (projected is auto-calculated, field hidden)
  if (isPrivat) vf = vf.filter(f => f.key !== 'projected');

  // Optional: ein valueField inline neben dem Betrag anzeigen
  const inlineKey = cfg.amountWithValue;
  const inlineWrap = $('f-amount-value-wrap');
  if (inlineKey) {
    const inlineF = vf.find(f => f.key === inlineKey);
    if (inlineF) {
      inlineWrap.style.display = '';
      $('f-amount-value-label').textContent = inlineF.label;
      $('f-amount-value-input').placeholder = inlineF.placeholder || '';
      $('f-amount-value-input').value = vEntry && vEntry[inlineKey] != null ? fmt(vEntry[inlineKey]) : '';
      vf = vf.filter(f => f.key !== inlineKey);
    } else {
      inlineWrap.style.display = 'none';
    }
  } else {
    inlineWrap.style.display = 'none';
  }

  const rowFields = vf.filter(f => f.row);
  const soloFields = vf.filter(f => !f.row);
  // Bei Privat: Einheiten-Feld direkt neben "Aktueller Wert" in dieselbe Zeile
  const unitsInline = isPrivat && cfg.unitsField;
  let vHtml = '';
  if (rowFields.length) {
    let cells = rowFields.map(f =>
      `<div><label>${f.label}</label><input type="text" id="vf-${f.key}" placeholder="${f.placeholder||''}" autocomplete="off"></div>`
    ).join('');
    if (unitsInline) {
      cells += `<div><label>${cfg.unitsField.label}</label><input type="text" id="f-units-input-inline" placeholder="${cfg.unitsField.placeholder||''}" autocomplete="off"></div>`;
    }
    vHtml += '<div class="field field-row">' + cells + '</div>';
  }
  vHtml += soloFields.map(f =>
    `<div class="field"><label>${f.label}</label><input type="text" id="vf-${f.key}" placeholder="${f.placeholder||''}" autocomplete="off"></div>`
  ).join('');
  $('f-values').innerHTML = vHtml;
  vf.forEach(f => {
    const v = vEntry ? vEntry[f.key] : null;
    const inp = $('vf-' + f.key);
    if (inp) inp.value = (v != null) ? fmt(v) : '';
  });
  // Einheiten-Wert ins Inline-Feld laden (Privat)
  if (unitsInline) {
    const ui = $('f-units-input-inline');
    if (ui) ui.value = vEntry ? (vEntry[cfg.unitsField.key] || '') : '';
  }

  // Projected type selector — hidden for Privat (auto) and Gesetzlich (always monthly)
  const cat = $('f-cat').value;
  const ptWrap = $('f-projtype');
  if (cfg.projectedTypeField && !isPrivat && cat !== 'Gesetzlich') {
    ptWrap.style.display = '';
    $('f-projtype-select').value = (vEntry && vEntry.projectedType) ? vEntry.projectedType : 'einmal';
  } else {
    ptWrap.style.display = 'none';
    if (cat === 'Gesetzlich') $('f-projtype-select').value = 'monatlich';
  }
}

function renderGrowthArea(sec, vEntry) {
  const cfg = SECTIONS[sec];
  const gf = cfg.growthFields || [];
  const el = $('f-growth');
  if (!gf.length) { el.innerHTML = ''; return; }
  const cat = $('f-cat').value;
  // Privat -> automatic, show note only
  if (cat === 'Privat') {
    el.innerHTML =
      `<div class="growth-auto-note">„Bei Renteneintritt" wird automatisch berechnet (aktueller Wert + Monatsbetrag bis 67) und in der Übersicht angezeigt. Die Renditeszenarien siehst du im Dashboard.</div>`;
    return;
  }
  // No separate scenario-type selector: scenarios follow the single "Art des Renteneintritt-Betrags" choice.
  // Gesetzlich is always monthly.
  el.innerHTML = `<div class="field-group-label">Szenarien</div>
    <div class="field field-row">` +
    gf.map(f =>
      `<div><label>${f.label}</label><input type="text" id="gf-${f.key}" placeholder="${f.placeholder||''}" autocomplete="off"></div>`
    ).join('') +
    `</div>`;
  gf.forEach(f => {
    const inp = $('gf-' + f.key);
    const v = vEntry ? vEntry[f.key] : null;
    if (inp) inp.value = (v != null) ? fmt(v) : '';
  });
}

function finOpenModal(sec, id) {
  activeSection = sec;
  editId = id || null;
  const cfg = SECTIONS[sec];

  // Category options
  $('f-cat').innerHTML = cfg.cats.map(c => `<option>${c}</option>`).join('');

  // Provider field: hidden for some sections
  const showProvider = !cfg.hideProvider;
  const showExtra = !!cfg.extra;
  $('f-prov-acct-row').style.display = (showProvider || showExtra) ? '' : 'none';
  $('f-provider-wrap').style.display = showProvider ? '' : 'none';
  $('f-provider-label').textContent = cfg.providerLabel || '';
  $('f-provider').placeholder = cfg.providerPlaceholder || '';

  // Interval visibility
  $('f-period-wrap').style.display = cfg.showPeriod ? '' : 'none';

  // Extra field: text input vs select
  const exLabel = $('f-extra-label');
  const exInput = $('f-extra-input');
  const exSelect = $('f-extra-select');
  const exWrap = $('f-extra-wrap');
  if (cfg.extra) {
    exWrap.style.display = '';
    exLabel.textContent = cfg.extra.label;
    if (cfg.extra.kind === 'select') {
      exInput.style.display = 'none';
      exSelect.style.display = '';
      exSelect.innerHTML = cfg.extra.options.map(o => `<option>${o}</option>`).join('');
    } else {
      exSelect.style.display = 'none';
      exInput.style.display = '';
      exInput.placeholder = cfg.extra.placeholder || '';
    }
  } else {
    exWrap.style.display = 'none';
  }

  $('f-name').placeholder = cfg.namePlaceholder;
  $('modal-title').textContent = id ? 'Eintrag bearbeiten' : 'Neuer Eintrag';
  $('btn-duplicate').style.display = id ? '' : 'none';

  // Build custom free-text fields (e.g. Abbuchungsdatum) from config
  const tf = cfg.textFields || [];
  $('f-texts').innerHTML = (() => {
    let html = '', i = 0;
    const fieldHtml = (ff) => ff.date
      ? `<div class="field"><label>${ff.label}</label><input type="text" id="tf-${ff.key}" placeholder="${ff.placeholder||''}" inputmode="numeric" autocomplete="off" oninput="autoDate(this)" onblur="fixDate(this)"></div>`
      : `<div class="field"><label>${ff.label}</label><input type="${ff.kind === 'date' ? 'date' : 'text'}" id="tf-${ff.key}" placeholder="${ff.placeholder||''}" autocomplete="off"></div>`;
    while (i < tf.length) {
      const f = tf[i];
      if (f.half && tf[i+1] && tf[i+1].half) {
        html += `<div class="field-row">${fieldHtml(f)}${fieldHtml(tf[i+1])}</div>`;
        i += 2;
      } else {
        html += fieldHtml(f);
        i += 1;
      }
    }
    return html;
  })();

  const vEntry = id ? data[sec].find(x => x.id === id) : null;

  if (id) {
    const e = vEntry;
    $('f-name').value     = e.name;
    $('f-provider').value = e.provider || '';
    $('f-account').value  = e.account || '';
    $('f-amount').value   = fmt(e.amount);
    $('f-period').value   = e.period || 'monatlich';
    $('f-cat').value      = e.cat;
    if (cfg.extra && cfg.extra.kind === 'select') exSelect.value = e.extra || cfg.extra.options[0];
    else if (cfg.extra) exInput.value = e.extra ?? e.contract ?? '';
  } else {
    ['f-name','f-provider','f-amount','f-extra-input'].forEach(i => $(i).value = '');
    $('f-account').value = '';
    $('f-period').value = cfg.fixedPeriod || 'monatlich';
    $('f-cat').value    = cfg.defaultCat;
    if (cfg.extra && cfg.extra.kind === 'select') exSelect.value = cfg.extra.options[0];
  }
  tf.forEach(f => {
    const val = vEntry ? vEntry[f.key] : null;
    if (f.kind === 'money') {
      $('tf-' + f.key).value = (val != null && val !== '') ? Number(val).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) : '';
    } else if (f.iso) {
      $('tf-' + f.key).value = isoToDE(val || '');
    } else {
      $('tf-' + f.key).value = val || '';
    }
  });

  // Now build value/growth fields AFTER category is set (category-aware for section a)
  buildValueFields(sec, vEntry);
  renderGrowthArea(sec, vEntry);

  // Auto-Erhöhung-Schalter (nur Sparen)
  const agWrap = $('f-autogrow-wrap');
  if (cfg.autoGrowOption) {
    agWrap.style.display = '';
    $('f-autogrow').checked = !!(vEntry && vEntry.autoGrow);
  } else {
    agWrap.style.display = 'none';
    $('f-autogrow').checked = false;
  }

  // Einheiten-Feld (optional, z.B. AV)
  // Bei Privat wird Einheiten inline neben "Aktueller Wert" gerendert (in buildValueFields)
  const unitsInlinePrivat = (sec === 'a' && $('f-cat').value === 'Privat' && cfg.unitsField);
  const unitsWrap = $('f-units-wrap');
  if (cfg.unitsField && !unitsInlinePrivat) {
    unitsWrap.style.display = '';
    $('f-units-label').textContent = cfg.unitsField.label;
    $('f-units-input').placeholder = cfg.unitsField.placeholder || '';
    $('f-units-input').value = vEntry ? (vEntry[cfg.unitsField.key] || '') : '';
  } else {
    unitsWrap.style.display = 'none';
    if (!unitsInlinePrivat) $('f-units-input').value = '';
  }

  // Wrapper-Zeile für Einheiten + Art der Beträge nur zeigen, wenn mind. eins sichtbar
  const utRow = $('f-units-projtype-row');
  const unitsVis = unitsWrap.style.display !== 'none';
  const ptVis = $('f-projtype').style.display !== 'none';
  utRow.style.display = (unitsVis || ptVis) ? '' : 'none';
  utRow.style.gridTemplateColumns = '1fr 1fr';

  // React to category changes (section a only)
  if (sec === 'a') {
    $('f-cat').onchange = () => { buildValueFields(sec, vEntry); renderGrowthArea(sec, vEntry); };
  } else {
    $('f-cat').onchange = null;
  }

  // Money-Felder mit Auto-Format (on blur) versehen
  bindMoneyInput($('f-amount'));
  bindMoneyInput($('f-amount-value-input'));
  (cfg.valueFields || []).forEach(f => bindMoneyInput($('vf-' + f.key)));
  (cfg.textFields || []).forEach(f => { if (f.kind === 'money') bindMoneyInput($('tf-' + f.key)); });
  (cfg.growthFields || []).forEach(f => bindMoneyInput($('gf-' + f.key)));

  oeffneOverlay('overlay', finCloseModal);
  setTimeout(() => $('f-name').focus(), 60);
}

function finCloseModal(){ schliesseOverlay('overlay'); }
function closeIfBg(e){ if (e.target === $('overlay')) finCloseModal(); }

function saveEntry() {
  const sec = activeSection;
  const cfg = SECTIONS[sec];
  const name     = $('f-name').value.trim();
  const provider = cfg.hideProvider ? '' : $('f-provider').value.trim();
  const account  = $('f-account').value;
  const amount   = parseMoney($('f-amount').value);
  const period   = cfg.showPeriod ? $('f-period').value : (cfg.fixedPeriod || 'monatlich');
  const cat      = $('f-cat').value;
  const extra    = !cfg.extra ? ''
    : cfg.extra.kind === 'select'
      ? $('f-extra-select').value
      : $('f-extra-input').value.trim();

  if (!name || amount == null || isNaN(amount) || amount < 0) { notify('Bitte Name und Betrag ausfüllen.'); return; }

  const fields = { name, provider, account, amount, period, cat, extra };
  (cfg.valueFields || []).forEach(f => {
    let inp = $('vf-' + f.key);
    if (!inp && cfg.amountWithValue === f.key) inp = $('f-amount-value-input');
    if (inp) fields[f.key] = parseMoney(inp.value);
  });
  (cfg.textFields || []).forEach(f => {
    const raw = $('tf-' + f.key).value.trim();
    fields[f.key] = (f.kind === 'money') ? (raw === '' ? '' : parseMoney(raw)) : (f.iso ? (deToISO(raw) || raw) : raw);
  });
  if (cfg.unitsField) {
    // Privat rendert Einheiten inline (f-units-input-inline), sonst Standard-Feld
    const src = $('f-units-input-inline') || $('f-units-input');
    fields[cfg.unitsField.key] = src ? src.value.trim() : '';
  }

  // Auto-Erhöhung: Flag + Monats-Anker (beim Aktivieren auf aktuellen Monat, kein Nachbuchen)
  if (cfg.autoGrowOption) {
    const on = $('f-autogrow').checked;
    fields.autoGrow = on;
    if (on) {
      const prev = editId ? data[sec].find(x => x.id === editId) : null;
      fields.autoGrowYM = (prev && prev.autoGrow && prev.autoGrowYM != null)
        ? prev.autoGrowYM
        : (new Date().getFullYear() * 12 + new Date().getMonth());
    } else {
      fields.autoGrowYM = null;
    }
  }

  // Section a, Privat: auto-compute "Bei Renteneintritt" = current + months×monthly (no return)
  if (sec === 'a' && cat === 'Privat') {
    const cur = fields.current || 0;
    const mo = toMonthly(amount || 0, period);
    fields.projected = cur + mo * monthsToRetirement();
    fields.projectedType = 'einmal';
    // clear any old manual growth values
    (cfg.growthFields || []).forEach(f => { fields[f.key] = null; if (f.typeKey) fields[f.typeKey] = null; });
    fields.growthType = null;
  } else {
    let projType = 'einmal';
    if (cat === 'Gesetzlich') projType = 'monatlich';
    else if (cfg.projectedTypeField) {
      const pt = $('f-projtype-select');
      if (pt) projType = pt.value;
    }
    fields.projectedType = projType;
    (cfg.growthFields || []).forEach(f => {
      const inp = $('gf-' + f.key);
      fields[f.key] = inp ? parseMoney(inp.value) : null;
    });
    // Scenario type mirrors the single projected-type choice
    fields.growthType = projType;
  }

  if (editId) {
    const i = data[sec].findIndex(x => x.id === editId);
    data[sec][i] = { ...data[sec][i], ...fields };
  } else {
    data[sec].push({ id: neueId(), ...fields });
  }
  store.set(cfg.storageKey, JSON.stringify(data[sec]));
  finCloseModal();
  renderSection(sec);
  updateIncome();
}

async function deleteEntry(sec, id) {
  await loeschenMitRueckfrage({
    liste: data[sec], id,
    speichern: () => store.set(SECTIONS[sec].storageKey, JSON.stringify(data[sec])),
    zeichnen: () => { renderSection(sec); updateIncome(); }
  });
}

// ---- Custom dialog (replaces native confirm/alert which are blocked in some sandboxes) ----

// --- Eintrag duplizieren (aus dem Bearbeiten-Modal) ---
function duplicateEntry() {
  const sec = activeSection;
  if (!editId) return;
  const src = data[sec].find(x => x.id === editId);
  if (!src) return;
  const copy = JSON.parse(JSON.stringify(src));
  copy.id = neueId();
  copy.name = (src.name || '') + ' Kopie';
  data[sec].push(copy);
  store.set(SECTIONS[sec].storageKey, JSON.stringify(data[sec]));
  renderSection(sec);
  updateIncome();
  // Kopie direkt zum Umbenennen öffnen
  finOpenModal(sec, copy.id);
  setTimeout(() => { const f = $('f-name'); f.focus(); f.select && f.select(); }, 80);
}

// --- Stand direkt in der Liste bearbeiten (antippen) ---
function startInlineBalance(sec, id, el) {
  const e = data[sec].find(x => x.id === id);
  if (!e || el.querySelector('input')) return;
  const key = sec === 'a' ? 'current' : 'balance';
  const old = e[key];
  el.innerHTML = `<span>Stand:</span> <input type="text" class="balance-inline" inputmode="decimal" autocomplete="transaction-amount">`;
  const inp = el.querySelector('input');
  inp.value = fmt(old);
  inp.focus();
  inp.select && inp.select();
  let done = false;
  const commit = () => {
    if (done) return;
    done = true;
    const v = parseMoney(inp.value);
    if (v != null && !isNaN(v) && v >= 0) e[key] = v;
    store.set(SECTIONS[sec].storageKey, JSON.stringify(data[sec]));
    renderSection(sec);
    renderDashboard();
    if (sec === 'a') renderAvDash();
    updateIncome();
  };
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') { ev.preventDefault(); inp.blur(); }
  });
}

// Undo-Toast liegt im Kern.

// Info-Popup: welche Einträge fließen ins Gesamtvermögen ein
function showWealthInfo() {
  const catOrder = SECTIONS.b.cats || [];
  const byCat = (a, b) => {
    const ci = catOrder.indexOf(a.cat) - catOrder.indexOf(b.cat);
    return ci !== 0 ? ci : (a.name || '').localeCompare(b.name || '', 'de', { numeric: true });
  };
  const vermoegen = data.b.filter(e => !isGiro(e)).sort(byCat).map(e => e.name);
  const vorsorge  = data.a.filter(e => e.cat === 'Privat').sort((a,b)=>(a.name||'').localeCompare(b.name||'','de',{numeric:true})).map(e => e.name);
  const v = vermoegen.length ? vermoegen.join(', ') : '–';
  const a = vorsorge.length ? vorsorge.join(', ') : '–';
  notify(
    `Vermögen:\n${v}\n\nVorsorge (private Altersvorsorge):\n${a}`,
    'Was fließt ein?'
  );
}

// ---- Export / Import ----
// ═══════════════ Cloud-Backup (GitHub, verschlüsselt) ═══════════════
// Ablauf: Daten → AES-256-GCM verschlüsseln (Schlüssel aus Passphrase via PBKDF2)
// → als backup.enc.json in ein privates GitHub-Repo pushen (Contents-API).
// Bei GitHub liegt nur unlesbarer Ciphertext; entschlüsseln kann nur die Passphrase.

let _cloudBusy = false;


// --- Krypto: Passphrase → AES-256-GCM ---

// --- GitHub Contents-API ---

// --- Auto-Trigger: 30 Sek. nach der letzten Datenänderung sichern ---
/* Zentrales Registry aller gesicherten Datenschlüssel – eine Quelle der Wahrheit.
   Neue Datenart? Hier eintragen, dann wird sie automatisch mit ins Cloud-Backup genommen. */
const FIN_KEYS = {
  abos:'abos_v1', budgets:'budgets_v1', altersvorsorge:'altersvorsorge_v1', income:'income_v1', bonus:'bonus_v1',
  urlaube:'urlaube_v1', urlaubBudget:'urlaub_budget_v1', urlaubDeposits:'urlaub_deposits_v1',
  urlaubManualDays:'urlaub_manual_days_v1', urlaubKontoOverride:'urlaub_konto_override_v1',
  urlaubRateHist:'urlaub_rate_hist_v1', history:'history_v1', incomeMeta:'income_meta_v1'
};

// ═══════════════ App-Sperre (FaceID/TouchID via WebAuthn) ═══════════════
// Beim Aktivieren wird ein Passkey auf dem Gerät erzeugt; Entsperren verlangt
// Face ID / Touch ID. Hinweis: Das ist ein Sichtschutz gegen beiläufigen Zugriff —
// die Daten selbst bleiben lokal unverschlüsselt gespeichert.

  // erst nach 5 Min. im Hintergrund sperren

function finBuildBackupPayload() {
  return {
    app: 'finanzen-uebersicht',
    version: 1,
    exportedAt: new Date().toISOString(),
    income: income,
    incomeMeta: incomeMeta,
    sections: { v: data.v, b: data.b, a: data.a },
    bonus: bonus,
    urlaube: urlaube,
    urlaubBudget: urlaubBudget,
    urlaubRateHist: urlaubRateHist,
    urlaubDeposits: urlaubDeposits,
    urlaubManualDays: manuelleUrlaubstage,
    urlaubKontoOverride: urlaubKontoOverrides,
    avViewMode: avViewMode,
    history: history
  };
}

async function finApplyBackup(rawText) {
  let parsed;
  try { parsed = JSON.parse(rawText); }
  catch (e) { notify('Das ist keine gültige Backup-Datei.'); return; }
  const sec = parsed && parsed.sections ? parsed.sections : null;
  if (!sec || (!Array.isArray(sec.v) && !Array.isArray(sec.b) && !Array.isArray(sec.a))) {
    notify('Diese Datei sieht nicht wie ein gültiges Backup aus.');
    return;
  }
  const nV = Array.isArray(sec.v) ? sec.v.length : 0;
  const nB = Array.isArray(sec.b) ? sec.b.length : 0;
  const nA = Array.isArray(sec.a) ? sec.a.length : 0;
  const ok = await showDialog(
    `Versicherungen & Verträge: ${nV}\nKonsum, Urlaub & Sparen: ${nB}\nAltersvorsorge: ${nA}\n\nDies ersetzt deine aktuellen Einträge.`,
    { title: 'Backup wiederherstellen?', okText: 'Wiederherstellen' }
  );
  if (!ok) return;
  if (Array.isArray(sec.v)) { data.v = sec.v; store.set(SECTIONS.v.storageKey, JSON.stringify(data.v)); }
  if (Array.isArray(sec.b)) { data.b = sec.b; store.set(SECTIONS.b.storageKey, JSON.stringify(data.b)); }
  if (Array.isArray(sec.a)) { data.a = sec.a; store.set(SECTIONS.a.storageKey, JSON.stringify(data.a)); }
  if (typeof parsed.income === 'number') {
    income = parsed.income;
    store.set(INCOME_KEY, String(income));
    $('income-input').value = income > 0 ? fmt(income) : '';
  }
  if (Array.isArray(parsed.bonus)) {
    bonus = parsed.bonus;
    store.set(BONUS_KEY, JSON.stringify(bonus));
  }
  if (Array.isArray(parsed.urlaube)) {
    urlaube = parsed.urlaube;
    store.set(URLAUB_KEY, JSON.stringify(urlaube));
  }
  if (parsed.incomeMeta && typeof parsed.incomeMeta === 'object') {
    incomeMeta = parsed.incomeMeta;
    store.set(INCOME_META_KEY, JSON.stringify(incomeMeta));
  }
  if (typeof parsed.urlaubBudget === 'number') {
    urlaubBudget = parsed.urlaubBudget;
    store.set(URLAUB_BUDGET_KEY, String(urlaubBudget));
  }
  if (Array.isArray(parsed.urlaubRateHist)) {
    urlaubRateHist = parsed.urlaubRateHist;
    store.set(URLAUB_RATE_HIST_KEY, JSON.stringify(urlaubRateHist));
  }
  if (Array.isArray(parsed.urlaubDeposits)) {
    urlaubDeposits = parsed.urlaubDeposits;
    store.set(URLAUB_DEPOSITS_KEY, JSON.stringify(urlaubDeposits));
  }
  if (Array.isArray(parsed.urlaubManualDays)) {
    manuelleUrlaubstage = parsed.urlaubManualDays;
    store.set(URLAUB_MANUAL_DAYS_KEY, JSON.stringify(manuelleUrlaubstage));
  }
  if (parsed.urlaubKontoOverride && typeof parsed.urlaubKontoOverride === 'object' && !Array.isArray(parsed.urlaubKontoOverride)) {
    urlaubKontoOverrides = parsed.urlaubKontoOverride;
    store.set(URLAUB_KONTO_OVERRIDE_KEY, JSON.stringify(urlaubKontoOverrides));
  }
  if (parsed.avViewMode === 'nominal' || parsed.avViewMode === 'real') {
    avViewMode = parsed.avViewMode;
    store.set('av_view_mode_v1', avViewMode);
  }
  if (Array.isArray(parsed.history)) {
    history = parsed.history;
    store.set(HISTORY_KEY, JSON.stringify(history));
  }
  renderAll();
  notify('Backup erfolgreich wiederhergestellt.', 'Fertig');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') finCloseModal();
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') saveEntry();
});

function populateFilters() {
  ['v','b','a'].forEach(sec => {
    const el = $('filter-' + sec);
    if (!el) return;
    const current = el.value;
    el.innerHTML = '<option value="">Alle Konten</option>' +
      ACCOUNTS.map(a => `<option>${a}</option>`).join('');
    if (current) el.value = current;
  });
}

/* Aufbau des Bereichs – wird vom Kern über init() angestossen,
   damit alle Bereiche gleich starten. */
function finInit(){
  if (!store.persistent && $('notice')) $('notice').style.display = 'block';
  if (income > 0) $('income-input').value = income.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2});
  populateFilters();
  applyAutoGrow();
  renderAll();
  applyCollapsedStates();
  renderHistRangeCtls();
  ['deposit-amount','urlaub-cost'].forEach(id => bindMoneyInput($(id)));
}

// Service Worker registrieren (Offline-Fähigkeit); scheitert leise wenn nicht unterstützt (z.B. file://)




/* Kachel-Grafik: Verlauf des Gesamtvermoegens.
   Statt einer nackten Linie: die Flaeche zwischen Kurve und Startwert wird eingefaerbt
   (ueber dem Startwert gruen, darunter rot), dazu ein hervorgehobener Endpunkt.
   Ohne Beschriftung/Legende – die Kachel soll nur den Trend auf einen Blick zeigen. */
function finTileArt() {
  const pts = (history || []).map(h => h.wealth).filter(v => typeof v === 'number' && isFinite(v));
  if (pts.length < 2) return '';
  const W = 120, H = 66, padT = 9, padB = 2;
  const min = Math.min(...pts), max = Math.max(...pts);
  const span = (max - min) || Math.abs(max) * 0.01 || 1;
  const lo = min - span * 0.22, hi = max + span * 0.18;
  const range = hi - lo;
  const xAt = i => (i / (pts.length - 1)) * W;
  const yAt = v => padT + (1 - (v - lo) / range) * (H - padT - padB);

  const first = pts[0], last = pts[pts.length - 1];
  const farbe = last >= first ? 'var(--green)' : 'var(--danger)';
  const linie = pts.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  // Flaeche laeuft von der Kurve bis zum unteren Rand aus – einfarbig nach Gesamttrend.
  const flaeche = `0,${H} ${linie} ${W},${H}`;
  const ex = xAt(pts.length - 1), ey = yAt(last);
  const uid = 'fintile';

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="${uid}-f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${farbe}" stop-opacity="0.40"/>
        <stop offset="100%" stop-color="${farbe}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${flaeche}" fill="url(#${uid}-f)"/>
    <polyline points="${linie}" fill="none" stroke="${farbe}" stroke-width="2"
              stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="6" fill="${farbe}" opacity="0.26"/>
    <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.8" fill="${farbe}"/>
    <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="1.2" fill="#fff" opacity="0.9"/>
  </svg>`;
}

registerModule({
  id: 'finanzen', name: 'Finanzen', tagline: 'Versicherungen, Budgets & Vorsorge', order: 1,
  keys: FIN_KEYS,
  buildPayload: () => finBuildBackupPayload(),
  applyBackup: (t) => finApplyBackup(t),
  detect: p => !!(p && p.sections),
  init: () => { try { finInit(); } catch(e){} },
  onOpen: () => { try { renderAll(); } catch(e){} },
  summary: () => {
    try {
      const art = finTileArt();
      // Gesamtvermoegen nach derselben Formel wie im Hero der Finanzen-Startseite.
      const konten  = (data.b||[]).reduce((s,e) => s + (isGiro(e) ? 0 : (e.balance || 0)), 0);
      const vorsorge = (data.a||[]).reduce((s,e) => s + (e.cat === 'Privat' ? (e.current || 0) : 0), 0);
      const vermoegen = konten + vorsorge;
      if (vermoegen > 0) {
        // Ohne Nachkommastellen und ohne Waehrungszeichen – das Euro-Zeichen steht
        // als kleine Einheit daneben, wie "Tage" oder "Hinweise" auf den anderen Kacheln.
        const zahl = Math.round(vermoegen).toLocaleString('de-DE', { maximumFractionDigits: 0 });
        return { sub: 'Verträge & Budgets', art, value: zahl, unit: '€', note: 'Gesamtvermögen' };
      }
      const n = (data.v||[]).length + (data.b||[]).length + (data.a||[]).length;
      return { sub: 'Verträge & Budgets', art, value: n, unit: n === 1 ? 'Eintrag' : 'Einträge', note: 'erfasst' };
    } catch(e) { return { sub: 'Versicherungen, Budgets & Vorsorge' }; }
  }
});
