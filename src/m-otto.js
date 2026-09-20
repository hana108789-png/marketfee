(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  SF.add({
    id: 'otto-de', currency: 'EUR', flag: '', platform: 'OTTO Market', region: 'DE', countries: ['DE'],
    slug: { en: 'otto-market-fee-calculator', de: 'otto-gebuehrenrechner' },
    fields: [F.price(59.99), F.shipping(4.99), F.cost(24), F.shipCost(4.5),
      F.cat(['5', '7', '8', '8', '9', '10', '12', '13', '15', '15', '16', '18', '19', '20'], '15'), F.commission(15),
      { k: 'shipFee', l: 'shipFee', t: 'num', u: '%', d: 16, step: 0.5 },
      { k: 'plan', l: 'plan', t: 'num', u: 'cur', d: 99.90, step: 0.1 },
      F.orders(80), F.vat(19), F.other(), F.target()],
    fees: function (v) {
      var gross = n(v.price) + n(v.shipping);
      var com = n(v.price) * n(v.commission) / 100, ship = n(v.shipping) * n(v.shipFee) / 100;
      var monthly = n(v.plan) / Math.max(1, n(v.orders));
      return [{ k: 'commission', a: com }, { k: 'shipFee', a: ship }, { k: 'monthly', a: monthly },
        { k: 'vatOnFees', a: (com + ship + monthly) * n(v.vat) / 100 }, { k: 'otherCost', a: gross * n(v.other) / 100 }];
    },
    sources: [{ n: 'profitkonsole: OTTO Marketplace Fees 2026', u: 'https://profitkonsole.de/en/otto-marketplace-fees' },
      { n: 'AMZ+ Consulting: Otto Gebühren 2026', u: 'https://amzplus-consulting.de/blog/otto-gebuehren-2026' },
      { n: 'plentyONE: Auf OTTO verkaufen – Gebühren & Guide', u: 'https://www.plentyone.com/de/blog/auf-otto-verkaufen' },
      { n: 'OTTO Market Partner (offiziell)', u: 'https://partners.otto.market/' }],
    s: {
      de: { title: 'OTTO Market Gebührenrechner 2026 – Provision und Gewinn', desc: 'Kostenloser OTTO Market Gebührenrechner: 5–22 % Provision, 16 % auf die Versandkosten des Käufers, 99,90 € Grundgebühr pro Bestellung.', h1: 'OTTO Market Gebührenrechner (2026)', intro: 'OTTO Market kostet 99,90 € netto Grundgebühr pro Monat plus eine Verkaufsprovision von 5 bis 22 % je nach Kategorie und Preisstufe, berechnet auf den Bruttoverkaufspreis. Auf die vom Kunden gezahlten Versandkosten kommen 16 %. Die Zahlungsgebühr von 2,7 % ist in der Provision bereits enthalten. Der Rechner legt die Grundgebühr auf deine Bestellungen um und zeigt Gebühren, Auszahlung und Nettogewinn.',
        cats: ['PC-Komponenten – 5 %', 'Unterhaltungselektronik – 7 %', 'Spielkonsolen – 8 %', 'Kleinteile & Beschläge – 8 %', 'Großgeräte – 9 %', 'Bürobedarf, Gartengeräte, Baby-Zubehör – 10 %', 'Kopfhörer, Smartwatches, Games – 12 %', 'Bad, DIY, Werkzeug, Gesundheit – 13 %', 'Küche, Haushalt, Deko, Lampen – 15 %', 'Tech-Zubehör, Sport, Garten & Tierbedarf – 15 %', 'Fitnessgeräte – 16 %', 'Möbel – 18 %', 'Teppiche, Rollos, Matratzen – 19 %', 'Schmuck – 20 %'],
        f: { shipFee: 'Provision auf Versandkosten %', plan: 'Grundgebühr netto/Monat' },
        fee: { commission: 'Verkaufsprovision', shipFee: 'Provision auf Versandkosten', monthly: 'Grundgebühr / Bestellung' },
        notes: ['Provision auf den Bruttoverkaufspreis (inkl. deutscher MwSt.), gestaffelt nach Kategorie und teils nach Preisstufe: 5 % bei PC-Komponenten bis 22 % bei Schmuck und Mode.', 'Auf die vom Kunden gezahlten Versandkosten fallen zusätzlich 16 % Provision an.', 'Die Zahlungsgebühr von 2,7 % ist in der Verkaufsprovision bereits enthalten und wird nicht separat berechnet.', 'Grundgebühr 99,90 € netto pro Monat, unabhängig vom Umsatz (Stand seit August 2024).', 'Bei einigen Kategorien sinkt der Prozentsatz mit steigendem Verkaufspreis – prüfe deinen genauen Satz im Partner-Portal.'],
        faq: [{ q: 'Was kostet der Verkauf auf OTTO Market?', a: '99,90 € netto Grundgebühr pro Monat plus 5 bis 22 % Verkaufsprovision je nach Kategorie. Elektronik und PC-Komponenten liegen bei 5–8 %, Möbel bei 17–19 %, Mode bei 14–19 % und Schmuck bei 18–22 %.' },
          { q: 'Worauf wird die Provision berechnet?', a: 'Auf den Bruttoverkaufspreis inklusive deutscher Mehrwertsteuer. Die vom Kunden gezahlten Versandkosten werden separat mit 16 % belastet.' },
          { q: 'Gibt es eine zusätzliche Zahlungsgebühr?', a: 'Nein. Die Zahlungsgebühr von 2,7 % ist bereits in der Verkaufsprovision enthalten, es kommt also nichts obendrauf.' },
          { q: 'Lohnt sich OTTO bei wenigen Bestellungen?', a: 'Die Grundgebühr von 99,90 € fällt unabhängig vom Umsatz an. Bei 20 Bestellungen im Monat sind das 5 € pro Bestellung, bei 200 nur 0,50 €. Trage deine realistische Bestellzahl ein, um den echten Effekt zu sehen.' }] },
      en: { title: 'OTTO Market Fee Calculator 2026 – Commission and Net Profit', desc: 'Free OTTO Market seller fee calculator: 5–22 % category commission, 16 % on the shipping your buyer pays, €99.90 base fee per order, VAT and payout.', h1: 'OTTO Market Fee Calculator (2026)', intro: 'OTTO Market costs €99.90 net per month plus a sales commission of 5 to 22 % depending on category and price tier, charged on the gross selling price. Shipping paid by the customer is charged a separate 16 %. The 2.7 % payment fee is already inside the commission. The calculator spreads the base fee over your orders and shows fees, payout and net profit.',
        cats: ['PC components – 5 %', 'Consumer electronics – 7 %', 'Game consoles – 8 %', 'Small parts & fittings – 8 %', 'Large appliances – 9 %', 'Office supplies, garden power tools, baby accessories – 10 %', 'Headphones, smartwatches, games – 12 %', 'Bathroom, DIY, tools, health – 13 %', 'Kitchen, household, decor, lighting – 15 %', 'Tech accessories, sports, garden & pet – 15 %', 'Fitness equipment – 16 %', 'Furniture – 18 %', 'Carpets, blinds, mattresses – 19 %', 'Jewellery – 20 %'],
        f: { shipFee: 'Commission on shipping %', plan: 'Base fee net/month' },
        fee: { commission: 'Sales commission', shipFee: 'Commission on shipping', monthly: 'Base fee per order' },
        notes: ['Commission is charged on the gross selling price including German VAT, tiered by category and sometimes by price: 5 % for PC components up to 22 % for jewellery and fashion.', 'Shipping costs paid by the customer carry an additional 16 % commission.', 'The 2.7 % payment fee is already included in the sales commission and is not charged separately.', 'The base fee is €99.90 net per month regardless of revenue (in force since August 2024).', 'In several categories the percentage falls as the selling price rises – check your exact rate in the partner portal.'],
        faq: [{ q: 'What does selling on OTTO Market cost?', a: '€99.90 net per month plus a 5–22 % sales commission by category. Electronics and PC components sit at 5–8 %, furniture at 17–19 %, clothing at 14–19 % and jewellery at 18–22 %.' },
          { q: 'What is the commission calculated on?', a: 'The gross selling price including German VAT. Shipping paid by the customer is charged separately at 16 %.' },
          { q: 'Is there an extra payment fee?', a: 'No. The 2.7 % payment fee is already part of the sales commission, so nothing is added on top.' },
          { q: 'Is OTTO worth it with few orders?', a: 'The €99.90 base fee is charged whatever you sell. At 20 orders a month that is €5 per order; at 200 orders it is €0.50. Enter your realistic order count to see the true effect.' }] }
    }
  });
})(typeof window !== 'undefined' ? window : global);
