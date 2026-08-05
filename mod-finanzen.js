/* ================= BEREICH: FINANZEN =================
   Eigenständiges Modul. Nutzt den gemeinsamen Unterbau aus index.html.
   Die Optik liegt vollstaendig im Kern (index.html), wie bei Reisen und Impfpass –
   dieses Modul bringt keine eigene Gestaltung mit. Die dortigen Regeln sind mit
   #mod-finanzen auf diesen Bereich begrenzt, damit sie andere Module nicht beeinflussen. */

document.getElementById('mod-finanzen').insertAdjacentHTML('beforeend', "<div class=\"wrap\">\n  \n\n  <div class=\"app-header\"><button class=\"screen-back\" aria-label=\"Zurück\" onclick=\"closeModule()\">‹</button><span>Jörg's Finanzen</span></div>\n\n  <div class=\"income-bar glass\">\n    <div class=\"income-top\">\n      <div class=\"income-left\">\n        <span class=\"income-label\">Netto / Monat</span>\n        <div class=\"income-input-wrap\">\n          <input type=\"text\" id=\"income-input\" placeholder=\"z.B. 0,00\" oninput=\"onIncomeInput()\">\n          <span class=\"income-eur\">€</span>\n        </div>\n      </div>\n      <div class=\"income-right\">\n        <span class=\"income-label\">Verfügbar</span>\n        <span class=\"income-avail\" id=\"income-avail\">0,00 €</span>\n      </div>\n    </div>\n    <div class=\"income-meta\" id=\"income-meta\" onclick=\"openIncomeMeta()\"></div>\n  </div>\n\n  <!-- Einkommens-Details (nur Info, keine Logik) -->\n  <div class=\"overlay\" id=\"income-meta-overlay\" onclick=\"if(event.target===this)closeIncomeMeta()\">\n    <div class=\"modal\">\n      <div class=\"grabber\"></div>\n      <h2>Einkommen</h2>\n      <div style=\"display:flex;flex-direction:column;gap:14px\">\n        <div class=\"field\">\n          <label>Arbeitgeber</label>\n          <input type=\"text\" id=\"im-employer\" placeholder=\"z.B. Siemens\" autocomplete=\"off\">\n        </div>\n        <div class=\"field field-row\">\n          <div>\n            <label>Zieleinkommen</label>\n            <input type=\"text\" id=\"im-target\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n          <div>\n            <label>Brutto / Monat</label>\n            <input type=\"text\" id=\"im-gross-m\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n        </div>\n        <div class=\"field field-row\">\n          <div>\n            <label>Brutto / Jahr</label>\n            <input type=\"text\" id=\"im-gross-y\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n          <div>\n            <label>Bonus</label>\n            <input type=\"text\" id=\"im-bonus\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n        </div>\n        <div class=\"field field-row\">\n          <div>\n            <label>Altersvorsorge</label>\n            <input type=\"text\" id=\"im-pension\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n          <div>\n            <label>Aktien</label>\n            <input type=\"text\" id=\"im-stocks\" placeholder=\"z.B. 0,00\" inputmode=\"decimal\" autocomplete=\"transaction-amount\">\n          </div>\n        </div>\n      </div>\n      <div class=\"modal-actions\">\n        <button class=\"btn btn-secondary\" onclick=\"closeIncomeMeta()\">Abbrechen</button>\n        <button class=\"btn btn-primary\" onclick=\"saveIncomeMeta()\">Speichern</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- Hero: Gesamtvermögen -->\n  <div class=\"hero\" id=\"hero\" onclick=\"openDetail('uebersicht')\">\n    <div class=\"hero-label\">Gesamtvermögen</div>\n    <div class=\"hero-val\" id=\"hero-val\">–</div>\n    <div class=\"hero-delta\" id=\"hero-delta\" style=\"display:none\"></div>\n    <div id=\"hero-spark\"></div>\n    <span class=\"hero-sub\" id=\"hero-sub\"></span>\n  </div>\n\n  <!-- Bento: Kennzahlen auf einen Blick -->\n  <div class=\"tag\" id=\"bento-tag\" style=\"display:none\">Auf einen Blick</div>\n  <div class=\"bento\" id=\"bento\" style=\"display:none\"></div>\n\n  <!-- Detail-Ansichten: werden über die Bento-Kacheln geöffnet (alle Render-Ziele unverändert) -->\n  <div class=\"detail-sheet\" id=\"detail-sheet\">\n    <div class=\"settings-topbar\">\n      <button class=\"settings-back\" aria-label=\"Zurück\" onclick=\"closeDetail()\">‹</button>\n      <h2 id=\"detail-title\">Details</h2>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-uebersicht\">\n      <div class=\"dashboard glass\" id=\"dashboard\">\n        <div class=\"uy-konto-head\">\n          <span>Gesamtvermögen</span>\n          <b id=\"wealth-val\">–</b>\n          <span class=\"wealth-sub-row\"><span class=\"saverate-eur\" id=\"wealth-sub\"></span><button class=\"info-i\" aria-label=\"Info\" onclick=\"showWealthInfo()\">i</button></span>\n        </div>\n        <div class=\"dash-accounts first\">\n          <div class=\"dash-sub-label\">Ausgaben nach Kategorie</div>\n          <div class=\"dash-grid\">\n            <div class=\"dash-donut\">\n              <svg viewBox=\"0 0 120 120\" id=\"donut-svg\" width=\"100\" height=\"100\"></svg>\n              <div class=\"donut-center\">\n                <span class=\"donut-center-label\">Netto</span>\n                <span class=\"donut-center-val\" id=\"donut-center-val\">–</span>\n              </div>\n            </div>\n            <div class=\"dash-legend\" id=\"dash-legend\"></div>\n          </div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-wealth-hist\" style=\"display:none\">\n          <div class=\"hist-head\"><span class=\"dash-sub-label\">Gesamtvermögensverlauf</span><span class=\"hist-range-ctl\" data-target=\"wealth\"></span></div>\n          <div id=\"wealth-hist-chart\"></div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-balances\">\n          <div class=\"dash-sub-label\">Kontostände</div>\n          <div id=\"balance-bars\"></div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-saverates\" style=\"display:none\">\n          <div class=\"dash-sub-label\">Sparquoten</div>\n          <div id=\"saverate-bars\"></div>\n        </div>\n        <div class=\"dash-accounts\" id=\"dash-accounts\">\n          <div class=\"dash-sub-label\">Ausgaben nach Konto</div>\n          <div id=\"account-bars\"></div>\n        </div>\n      </div>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-a\">\n      <div class=\"av-dash glass\" id=\"av-dash\">\n        <div id=\"av-kontostand\"></div>\n        <div id=\"av-table\"></div>\n      </div>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-urlaub\">\n      <div class=\"av-dash glass\" id=\"urlaub-dash\">\n        <div id=\"urlaub-dash-body\"></div>\n      </div>\n    </div>\n    <div class=\"detail-panel\" id=\"panel-v\">\n      <div class=\"av-dash glass\" id=\"vertrag-dash\">\n        <div id=\"vertrag-dash-body\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"income-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('b')\">\n    <div class=\"sub-header-text\">\n      <h1>Konsum, Urlaub &amp; Sparen</h1>\n      <p>Sparpläne und monatliche Budgets im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-b\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-b\">\n  <div class=\"filter-row\">\n    <select class=\"account-filter\" id=\"filter-b\" onchange=\"renderSection('b')\"></select>\n  </div>\n  <div class=\"summary glass\">\n    <div class=\"stat\"><div class=\"stat-label\">Monatlich</div><div class=\"stat-value month\" id=\"sum-month-b\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Jährlich</div><div class=\"stat-value year\" id=\"sum-year-b\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Einträge</div><div class=\"stat-value count\" id=\"sum-count-b\">0</div></div>\n  </div>\n  <div class=\"balance-box glass\" id=\"balance-box-b\" style=\"display:none\"></div>\n\n  <div class=\"section-label\">Konsum, Urlaub &amp; Sparen</div>\n  <div class=\"list\" id=\"list-b\"></div>\n  <div class=\"empty\" id=\"empty-b\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"finOpenModal('b')\">＋ Eintrag hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('a')\">\n    <div class=\"sub-header-text\">\n      <h1>Altersvorsorge</h1>\n      <p>Vorsorge und Rente im Blick · Renteneintrittsalter 67</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-a\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-a\">\n  <div class=\"filter-row\">\n    <select class=\"account-filter\" id=\"filter-a\" onchange=\"renderSection('a')\"></select>\n  </div>\n  <div class=\"summary glass\">\n    <div class=\"stat\"><div class=\"stat-label\">Monatlich</div><div class=\"stat-value month\" id=\"sum-month-a\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Jährlich</div><div class=\"stat-value year\" id=\"sum-year-a\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Einträge</div><div class=\"stat-value count\" id=\"sum-count-a\">0</div></div>\n  </div>\n\n  <div class=\"section-label\">Altersvorsorge</div>\n  <div class=\"list\" id=\"list-a\"></div>\n  <div class=\"empty\" id=\"empty-a\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"finOpenModal('a')\">＋ Eintrag hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('v')\">\n    <div class=\"sub-header-text\">\n      <h1>Versicherungen &amp; Verträge</h1>\n      <p>Alle laufenden Ausgaben im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-v\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-v\">\n  <div class=\"filter-row\">\n    <select class=\"account-filter\" id=\"filter-v\" onchange=\"renderSection('v')\"></select>\n  </div>\n  <div class=\"summary glass\">\n    <div class=\"stat\"><div class=\"stat-label\">Monatlich</div><div class=\"stat-value month\" id=\"sum-month\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Jährlich</div><div class=\"stat-value year\" id=\"sum-year\">0,00 €</div></div>\n    <div class=\"stat\"><div class=\"stat-label\">Einträge</div><div class=\"stat-value count\" id=\"sum-count\">0</div></div>\n  </div>\n\n  <div class=\"section-label\">Versicherungen &amp; Verträge</div>\n  <div class=\"list\" id=\"list-v\"></div>\n  <div class=\"empty\" id=\"empty-v\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"finOpenModal('v')\">＋ Eintrag hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('urlaub')\">\n    <div class=\"sub-header-text\">\n      <h1>Urlaube</h1>\n      <p>Geplante Reisen &amp; Jahresbudget im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-urlaub\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-urlaub\">\n  <div class=\"section-label\">Urlaube</div>\n  <div class=\"urlaub-combined glass\">\n    <div class=\"ud-head\">\n      <span class=\"ub-label\">Kontingent</span>\n    </div>\n    <div id=\"urlaub-kontingent-rows\"></div>\n    <div class=\"uc-divider\"></div>\n    <div class=\"uc-budget-row\">\n      <span class=\"ub-label\">Jahresbudget (pro Jahr)</span>\n      <span class=\"ub-auto-val\" id=\"urlaub-budget-auto\">0,00 €</span>\n    </div>\n    <div class=\"uc-divider\"></div>\n    <div class=\"ud-head\">\n      <span class=\"ub-label\">Einmaleinzahlungen</span>\n      <button class=\"ud-add\" onclick=\"openDepositModal()\">＋ Einzahlung</button>\n    </div>\n    <div id=\"deposit-list\"></div>\n    <div class=\"uc-divider\"></div>\n    <div class=\"ud-head\">\n      <span class=\"ub-label\">Urlaubstage</span>\n      <button class=\"ud-add\" onclick=\"openManualDayModal()\">＋ Urlaubstag</button>\n    </div>\n    <div id=\"manual-day-list\"></div>\n  </div>\n  <div id=\"urlaub-years\"></div>\n  <div class=\"empty\" id=\"empty-urlaub\" style=\"display:none\">Noch keine Urlaube geplant. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"openUrlaubModal()\">＋ Urlaub hinzufügen</button>\n  </div>\n\n  <div class=\"group-divider\"></div>\n\n  <header class=\"sub-header\" onclick=\"toggleSection('bonus')\">\n    <div class=\"sub-header-text\">\n      <h1>Bonusprogramme</h1>\n      <p>Punkte, Meilen &amp; Verfall im Blick</p>\n    </div>\n    <span class=\"section-chevron\" id=\"chev-bonus\">⌄</span>\n  </header>\n\n  <div class=\"section-body\" id=\"body-bonus\">\n  <div class=\"section-label\">Bonusprogramme</div>\n  <div class=\"list\" id=\"list-bonus\"></div>\n  <div class=\"empty\" id=\"empty-bonus\" style=\"display:none\">Noch keine Einträge. Tippe unten, um zu beginnen.</div>\n\n  <button class=\"add-btn\" onclick=\"openBonusModal()\">＋ Eintrag hinzufügen</button>\n  </div>\n\n\n\n</div>\n\n<!-- Vollbild-Einstellungen (Zahnrad) -->\n\n\n<!-- Custom dialog (works where native confirm/alert are blocked) -->\n\n\n<div class=\"overlay\" id=\"overlay\" onclick=\"closeIfBg(event)\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"modal-title\">Neuer Eintrag</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Name</label>\n      <input type=\"text\" id=\"f-name\" placeholder=\"z.B. Netflix\" autocomplete=\"off\">\n    </div>\n    <div class=\"field field-row\" id=\"f-prov-acct-row\">\n      <div id=\"f-provider-wrap\">\n        <label id=\"f-provider-label\">Anbieter (optional)</label>\n        <input type=\"text\" id=\"f-provider\" placeholder=\"z.B. Allianz\" autocomplete=\"off\">\n      </div>\n      <div id=\"f-extra-wrap\">\n        <label id=\"f-extra-label\">Vertragsnummer (optional)</label>\n        <input type=\"text\" id=\"f-extra-input\" placeholder=\"—\" autocomplete=\"off\">\n        <select id=\"f-extra-select\" style=\"display:none\"></select>\n      </div>\n    </div>\n    <div class=\"field field-row\">\n      <div>\n        <label>Betrag</label>\n        <input type=\"text\" id=\"f-amount\" placeholder=\"z.B. 1.000,00 €\">\n      </div>\n      <div id=\"f-period-wrap\">\n        <label>Intervall</label>\n        <select id=\"f-period\">\n          <option value=\"monatlich\">Monatlich</option>\n          <option value=\"jährlich\">Jährlich</option>\n          <option value=\"vierteljährlich\">Vierteljährlich</option>\n          <option value=\"wöchentlich\">Wöchentlich</option>\n        </select>\n      </div>\n      <div id=\"f-amount-value-wrap\" style=\"display:none\">\n        <label id=\"f-amount-value-label\"></label>\n        <input type=\"text\" id=\"f-amount-value-input\" placeholder=\"\" autocomplete=\"transaction-amount\">\n      </div>\n    </div>\n    <div class=\"field field-row\" id=\"f-cat-extra-row\">\n      <div>\n        <label>Konto</label>\n        <select id=\"f-account\">\n          <option value=\"\">— kein Konto —</option>\n          <option>DB Giro</option>\n          <option>DB Spar</option>\n          <option>DB ROBIN</option>\n          <option>DKB Giro</option>\n          <option>Scalable Broker</option>\n          <option>Scalable Wealth (Weltreise)</option>\n          <option>Scalable Tagesgeld</option>\n          <option>EquatePlus</option>\n        </select>\n      </div>\n      <div>\n        <label>Kategorie</label>\n        <select id=\"f-cat\"></select>\n      </div>\n    </div>\n    <div id=\"f-values\" class=\"f-dyn-group\"></div>\n    <div class=\"field field-row\" id=\"f-units-projtype-row\" style=\"display:none\">\n      <div id=\"f-units-wrap\" style=\"display:none\">\n        <label id=\"f-units-label\">Einheiten (optional)</label>\n        <input type=\"text\" id=\"f-units-input\" placeholder=\"z.B. 12 Stück\" autocomplete=\"off\">\n      </div>\n      <div id=\"f-projtype\" style=\"display:none\">\n        <label>Art der Beträge</label>\n        <select id=\"f-projtype-select\">\n          <option value=\"einmal\">Einmalbetrag</option>\n          <option value=\"monatlich\">Monatlich</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"field f-toggle\" id=\"f-autogrow-wrap\" style=\"display:none\">\n      <input type=\"checkbox\" id=\"f-autogrow\" class=\"f-toggle-cb\">\n      <label class=\"f-toggle-lab\" for=\"f-autogrow\">Stand monatlich automatisch erhöhen</label>\n    </div>\n    <div id=\"f-growth\" class=\"f-dyn-group\"></div>\n    <div id=\"f-texts\" class=\"f-dyn-group\"></div>\n    </div><!-- end gap wrapper -->\n    <button type=\"button\" class=\"add-btn\" id=\"btn-duplicate\" style=\"display:none\" onclick=\"duplicateEntry()\">⧉ Eintrag duplizieren</button>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" id=\"cancel-btn\" onclick=\"finCloseModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" id=\"save-btn\" onclick=\"saveEntry()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"bonus-overlay\" onclick=\"if(event.target===this)closeBonusModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"bonus-title\">Neues Bonusprogramm</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Bonusprogramm</label>\n      <input type=\"text\" id=\"bonus-name\" placeholder=\"z.B. Miles & More\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Punkte / Meilen</label>\n      <input type=\"text\" id=\"bonus-points\" placeholder=\"z.B. 25.000 Meilen\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Verfall</label>\n      <input type=\"text\" id=\"bonus-expiry\" placeholder=\"z.B. 31.12.2026\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"autoDate(this)\" onblur=\"fixDate(this)\">\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeBonusModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveBonus()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"urlaub-overlay\" onclick=\"if(event.target===this)closeUrlaubModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"urlaub-title\">Neuer Urlaub</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Reiseziel / Name</label>\n      <input type=\"text\" id=\"urlaub-name\" placeholder=\"z.B. Namibia\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Land (für die Karte)</label>\n      <input type=\"text\" id=\"urlaub-country\" placeholder=\"z.B. Namibia\" autocomplete=\"off\" list=\"country-list\">\n      <datalist id=\"country-list\"></datalist>\n    </div>\n    <div class=\"field field-row\">\n      <div>\n        <label>Von</label>\n        <input type=\"text\" id=\"urlaub-from\" placeholder=\"TT.MM.JJJJ\" autocomplete=\"off\" inputmode=\"decimal\" oninput=\"autoDate(this)\" onblur=\"fixDate(this);checkUrlaubYearSpan()\">\n      </div>\n      <div>\n        <label>Bis</label>\n        <input type=\"text\" id=\"urlaub-to\" placeholder=\"TT.MM.JJJJ\" autocomplete=\"off\" inputmode=\"decimal\" oninput=\"autoDate(this)\" onblur=\"fixDate(this);checkUrlaubYearSpan()\">\n      </div>\n    </div>\n    <div class=\"field field-row\" id=\"urlaub-split-row\" style=\"display:none\">\n      <div>\n        <label id=\"urlaub-split-label-1\">Urlaubstage Jahr 1</label>\n        <input type=\"text\" id=\"urlaub-days-y1\" placeholder=\"z.B. 3\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"updateUrlaubDaysTotal()\">\n      </div>\n      <div>\n        <label id=\"urlaub-split-label-2\">Urlaubstage Jahr 2</label>\n        <input type=\"text\" id=\"urlaub-days-y2\" placeholder=\"z.B. 7\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"updateUrlaubDaysTotal()\">\n      </div>\n    </div>\n    <div class=\"field field-row\">\n      <div id=\"urlaub-days-wrap\">\n        <label>Verbrauchte Urlaubstage</label>\n        <input type=\"text\" id=\"urlaub-days\" placeholder=\"z.B. 10\" inputmode=\"decimal\" autocomplete=\"off\">\n      </div>\n      <div id=\"urlaub-budget-year-field\" style=\"display:none\">\n        <label>Budget-Jahr</label>\n        <select id=\"urlaub-budget-year\"></select>\n      </div>\n      <div>\n        <label>Gesamtkosten</label>\n        <input type=\"text\" id=\"urlaub-cost\" placeholder=\"z.B. 1.000,00 €\" autocomplete=\"transaction-amount\" oninput=\"updatePayHint()\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Anzahlungen (optional)</label>\n      <div id=\"urlaub-payments\"></div>\n      <button type=\"button\" class=\"btn-add-pay\" onclick=\"addPaymentRow()\">+ Anzahlung hinzufügen</button>\n      <div class=\"pay-hint\" id=\"urlaub-pay-hint\"></div>\n    </div>\n    <div class=\"field field-row\" id=\"urlaub-due-row\" style=\"display:none\">\n      <div>\n        <label>Restzahlung Monat</label>\n        <input type=\"text\" id=\"urlaub-due-m\" placeholder=\"z.B. MM\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"updatePayHint()\">\n      </div>\n      <div>\n        <label>Restzahlung Jahr</label>\n        <input type=\"text\" id=\"urlaub-due-y\" placeholder=\"z.B. JJJJ\" inputmode=\"decimal\" autocomplete=\"off\" oninput=\"updatePayHint()\">\n      </div>\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeUrlaubModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveUrlaub()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"deposit-overlay\" onclick=\"if(event.target===this)closeDepositModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"deposit-title\">Neue Einzahlung</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field field-row\">\n      <div>\n        <label>Jahr</label>\n        <input type=\"text\" id=\"deposit-year\" placeholder=\"z.B. 2026\" autocomplete=\"off\" inputmode=\"numeric\">\n      </div>\n      <div>\n        <label>Monat</label>\n        <input type=\"text\" id=\"deposit-month\" placeholder=\"z.B. 01\" autocomplete=\"off\" inputmode=\"numeric\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Betrag</label>\n      <input type=\"text\" id=\"deposit-amount\" placeholder=\"z.B. 1.000,00 €\" autocomplete=\"transaction-amount\">\n    </div>\n    <div class=\"field\">\n      <label>Notiz (optional)</label>\n      <input type=\"text\" id=\"deposit-note\" placeholder=\"z.B. Bonus, Defizitausgleich\" autocomplete=\"off\">\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeDepositModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveDeposit()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n<div class=\"overlay\" id=\"manual-day-overlay\" onclick=\"if(event.target===this)closeManualDayModal()\">\n  <div class=\"modal\">\n    <div class=\"grabber\"></div>\n    <h2 id=\"manual-day-title\">Neuer Urlaubstag</h2>\n    <div style=\"display:flex;flex-direction:column;gap:14px\">\n    <div class=\"field\">\n      <label>Datum</label>\n      <input type=\"text\" id=\"manual-day-date\" placeholder=\"TT.MM.JJJJ\" autocomplete=\"off\" inputmode=\"decimal\" oninput=\"autoDate(this)\" onblur=\"fixDate(this)\">\n    </div>\n    <div class=\"field\">\n      <label>Tage</label>\n      <input type=\"text\" id=\"manual-day-count\" placeholder=\"z.B. 1\" inputmode=\"decimal\" autocomplete=\"off\">\n    </div>\n    <div class=\"field\">\n      <label>Notiz (optional)</label>\n      <input type=\"text\" id=\"manual-day-note\" placeholder=\"z.B. Brückentag\" autocomplete=\"off\">\n    </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn btn-secondary\" onclick=\"closeManualDayModal()\">Abbrechen</button>\n      <button class=\"btn btn-primary\" onclick=\"saveManualDay()\">Speichern</button>\n    </div>\n  </div>\n</div>\n\n");



/* Umstellung der Speicher-Schlüssel auf das Präfix 'fin_'.

   Vorgeschichte: Eine frühere Fassung kopierte die Schlüssel bereits nach 'fin_',
   die Lesezugriffe wurden aber nie umgestellt. Dadurch enthielten die Kopien einen
   veralteten Stand, während die Arbeit weiter auf den Schlüsseln ohne Präfix lief.
   Ein bloßes Umschalten der Zugriffe hätte auf diesen alten Stand zurückgeworfen.

   Deshalb wird hier einmalig der AKTUELLE Inhalt übertragen, gesteuert über eine
   eigene Marke. Die Schlüssel ohne Präfix bleiben unangetastet als Sicherheitskopie
   liegen - es wird nichts gelöscht und nichts überschrieben, was noch gebraucht wird. */
(function migrateKeyPrefix(){
  if (!store.persistent) return;
  const ls = window.localStorage;
  const MARKE = 'fin_prefix_umgestellt_v2';
  if (ls.getItem(MARKE)) return;                       // bereits erledigt
  const keys = ['abos_v1','budgets_v1','altersvorsorge_v1','income_v1','bonus_v1','urlaube_v1',
                'urlaub_budget_v1','urlaub_deposits_v1','urlaub_manual_days_v1',
                'urlaub_konto_override_v1','urlaub_rate_hist_v1','history_v1','income_meta_v1',
                'av_view_mode_v1','hist_range_v1','collapsed_sections_v1'];
  for (const k of keys){
    try {
      const wert = ls.getItem(k);
      if (wert !== null) ls.setItem('fin_' + k, wert);  // aktuellen Stand übernehmen
    } catch(e){}
  }
  try { ls.setItem(MARKE, new Date().toISOString()); } catch(e){}
})();

// Per-section configuration
const SECTIONS = {
  v: {
    storageKey: 'fin_abos_v1',
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
    storageKey: 'fin_budgets_v1',
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
    storageKey: 'fin_altersvorsorge_v1',
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
const INCOME_KEY = 'fin_income_v1';
const BONUS_KEY = 'fin_bonus_v1';
const URLAUB_KEY = 'fin_urlaube_v1';
const URLAUB_BUDGET_KEY = 'fin_urlaub_budget_v1';
const URLAUB_DEPOSITS_KEY = 'fin_urlaub_deposits_v1';
const URLAUB_MANUAL_DAYS_KEY = 'fin_urlaub_manual_days_v1';
const URLAUB_KONTO_OVERRIDE_KEY = 'fin_urlaub_konto_override_v1';
const URLAUB_ANSPRUCH_KEY = 'fin_urlaub_anspruch_v1';

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
/* Urlaubsanspruch pro Jahr, manuell gesetzt (z.B. 2 Tage aus dem Vorjahr mitgenommen).
   Kein Jahr angelegt -> Standardanspruch (URLAUB_ANSPRUCH). Absichtlich keine automatische
   Uebertragsrechnung und kein Verfallsdatum - Joerg traegt den Starttag des Jahres selbst ein. */
let urlaubAnspruchOverride = safeParse(store.get(URLAUB_ANSPRUCH_KEY), {});
if (!urlaubAnspruchOverride || typeof urlaubAnspruchOverride !== 'object' || Array.isArray(urlaubAnspruchOverride)) urlaubAnspruchOverride = {};
function urlaubAnspruchJahr(j) {
  const v = urlaubAnspruchOverride[j];
  return (typeof v === 'number' && !isNaN(v) && v >= 0) ? v : URLAUB_ANSPRUCH;
}
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
let avViewMode = store.get('fin_av_view_mode_v1') || 'nominal';  // 'nominal' | 'real'

// --- Monthly history snapshots (auto, on app open) ---
const HISTORY_KEY = 'fin_history_v1';
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
let histRange = store.get('fin_hist_range_v1') || 'all';
function histLabel(h) {
  const d = histDate(h);
  return d.slice(8,10) + '.' + d.slice(5,7) + '.';
}
function histSlice(arr) {
  if (histRange === 'all') return arr;
  const cut = new Date();
  cut.setMonth(cut.getMonth() - (histRange === '6m' ? 6 : 12));
  const cs = isoVon(cut);   // lokal rechnen, nicht in UTC (Helfer aus dem Kern)
  return arr.filter(h => histDate(h) >= cs);
}
function setHistRange(r) {
  histRange = r;
  store.set('fin_hist_range_v1', r);
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
            ${yearly}`
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
const INCOME_META_KEY = 'fin_income_meta_v1';
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
  showToast('Gespeichert');
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
    const cs = isoVon(cutoff);   // lokal rechnen, nicht in UTC (Helfer aus dem Kern)
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
    const cats = {};      // nur positive Anteile - der Segmentbalken kann keine negativen zeigen
    const negCats = {};   // negative Betraege, werden in der Legende ausgewiesen
    let total = 0;        // echte Summe inkl. negativer Betraege
    let posTotal = 0;
    data.b.forEach(e => {
      if (isGiro(e)) return;
      if ((e.account || '') !== acct) return;
      const b = Number(e.balance) || 0;
      if (b === 0) return;
      total += b;
      if (b > 0) { cats[e.cat] = (cats[e.cat] || 0) + b; posTotal += b; }
      else { negCats[e.cat] = (negCats[e.cat] || 0) + b; }
    });
    if (posTotal > 0 || Object.keys(negCats).length) {
      const CAT_COL = { Urlaub: 'var(--violet)', Sparen: 'var(--green)', Konsum: 'var(--accent)' };
      const order = Object.entries(cats).sort((a,b) => b[1] - a[1]);
      const bar = posTotal > 0
        ? order.map(([cat,v]) => `<span class="bento-seg" style="flex:${(v/posTotal).toFixed(4)};background:${CAT_COL[cat]||'var(--muted)'}"></span>`).join('')
        : `<span class="bento-seg" style="flex:1;background:var(--stroke)"></span>`;
      const zeile = (cat, v, farbe) => `<div class="bento-break-row"><span class="bl"><span class="bento-leg-dot" style="background:${farbe}"></span>${esc(cat)}</span><span class="bv">${fmt(v)}</span></div>`;
      const legend = order.map(([cat,v]) => zeile(cat, v, CAT_COL[cat] || 'var(--muted)')).join('')
        + Object.entries(negCats).sort((a,b) => a[1] - b[1]).map(([cat,v]) => zeile(cat, v, 'var(--danger)')).join('');
      tiles.push(`<div class="bento-tile" onclick="openDetail('uebersicht')">
        <div class="bento-head"><span class="bento-title">${esc(acct)}</span></div>
        <div class="bento-primary ${total < 0 ? 'neg' : ''}">${fmt(total)}</div>
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
      // Weltkarte: dieselbe Basis wie in Reisen (jedes Land einzeln, korrekter
      // Kartenausschnitt 0 11.8 1000 406.5 statt eines nur groben Kontinent-Umrisses) -
      // hier aber weiterhin nach Jahr eingefaerbt statt nach "besucht/nicht besucht".
      const yearNow = jahr, yearNext = jahr + 1;
      const mapTrips = urlaube.map(u => ({ u, y: parseInt(finTripYear(u),10) }))
        .filter(t => (t.y === yearNow || t.y === yearNext) && t.u.country && (COUNTRY_PATHS[t.u.country] || ORT_PUNKTE[t.u.country]));
      let map = '';
      if (mapTrips.length) {
        // Kommt ein Land in beiden Jahren vor, gewinnt das zuletzt gesetzte (yearNext) -
        // seltener Sonderfall, kein eigener Regelbedarf dafuer.
        const farbe = {};
        const punkte = [];
        mapTrips.forEach(t => {
          const col = t.y === yearNow ? 'var(--violet)' : 'var(--petrol)';
          if (COUNTRY_PATHS[t.u.country]) farbe[t.u.country] = col;
          else punkte.push({ col, xy: ORT_PUNKTE[t.u.country] });
        });
        const rest = COUNTRY_LIST.filter(c => !farbe[c]).map(c => COUNTRY_PATHS[c]).join('');
        const laender = Object.entries(farbe).map(([land, col]) => `<path d="${COUNTRY_PATHS[land]}" fill="${col}"/>`).join('');
        const dots = punkte.map(p => `<circle cx="${p.xy[0]}" cy="${p.xy[1]}" r="13" fill="${p.col}"/><circle cx="${p.xy[0]}" cy="${p.xy[1]}" r="24" fill="${p.col}" opacity="0.25"/>`).join('');
        map = `<div class="bento-map-wrap"><svg class="bento-map" viewBox="0 11.8 1000 406.5" preserveAspectRatio="xMidYMid meet">
          <path d="${rest}" fill="rgba(255,255,255,0.12)"/>${laender}${dots}
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
    const zeile = a => {
      const pct = Math.max(0, Math.min(100, (a.rest / (a.anspruch || 1)) * 100));
      // Nicht mehr antippbar - stand mit dem Tap auf die ganze Kachel (oeffnet die
      // Urlaube-Ansicht) in Konflikt und liess sich auf dem Geraet nicht zuverlaessig
      // davon trennen. Bearbeitbar ist der Anspruch jetzt in der Detailansicht selbst.
      return `<div class="ru-mini">
        <div class="ru-mini-top"><span>${a.jahr}</span><span style="color:${ruTextFarbe(a.rest)}">${ruZahl(a.rest)} / ${ruZahl(a.anspruch)}</span></div>
        <div class="bento-progress"><span class="bento-progress-fill" style="width:${pct}%;background:${ruFarbe(a.rest)}"></span></div>
      </div>`;
    };
    tiles.push(`<div class="bento-tile" onclick="openDetail('urlaub')">
      <div class="bento-head"><span class="bento-title">Resturlaub ${j0}</span></div>
      <div class="bento-primary" style="color:${ruTextFarbe(a0.rest)}">${ruZahl(a0.rest)}<span class="bento-unit">Tage</span></div>
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
      const upcoming = radar.slice(0,4);
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
        <div class="bento-foot bento-foot-col">
          <div class="bento-caption">noch ${yearsLeft} Jahre bis 67</div>
          <div class="bento-progress"><span class="bento-progress-fill" style="width:${pct}%"></span></div>
          <div class="bento-list">${rows.join('')}</div>
        </div>
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
      legend.innerHTML += `<div class="legend-row over"><span class="legend-dot" style="background:var(--danger)"></span><span class="legend-name">Über Budget</span><span class="legend-val">${fmt(totalExpenses - income)}</span><span class="legend-pct"></span></div>`;
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

/* Gespeicherte Datumsangaben (Stichtag, Abbuchung, Bonus-Verfall) von TT.MM.JJJJ auf ISO
   umstellen. Anzeige und Parsing lesen beide Formate -> gefahrlos und wiederholbar.
   Laeuft ueber den migrate-Haken des Kerns: beim Start und nach dem Wiederherstellen.
   Vorher war es eine IIFE, die nur beim Laden der Datei lief – eine aeltere Sicherung
   wurde dadurch mit alten Datumsformaten uebernommen. */
function finMigrate(){
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
  finVerknuepfeAltEintraege();
}

/* Einmaliger Abgleich fuer Alteintraege, die vor dem Automatismus zwischen Finanzen und
   Reisen angelegt wurden (also schon vorhandene Urlaube in Finanzen, zu denen der
   Automatismus noch keine Reise erzeugt hat):
   - Gibt es zu einem Namen bereits GENAU EINE unverknuepfte Reise, wird verknuepft.
   - Gibt es MEHRERE gleich benannte Reisen, bleibt der Eintrag unangetastet, statt eine
     falsche Zuordnung zu raten - dafuer muesste von Hand nachgeholfen werden.
   - Gibt es GAR KEINE passende Reise, wird - wie beim Neuanlegen - eine neue Huelle
     angelegt. Ohne diesen dritten Fall blieben Alteintraege ohne Gegenstueck in Reisen
     fuer immer unsichtbar, weil sie ja nie ueber saveUrlaub() neu angelegt werden.
   Laeuft bei jedem Start und nach jedem Wiederherstellen mit, tut aber nichts mehr,
   sobald einmal alles verknuepft bzw. angelegt ist. */
function finVerknuepfeAltEintraege() {
  if (typeof trips === 'undefined' || typeof urlaube === 'undefined') return;
  const normal = s => (s || '').trim().toLowerCase();
  const offen = urlaube.filter(u => !u.reiseId);
  if (!offen.length) return;
  let n = 0;
  for (const u of offen) {
    const name = normal(u.name);
    if (!name) continue;
    const kandidaten = trips.filter(t => !t.finId && normal(t.name) === name);
    if (kandidaten.length === 1) {
      u.reiseId = kandidaten[0].id;
      kandidaten[0].finId = u.id;
      n++;
    } else if (kandidaten.length === 0 && typeof rpCreateShellTrip === 'function') {
      u.reiseId = rpCreateShellTrip({ name: u.name, start: u.from, end: u.to, country: u.country || '' }, u.id);
      n++;
    }
    // kandidaten.length > 1 -> mehrdeutig, bewusst unangetastet lassen
  }
  if (n) {
    store.set(URLAUB_KEY, JSON.stringify(urlaube));
    if (typeof persist === 'function') persist('trip');
  }
}

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
/* Ankermonat eines Vertrags: bevorzugt aus dem Abbuchungsdatum ("15.03"), sonst aus dem
   Stichtag. Stand im Abbuchungsdatum nur der Tag, war ein vierteljaehrlicher oder
   jaehrlicher Vertrag vorher nie einzuordnen und verschwand kommentarlos aus der Liste. */
function vertragAnkerMonat(e, ausDebit) {
  if (ausDebit != null) return ausDebit;
  const iso = deToISO(e.startDate || '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return parseInt(iso.slice(5, 7), 10);
  return null;
}

/* Liefert zusaetzlich, welche Vertraege sich mangels Monatsangabe nicht einordnen
   liessen - die werden ausgewiesen statt stumm weggelassen. */
function dueThisMonth() {
  const today = new Date();
  const curM = today.getMonth() + 1, curY = today.getFullYear(), curD = today.getDate();
  const daysInM = new Date(curY, curM, 0).getDate();
  const out = [];
  const ohneAnker = [];
  data.v.forEach(e => {
    if (!e.debitDate) return;
    const m = String(e.debitDate).trim().match(/^(\d{1,2})(?:\.(\d{1,2}))?/);
    if (!m) return;
    const day = Math.min(parseInt(m[1], 10), daysInM);
    if (day < 1) return;
    const per = e.period || 'monatlich';
    if (per === 'monatlich') {
      if (day >= curD) out.push({ e, day });
      return;
    }
    const anker = vertragAnkerMonat(e, m[2] ? parseInt(m[2], 10) : null);
    if (anker == null) { ohneAnker.push(e); return; }
    let due = false;
    if (per === 'vierteljährlich') due = (((curM - anker) % 3) + 3) % 3 === 0;
    else if (per === 'jährlich')   due = anker === curM;
    if (!due || day < curD) return;  // nicht faellig oder schon abgebucht
    out.push({ e, day });
  });
  out.sort((a, b) => a.day - b.day || (a.e.name || '').localeCompare(b.e.name || '', 'de'));
  out.ohneAnker = ohneAnker;
  return out;
}

function dueThisMonthHTML() {
  const due = dueThisMonth();
  const ohne = due.ohneAnker || [];
  if (!due.length && !ohne.length) return '';
  const curM = String(new Date().getMonth() + 1).padStart(2, '0');
  const sum = due.reduce((s, d) => s + (Number(d.e.amount) || 0), 0);
  let html = '';
  if (due.length) {
    html += `<div class="uy-konto-head"><span>Fällig diesen Monat</span><b>${fmt(sum)}</b><span class="saverate-eur">${due.length === 1 ? '1 Abbuchung steht an' : due.length + ' Abbuchungen stehen an'}</span></div>`;
  }
  html += `<div class="due-list">`;
  due.forEach(d => {
    html += `<div class="due-row"><span class="due-date">${String(d.day).padStart(2, '0')}.${curM}.</span><span class="due-name">${esc(d.e.name)}${d.e.provider ? `<span class="due-prov"> · ${esc(d.e.provider)}</span>` : ''}</span><span class="due-amount">${fmt(d.e.amount)}</span></div>`;
  });
  html += `</div>`;
  /* Vertraege, bei denen weder Abbuchungsdatum noch Stichtag einen Monat hergeben.
     Sie tauchen sonst nirgends auf - lieber sichtbar als stumm verschluckt. */
  if (ohne.length) {
    html += `<div class="due-hint">${ohne.length === 1 ? 'Ein Vertrag lässt sich nicht einordnen' : ohne.length + ' Verträge lassen sich nicht einordnen'}: ${ohne.map(e => esc(e.name)).join(', ')} — bitte Monat im Abbuchungsdatum oder einen Stichtag ergänzen.</div>`;
  }
  html += `<div class="uc-divider"></div>`;
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
  store.set('fin_av_view_mode_v1', mode);
  renderAvDash();
}

const COLLAPSE_KEY = 'fin_collapsed_sections_v1';
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
      e.points ? `<div class="entry-amount">${esc(e.points)}</div>` : ''
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
  showToast('Gespeichert');
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
/* Der Eintrag, aus dem Urlaubsbudget und Kontostand gespeist werden. Zuerst ueber den
   Namen, damit sich an den heutigen Zahlen nichts aendert. Der Rueckfall ueber die
   Kategorie greift nur, wenn kein Eintrag mehr so heisst - vorher lieferte ein Umbenennen
   kommentarlos 0 und Budget wie Kontostand rechneten ab da mit null.
   ---> Wenn der Rueckfall nicht gewuenscht ist: die vorletzte Zeile im return loeschen. */
const URLAUB_SPAR_NAME = 'Urlaub I';
function urlaubSparEintrag() {
  return data.b.find(x => x.name && x.name.trim() === URLAUB_SPAR_NAME)
      || data.b.find(x => x.cat === 'Urlaub')
      || null;
}

function urlaubMonthlyRate() {
  const e = urlaubSparEintrag();
  return e ? toMonthly(e.amount || 0, e.period || 'monatlich') : 0;
}

/* Wann der nicht durch Anzahlungen gedeckte Rest vom Konto abgeht. Standard ist der
   Reisemonat; ueber die Felder dueM/dueY laesst sich ein anderer Zeitpunkt setzen -
   etwa wenn eine Reise ueber den Jahreswechsel erst im Januar abgerechnet wird. */
function tripRestFaellig(u) {
  const m = parseInt(u.dueM, 10);
  const y = parseInt(u.dueY, 10);
  if (m >= 1 && m <= 12 && y > 1900) return { m, y };
  return { m: tripMonthNum(u), y: parseInt(tripRealYear(u), 10) };
}

/* Betrag, der in einem Jahr vom Konto abfliesst, obwohl die Reise erst dem Budget eines
   spaeteren Jahres zugeordnet ist (Anzahlungen und Reisen ueber den Jahreswechsel).
   Genau um diesen Betrag darf das Konto am Jahresende im Minus stehen: das Geld ist
   vorgestreckt und wird vom Budget des Folgejahres getragen. */
function urlaubVorstreckung(jahr) {
  let summe = 0;
  urlaube.forEach(u => {
    const budgetJahr = parseInt(finTripYear(u), 10);
    if (!budgetJahr || budgetJahr <= jahr) return;
    const kosten = tripCost(u);
    let gedeckt = 0;
    if (Array.isArray(u.payments) && u.payments.length) {
      u.payments.forEach(p => {
        if (!(p.amount > 0)) return;
        const y = parseInt(p.y || tripRealYear(u), 10);
        if (!y) return;
        gedeckt += p.amount;
        if (y === jahr) summe += p.amount;
      });
    }
    // Was der Anzahlungsplan nicht abdeckt, wird zum Faelligkeitsmonat des Restbetrags faellig
    const rest = kosten - gedeckt;
    if (rest > 0.005 && tripRestFaellig(u).y === jahr) summe += rest;
  });
  return summe;
}

/* Tatsaechliches Reisejahr - ignoriert bewusst das u.budgetYear-Override. Fuer den
   Kontoverlauf zaehlt, wann das Geld wirklich abfliesst, nicht welches Jahresbudget
   die Reise planerisch belastet. */
function tripRealYear(u) {
  if (u.year) { const m = String(u.year).match(/\d{4}/); if (m) return m[0]; }
  // Rueckfall auf das Von-Datum: ohne diesen Zweig konnte bei Eintraegen ohne year-Feld
  // kein Jahr ermittelt werden - die Kosten fielen dann lautlos aus dem Kontoverlauf.
  const von = tripFrom(u);
  if (von && /^\d{4}/.test(von)) return von.slice(0, 4);
  return urlaubYear(u.month);
}

/* Monatsweiser Kontoverlauf (Ist-Sicht) ab dem laufenden Monat.
   Zufluesse: monatliche Sparrate + Einmaleinzahlungen (Ausgleiche bei Budgetueberschreitung).
   Abfluesse: Anzahlungen bzw. - ohne Anzahlungsplan - die vollen Reisekosten im Reisemonat.
   Startsaldo ist der heutige Kontostand; vergangene Monate werden bewusst nicht
   rekonstruiert, da dafuer keine historischen Kontodaten vorliegen. */
function urlaubKontoVerlauf(startSaldo) {
  const now = new Date();
  // Der Verlauf beginnt beim laufenden Monat, nicht erst beim Folgemonat - sonst fehlt
  // z.B. am 1. eines Monats dessen Zeile komplett, obwohl noch nichts gebucht sein kann.
  // Er faellt erst raus, sobald der Monat vorbei ist.
  const ymNow = now.getFullYear() * 12 + now.getMonth();
  const buckets = {};
  const bucket = ym => (buckets[ym] = buckets[ym] || { ym, zu: [], ab: [] });

  // Abfluesse aus Reisen
  urlaube.forEach(u => {
    const kosten = tripCost(u);
    let gedeckt = 0;
    if (Array.isArray(u.payments) && u.payments.length) {
      u.payments.forEach(p => {
        const y = parseInt(p.y || tripRealYear(u), 10), m = p.m;
        if (!y || !m || !(p.amount > 0)) return;
        gedeckt += p.amount;
        const ym = y * 12 + (m - 1);
        if (ym >= ymNow) bucket(ym).ab.push({ label: 'Anzahlung ' + u.name, amount: p.amount });
      });
    }
    // Was die Anzahlungen nicht abdecken, wird zum Faelligkeitsmonat des Restbetrags
    // faellig - standardmaessig der Reisemonat, sonst der im Eintrag gesetzte Termin.
    const rest = kosten - gedeckt;
    if (rest > 0.005) {
      const f = tripRestFaellig(u);
      if (f.y && f.m) {
        const ym = f.y * 12 + (f.m - 1);
        if (ym >= ymNow) bucket(ym).ab.push({ label: u.name, amount: rest });
      }
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
    // Der Startsaldo ist der heutige, echte Kontostand - die Sparrate des laufenden
    // Monats steckt darin bereits drin (oder ist noch offen, aber nicht diese Funktion
    // sagt das). Sie hier nochmal aufzuaddieren wuerde den Monat doppelt zaehlen.
    // Erst ab dem Folgemonat ist die Rate eine echte zukuenftige Bewegung.
    const rate = ym === ymNow ? 0 : rateAtYm(ym);
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

/* Jahresanspruch manuell setzen bzw. (bei leerer Eingabe) wieder auf den Standard
   zurueckfallen. Gleiches Muster wie startInlineKontoSaldo. */
function startInlineUrlaubAnspruch(jahr, el) {
  if (el.querySelector('input')) return;
  const angezeigt = urlaubAnspruchJahr(jahr);
  const inp = buildSignedInput(el, String(angezeigt).replace('.', ','), { inputClass: 'balance-inline kv-input-days' });
  inp.focus(); inp.select && inp.select();
  let done = false;
  const commit = () => {
    if (done) return; done = true;
    const roh = inp.value.trim();
    const v = parseMoney(roh);
    if (!roh || v == null || v < 0 || v === URLAUB_ANSPRUCH) delete urlaubAnspruchOverride[jahr];
    else urlaubAnspruchOverride[jahr] = v;
    store.set(URLAUB_ANSPRUCH_KEY, JSON.stringify(urlaubAnspruchOverride));
    // renderUrlaubeAll() statt nur renderHeroBento(): die Eingabe liegt jetzt in dieser
    // Detailansicht selbst, die muss sich nach dem Bestaetigen mit neu zeichnen (baut
    // dabei auch die Kachel mit - siehe renderUrlaubeAll()).
    renderUrlaubeAll();
  };
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); inp.blur(); } });
}

/* Monats-Endsaldo manuell setzen bzw. (bei leerer Eingabe) wieder freigeben. */
function startInlineKontoSaldo(ym, el) {
  if (el.querySelector('input')) return;
  const alt = urlaubKontoOverrides[ym];
  // Vorbelegt wird immer der aktuell angezeigte Wert - so ist sichtbar, was ueberschrieben
  // wird, und es braucht keinen Platzhalter, der im schmalen Feld abgeschnitten wuerde.
  const angezeigt = typeof alt === 'number' ? alt : parseMoneySigned(el.textContent);
  const inp = buildSignedInput(el, (angezeigt != null && !isNaN(angezeigt)) ? fmt(angezeigt) : '', { inputClass: 'balance-inline kv-input' });
  inp.focus(); inp.select && inp.select();
  let done = false;
  const commit = () => {
    if (done) return; done = true;
    const roh = inp.value.trim();
    if (!roh || roh === '-' || roh === '−') delete urlaubKontoOverrides[ym];
    else {
      const v = parseMoneySigned(roh);
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
  const e = urlaubSparEintrag();
  if (!e || el.querySelector('input')) return;
  const inp = buildSignedInput(el, fmt(e.balance || 0), { inputClass: 'balance-inline kv-input' });
  inp.focus(); inp.select && inp.select();
  let done = false;
  const commit = () => {
    if (done) return; done = true;
    const v = parseMoneySigned(inp.value);
    if (v != null && !isNaN(v) && v !== (e.balance || 0)) {
      e.balance = v;
      store.set(SECTIONS.b.storageKey, JSON.stringify(data.b));
      // Ein neuer Startwert soll durchgreifen. Manuell gesetzte Monats-Salden wirken als
      // Anker und wuerden ihn blockieren - sie werden deshalb aufgeloest, damit die
      // Automatik ab dem Startwert durchrechnet und nichts zweimal angefasst werden muss.
      if (Object.keys(urlaubKontoOverrides).length) {
        urlaubKontoOverrides = {};
        store.set(URLAUB_KONTO_OVERRIDE_KEY, JSON.stringify(urlaubKontoOverrides));
      }
      renderSection('b'); renderDashboard(); updateIncome();
    }
    renderUrlaubeAll();
  };
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); inp.blur(); } });
}

// Historie der Ratenänderungen [{ym, rate}] (ym = Jahr*12+Monat). Nur Änderungen ab jetzt.
const URLAUB_RATE_HIST_KEY = 'fin_urlaub_rate_hist_v1';
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

/* Sortierung innerhalb eines Jahres. Bewusst nach dem tatsaechlichen Von-Datum und nicht
   nur nach der Monatsnummer: Eine Reise ueber den Jahreswechsel kann per Budget-Jahr in
   der Gruppe des Folgejahres stehen, beginnt real aber im Dezember des Vorjahres. Nach
   Monatsnummer allein (12) waere sie ans Ende gerutscht, obwohl sie zeitlich zuerst kommt. */
function urlaubItems(group) {
  const schluessel = u => {
    const von = tripFrom(u);
    if (von && /^\d{4}-\d{2}/.test(von)) return von;
    const j = tripRealYear(u) || '9999';
    const m = String(tripMonthNum(u) || 12).padStart(2, '0');
    return `${j}-${m}-01`;
  };
  return group.slice().sort((a,b) => schluessel(a).localeCompare(schluessel(b)));
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
/* Laenderumrisse kommen aus data-laender.js (COUNTRY_PATHS) - die frueher hier liegende
   Zweitfassung FIN_COUNTRY_PATHS war dieselbe Projektion in einem zehnfach kleineren
   Massstab und musste doppelt gepflegt werden. */
function fillCountryDatalist() {
  const dl = $('country-list');
  if (!dl || dl.children.length) return;
  dl.innerHTML = [...Object.keys(COUNTRY_PATHS), ...Object.keys(ORT_PUNKTE)].sort((a,b) => a.localeCompare(b,'de')).map(n => `<option value="${n}">`).join('');
}
/* Restbudget des laufenden Jahres - identische Formel wie in der Urlaube-Detailansicht:
   Budget = 12 x Sparrate, ohne Uebertrag zwischen den Jahren und ohne Einmaleinzahlungen
   (die sind Ausgleiche auf dem Konto und gehoeren nur in die Ist-Sicht). */
function currentYearUrlaubBalance() {
  // Bewusst frisch berechnet und nicht aus der globalen urlaubBudget-Variablen gelesen:
  // die wird erst in renderUrlaubeAll() aktualisiert, die Kachel kann aber vorher zeichnen.
  const yearlyBudget = computeUrlaubBudget();
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
  const numYears = years.filter(y => y !== 'ohne').map(Number).filter(Boolean).sort((a,b) => a - b);

  // Aktueller Kontostand (Ist, global einmal oben) - reales Guthaben auf dem Sparkonto
  // "Urlaub I", manuell gepflegt. Getrennt von der Budget-Planung je Jahr weiter unten:
  // der Kontostand zeigt, was JETZT auf dem Konto liegt; die Jahreskarten zeigen, wie sich
  // das Jahresbudget (Sparrate x 12) rechnerisch auf geplante Reisen verteilt.
  const sparE = urlaubSparEintrag();
  const konto = sparE ? (sparE.balance || 0) : 0;
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

  if (yearlyBudget > 0 && numYears.length) {
    html += `<div class="uy-section-label">Budget</div>`;
    numYears.forEach(y => {
      const items = urlaubItems(groups[String(y)] || []);
      const geplant = expByYear[y] || 0;
      const balance = yearlyBudget - geplant;                    // große +/- Zahl

      const remTxt = balance >= 0 ? `${fmt(balance)} übrig` : `${fmt(Math.abs(balance))} fehlen`;
      // Invertierte Logik: der Balken zeigt ausschliesslich das UEBRIGE Budget in Gruen.
      // Voll = nichts verplant, leer = Budget aufgebraucht oder ueberschritten. Bei
      // Ueberschreitung bleibt nur die graue Spur - der Fehlbetrag steht als rote Zahl
      // darueber. Ein roter Balken waere hier irrefuehrend, weil er aehnlich lang wie ein
      // gruener aussehen kann und damit das Gegenteil suggeriert.
      const fillPct = (yearlyBudget > 0 && balance > 0)
        ? Math.max(0, Math.min(100, Math.round(balance / yearlyBudget * 100)))
        : 0;

      const metaGrid = `<div class="uy-meta-pair">
          <span class="uy-mc"><span class="uy-ml">Budget</span><span class="uy-mv">${fmt(yearlyBudget)}</span></span>
          <span class="uy-mc"><span class="uy-ml">Geplant</span><span class="uy-mv">${fmt(geplant)}</span></span>
        </div>`;

      html += `<div class="urlaub-year-head${numYears.indexOf(y) === 0 ? ' first-year' : ''}">
          <div class="uy-top"><span class="uy-year">${y}</span><span class="uy-remaining ${balance < 0 ? 'negative' : ''}">${remTxt}</span></div>
          <div class="uy-bar"><div class="uy-bar-fill" style="width:${fillPct}%"></div></div>
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
    verlauf.forEach((z, i) => {
      const jahrLabel = z.jahr !== letztesJahr ? `<div class="kv-year">${z.jahr}</div>` : '';
      letztesJahr = z.jahr;
      const bewegungen =
        z.zu.map(x => `<div class="kv-move"><span class="kv-lbl">${esc(x.label)}</span><span class="kv-in">+${fmt(x.amount)}</span></div>`).join('') +
        z.ab.map(x => `<div class="kv-move"><span class="kv-lbl">${esc(x.label)}</span><span class="kv-out">−${fmt(x.amount)}</span></div>`).join('');
      html += `${jahrLabel}<div class="kv-month">
          <div class="kv-head"><span class="kv-mon">${MONTH_FULL[z.monat-1]}${z.manuell ? '<span class="kv-manual" title="manuell gesetzt">•</span>' : ''}</span><span class="kv-saldo kv-editable${z.saldo < 0 ? ' negative' : ''}${z.manuell ? ' manuell' : ''}" onclick="startInlineKontoSaldo(${z.ym}, this)">${fmt(z.saldo)}</span></div>
          ${bewegungen}
        </div>`;

      /* Eine Zeile je Jahr: der geplante Kontostand zum 31.12. Er ist normalerweise 0 -
         das Konto soll zum Jahreswechsel ausgeglichen sein - und steht genau um den
         Betrag im Minus, der in diesem Jahr fuer Reisen des Folgejahres vorgestreckt
         wurde (Anzahlungen und Reisen ueber den Jahreswechsel). */
      const naechste = verlauf[i + 1];
      if (!naechste || naechste.jahr !== z.jahr) {
        const soll = -urlaubVorstreckung(z.jahr) || 0;   // "|| 0" faengt die negative Null ab
        // Differenz zwischen dem geplanten Stand und dem tatsaechlichen Dezember-Saldo.
        // Liegt der Saldo darunter, fehlt Geld und muss per Einmaleinzahlung nachgeschossen
        // werden; liegt er darueber, ist mehr auf dem Konto als noetig.
        const diff = z.saldo - soll;
        const fehlt = diff < -0.005;
        html += `<div class="kv-yearend">
            <div class="kv-ye-row">
              <span class="kv-ye-lbl">Geplanter Kontostand 31.12.${z.jahr}</span>
              <span class="kv-ye-val${soll < 0 ? ' negative' : ''}">${fmt(soll)}</span>
            </div>
            <div class="kv-ye-row">
              <span class="kv-ye-lbl sub">${fehlt ? 'Fehlbetrag' : 'Überschuss'}</span>
              <span class="kv-ye-val ${fehlt ? 'negative' : 'positiv'}">${fmt(Math.abs(diff))}</span>
            </div>
          </div>`;
      }
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
  const anspruch = urlaubAnspruchJahr(j);
  return { jahr: j, reisen, verplant: verplant + manuell, manuell, anspruch, rest: anspruch - verplant - manuell };
}

/* Formatierung fuer Resturlaub-Tage, geteilt zwischen der Bento-Kachel und der
   Detailansicht - vorher zweimal wortgleich lokal definiert. */
// Balkenfarbe bleibt gruen/orange/rot als Signal, die Zahlen selbst sind weiss/Textfarbe –
// eine Warnfarbe erscheint dort nur bei knappem oder aufgebrauchtem Resturlaub.
function ruFarbe(r){ return r < 0 ? 'var(--danger)' : r <= 5 ? 'var(--orange)' : 'var(--green)'; }
function ruTextFarbe(r){ return r < 0 ? 'var(--danger)' : r <= 5 ? 'var(--orange)' : 'var(--text)'; }
function ruZahl(r){ return Number.isInteger(r) ? String(r) : r.toFixed(1).replace('.', ','); }

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
        `<div class="entry-amount">${fmt(tripCost(u))}</div>`
      ));
      list.appendChild(div);
      attachSwipeGeneric(div, () => deleteUrlaub(u.id), () => openUrlaubModal(u.id));
    });
    wrap.appendChild(list);
  });
}

/* Monat, auf dem die zuletzt gezeichnete Ansicht basiert. Bleibt die App ueber einen
   Monatswechsel hinweg geoeffnet (auf dem iPhone der Normalfall), wuerde der Kontoverlauf
   sonst weiter mit dem alten Startmonat stehen. */
let _urlaubRenderYm = null;

function aktuellesYm() {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
}

/* Entfernt manuelle Kontostand-Werte, deren Monat vorbei ist. Sie koennen nicht mehr
   angezeigt werden und wuerden sich sonst dauerhaft im Speicher ansammeln. */
function pruneKontoOverrides() {
  const grenze = aktuellesYm();
  let geaendert = false;
  Object.keys(urlaubKontoOverrides).forEach(k => {
    const ym = parseInt(k, 10);
    if (!isNaN(ym) && ym <= grenze) { delete urlaubKontoOverrides[k]; geaendert = true; }
  });
  if (geaendert) store.set(URLAUB_KONTO_OVERRIDE_KEY, JSON.stringify(urlaubKontoOverrides));
}

function renderUrlaubeAll() {
  _urlaubRenderYm = aktuellesYm();
  pruneKontoOverrides();
  updateUrlaubRateHist();
  urlaubBudget = computeUrlaubBudget();
  store.set(URLAUB_BUDGET_KEY, String(urlaubBudget));
  const autoEl = $('urlaub-budget-auto');
  if (autoEl) autoEl.textContent = fmt(urlaubBudget);
  renderUrlaubKontingentRows();
  renderUrlaubeDash(); renderUrlaube(); renderDeposits(); renderManualDays();
  // Die Kacheln "Urlaubsbudget" und "Resturlaub" haengen an denselben Daten und muessen
  // mitziehen - sonst zeigt die Uebersicht nach dem Speichern einer Reise noch alte Zahlen.
  renderHeroBento();
}

/* Kontingent-Zeilen in der Urlaube-Karte (Haupt-Bildschirm) - der Ort, an dem alle
   Eingaben zu diesem Bereich liegen (Einmaleinzahlungen, Urlaubstage, jetzt auch das
   Kontingent). Lag vorher als eigener Abschnitt im Detailblatt, dort aber getrennt von
   den uebrigen Eingaben - jetzt an einem Ort zusammengefasst statt doppelt vorzukommen. */
function renderUrlaubKontingentRows() {
  const wrap = $('urlaub-kontingent-rows');
  if (!wrap) return;
  const { years } = urlaubGroups();
  const numYears = years.filter(y => y !== 'ohne').map(Number).filter(Boolean).sort((a, b) => a - b);
  if (!numYears.length) { wrap.innerHTML = '<div class="ub-label" style="padding:2px 0">Noch keine Reisejahre angelegt.</div>'; return; }
  wrap.innerHTML = numYears.map(y => {
    const anspruch = urlaubAnspruchJahr(y);
    return `<div class="uc-budget-row">
        <span class="ub-label">Kontingent ${y}</span>
        <span class="ub-auto-val"><span class="kv-editable" onclick="startInlineUrlaubAnspruch(${y}, this)">${ruZahl(anspruch)}</span> Tage</span>
      </div>`;
  }).join('');
}

/* Kommt die App aus dem Hintergrund zurueck und es ist inzwischen ein neuer Monat,
   wird neu gezeichnet - der abgelaufene Monat faellt dann aus dem Kontoverlauf. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) return;
  if (_urlaubRenderYm !== null && _urlaubRenderYm !== aktuellesYm()) renderUrlaubeAll();
});

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
  showToast('Gespeichert');
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
  showToast('Gespeichert');
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
  // Faelligkeit des Restbetrags: eigenes Feld schlaegt den Reisemonat
  const dm = parseInt(($('urlaub-due-m') || {}).value, 10);
  const dy = parseInt(($('urlaub-due-y') || {}).value, 10);
  const eigen = (dm >= 1 && dm <= 12 && dy > 1900);
  const mName = eigen ? (MONTH_FULL[dm-1] + ' ' + dy) : (month ? MONTH_FULL[month-1] : 'Reisemonat');
  if (explicit <= 0) {
    hint.textContent = 'Ohne Anzahlung wird der Gesamtbetrag im ' + mName + ' fällig.';
    hint.classList.remove('over');
    return;
  }
  const rest = cost - explicit;
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
  // Nur befuellen, wenn die Zeile sichtbar ist - checkUrlaubYearSpan() hat sie oben
  // je nach Jahreswechsel ein- oder ausgeblendet und im zweiten Fall bereits geleert.
  const dueSichtbarJetzt = $('urlaub-due-row') && $('urlaub-due-row').style.display !== 'none';
  if (dueSichtbarJetzt) {
    if ($('urlaub-due-m')) $('urlaub-due-m').value = (e && e.dueM) ? String(e.dueM) : '';
    if ($('urlaub-due-y')) $('urlaub-due-y').value = (e && e.dueY) ? String(e.dueY) : '';
  }
  updatePayHint();
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
  const dueRow = $('urlaub-due-row');
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
    // Der Zahlungstermin ist nur bei Reisen ueber den Jahreswechsel eine Frage -
    // sonst faellt der Restbetrag ohnehin im Reisemonat an.
    if (dueRow) dueRow.style.display = '';
  } else {
    splitRow.style.display = 'none';
    daysWrap.style.display = '';
    if (byField) byField.style.display = 'none';
    if (dueRow) {
      dueRow.style.display = 'none';
      // Werte verwerfen, damit ein zuvor gesetzter Termin nicht unsichtbar weiterwirkt
      if ($('urlaub-due-m')) $('urlaub-due-m').value = '';
      if ($('urlaub-due-y')) $('urlaub-due-y').value = '';
    }
  }
  updatePayHint();
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
  // Faelligkeit des Restbetrags - nur bei Reisen ueber den Jahreswechsel eingebbar,
  // sonst faellt der Restbetrag immer im Reisemonat an. Leer bedeutet Reisemonat.
  const dueSichtbar = $('urlaub-due-row') && $('urlaub-due-row').style.display !== 'none';
  const dueMRaw = dueSichtbar ? parseInt(($('urlaub-due-m') || {}).value, 10) : NaN;
  const dueYRaw = dueSichtbar ? parseInt(($('urlaub-due-y') || {}).value, 10) : NaN;
  const dueGesetzt = (dueMRaw >= 1 && dueMRaw <= 12 && dueYRaw > 1900);
  const nurEins = (!isNaN(dueMRaw) || !isNaN(dueYRaw)) && !dueGesetzt;
  if (nurEins) { notify('Bitte Monat (1–12) und Jahr für die Restzahlung angeben.'); return; }

  const obj = { name, year, month, cost, from, to, days: days || 0 };
  if (country) obj.country = country;
  if (payments.length) obj.payments = payments;
  if (daysByYear) obj.daysByYear = daysByYear;
  if (budgetYear) obj.budgetYear = budgetYear;
  if (dueGesetzt) { obj.dueM = dueMRaw; obj.dueY = dueYRaw; }
  if (editUrlaubId) {
    const i = urlaube.findIndex(x => x.id === editUrlaubId);
    const { payments: _old, month: _m, daysByYear: _dby, budgetYear: _by, dueM: _dm, dueY: _dy, ...rest } = urlaube[i];
    urlaube[i] = { ...rest, ...obj };
    // Verknuepfte Reise nachziehen (Name/Zeitraum/Land). rest enthaelt reiseId, falls
    // gesetzt - der Destrukturierungs-Ausschluss oben betrifft nur die dort genannten
    // Felder, reiseId bleibt also automatisch erhalten.
    if (urlaube[i].reiseId && typeof rpSyncFromFinanzen === 'function') {
      rpSyncFromFinanzen(urlaube[i].reiseId, { name, start: from, end: to, country: country || '' });
    }
  } else {
    const neuId = neueId();
    const neuerEintrag = { id: neuId, ...obj };
    // Automatisch eine Huelle in Reisen anlegen (nur Name/Zeitraum/Land) - alles
    // Weitere traegt man dort selbst nach.
    if (typeof rpCreateShellTrip === 'function') {
      neuerEintrag.reiseId = rpCreateShellTrip({ name, start: from, end: to, country: country || '' }, neuId);
    }
    urlaube.push(neuerEintrag);
  }
  store.set(URLAUB_KEY, JSON.stringify(urlaube));
  closeUrlaubModal();
  showToast('Gespeichert');
  renderUrlaubeAll();
}

async function deleteUrlaub(id) {
  await loeschenMitRueckfrage({
    liste: urlaube, id,
    // Verknuepfte Reise wird VOR dem Entfernen behandelt (gleiches Prinzip wie das
    // Aufraeumen der Bilder in Reisen beim Loeschen dort): eine noch bevorstehende oder
    // laufende Reise wird automatisch mitgeloescht, ohne weitere Rueckfrage - die
    // Rueckfrage fuer diesen Eintrag ist gerade schon beantwortet. Eine bereits
    // abgeschlossene Reise bleibt unter "Vergangene Reisen" stehen, nur die
    // Verknuepfung faellt weg.
    vorher: async (e) => {
      if (!e.reiseId || typeof trips === 'undefined') return;
      const t = trips.find(x => x.id === e.reiseId);
      if (!t) return;
      const vorbei = t.end && t.end < todayISO();
      if (vorbei) {
        delete t.finId;
        persist('trip');
      } else if (typeof rpDeleteTripSilently === 'function') {
        await rpDeleteTripSilently(e.reiseId);
        if (typeof renderHome === 'function') renderHome();
      }
    },
    speichern: () => store.set(URLAUB_KEY, JSON.stringify(urlaube)),
    zeichnen: () => renderUrlaubeAll()
  });
}

/* Verknuepfung aufloesen, wenn die Reise direkt in Reisen geloescht wurde (nicht ueber
   diesen Bereich). Der Finanzen-Eintrag bleibt bestehen - Geld-Daten werden hier nie
   automatisch geloescht, nur der Verweis auf die nicht mehr existierende Reise faellt weg. */
function finUnlinkReise(finId) {
  const e = urlaube.find(x => x.id === finId);
  if (!e || !e.reiseId) return;
  delete e.reiseId;
  store.set(URLAUB_KEY, JSON.stringify(urlaube));
}

/* Name/Zeitraum/Land nachziehen, wenn die verknuepfte Reise in Reisen bearbeitet wurde.
   Schreibt direkt, ohne ueber saveUrlaub() zu gehen - sonst wuerde das einen Ruecksync
   nach Reisen ausloesen und beide Seiten wechselseitig anstossen. */
function finSyncFromReisen(finId, daten) {
  const e = urlaube.find(x => x.id === finId); if (!e) return;
  e.name = daten.name || e.name;
  if (daten.start) { e.from = daten.start; e.year = daten.start.slice(0, 4); e.month = parseInt(daten.start.slice(5, 7), 10); }
  e.to = daten.end || daten.start || e.to;
  if (daten.country) e.country = daten.country; else delete e.country;
  store.set(URLAUB_KEY, JSON.stringify(urlaube));
  renderUrlaubeAll();
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
      ? `<div class="field"><label>${ff.label}</label><input type="text" id="tf-${ff.key}" placeholder="${ff.placeholder||''}" inputmode="decimal" autocomplete="off" oninput="autoDate(this)" onblur="fixDate(this)"></div>`
      : `<div class="field"><label>${ff.label}</label><input type="text" id="tf-${ff.key}" placeholder="${ff.placeholder||''}" autocomplete="off"></div>`;
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
  showToast('Gespeichert');
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
  const inp = buildSignedInput(el, fmt(old), { prefixHTML: '<span>Stand:</span> ' });
  inp.focus();
  inp.select && inp.select();
  let done = false;
  const commit = () => {
    if (done) return;
    done = true;
    const v = parseMoneySigned(inp.value);
    if (v != null && !isNaN(v)) e[key] = v;
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
  abos:'fin_abos_v1', budgets:'fin_budgets_v1', altersvorsorge:'fin_altersvorsorge_v1', income:'fin_income_v1', bonus:'fin_bonus_v1',
  urlaube:'fin_urlaube_v1', urlaubBudget:'fin_urlaub_budget_v1', urlaubDeposits:'fin_urlaub_deposits_v1',
  urlaubManualDays:'fin_urlaub_manual_days_v1', urlaubKontoOverride:'fin_urlaub_konto_override_v1',
  urlaubRateHist:'fin_urlaub_rate_hist_v1', history:'fin_history_v1', incomeMeta:'fin_income_meta_v1'
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
    history: history
  };
}

/* Uebernimmt nur noch Daten. Rueckfrage, Erfolgsmeldung und Neuzeichnen macht der Kern
   in applyCombined – vorher fragte dieser Bereich zusaetzlich selbst nach und meldete
   selbst Erfolg, sodass beim Laden aus der Cloud mehrere Rueckfragen und mehrere
   Erfolgsmeldungen hintereinander kamen. */
function finApplyBackup(rawText) {
  let parsed;
  try { parsed = JSON.parse(rawText); } catch (e) { return false; }
  const sec = parsed && parsed.sections ? parsed.sections : null;
  if (!sec || (!Array.isArray(sec.v) && !Array.isArray(sec.b) && !Array.isArray(sec.a))) return false;
  if (Array.isArray(sec.v)) { data.v = sec.v; store.set(SECTIONS.v.storageKey, JSON.stringify(data.v)); }
  if (Array.isArray(sec.b)) { data.b = sec.b; store.set(SECTIONS.b.storageKey, JSON.stringify(data.b)); }
  if (Array.isArray(sec.a)) { data.a = sec.a; store.set(SECTIONS.a.storageKey, JSON.stringify(data.a)); }
  if (typeof parsed.income === 'number') {
    income = parsed.income;
    store.set(INCOME_KEY, String(income));
    if ($('income-input')) $('income-input').value = income > 0 ? fmt(income) : '';
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
  if (Array.isArray(parsed.history)) {
    history = parsed.history;
    store.set(HISTORY_KEY, JSON.stringify(history));
  }
  return true;
}

/* Kurzangabe fuer die Rueckfrage des Kerns. */
function finRestoreInfo(p) {
  const s = (p && p.sections) || {};
  const n = (x) => (Array.isArray(x) ? x.length : 0);
  return `${n(s.v)} Verträge, ${n(s.b)} Budgets, ${n(s.a)} Vorsorge`;
}

/* Der Escape-Zuhoerer lag frueher hier und schloss immer nur das Formular dieses
   Bereichs – er liegt jetzt im Kern und schliesst das oberste offene Blatt. Die
   Tastenkombination zum Speichern ist entfallen: auf dem iPhone nicht erreichbar. */

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
  restoreInfo: p => finRestoreInfo(p),
  migrate: () => finMigrate(),
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
