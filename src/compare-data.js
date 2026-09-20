/* Country comparison groups. Only countries where several marketplaces compete are worth comparing. */
(function (root) {
  var SF = root.SF;
  SF.GROUPS = [
    {
      code: 'KR', currency: 'KRW', markets: ['coupang-kr', 'naver-kr', '11st-kr', 'gmarket-kr'],
      slug: { ko: 'korea-marketplace-fee-comparison', en: 'korea-marketplace-fee-comparison' },
      s: {
        ko: { title: '한국 마켓 수수료 비교 2026 | 쿠팡·네이버·11번가·G마켓 순이익 한눈에', desc: '상품 하나를 입력하면 쿠팡, 네이버 스마트스토어, 11번가, G마켓·옥션의 수수료·정산금액·순이익·마진율을 나란히 비교합니다. 2026년 요율 기준, 무료.', h1: '한국 마켓 수수료 비교 (2026년)', intro: '같은 상품을 어느 마켓에 올리는 게 남는지는 수수료율만 봐서는 알 수 없습니다. 쿠팡은 결제수수료가 분리됐고, 네이버는 판매수수료와 주문관리수수료 두 층이며, 11번가·G마켓은 배송비에 따로 수수료가 붙습니다. 판매가와 원가를 한 번만 입력하면 네 마켓의 순이익을 같은 기준으로 계산해 순서대로 보여줍니다.',
          notes: ['각 마켓의 카테고리를 골라야 정확합니다. 같은 상품이라도 마켓마다 카테고리 요율이 다릅니다.', '부가세는 일반과세자(매입세액공제 가능) 기준입니다. 간이과세자라면 각 계산기 페이지에서 옵션을 바꿔 확인하세요.', '월 서비스 이용료·서버이용료 등 고정비는 각 마켓의 기본 설정값과 월 주문 수 기준으로 주문 1건에 배분됩니다.', '광고비·쿠폰 부담·반품률은 포함되지 않습니다. 실제 마진은 이보다 낮습니다.'],
          faq: [{ q: '어느 마켓이 수수료가 가장 싼가요?', a: '카테고리에 따라 달라집니다. 명목 요율만 보면 G마켓·옥션(6.5~13%)이 낮고 11번가(7~13%)가 그다음이지만, 쿠팡은 결제수수료 2.9%와 부가세가 별도로 붙고 네이버는 판매수수료가 2.73%로 낮은 대신 주문관리수수료가 최대 3.63% 더해집니다. 실제 부담은 상품 카테고리와 배송비 설정에 따라 뒤집힙니다.' },
            { q: '배송비 처리가 왜 중요한가요?', a: '쿠팡과 네이버는 배송비를 포함한 결제금액 전체에 수수료를 매기고, 11번가와 G마켓은 판매가에 카테고리 요율을 적용한 뒤 배송비에 따로 3.3%를 매깁니다. 무료배송인지 유료배송인지에 따라 순위가 바뀝니다.' },
            { q: '고정비는 어떻게 반영되나요?', a: '쿠팡 월 서비스 이용료 55,000원, 11번가 서버이용료 77,000원 같은 고정비는 월 주문 수로 나눠 주문 1건당 비용으로 넣었습니다. 주문이 적을수록 고정비가 있는 마켓이 불리해집니다.' }] },
        en: { title: 'Korea Marketplace Fee Comparison 2026 – Coupang vs Naver', desc: 'Enter one product and compare fees, payout and net profit across Coupang, Naver SmartStore, 11st and Gmarket side by side. Free, 2026 rates.', h1: 'Korea Marketplace Fee Comparison (2026)', intro: 'Headline commission rates do not tell you where a product earns most in Korea. Coupang now shows its payment fee separately, Naver charges a sales commission plus an order management fee, and 11st and Gmarket charge shipping separately. Enter your price and cost once and see net profit on all four, ranked.',
          notes: ['Pick the right category per marketplace: rates differ between them for the same product.', 'VAT assumes a VAT-registered business that can deduct it. Switch the option on each calculator page if you are not.', 'Fixed costs such as monthly service or server fees are spread across the monthly order count each calculator defaults to.', 'Advertising, coupon funding and returns are not included, so real margins are lower.'],
          faq: [{ q: 'Which Korean marketplace is cheapest?', a: 'It depends on the category. On headline rates Gmarket/Auction (6.5–13 %) and 11st (7–13 %) look lowest, but Coupang adds a 2.9 % payment fee plus VAT, and Naver pairs a low 2.73 % sales commission with an order management fee of up to 3.63 %. The ranking flips with category and shipping setup.' },
            { q: 'Why does shipping matter so much?', a: 'Coupang and Naver charge fees on the full amount the customer paid including shipping, while 11st and Gmarket apply the category rate to the item price and charge 3.3 % on shipping separately.' },
            { q: 'How are fixed costs handled?', a: 'Monthly fees such as Coupang’s ₩55,000 service fee or 11st’s ₩77,000 server fee are divided by your monthly order count and shown per order. Fewer orders make marketplaces with fixed fees look worse.' }] }
      }
    },
    {
      code: 'JP', currency: 'JPY', markets: ['rakuten-jp', 'yahoo-jp', 'qoo10-jp'],
      slug: { ja: 'japan-marketplace-fee-comparison', en: 'japan-marketplace-fee-comparison' },
      s: {
        ja: { title: '日本モール手数料 比較 2026｜楽天市場・Yahoo!ショッピング・Qoo10の利益を並べて比較', desc: '商品を1つ入力するだけで、楽天市場・Yahoo!ショッピング・Qoo10の手数料、入金額、純利益、利益率を並べて比較。2026年の料率、無料。', h1: '日本モール手数料 比較（2026年）', intro: '同じ商品をどのモールに出すのが得かは、料率だけでは決まりません。楽天市場は月額出店料とシステム利用料の二層、Yahoo!ショッピングは2026年9月から月額10,000円と売上ロイヤリティ2.5%が新設、Qoo10は月額0円でカテゴリ別6〜10%。販売価格と原価を一度入力すれば、3モールの純利益を同じ条件で計算して順に並べます。',
          notes: ['モールごとにカテゴリを選ぶと精度が上がります。同じ商品でも料率は異なります。', '月額出店料などの固定費は、各モールの既定の月間注文数で1件あたりに按分しています。注文数を変えると順位が変わります。', '消費税は課税事業者（仕入税額控除できる）を前提にしています。', '広告費・ポイント上乗せ・返品率は含みません。実際の利益はこれより低くなります。'],
          faq: [{ q: '3モールで一番手数料が安いのはどこですか？', a: '販売規模によります。Qoo10は固定費0円で料率6〜10%のため小規模では有利です。楽天市場は月額25,000〜130,000円の固定費がかかる代わりに売上が伸びるほどシステム利用料の料率が下がります。Yahoo!ショッピングは2026年9月改定で月額10,000円＋ロイヤリティ2.5%になりました。' },
            { q: '固定費はどう反映されていますか？', a: '楽天の月額出店料、Yahoo!の月額システム利用料などを月間注文数で割り、1注文あたりのコストとして加えています。注文が少ないほど固定費のあるモールが不利になります。' },
            { q: 'ポイント原資も含まれますか？', a: '楽天のポイント原資1.0%とYahoo!のストアポイント原資1%を既定値として含めています。倍率を上げる施策を行う場合は各計算ページで数値を上げてください。' }] },
        en: { title: 'Japan Marketplace Fee Comparison 2026 – Rakuten vs Qoo10', desc: 'Enter one product and compare fees, payout and net profit across Rakuten Ichiba, Yahoo! Shopping and Qoo10 side by side. Free, 2026 rates.', h1: 'Japan Marketplace Fee Comparison (2026)', intro: 'Rates alone will not tell you where a product earns most in Japan. Rakuten Ichiba combines a monthly plan fee with a sales-linked system fee, Yahoo! Shopping added a ¥10,000 monthly fee and a 2.5 % royalty in September 2026, and Qoo10 has no monthly fee but charges 6–10 % by category. Enter price and cost once to rank all three by net profit.',
          notes: ['Choose the matching category on each marketplace for accurate numbers.', 'Fixed costs are spread across the default monthly order count of each calculator; changing that count changes the ranking.', 'Consumption tax assumes a taxable business that can deduct it.', 'Advertising, extra point multipliers and returns are excluded, so real margins are lower.'],
          faq: [{ q: 'Which Japanese marketplace has the lowest fees?', a: 'It depends on your volume. Qoo10 has no fixed fee and charges 6–10 %, which suits small sellers. Rakuten costs ¥25,000–130,000 per month but its system fee percentage falls as sales grow. Yahoo! Shopping moved to a ¥10,000 monthly fee plus a 2.5 % royalty in September 2026.' },
            { q: 'How are fixed costs treated?', a: 'Monthly plan and system fees are divided by the monthly order count and added per order. The fewer orders you have, the worse marketplaces with fixed fees look.' },
            { q: 'Are loyalty points included?', a: 'Yes, Rakuten’s 1.0 % point funding and Yahoo’s 1 % store point funding are included as defaults. Raise them on the individual calculator pages if you run higher multipliers.' }] }
      }
    },
    {
      code: 'DE', currency: 'EUR', markets: ['kaufland-de', 'otto-de', 'tiktok-eu'],
      slug: { de: 'marktplatz-gebuehren-vergleich-deutschland', en: 'germany-marketplace-fee-comparison' },
      s: {
        de: { title: 'Marktplatz-Gebühren Vergleich 2026 – Kaufland vs OTTO', desc: 'Ein Produkt eingeben und Gebühren, Auszahlung und Nettogewinn auf Kaufland, OTTO Market und TikTok Shop nebeneinander vergleichen. Kostenlos.', h1: 'Marktplatz-Gebühren Vergleich Deutschland (2026)', intro: 'Welcher Marktplatz sich lohnt, verrät der Provisionssatz allein nicht. Kaufland kostet 39,95 € Grundgebühr plus 7–16 % Provision, OTTO verlangt 99,90 € plus 5–22 % und zusätzlich 16 % auf die Versandkosten, TikTok Shop hat keine Grundgebühr und nimmt 9 %. Preis und Einkaufspreis einmal eingeben und der Nettogewinn wird für alle drei berechnet und sortiert.',
          notes: ['Wähle je Marktplatz die passende Kategorie – die Sätze unterscheiden sich deutlich.', 'Grundgebühren werden über die hinterlegte Zahl der Bestellungen pro Monat umgelegt. Bei wenigen Bestellungen verlieren Marktplätze mit hoher Grundgebühr.', 'Die USt-Einstellung geht von einem vorsteuerabzugsberechtigten Händler aus.', 'Werbekosten, Retouren und Rabatte sind nicht enthalten – die reale Marge liegt darunter.'],
          faq: [{ q: 'Welcher deutsche Marktplatz ist am günstigsten?', a: 'Das hängt von Kategorie und Bestellmenge ab. TikTok Shop hat keine Grundgebühr und pauschal 9 %, Kaufland liegt bei 39,95 € plus 7–16 %, OTTO bei 99,90 € plus 5–22 % und zusätzlich 16 % auf Versandkosten. Bei wenigen Bestellungen gewinnt fast immer der Marktplatz ohne Grundgebühr.' },
            { q: 'Warum ist die Bestellmenge so wichtig?', a: 'Die Grundgebühr wird auf die Bestellungen umgelegt: 99,90 € bei 20 Bestellungen sind 5 € pro Bestellung, bei 200 nur 0,50 €. Trage deine realistische Menge ein.' },
            { q: 'Sind die Versandkosten berücksichtigt?', a: 'Ja. Kaufland berechnet die Provision auf den Bruttopreis inklusive Versand, OTTO nimmt zusätzlich 16 % auf die Versandkosten, TikTok rechnet den Gesamtbetrag der Bestellung.' }] },
        en: { title: 'Germany Marketplace Fee Comparison 2026 – Kaufland vs OTTO', desc: 'Enter one product and compare fees, payout and net profit on Kaufland, OTTO Market and TikTok Shop side by side. Free, with 2026 rates.', h1: 'Germany Marketplace Fee Comparison (2026)', intro: 'Commission rates alone will not tell you which German marketplace pays best. Kaufland charges €39.95 base plus 7–16 %, OTTO charges €99.90 plus 5–22 % and an extra 16 % on shipping, and TikTok Shop has no base fee and takes 9 %. Enter your price and cost once to rank all three by net profit.',
          notes: ['Choose the matching category on each marketplace; rates differ a lot.', 'Base fees are spread over the monthly order count stored in each calculator. With few orders, high base fees hurt.', 'The VAT setting assumes a VAT-registered seller who can deduct it.', 'Advertising, returns and discounts are excluded, so real margins are lower.'],
          faq: [{ q: 'Which German marketplace is cheapest?', a: 'It depends on category and volume. TikTok Shop has no base fee and a flat 9 %, Kaufland is €39.95 plus 7–16 %, OTTO is €99.90 plus 5–22 % plus 16 % on shipping. At low order volumes the marketplace without a base fee almost always wins.' },
            { q: 'Why does order volume matter?', a: 'Base fees are divided across orders: €99.90 over 20 orders is €5 each, over 200 orders just €0.50. Enter your realistic monthly volume.' },
            { q: 'Is shipping included?', a: 'Yes. Kaufland charges commission on the gross price including shipping, OTTO adds 16 % on shipping, and TikTok charges on the full order amount.' }] }
      }
    },
    {
      code: 'FR', currency: 'EUR', markets: ['cdiscount-fr', 'fnac-fr', 'tiktok-eu'],
      slug: { fr: 'comparatif-frais-marketplaces-france', en: 'france-marketplace-fee-comparison' },
      s: {
        fr: { title: 'Comparatif frais marketplaces France 2026 – Cdiscount, Fnac', desc: 'Saisissez un produit et comparez frais, montant reversé et bénéfice net sur Cdiscount, Fnac Marketplace et TikTok Shop. Gratuit, taux 2026.', h1: 'Comparatif des frais marketplaces France (2026)', intro: 'Le taux de commission seul ne dit pas où un produit rapporte le plus. Cdiscount facture 39,99 € d’abonnement plus 5 à 20 %, Fnac environ 49,99 € plus 6 à 16 % selon l’état du produit, TikTok Shop n’a pas d’abonnement et prend 9 %. Entrez prix et coût une seule fois : le bénéfice net des trois est calculé et classé.',
          notes: ['Choisissez la catégorie correspondante sur chaque marketplace, les taux varient fortement.', 'Les abonnements sont répartis sur le nombre de commandes mensuelles enregistré dans chaque calculateur.', 'Le réglage TVA suppose un vendeur assujetti qui récupère la TVA.', 'Publicité, retours et remises ne sont pas inclus : la marge réelle est plus basse.'],
          faq: [{ q: 'Quelle marketplace française est la moins chère ?', a: 'Cela dépend de la catégorie et du volume. TikTok Shop n’a pas d’abonnement et prélève 9 %, Cdiscount demande 39,99 € plus 5 à 20 %, Fnac environ 49,99 € plus 6 à 16 %. À faible volume, l’absence d’abonnement l’emporte presque toujours.' },
            { q: 'Pourquoi le nombre de commandes compte-t-il ?', a: 'L’abonnement est réparti sur les commandes : 39,99 € sur 20 commandes font 2 € par commande, sur 200 seulement 0,20 €. Indiquez votre volume réel.' },
            { q: 'Les frais de port sont-ils pris en compte ?', a: 'Oui. Cdiscount calcule la commission sur le prix TTC frais de port inclus, Fnac ajoute des frais fixes par commande, et TikTok applique son taux au montant total payé par le client.' }] },
        en: { title: 'France Marketplace Fee Comparison 2026 – Cdiscount vs Fnac', desc: 'Enter one product and compare fees, payout and net profit on Cdiscount, Fnac Marketplace and TikTok Shop side by side. Free, with 2026 rates.', h1: 'France Marketplace Fee Comparison (2026)', intro: 'Commission rates alone will not tell you which French marketplace pays best. Cdiscount charges a €39.99 subscription plus 5–20 %, Fnac around €49.99 plus 6–16 % depending on product condition, and TikTok Shop has no subscription and takes 9 %. Enter price and cost once to rank all three by net profit.',
          notes: ['Choose the matching category on each marketplace; rates vary widely.', 'Subscriptions are spread across the monthly order count stored in each calculator.', 'The VAT setting assumes a VAT-registered seller who recovers VAT.', 'Advertising, returns and discounts are excluded, so real margins are lower.'],
          faq: [{ q: 'Which French marketplace is cheapest?', a: 'It depends on category and volume. TikTok Shop has no subscription and takes 9 %, Cdiscount is €39.99 plus 5–20 %, Fnac about €49.99 plus 6–16 %. At low volume, having no subscription almost always wins.' },
            { q: 'Why does order volume matter?', a: 'Subscriptions are divided across orders: €39.99 over 20 orders is €2 each, over 200 orders only €0.20. Enter your realistic volume.' },
            { q: 'Is shipping taken into account?', a: 'Yes. Cdiscount calculates commission on the price incl. VAT plus shipping, Fnac adds fixed per-order fees, and TikTok applies its rate to the full amount the customer paid.' }] }
      }
    }
  ];
})(typeof window !== 'undefined' ? window : global);
