/* sellerfee core: languages, common UI strings, field helpers. Market files register into SF.MARKETS. */
(function (root) {
  var SF = root.SF = { MARKETS: [], UPDATED: '2026-09-09' };
  SF.LANGS = ['en', 'de', 'fr', 'it', 'es', 'nl', 'ja', 'ko'];
  SF.LOCALE = { en: 'en-US', de: 'de-DE', fr: 'fr-FR', it: 'it-IT', es: 'es-ES', nl: 'nl-NL', ja: 'ja-JP', ko: 'ko-KR' };
  SF.n = function (x) { var y = Number(x); return isFinite(y) ? y : 0; };
  SF.extra = function (v, i) { return Number(String(v.cat).split('+')[i] || 0); };
  SF.add = function (m) { SF.MARKETS.push(m); };
  SF.get = function (id) { return SF.MARKETS.filter(function (m) { return m.id === id; })[0]; };
  SF.langsOf = function (m) { return SF.LANGS.filter(function (l) { return m.s[l]; }); };

  // Shared by the single-market calculator and the comparison table.
  SF.defaults = function (m) { var v = {}; m.fields.forEach(function (f) { v[f.k] = f.d; }); SF.derive(m, v); return v; };

  // The product itself follows the visitor between pages; fee settings stay per market.
  // Keyed by currency so a ₩29,900 product never lands in a EUR calculator.
  // Fields shown up front; everything else folds into an 'advanced' disclosure.
  SF.PRIMARY = ['price', 'shipping', 'cost', 'shipCost', 'cat', 'cond', 'commission'];
  SF.isPrimary = function (m, f) { return SF.PRIMARY.indexOf(f.k) >= 0 || (m.primary && m.primary.indexOf(f.k) >= 0); };

  SF.PRODUCT = ['price', 'shipping', 'cost', 'shipCost'];
  var pkey = function (cur) { return 'sf:p:' + cur; };
  SF.loadProduct = function (cur, v) {
    try {
      var p = JSON.parse(localStorage.getItem(pkey(cur)) || 'null');
      if (p) SF.PRODUCT.forEach(function (k) { if (k in v && p[k] !== undefined && p[k] !== '') v[k] = p[k]; });
    } catch (e) {}
    return v;
  };
  SF.saveProduct = function (cur, v) {
    var o = {};
    SF.PRODUCT.forEach(function (k) { if (v[k] !== undefined) o[k] = v[k]; });
    try { localStorage.setItem(pkey(cur), JSON.stringify(o)); } catch (e) {}
  };
  SF.clearProduct = function (cur) { try { localStorage.removeItem(pkey(cur)); } catch (e) {} };

  // A select with `sets` writes its option value into another field (category -> commission %).
  // Values may carry variants "7|8|10" chosen by `cond`, and extras after "+" that fees() reads.
  SF.derive = function (m, v, k) {
    m.fields.forEach(function (f) {
      if (!f.sets) return;
      if (k !== undefined && k !== f.k && k !== 'cond') return;
      var opt = (f.o || []).filter(function (o) { return String(o.v) === String(v[f.k]); })[0];
      if (!opt) return;
      var parts = String(opt.v).split('+')[0].split('|');
      v[f.sets] = Number(parts[Math.min(SF.n(v.cond), parts.length - 1)]);
    });
    if (m.derive) m.derive(v, k);
  };

  SF.calc = function (m, v) {
    var n = SF.n;
    var rev = n(v.price) + n(v.shipping);
    var fees = m.fees(v).filter(function (x) { return n(x.a) !== 0; });
    var total = fees.reduce(function (acc, x) { return acc + n(x.a); }, 0);
    var payout = rev - total, spend = n(v.cost) + n(v.shipCost), profit = payout - spend;
    return { rev: rev, fees: fees, total: total, payout: payout, profit: profit, margin: rev ? profit / rev : 0, roi: spend ? profit / spend : 0 };
  };

  // Price where profit == target. Bisection: fees are piecewise but profit rises with price.
  SF.solve = function (m, v, target) {
    var lo = 0, hi = Math.max(100, (SF.n(v.cost) + SF.n(v.shipCost) + target) * 5, SF.n(v.price) * 5);
    for (var i = 0; i < 60; i++) {
      var mid = (lo + hi) / 2, o = {};
      for (var k in v) o[k] = v[k];
      o.price = mid;
      if (SF.calc(m, o).profit < target) lo = mid; else hi = mid;
    }
    return hi;
  };

  SF.COUNTRY = {
  'KR': {
    'en': 'South Korea',
    'ko': '한국',
    'ja': '韓国',
    'de': 'Südkorea',
    'fr': 'Corée du Sud',
    'it': 'Corea del Sud',
    'es': 'Corea del Sur',
    'nl': 'Zuid-Korea'
  },
  'JP': {
    'en': 'Japan',
    'ko': '일본',
    'ja': '日本',
    'de': 'Japan',
    'fr': 'Japon',
    'it': 'Giappone',
    'es': 'Japón',
    'nl': 'Japan'
  },
  'DE': {
    'en': 'Germany',
    'ko': '독일',
    'ja': 'ドイツ',
    'de': 'Deutschland',
    'fr': 'Allemagne',
    'it': 'Germania',
    'es': 'Alemania',
    'nl': 'Duitsland'
  },
  'FR': {
    'en': 'France',
    'ko': '프랑스',
    'ja': 'フランス',
    'de': 'Frankreich',
    'fr': 'France',
    'it': 'Francia',
    'es': 'Francia',
    'nl': 'Frankrijk'
  },
  'NL': {
    'en': 'Netherlands & Belgium',
    'ko': '네덜란드·벨기에',
    'ja': 'オランダ・ベルギー',
    'de': 'Niederlande & Belgien',
    'fr': 'Pays-Bas & Belgique',
    'it': 'Paesi Bassi e Belgio',
    'es': 'Países Bajos y Bélgica',
    'nl': 'Nederland & België'
  },
  'EU': {
    'en': 'Europe (multi-country)',
    'ko': '유럽 (여러 나라)',
    'ja': 'ヨーロッパ（複数国）',
    'de': 'Europa (mehrere Länder)',
    'fr': 'Europe (plusieurs pays)',
    'it': 'Europa (più paesi)',
    'es': 'Europa (varios países)',
    'nl': 'Europa (meerdere landen)'
  }
};
  SF.HOMECOUNTRY = {'ko':'KR','ja':'JP','de':'DE','fr':'FR','nl':'NL','it':'EU','es':'EU','en':''};

  SF.I18N = {
    en: { advanced: "Advanced settings", sysfeeShort: "System usage fee", marketplace: "Marketplace", compareH: "Compare marketplaces", sharedInputs: "Your product", bestFirst: "Sorted by net profit", langName: 'English', languages: 'Languages', price: 'Sale price', shipping: 'Shipping charged to buyer', cost: 'Item cost', shipCost: 'Your shipping cost', category: 'Category', commission: 'Commission %', orders: 'Orders per month', vatStatus: 'VAT status', vatDeduct: 'VAT registered – VAT on fees is recoverable', vatCost: 'Not VAT registered – VAT on fees is a cost', otherPct: 'Other costs % (ads etc.)', otherCost: 'Other costs', vatOnFees: 'VAT on fees', targetProfit: 'Target profit (optional)', results: 'Results', feesTotal: 'Total fees', payout: 'Payout', profit: 'Net profit', margin: 'Margin', roi: 'ROI', breakEven: 'Break-even price', requiredPrice: 'Price for target profit', feeBreakdown: 'Fee breakdown', editableNote: 'Rates are prefilled from the official fee schedule and fully editable.', disclaimer: 'Estimates only. Verify current rates in your seller account.', updated: 'Updated', sources: 'Sources', otherCalcs: 'Other calculators', reset: 'Reset', feeTableH: 'Fee overview', faqH: 'FAQ', home: 'All calculators', ratesH: 'Rate',
      hubTitle: 'Marketplace Fee Calculators 2026 – TikTok Shop, Kaufland, Cdiscount, Fnac, bol, Qoo10, Rakuten, Coupang', hubDesc: 'Free fee and profit calculators for TikTok Shop EU, Kaufland, Cdiscount, Fnac, bol, Qoo10 Japan, Rakuten Ichiba and Coupang with 2026 rates, in 8 languages.', hubH1: 'Marketplace seller fee calculators', hubIntro: 'Free, no-signup fee and profit calculators for marketplaces the big tools ignore. 2026 rates are prefilled and editable: commission, VAT on fees, monthly plans spread per order, payout, net profit, margin and break-even price. Everything runs in your browser; nothing is uploaded.' },
    de: { advanced: "Erweiterte Einstellungen", sysfeeShort: "Systemnutzungsgebühr", marketplace: "Marktplatz", compareH: "Marktplätze vergleichen", sharedInputs: "Dein Produkt", bestFirst: "Nach Nettogewinn sortiert", langName: 'Deutsch', languages: 'Sprachen', price: 'Verkaufspreis', shipping: 'Versandkosten (vom Käufer gezahlt)', cost: 'Einkaufspreis', shipCost: 'Deine Versandkosten', category: 'Kategorie', commission: 'Provision %', orders: 'Bestellungen pro Monat', vatStatus: 'USt-Status', vatDeduct: 'Vorsteuerabzugsberechtigt – USt auf Gebühren ist erstattungsfähig', vatCost: 'Nicht vorsteuerabzugsberechtigt (z. B. Kleinunternehmer) – USt auf Gebühren ist Kosten', otherPct: 'Sonstige Kosten % (Ads etc.)', otherCost: 'Sonstige Kosten', vatOnFees: 'USt auf Gebühren', targetProfit: 'Zielgewinn (optional)', results: 'Ergebnis', feesTotal: 'Gebühren gesamt', payout: 'Auszahlung', profit: 'Nettogewinn', margin: 'Marge', roi: 'ROI', breakEven: 'Break-even-Preis', requiredPrice: 'Preis für Zielgewinn', feeBreakdown: 'Gebührenaufstellung', editableNote: 'Sätze sind aus der offiziellen Gebührentabelle vorausgefüllt und frei editierbar.', disclaimer: 'Nur Schätzung. Aktuelle Sätze bitte im Händlerkonto prüfen.', updated: 'Stand', sources: 'Quellen', otherCalcs: 'Weitere Rechner', reset: 'Zurücksetzen', feeTableH: 'Gebührenübersicht', faqH: 'Häufige Fragen', home: 'Alle Rechner', ratesH: 'Satz',
      hubTitle: 'Marktplatz-Gebührenrechner 2026 – TikTok Shop, Kaufland, Cdiscount, Fnac, bol, Qoo10, Rakuten, Coupang', hubDesc: 'Kostenlose Gebühren- und Gewinnrechner für TikTok Shop EU, Kaufland, Cdiscount, Fnac, bol, Qoo10 Japan, Rakuten Ichiba und Coupang mit Sätzen 2026, in 8 Sprachen.', hubH1: 'Gebührenrechner für Marktplatz-Händler', hubIntro: 'Kostenlose Gebühren- und Gewinnrechner ohne Anmeldung für Marktplätze, die große Tools ignorieren. Sätze 2026 vorausgefüllt und editierbar: Provision, USt auf Gebühren, Grundgebühr pro Bestellung umgelegt, Auszahlung, Nettogewinn, Marge und Break-even-Preis. Alles läuft im Browser, nichts wird hochgeladen.' },
    fr: { advanced: "Paramètres avancés", sysfeeShort: "Frais système", marketplace: "Marketplace", compareH: "Comparer les marketplaces", sharedInputs: "Votre produit", bestFirst: "Trié par bénéfice net", langName: 'Français', languages: 'Langues', price: 'Prix de vente', shipping: 'Frais de port facturés à l’acheteur', cost: 'Coût d’achat', shipCost: 'Vos frais d’expédition', category: 'Catégorie', commission: 'Commission %', orders: 'Commandes par mois', vatStatus: 'Statut TVA', vatDeduct: 'Assujetti à la TVA – TVA sur les frais récupérable', vatCost: 'Non assujetti (franchise en base) – TVA sur les frais = coût', otherPct: 'Autres coûts % (pub, etc.)', otherCost: 'Autres coûts', vatOnFees: 'TVA sur les frais', targetProfit: 'Bénéfice cible (optionnel)', results: 'Résultats', feesTotal: 'Total des frais', payout: 'Montant reversé', profit: 'Bénéfice net', margin: 'Marge', roi: 'ROI', breakEven: 'Prix d’équilibre', requiredPrice: 'Prix pour le bénéfice cible', feeBreakdown: 'Détail des frais', editableNote: 'Les taux sont préremplis d’après la grille officielle et entièrement modifiables.', disclaimer: 'Estimation uniquement. Vérifiez les taux en vigueur dans votre espace vendeur.', updated: 'Mise à jour', sources: 'Sources', otherCalcs: 'Autres calculateurs', reset: 'Réinitialiser', feeTableH: 'Grille des frais', faqH: 'Questions fréquentes', home: 'Tous les calculateurs', ratesH: 'Taux',
      hubTitle: 'Calculateurs de frais marketplace 2026 – TikTok Shop, Kaufland, Cdiscount, Fnac, bol, Qoo10, Rakuten, Coupang', hubDesc: 'Calculateurs gratuits de frais et de marge pour TikTok Shop UE, Kaufland, Cdiscount, Fnac, bol, Qoo10 Japon, Rakuten Ichiba et Coupang, taux 2026, en 8 langues.', hubH1: 'Calculateurs de frais pour vendeurs marketplace', hubIntro: 'Calculateurs gratuits et sans inscription pour les marketplaces ignorées par les gros outils. Taux 2026 préremplis et modifiables : commission, TVA sur les frais, abonnement ramené par commande, montant reversé, bénéfice net, marge et prix d’équilibre. Tout se calcule dans votre navigateur, rien n’est envoyé.' },
    it: { advanced: "Impostazioni avanzate", sysfeeShort: "Costo sistema", marketplace: "Marketplace", compareH: "Confronta i marketplace", sharedInputs: "Il tuo prodotto", bestFirst: "Ordinato per profitto netto", langName: 'Italiano', languages: 'Lingue', price: 'Prezzo di vendita', shipping: 'Spedizione addebitata all’acquirente', cost: 'Costo del prodotto', shipCost: 'Tuo costo di spedizione', category: 'Categoria', commission: 'Commissione %', orders: 'Ordini al mese', vatStatus: 'Regime IVA', vatDeduct: 'Partita IVA ordinaria – IVA sulle commissioni detraibile', vatCost: 'Regime forfettario / non detraibile – IVA sulle commissioni è un costo', otherPct: 'Altri costi % (ads ecc.)', otherCost: 'Altri costi', vatOnFees: 'IVA sulle commissioni', targetProfit: 'Profitto obiettivo (opzionale)', results: 'Risultati', feesTotal: 'Totale commissioni', payout: 'Importo accreditato', profit: 'Profitto netto', margin: 'Margine', roi: 'ROI', breakEven: 'Prezzo di pareggio', requiredPrice: 'Prezzo per il profitto obiettivo', feeBreakdown: 'Dettaglio commissioni', editableNote: 'Le aliquote sono precompilate dal listino ufficiale e modificabili.', disclaimer: 'Solo una stima. Verifica le aliquote attuali nel Seller Center.', updated: 'Aggiornato', sources: 'Fonti', otherCalcs: 'Altri calcolatori', reset: 'Reimposta', feeTableH: 'Tabella commissioni', faqH: 'Domande frequenti', home: 'Tutti i calcolatori', ratesH: 'Aliquota',
      hubTitle: 'Calcolatori commissioni marketplace 2026 – TikTok Shop, Kaufland, Cdiscount, Fnac, bol, Qoo10, Rakuten, Coupang', hubDesc: 'Calcolatori gratuiti di commissioni e profitto per TikTok Shop UE, Kaufland, Cdiscount, Fnac, bol, Qoo10 Giappone, Rakuten Ichiba e Coupang, aliquote 2026, in 8 lingue.', hubH1: 'Calcolatori di commissioni per venditori marketplace', hubIntro: 'Calcolatori gratuiti, senza registrazione, per i marketplace ignorati dai grandi strumenti. Aliquote 2026 precompilate e modificabili: commissione, IVA sulle commissioni, canone mensile ripartito per ordine, accredito, profitto netto, margine e prezzo di pareggio. Tutto gira nel browser, nulla viene inviato.' },
    es: { advanced: "Ajustes avanzados", sysfeeShort: "Tarifa de sistema", marketplace: "Marketplace", compareH: "Comparar marketplaces", sharedInputs: "Tu producto", bestFirst: "Ordenado por beneficio neto", langName: 'Español', languages: 'Idiomas', price: 'Precio de venta', shipping: 'Envío cobrado al comprador', cost: 'Coste del producto', shipCost: 'Tu coste de envío', category: 'Categoría', commission: 'Comisión %', orders: 'Pedidos al mes', vatStatus: 'Situación de IVA', vatDeduct: 'Con IVA deducible – el IVA de las tarifas se recupera', vatCost: 'Sin IVA deducible – el IVA de las tarifas es un coste', otherPct: 'Otros costes % (publicidad, etc.)', otherCost: 'Otros costes', vatOnFees: 'IVA sobre las tarifas', targetProfit: 'Beneficio objetivo (opcional)', results: 'Resultados', feesTotal: 'Total de tarifas', payout: 'Importe recibido', profit: 'Beneficio neto', margin: 'Margen', roi: 'ROI', breakEven: 'Precio de equilibrio', requiredPrice: 'Precio para el beneficio objetivo', feeBreakdown: 'Desglose de tarifas', editableNote: 'Las tarifas vienen precargadas de la tabla oficial y se pueden editar.', disclaimer: 'Solo una estimación. Comprueba las tarifas vigentes en tu cuenta de vendedor.', updated: 'Actualizado', sources: 'Fuentes', otherCalcs: 'Otras calculadoras', reset: 'Restablecer', feeTableH: 'Tabla de tarifas', faqH: 'Preguntas frecuentes', home: 'Todas las calculadoras', ratesH: 'Tarifa',
      hubTitle: 'Calculadoras de comisiones de marketplaces 2026 – TikTok Shop, Kaufland, Cdiscount, Fnac, bol, Qoo10, Rakuten, Coupang', hubDesc: 'Calculadoras gratuitas de comisiones y beneficio para TikTok Shop UE, Kaufland, Cdiscount, Fnac, bol, Qoo10 Japón, Rakuten Ichiba y Coupang con tarifas 2026, en 8 idiomas.', hubH1: 'Calculadoras de comisiones para vendedores de marketplaces', hubIntro: 'Calculadoras gratuitas y sin registro para los marketplaces que las grandes herramientas ignoran. Tarifas 2026 precargadas y editables: comisión, IVA sobre las tarifas, cuota mensual repartida por pedido, importe recibido, beneficio neto, margen y precio de equilibrio. Todo se calcula en tu navegador; no se envía nada.' },
    nl: { advanced: "Geavanceerde instellingen", sysfeeShort: "Systeemkosten", marketplace: "Marketplace", compareH: "Marketplaces vergelijken", sharedInputs: "Jouw product", bestFirst: "Gesorteerd op nettowinst", langName: 'Nederlands', languages: 'Talen', price: 'Verkoopprijs', shipping: 'Verzendkosten (betaald door koper)', cost: 'Inkoopprijs', shipCost: 'Jouw verzendkosten', category: 'Categorie', commission: 'Commissie %', orders: 'Bestellingen per maand', vatStatus: 'Btw-status', vatDeduct: 'Btw-plichtig – btw over kosten is aftrekbaar', vatCost: 'Niet btw-plichtig (bijv. KOR) – btw over kosten is een kostenpost', otherPct: 'Overige kosten % (ads etc.)', otherCost: 'Overige kosten', vatOnFees: 'Btw over kosten', targetProfit: 'Doelwinst (optioneel)', results: 'Resultaat', feesTotal: 'Totale kosten', payout: 'Uitbetaling', profit: 'Nettowinst', margin: 'Marge', roi: 'ROI', breakEven: 'Break-evenprijs', requiredPrice: 'Prijs voor doelwinst', feeBreakdown: 'Kostenoverzicht', editableNote: 'Tarieven zijn vooraf ingevuld op basis van de officiële tarievenlijst en aanpasbaar.', disclaimer: 'Alleen een schatting. Controleer de actuele tarieven in je verkoopaccount.', updated: 'Bijgewerkt', sources: 'Bronnen', otherCalcs: 'Andere calculators', reset: 'Reset', feeTableH: 'Tarievenoverzicht', faqH: 'Veelgestelde vragen', home: 'Alle calculators', ratesH: 'Tarief',
      hubTitle: 'Marketplace-commissiecalculators 2026 – TikTok Shop, Kaufland, Cdiscount, Fnac, bol, Qoo10, Rakuten, Coupang', hubDesc: 'Gratis commissie- en winstcalculators voor TikTok Shop EU, Kaufland, Cdiscount, Fnac, bol, Qoo10 Japan, Rakuten Ichiba en Coupang met tarieven 2026, in 8 talen.', hubH1: 'Commissiecalculators voor marketplace-verkopers', hubIntro: 'Gratis calculators zonder registratie voor marketplaces die de grote tools negeren. Tarieven 2026 vooraf ingevuld en aanpasbaar: commissie, btw over kosten, maandabonnement omgeslagen per bestelling, uitbetaling, nettowinst, marge en break-evenprijs. Alles draait in je browser; er wordt niets verstuurd.' },
    ja: { advanced: "詳細設定", sysfeeShort: "システム利用料", marketplace: "モール", compareH: "モールを比較", sharedInputs: "あなたの商品", bestFirst: "純利益順", langName: '日本語', languages: '言語', price: '販売価格', shipping: '送料（購入者負担）', cost: '仕入原価', shipCost: '送料（自己負担）', category: 'カテゴリ', commission: '販売手数料 %', orders: '月間注文数', vatStatus: '手数料にかかる税の扱い', vatDeduct: '課税事業者 – 手数料の税は控除できる', vatCost: '免税事業者など – 手数料の税は費用になる', otherPct: 'その他コスト %（広告など）', otherCost: 'その他コスト', vatOnFees: '手数料にかかる税', targetProfit: '目標利益（任意）', results: '計算結果', feesTotal: '手数料合計', payout: '入金額', profit: '純利益', margin: '利益率', roi: 'ROI', breakEven: '損益分岐価格', requiredPrice: '目標利益に必要な価格', feeBreakdown: '手数料内訳', editableNote: '料率は公式の手数料表をもとに自動入力され、自由に編集できます。', disclaimer: '概算です。最新の料率は管理画面でご確認ください。', updated: '更新日', sources: '出典', otherCalcs: '他の計算ツール', reset: 'リセット', feeTableH: '手数料一覧', faqH: 'よくある質問', home: '計算ツール一覧', ratesH: '料率',
      hubTitle: 'マーケットプレイス手数料計算ツール 2026｜TikTok Shop・Kaufland・Cdiscount・Fnac・bol・Qoo10・楽天市場・Coupang', hubDesc: 'TikTok Shop EU、Kaufland、Cdiscount、Fnac、bol、Qoo10、楽天市場、Coupang（クーパン）の手数料・利益を2026年料率で計算する無料ツール。8言語対応。', hubH1: 'マーケットプレイス出品者向け 手数料計算ツール', hubIntro: '大手ツールが扱わないマーケットプレイスの手数料・利益を、登録不要で計算できます。2026年の料率を自動入力（編集可）：手数料、手数料にかかる税、月額費用の1注文あたり按分、入金額、純利益、利益率、損益分岐価格。すべてブラウザ内で計算し、データは送信しません。' },
    ko: { advanced: "상세 설정", sysfeeShort: "시스템이용료", marketplace: "마켓", compareH: "마켓 비교", sharedInputs: "내 상품", bestFirst: "순이익순 정렬", langName: '한국어', languages: '언어', price: '판매가', shipping: '배송비(구매자 부담)', cost: '상품 원가', shipCost: '실제 배송비(판매자 부담)', category: '카테고리', commission: '판매수수료 %', orders: '월 주문 수', vatStatus: '부가세 처리', vatDeduct: '매입세액공제 가능(일반과세자) – 수수료 부가세 환급', vatCost: '공제 불가(간이과세·면세 등) – 수수료 부가세는 비용', otherPct: '기타 비용 %(광고 등)', otherCost: '기타 비용', vatOnFees: '수수료 부가세', targetProfit: '목표 이익(선택)', results: '계산 결과', feesTotal: '수수료 합계', payout: '정산 금액', profit: '순이익', margin: '마진율', roi: 'ROI', breakEven: '손익분기 판매가', requiredPrice: '목표 이익 달성 판매가', feeBreakdown: '수수료 내역', editableNote: '수수료율은 공식 수수료표 기준으로 자동 입력되며 직접 수정할 수 있습니다.', disclaimer: '참고용 추정치입니다. 정확한 요율은 판매자 센터에서 확인하세요.', updated: '업데이트', sources: '출처', otherCalcs: '다른 계산기', reset: '초기화', feeTableH: '수수료 안내', faqH: '자주 묻는 질문', home: '전체 계산기', ratesH: '요율',
      hubTitle: '마켓플레이스 수수료 계산기 2026 | TikTok Shop·Kaufland·Cdiscount·Fnac·bol·Qoo10·라쿠텐·쿠팡', hubDesc: 'TikTok Shop EU, Kaufland, Cdiscount, Fnac, bol, Qoo10 일본, 라쿠텐, 쿠팡의 수수료와 순이익을 2026년 요율로 계산하는 무료 도구. 8개 언어 지원.', hubH1: '마켓플레이스 셀러 수수료 계산기', hubIntro: '대형 툴이 다루지 않는 마켓플레이스의 수수료·순이익을 회원가입 없이 계산합니다. 2026년 요율 자동 입력(수정 가능): 판매수수료, 수수료 부가세, 월정액 주문당 배분, 정산금액, 순이익, 마진율, 손익분기 판매가. 모든 계산은 브라우저에서 처리되며 아무것도 전송되지 않습니다.' }
  };

  // Field factories. l = label key (market s.f[key] first, then common I18N[key]). u = 'cur' | '%' | ''.
  SF.F = {
    price: function (d) { return { k: 'price', l: 'price', t: 'num', u: 'cur', d: d }; },
    shipping: function (d) { return { k: 'shipping', l: 'shipping', t: 'num', u: 'cur', d: d }; },
    cost: function (d) { return { k: 'cost', l: 'cost', t: 'num', u: 'cur', d: d }; },
    shipCost: function (d) { return { k: 'shipCost', l: 'shipCost', t: 'num', u: 'cur', d: d }; },
    cat: function (values, d) { return { k: 'cat', l: 'category', t: 'sel', d: d, o: values.map(function (v, i) { return { v: v, l: i }; }), sets: 'commission' }; },
    commission: function (d) { return { k: 'commission', l: 'commission', t: 'num', u: '%', d: d, step: 0.1 }; },
    orders: function (d) { return { k: 'orders', l: 'orders', t: 'num', u: '', d: d, step: 1 }; },
    vat: function (rate) { return { k: 'vat', l: 'vatStatus', t: 'sel', d: '0', o: [{ l: 'vatDeduct', v: '0' }, { l: 'vatCost', v: String(rate) }] }; },
    other: function () { return { k: 'other', l: 'otherPct', t: 'num', u: '%', d: 0, step: 0.1 }; },
    target: function () { return { k: 'target', l: 'targetProfit', t: 'num', u: 'cur', d: 0 }; }
  };
})(typeof window !== 'undefined' ? window : global);
