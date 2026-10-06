(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n, SHIP = 600;   // default parcel cost when the seller ships

  // Referral fee per unit on the total the customer pays (price + shipping, tax included).
  // Category value 'top+low+mid+cap+excess': with low = 1 the first ¥750 band is 5 % and the fee is
  // at least ¥30; mid > 0 adds an 8.4 % band up to mid; then the rate (commission field, prefilled
  // from top) applies to the whole amount, or only up to cap with excess % above it when cap > 0.
  // Media has no ¥750 band and no minimum. Rates after the 1 April 2026 revision (+0.4 pt over ¥750).
  function referral(v, total) {
    var p = String(v.cat).split('+').map(Number), low = p[1], mid = p[2], cap = p[3], excess = p[4];
    var top = n(v.commission), fee;
    if (low && total <= 750) fee = total * 0.05;
    else if (mid && total <= mid) fee = total * 0.084;
    else if (cap && total > cap) fee = cap * top / 100 + (total - cap) * excess / 100;
    else fee = total * top / 100;
    return low ? Math.max(30, fee) : fee;
  }

  SF.add({
    id: 'amazon-jp', currency: 'JPY', flag: '', platform: 'Amazon Japan', region: 'JP', countries: ['JP'], names: { ja: 'Amazon', ko: '아마존 재팬' }, primary: ['fm', 'plan'],
    slug: { en: 'amazon-japan-fee-calculator', ja: 'amazon-fee-calculator', ko: 'amazon-japan-fee-calculator' },
    fields: [F.price(3980), F.shipping(0), F.cost(1800), F.shipCost(SHIP),
      F.cat(['8.4+1+0+0+0', '10.4+1+0+0+0', '10.4+1+1500+0+0', '15.4+1+1500+0+0', '12.4+1+2500+3000+8.4', '12.4+1+0+3000+8.4', '12.4+1+0+7500+6.4', '10.4+1+0+10000+6.4', '15.4+1+0+0+0', '15.4+0+0+0+0', '6.9+1+0+0+0'], '15.4+1+0+0+0'),
      F.commission(15.4),
      // Fulfilment: '0' = seller ships; otherwise FBA fee per unit 'over ¥1,000+¥1,000 or less' for that size tier (tax incl.)
      { k: 'fm', l: 'fm', t: 'sel', d: '0', cols: ['fbaHi', 'fbaLo'], o: [{ l: 'fm0', v: '0' },
        { l: 'fbaS', v: '288+222' }, { l: 'fbaStd', v: '318+252' }, { l: 'std20', v: '410+344' }, { l: 'std30', v: '415+358' }, { l: 'std40', v: '420+371' }, { l: 'std50', v: '425+379' }, { l: 'std60', v: '430+391' }, { l: 'std80', v: '472+427' }, { l: 'std100', v: '532+466' },
        { l: 'big60', v: '589+523' }, { l: 'big80', v: '624+558' }, { l: 'big100', v: '675+609' }, { l: 'big120', v: '781+715' }, { l: 'big140', v: '1020+954' }, { l: 'big160', v: '1100+1034' }, { l: 'big180', v: '1532+1466' }, { l: 'big200', v: '1756+1690' },
        { l: 'xl200', v: '2755+2689' }, { l: 'xl220', v: '3573+3507' }, { l: 'xl240', v: '4496+4430' }, { l: 'xl260', v: '5625+5559' }] },
      { k: 'plan', l: 'plan', t: 'sel', d: 'p', o: [{ l: 'pro', v: 'p' }, { l: 'ind', v: 'i' }] },
      F.vat(10), F.orders(100), F.other(),
      { k: 'fbaHi', l: 'fbaHi', t: 'num', u: 'cur', d: 0 }, { k: 'fbaLo', l: 'fbaLo', t: 'num', u: 'cur', d: 0 }, F.target()],
    fees: function (v) {
      var base = n(v.price) + n(v.shipping), ref = referral(v, base);
      // Professional: ¥4,900 a month spread over orders; Individual: ¥100 per unit. Both ex tax, like the referral fee.
      var plan = v.plan === 'i' ? 100 : 4900 / Math.max(1, n(v.orders));
      var fba = String(v.fm) !== '0' ? (n(v.price) > 1000 ? n(v.fbaHi) : n(v.fbaLo)) : 0;   // FBA fees include tax
      return [{ k: 'referral', a: ref }, { k: 'plan', a: plan }, { k: 'fba', a: fba }, { k: 'vatOnFees', a: (ref + plan) * n(v.vat) / 100 }, { k: 'otherCost', a: base * n(v.other) / 100 }];
    },
    derive: function (v, k) {
      if (k !== undefined && k !== 'fm') return;
      var p = String(v.fm).split('+');
      v.fbaHi = n(p[0]); v.fbaLo = n(p[1]);
      // Amazon ships FBA orders; Prime delivery is free to the buyer.
      if (k === 'fm' && String(v.fm) !== '0') { v.shipping = 0; v.shipCost = 0; }
      else if (k === 'fm' && !n(v.shipCost)) v.shipCost = SHIP;
    },
    sources: [{ n: 'Amazon出品サービス：料金プラン（公式）', u: 'https://sell.amazon.co.jp/pricing' }, { n: 'GoalTech：Amazon FBA手数料 2026（4/1改定）', u: 'https://blog.goaltech.co.jp/articles/17/' }],
    s: {
      en: { title: 'Amazon Japan Fee Calculator 2026 – Referral & FBA Fees', desc: 'Free Amazon.co.jp fee calculator with April 2026 rates: referral fees by category (5–15.4 %), FBA fees by size, selling plan, payout and net profit.', h1: 'Amazon Japan Fee Calculator (2026)', intro: 'Amazon.co.jp charges a referral fee on every sale: 5 % when the total is ¥750 or less, otherwise mostly 8.4–15.4 % by category, with a ¥30 minimum. FBA adds a fulfillment fee by size and weight. Pick a category and how you ship; the calculator shows payout, net profit and break-even price at the rates revised on 1 April 2026.',
        cats: ['Electronics, cameras, computers, game consoles, small & large appliances – 8.4 %', 'Home appliances, musical instruments, sports, automotive & tires, toys – 10.4 %', 'Beauty, health, grocery & drinks, medical supplies – 8.4 % to 10.4 %', 'Pet supplies, baby products – 8.4 % to 15.4 %', 'Clothing & accessories – 8.4 % to 12.4 %', 'Eyewear – 12.4 %', 'Shoes, bags & luggage – 12.4 % (6.4 % on the part over ¥7,500)', 'Jewelry – 10.4 % (6.4 % on the part over ¥10,000)', 'Home & kitchen, stationery, DIY, furniture, garden, industrial, watches, everything else – 15.4 %', 'Books, music, DVDs, software, video games – 15.4 % (no minimum)', 'Beer – 6.9 %'],
        f: { commission: 'Referral fee %', fm: 'Fulfilment', plan: 'Selling plan', fbaHi: 'FBA fee per unit (price over ¥1,000)', fbaLo: 'FBA fee per unit (price ¥1,000 or less)' },
        o: { pro: 'Professional (¥4,900/month)', ind: 'Individual (¥100 per item)', fm0: 'Seller ships (FBM)', fbaS: 'FBA small (25×18×2 cm, ≤ 250 g)', fbaStd: 'FBA standard (35×30×3.3 cm, ≤ 1 kg)', std20: 'FBA standard (sides ≤ 20 cm, ≤ 2 kg)', std30: 'FBA standard (≤ 30 cm, ≤ 2 kg)', std40: 'FBA standard (≤ 40 cm, ≤ 2 kg)', std50: 'FBA standard (≤ 50 cm, ≤ 2 kg)', std60: 'FBA standard (≤ 60 cm, ≤ 2 kg)', std80: 'FBA standard (≤ 80 cm, ≤ 5 kg)', std100: 'FBA standard (≤ 100 cm, ≤ 9 kg)', big60: 'FBA oversize (≤ 60 cm, ≤ 2 kg)', big80: 'FBA oversize (≤ 80 cm, ≤ 5 kg)', big100: 'FBA oversize (≤ 100 cm, ≤ 10 kg)', big120: 'FBA oversize (≤ 120 cm, ≤ 15 kg)', big140: 'FBA oversize (≤ 140 cm, ≤ 20 kg)', big160: 'FBA oversize (≤ 160 cm, ≤ 25 kg)', big180: 'FBA oversize (≤ 180 cm, ≤ 30 kg)', big200: 'FBA oversize (≤ 200 cm, ≤ 40 kg)', xl200: 'FBA supersize (≤ 200 cm, ≤ 50 kg)', xl220: 'FBA supersize (≤ 220 cm, ≤ 50 kg)', xl240: 'FBA supersize (≤ 240 cm, ≤ 50 kg)', xl260: 'FBA supersize (≤ 260 cm, ≤ 50 kg)' },
        fee: { referral: 'Referral fee', plan: 'Selling plan (per unit)', fba: 'FBA fulfillment fee' },
        notes: ['Referral fee = total per unit (item price + shipping, tax included) × category rate. ¥750 or less: 5 % in most categories; minimum ¥30 (none for books, music, DVDs and video games).', 'Since 1 April 2026 rates over ¥750 are 0.4 points higher in every category (e.g. 8 % → 8.4 %). Clothing, shoes, bags and jewelry charge a lower rate on the part above a threshold.', 'The referral fee is quoted ex tax; 10 % consumption tax is added. FBA fees include tax. Professional plan ¥4,900/month (ex tax), Individual ¥100 per item.', 'FBA fees are lower for items priced ¥1,000 or less. Monthly storage fees (by volume, days and season) are not included.'],
        faq: [{ q: 'What is the Amazon Japan referral fee?', a: 'Mostly 8.4–15.4 % by category after the April 2026 revision, and 5 % when the total per unit is ¥750 or less. The minimum is ¥30; books, music, DVDs and video games are 15.4 % with no minimum.' }, { q: 'How much is FBA in Japan?', a: 'The fulfillment fee depends on size, weight and price: ¥288 for small items (¥222 if priced ¥1,000 or less) and ¥318 (¥252) for standard items up to 35×30×3.3 cm and 1 kg. Fees include tax; storage is charged separately.' }, { q: 'Professional or Individual plan?', a: 'Professional costs ¥4,900 a month, Individual ¥100 per item sold, so Professional pays off from 49 items a month.' }] },
      ja: { title: 'Amazon 手数料計算ツール 2026｜販売手数料・FBA手数料・利益を自動計算', desc: 'Amazon.co.jpの販売手数料（カテゴリー別5〜15.4%、2026年4月改定後）、FBA配送代行手数料、大口・小口出品の料金を反映し、入金額・純利益・利益率・損益分岐価格を無料で計算。', h1: 'Amazon 手数料計算ツール（2026年版）', intro: 'Amazon.co.jpでは、売れるたびにカテゴリー別の販売手数料がかかります。売上合計750円以下は5%、それ以外は8.4〜15.4%が中心で、最低30円です。FBAを使うとサイズ・重量別の配送代行手数料が加わります。カテゴリーと配送方法を選ぶだけで、2026年4月1日改定後の料率で入金額・純利益・損益分岐価格を計算します。',
        cats: ['家電・カメラ・パソコン・ゲーム機・小型/大型家電 – 8.4%', 'ホーム家電・住環境家電・楽器・スポーツ・カー用品・タイヤ・おもちゃ – 10.4%', 'ビューティー・ヘルス・食品・飲料・医療用品 – 8.4%〜10.4%', 'ペット用品・ベビー&マタニティ – 8.4%〜15.4%', '服&ファッション小物 – 8.4%〜12.4%', 'メガネ – 12.4%', 'シューズ・バッグ – 12.4%（7,500円を超える部分は6.4%）', 'ジュエリー – 10.4%（1万円を超える部分は6.4%）', 'ホーム&キッチン・文房具・DIY・家具・ガーデン・産業用品・腕時計・その他 – 15.4%', '本・ミュージック・DVD・PCソフト・TVゲーム – 15.4%（最低手数料なし）', 'ビール – 6.9%'],
        f: { commission: '販売手数料率 %', fm: '配送方法', plan: '出品プラン', fbaHi: 'FBA配送代行手数料（1,000円超）', fbaLo: 'FBA配送代行手数料（1,000円以下）' },
        o: { pro: '大口出品（月額4,900円）', ind: '小口出品（1点100円）', fm0: '自社発送', fbaS: 'FBA 小型（25×18×2cm・250g以下）', fbaStd: 'FBA 標準（35×30×3.3cm・1kg以下）', std20: 'FBA 標準（3辺合計20cm・2kg以下）', std30: 'FBA 標準（30cm・2kg以下）', std40: 'FBA 標準（40cm・2kg以下）', std50: 'FBA 標準（50cm・2kg以下）', std60: 'FBA 標準（60cm・2kg以下）', std80: 'FBA 標準（80cm・5kg以下）', std100: 'FBA 標準（100cm・9kg以下）', big60: 'FBA 大型（60cm・2kg以下）', big80: 'FBA 大型（80cm・5kg以下）', big100: 'FBA 大型（100cm・10kg以下）', big120: 'FBA 大型（120cm・15kg以下）', big140: 'FBA 大型（140cm・20kg以下）', big160: 'FBA 大型（160cm・25kg以下）', big180: 'FBA 大型（180cm・30kg以下）', big200: 'FBA 大型（200cm・40kg以下）', xl200: 'FBA 特大型（200cm・50kg以下）', xl220: 'FBA 特大型（220cm・50kg以下）', xl240: 'FBA 特大型（240cm・50kg以下）', xl260: 'FBA 特大型（260cm・50kg以下）' },
        fee: { referral: '販売手数料', plan: '出品プラン料金（按分）', fba: 'FBA配送代行手数料' },
        notes: ['販売手数料 ＝ 商品1点あたりの売上合計（商品価格＋配送料、税込）× カテゴリー別料率。750円以下は多くのカテゴリーで5%、最低30円（本・CD・DVD・TVゲームは最低なし）。', '2026年4月1日の改定で、750円を超える販売手数料率は全カテゴリーで0.4ポイント上がりました（例：8%→8.4%）。服・シューズ・バッグ・ジュエリーは一定額を超える部分に低い料率がかかります。', '販売手数料は税抜で、消費税10%が別途かかります。FBA配送代行手数料は税込。大口出品は月額4,900円（税抜）、小口出品は1点100円。', 'FBA配送代行手数料は商品価格1,000円以下だと安くなります。在庫保管手数料（体積・日数・時期で変動）は含みません。'],
        faq: [{ q: 'Amazonの販売手数料は何%ですか？', a: '2026年4月の改定後は、カテゴリー別に8.4〜15.4%が中心で、商品1点あたりの売上合計が750円以下なら5%です。最低30円。本・CD・DVD・TVゲームは15.4%で最低手数料はありません。' }, { q: 'FBAの手数料はいくらですか？', a: '配送代行手数料はサイズ・重量と価格で決まり、小型は288円（1,000円以下は222円）、標準（35×30×3.3cm・1kg以下）は318円（252円）からです。税込。ほかに在庫保管手数料がかかります。' }, { q: '大口出品と小口出品、どちらが得ですか？', a: '大口出品は月額4,900円、小口出品は1点100円なので、月49点以上売るなら大口出品が得です。' }, { q: '販売手数料に消費税はかかりますか？', a: 'かかります。販売手数料は税抜表示で、消費税10%が加わります。課税事業者は仕入税額控除できますが、免税事業者は費用になります。FBA配送代行手数料は税込表示です。' }] },
      ko: { title: '아마존 재팬 수수료 계산기 2026 | 판매수수료·FBA 수수료·순이익', desc: '아마존 일본(Amazon.co.jp) 카테고리별 판매수수료(5~15.4%, 2026년 4월 개정), FBA 배송대행 수수료, 대량·소량 출품 요금을 반영해 정산금·순이익·손익분기 판매가를 무료로 계산합니다.', h1: '아마존 재팬 수수료 계산기 (2026년)', intro: '아마존 일본(Amazon.co.jp)은 팔릴 때마다 카테고리별 판매수수료가 붙습니다. 판매금액 750엔 이하는 5%, 그 외는 8.4~15.4%가 중심이고 최저 30엔입니다. FBA를 쓰면 사이즈·무게별 배송대행 수수료가 더해집니다. 카테고리와 배송 방식만 고르면 2026년 4월 1일 개정 요율로 엔화 기준 정산금·순이익·손익분기 판매가를 계산합니다.',
        cats: ['가전·카메라·PC·게임기·소형/대형 가전 – 8.4%', '홈 가전·악기·스포츠·자동차용품·타이어·장난감 – 10.4%', '뷰티·헬스·식품·음료·의료용품 – 8.4%~10.4%', '반려동물용품·유아용품 – 8.4%~15.4%', '의류·패션 잡화 – 8.4%~12.4%', '안경 – 12.4%', '신발·가방 – 12.4%(7,500엔 초과분은 6.4%)', '주얼리 – 10.4%(1만 엔 초과분은 6.4%)', '홈&키친·문구·DIY·가구·가든·산업용품·시계·기타 – 15.4%', '도서·음악·DVD·PC 소프트·게임 – 15.4%(최저 수수료 없음)', '맥주 – 6.9%'],
        f: { commission: '판매수수료율 %', fm: '배송 방식', plan: '출품 플랜', fbaHi: 'FBA 배송대행 수수료 (1,000엔 초과)', fbaLo: 'FBA 배송대행 수수료 (1,000엔 이하)' },
        o: { pro: '대량 출품 (월 4,900엔)', ind: '소량 출품 (1점당 100엔)', fm0: '직접 배송 (자사 발송)', fbaS: 'FBA 소형 (25×18×2cm·250g 이하)', fbaStd: 'FBA 표준 (35×30×3.3cm·1kg 이하)', std20: 'FBA 표준 (세 변 합 20cm·2kg 이하)', std30: 'FBA 표준 (30cm·2kg 이하)', std40: 'FBA 표준 (40cm·2kg 이하)', std50: 'FBA 표준 (50cm·2kg 이하)', std60: 'FBA 표준 (60cm·2kg 이하)', std80: 'FBA 표준 (80cm·5kg 이하)', std100: 'FBA 표준 (100cm·9kg 이하)', big60: 'FBA 대형 (60cm·2kg 이하)', big80: 'FBA 대형 (80cm·5kg 이하)', big100: 'FBA 대형 (100cm·10kg 이하)', big120: 'FBA 대형 (120cm·15kg 이하)', big140: 'FBA 대형 (140cm·20kg 이하)', big160: 'FBA 대형 (160cm·25kg 이하)', big180: 'FBA 대형 (180cm·30kg 이하)', big200: 'FBA 대형 (200cm·40kg 이하)', xl200: 'FBA 특대형 (200cm·50kg 이하)', xl220: 'FBA 특대형 (220cm·50kg 이하)', xl240: 'FBA 특대형 (240cm·50kg 이하)', xl260: 'FBA 특대형 (260cm·50kg 이하)' },
        fee: { referral: '판매수수료', plan: '출품 플랜 요금 (배분)', fba: 'FBA 배송대행 수수료' },
        notes: ['판매수수료 = 상품 1점당 판매 합계(상품가 + 배송비, 소비세 포함) × 카테고리 요율. 750엔 이하는 대부분 카테고리에서 5%, 최저 30엔(도서·음악·DVD·게임은 최저 없음).', '2026년 4월 1일 개정으로 750엔을 넘는 판매수수료율이 모든 카테고리에서 0.4%포인트 올랐습니다(예: 8% → 8.4%). 의류·신발·가방·주얼리는 일정 금액을 넘는 부분에 낮은 요율이 붙습니다.', '판매수수료는 세금 별도로 소비세 10%가 따로 붙고, FBA 배송대행 수수료는 세금 포함입니다. 대량 출품 월 4,900엔(세금 별도), 소량 출품 1점당 100엔.', 'FBA 배송대행 수수료는 상품가 1,000엔 이하이면 더 쌉니다. 재고 보관 수수료(부피·일수·시기별)는 포함하지 않았습니다.'],
        faq: [{ q: '아마존 재팬 판매수수료는 몇 %인가요?', a: '2026년 4월 개정 후 카테고리별 8.4~15.4%가 중심이고, 상품 1점당 판매 합계가 750엔 이하면 5%입니다. 최저 30엔이며, 도서·음악·DVD·게임은 15.4%에 최저 수수료가 없습니다.' }, { q: 'FBA 수수료는 얼마인가요?', a: '배송대행 수수료는 사이즈·무게와 상품가로 정해집니다. 소형 288엔(1,000엔 이하 222엔), 표준(35×30×3.3cm·1kg 이하) 318엔(252엔)부터이고 세금 포함입니다. 재고 보관 수수료는 별도입니다.' }, { q: '대량 출품과 소량 출품 중 어느 쪽이 유리한가요?', a: '대량 출품은 월 4,900엔, 소량 출품은 1점당 100엔이라 한 달에 49점 이상 팔면 대량 출품이 유리합니다.' }] }
    }
  });
})(typeof window !== 'undefined' ? window : global);
