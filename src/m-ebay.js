(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;

  // Final value fee on the total amount of the sale per item (price + shipping + sales tax).
  // Category value 'rate+threshold+rate2+mode' (the first rate comes from the editable commission field):
  //   t  tiered: rate up to threshold, rate2 on the part above
  //   s  switch: rate2 on the whole amount once the total is over threshold
  //   w  watches: rate up to $1,000, rate2 up to $7,500, 3 % above
  //   k  sneakers: rate2 with no per-order fee from threshold, otherwise rate
  function fvf(v, total) {
    var p = String(v.cat).split('+'), r = n(v.commission), T = Number(p[1]), r2 = Number(p[2]), mode = p[3];
    if (mode === 's') return { a: total * (total > T ? r2 : r) / 100, order: true };
    if (mode === 'w') return { a: (Math.min(total, 1000) * r + Math.max(0, Math.min(total, 7500) - 1000) * r2 + Math.max(0, total - 7500) * 3) / 100, order: true };
    if (mode === 'k') return total >= T ? { a: total * r2 / 100, order: false } : { a: total * r / 100, order: true };
    return { a: (Math.min(total, T) * r + Math.max(0, total - T) * r2) / 100, order: true };
  }

  SF.add({
    id: 'ebay-us', currency: 'USD', flag: '', platform: 'eBay', region: 'US', countries: ['US'], names: { ko: '이베이', ja: 'eBay' }, primary: ['tax', 'intl'],
    slug: { en: 'ebay-fee-calculator', ko: 'ebay-fee-calculator', ja: 'ebay-fee-calculator' },
    fields: [F.price(49.99), F.shipping(0), F.cost(15), F.shipCost(10),
      F.cat(['13.6+7500+2.35+t', '15.3+7500+2.35+t', '13.25+7500+2.35+t', '6.7+7500+2.35+t', '15+5000+9+s', '15+2000+9+s', '15+1000+6.5+w', '13.6+150+8+k'], '13.6+7500+2.35+t'),
      F.commission(13.6),
      { k: 'tax', l: 'tax', t: 'num', u: '%', d: 0, step: 0.1 },
      { k: 'intl', l: 'intl', t: 'sel', d: '0', o: [{ l: 'intl0', v: '0' }, { l: 'intlUS', v: '1.65' }, { l: 'intlKR', v: '1.45' }, { l: 'intlJP', v: '1.35' }] },
      { k: 'fx', l: 'fx', t: 'sel', d: '0', o: [{ l: 'fx0', v: '0' }, { l: 'fx3', v: '3' }] },
      F.other(), F.target()],
    fees: function (v) {
      var sale = n(v.price) + n(v.shipping), total = sale * (1 + n(v.tax) / 100);   // eBay remits the sales tax but charges on it
      var f = fvf(v, total), order = f.order ? (total > 10 ? 0.4 : 0.3) : 0;
      var intl = total * n(v.intl) / 100, other = sale * n(v.other) / 100;
      var fx = (sale - f.a - order - intl - other) * n(v.fx) / 100;   // built into the payout exchange rate
      return [{ k: 'fvf', a: f.a }, { k: 'perOrder', a: order }, { k: 'intlFee', a: intl }, { k: 'fx', a: fx }, { k: 'otherCost', a: other }];
    },
    sources: [{ n: 'eBay: Selling fees (official)', u: 'https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822' }, { n: 'eBay: International fees for eBay global sellers (official)', u: 'https://www.ebay.com/help/selling/fees-credits-invoices/international-fees-ebay-global-sellers?id=5224' }],
    s: {
      en: { title: 'eBay Fee Calculator 2026 – Final Value Fee, Payout, Profit', desc: 'Free eBay fee calculator, 2026 rates: 13.6 % final value fee on the total incl. shipping and tax, per-order and international fees, payout and profit.', h1: 'eBay Fee Calculator (2026)', intro: 'eBay charges a final value fee on the total the buyer pays – item price, shipping and sales tax – at 13.6 % in most categories, plus $0.30 or $0.40 per order. Sales to buyers abroad add an international fee. Pick a category and where you are registered; the calculator shows payout, net profit and break-even price.',
        cats: ['Most categories – 13.6 %', 'Books & magazines, movies & TV, music – 15.3 %', 'Coins & paper money, trading cards, comics, collectible card games – 13.25 %', 'Guitars & basses – 6.7 %', 'Jewelry (except watches) – 15 % (9 % if the total is over $5,000)', 'Women’s bags & handbags – 15 % (9 % if the total is over $2,000)', 'Watches, parts & accessories – 15 % (6.5 % from $1,000, 3 % from $7,500)', 'Athletic sneakers – 13.6 % (8 % from $150, no per-order fee)'],
        f: { commission: 'Final value fee %', tax: 'Buyer’s sales tax %', intl: 'International fee', fx: 'Currency conversion' },
        o: { intl0: 'None – domestic sale, or eBay International Shipping', intlUS: 'US seller, buyer abroad – 1.65 %', intlKR: 'Seller registered in Korea – 1.45 %', intlJP: 'Seller registered in Japan – 1.35 %', fx0: 'None – paid out in USD', fx3: 'Payout converted to another currency – 3 %' },
        fee: { fvf: 'Final value fee', perOrder: 'Per-order fee', intlFee: 'International fee', fx: 'Currency conversion charge' },
        notes: ['Final value fee = % of the total sale amount per item (price + shipping + handling + sales tax): 13.6 % up to $7,500 in most categories and 2.35 % above, plus $0.30 per order ($0.40 when the order total is over $10).', 'International fee on sales to buyers outside your country: 1.65 % for US sellers (not charged with eBay International Shipping), 1.45 % for sellers registered in Korea, 1.35 % in Japan (Japan gets volume discounts from $3,000 a month).', 'Currency conversion: 3 % built into the exchange rate when eBay converts your payout; eBay has announced increases from 14 October (US) and 2 December 2026 (global sellers).', '250 free listings a month, then $0.35 each. Store subscriptions lower the final value fee and are not included; enter promoted listing ad rates under other costs.'],
        faq: [{ q: 'What is the eBay final value fee in 2026?', a: '13.6 % of the total sale amount, including shipping and sales tax, up to $7,500 per item in most categories, plus a per-order fee of $0.30 or $0.40. Books, movies and music are 15.3 %, guitars and basses 6.7 %, sneakers 8 % from $150 with no per-order fee.' }, { q: 'Does eBay charge fees on shipping and sales tax?', a: 'Yes. The final value fee is calculated on the total the buyer pays, including shipping, handling and sales tax. Enter the buyer’s sales tax rate to see the exact fee.' }, { q: 'What do sellers in Korea or Japan pay on eBay.com?', a: 'The same final value fee as US sellers, plus an international fee on sales to buyers outside their country: 1.45 % for Korea and 1.35 % for Japan. If eBay converts the payout into another currency, a 3 % conversion charge is built into the exchange rate.' }] },
      ko: { title: '이베이 수수료 계산기 2026 | 최종 거래가 수수료·국제 수수료·순이익', desc: '이베이(eBay.com) 최종 거래가 수수료 13.6%(배송비·판매세 포함 금액 기준), 주문당 수수료, 한국 셀러 국제 수수료 1.45%, 환전 수수료까지 반영해 정산금·순이익·손익분기 판매가를 무료로 계산합니다.', h1: '이베이 수수료 계산기 (2026년)', intro: '이베이는 구매자가 낸 총액(상품가 + 배송비 + 판매세)에 최종 거래가 수수료를 매깁니다. 대부분 카테고리는 13.6%이고 주문당 $0.30 또는 $0.40이 더해집니다. 한국에서 eBay.com에 팔면 해외 구매자 판매에 국제 수수료 1.45%가 붙으니, 국제 수수료에서 "한국 등록 셀러"를 고르세요. 정산금·순이익·손익분기 판매가를 달러로 계산합니다.',
        cats: ['대부분 카테고리 – 13.6%', '도서·잡지, 영화·TV, 음악 – 15.3%', '주화·지폐, 트레이딩 카드, 만화, 수집용 카드 게임 – 13.25%', '기타·베이스 – 6.7%', '주얼리(시계 제외) – 15%(총액 $5,000 초과 시 9%)', '여성 가방·핸드백 – 15%(총액 $2,000 초과 시 9%)', '시계·부품·액세서리 – 15%($1,000부터 6.5%, $7,500부터 3%)', '운동화 – 13.6%($150 이상 8%, 주문당 수수료 없음)'],
        f: { commission: '최종 거래가 수수료 %', tax: '구매자 판매세 %', intl: '국제 수수료', fx: '환전' },
        o: { intl0: '없음 – 국내 판매 또는 eBay 국제 배송 이용', intlUS: '미국 셀러, 해외 구매자 – 1.65%', intlKR: '한국 등록 셀러 – 1.45%', intlJP: '일본 등록 셀러 – 1.35%', fx0: '없음 – 달러로 수령', fx3: '다른 통화로 환전해 수령 – 3%' },
        fee: { fvf: '최종 거래가 수수료', perOrder: '주문당 수수료', intlFee: '국제 수수료', fx: '환전 수수료' },
        notes: ['최종 거래가 수수료 = 상품별 총 판매 금액(상품가 + 배송비 + 취급료 + 판매세) × 요율. 대부분 카테고리는 $7,500까지 13.6%, 초과분 2.35%. 주문당 $0.30(주문 총액 $10 초과 시 $0.40).', '국제 수수료: 판매자 등록 국가 밖의 구매자에게 팔 때 부과. 미국 셀러 1.65%(eBay 국제 배송 이용 시 없음), 한국 등록 셀러 1.45%, 일본 등록 셀러 1.35%.', '환전 수수료: eBay가 정산금을 다른 통화로 바꿀 때 환율에 3%가 포함됩니다. 2026년 10월 14일(미국)·12월 2일(해외 셀러)부터 인상 예정.', '등록 수수료는 월 250개까지 무료, 이후 건당 $0.35. 스토어 구독 할인은 반영하지 않았고, 프로모티드 리스팅 광고비는 기타 비용 %에 넣으면 됩니다.'],
        faq: [{ q: '이베이 수수료는 몇 %인가요?', a: '대부분 카테고리에서 상품별 총 판매 금액(배송비·판매세 포함)의 13.6%($7,500까지)에 주문당 $0.30 또는 $0.40이 붙습니다. 도서·영화·음악은 15.3%, 기타·베이스는 6.7%, 운동화는 $150 이상이면 8%이고 주문당 수수료가 없습니다.' }, { q: '한국 셀러는 수수료가 더 붙나요?', a: '해외 구매자에게 팔면 국제 수수료 1.45%가 더해집니다. eBay가 정산금을 원화 등 다른 통화로 환전하면 환율에 3%의 환전 수수료가 포함됩니다.' }, { q: '배송비와 판매세에도 수수료가 붙나요?', a: '붙습니다. 최종 거래가 수수료는 구매자가 낸 총액 기준이라 배송비·취급료·판매세가 모두 포함됩니다. 미국 구매자라면 주별 판매세율을 넣으면 정확해집니다.' }] },
      ja: { title: 'eBay 手数料計算ツール 2026｜落札手数料・国際手数料・利益を自動計算', desc: 'eBay（eBay.com）の落札手数料13.6%（送料・売上税込みの合計額に対して）、注文ごとの手数料、日本の出品者の国際手数料1.35%、為替手数料を反映し、入金額・純利益・損益分岐価格を無料で計算。', h1: 'eBay 手数料計算ツール（2026年版）', intro: 'eBayの落札手数料（Final Value Fee）は、購入者が支払う合計額（商品価格＋送料＋売上税）にかかり、ほとんどのカテゴリーで13.6%、さらに注文ごとに0.30ドルまたは0.40ドルが加わります。日本からeBay.comで販売すると、海外の購入者への販売に国際手数料1.35%がかかるため、国際手数料で「日本で登録した出品者」を選んでください。入金額・純利益・損益分岐価格をドルで計算します。',
        cats: ['ほとんどのカテゴリー – 13.6%', '本・雑誌、映画・TV、音楽 – 15.3%', 'コイン・紙幣、トレーディングカード、コミック、カードゲーム – 13.25%', 'ギター・ベース – 6.7%', 'ジュエリー（時計を除く） – 15%（合計5,000ドル超は9%）', 'レディースバッグ・ハンドバッグ – 15%（合計2,000ドル超は9%）', '時計・パーツ・アクセサリー – 15%（1,000ドルから6.5%、7,500ドルから3%）', 'スニーカー – 13.6%（150ドル以上は8%・注文手数料なし）'],
        f: { commission: '落札手数料率 %', tax: '購入者の売上税 %', intl: '国際手数料', fx: '為替換算' },
        o: { intl0: 'なし – 国内販売またはeBay国際配送を利用', intlUS: '米国の出品者・海外の購入者 – 1.65%', intlKR: '韓国で登録した出品者 – 1.45%', intlJP: '日本で登録した出品者 – 1.35%', fx0: 'なし – ドルで受け取る', fx3: '他の通貨に換算して受け取る – 3%' },
        fee: { fvf: '落札手数料', perOrder: '注文ごとの手数料', intlFee: '国際手数料', fx: '為替換算手数料' },
        notes: ['落札手数料 ＝ 商品ごとの販売合計額（商品価格＋送料＋手数料＋売上税）× 料率。ほとんどのカテゴリーで7,500ドルまで13.6%、超える部分は2.35%。注文ごとに0.30ドル（注文合計10ドル超は0.40ドル）。', '国際手数料：出品者の登録国以外の購入者に販売したときにかかります。米国の出品者1.65%（eBay国際配送の利用時はなし）、韓国1.45%、日本1.35%（日本は月3,000ドル以上の販売で割引あり）。', '為替換算手数料：eBayが売上金を他の通貨に換算するとき、為替レートに3%が含まれます。2026年10月14日（米国）・12月2日（海外の出品者）から引き上げ予定。', '出品手数料は月250件まで無料、以降1件0.35ドル。ストア契約の割引は含みません。プロモーテッドリスティングの広告費は「その他コスト %」に入力してください。'],
        faq: [{ q: 'eBayの手数料は何%ですか？', a: 'ほとんどのカテゴリーで、商品ごとの販売合計額（送料・売上税を含む）の13.6%（7,500ドルまで）に、注文ごとの手数料0.30ドルまたは0.40ドルが加わります。本・映画・音楽は15.3%、ギター・ベースは6.7%、スニーカーは150ドル以上なら8%で注文手数料はありません。' }, { q: '日本から出品すると手数料は増えますか？', a: '海外の購入者に販売すると国際手数料1.35%が加わります。月の販売額が3,000ドル以上で出品者レベルが標準以上なら割引があります。売上金を円に換算するときは為替レートに3%の換算手数料が含まれます。' }, { q: '送料や売上税にも手数料はかかりますか？', a: 'かかります。落札手数料は購入者が支払う合計額にかかるため、送料・手数料・売上税も含まれます。米国の購入者なら州の売上税率を入れると正確になります。' }] }
    }
  });
})(typeof window !== 'undefined' ? window : global);
