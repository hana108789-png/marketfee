(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  SF.add({
    id: 'gmarket-kr', currency: 'KRW', flag: '', platform: 'Gmarket / Auction', region: 'KR', countries: ['KR'], names: {ko: 'G마켓·옥션'},
    slug: { en: 'gmarket-auction-fee-calculator', ko: 'gmarket-auction-fee-calculator' },
    fields: [F.price(29900), F.shipping(3000), F.cost(12000), F.shipCost(3000),
      F.cat(['10', '8', '9', '6.5', '9', '9', '7', '9', '7', '13', '11', '10'], '10'), F.commission(10),
      { k: 'shipFee', l: 'shipFee', t: 'num', u: '%', d: 3.3, step: 0.1 },
      { k: 'svc', l: 'svc', t: 'num', u: 'cur', d: 0, step: 1 },
      F.orders(100), F.vat(10), F.other(), F.target()],
    fees: function (v) {
      var p = n(v.price);
      var com = p * n(v.commission) / 100, ship = n(v.shipping) * n(v.shipFee) / 100;
      return [{ k: 'commission', a: com }, { k: 'shipFee', a: ship },
        { k: 'vatOnFees', a: com * n(v.vat) / 100 }, { k: 'svc', a: n(v.svc) / Math.max(1, n(v.orders)) },
        { k: 'otherCost', a: (p + n(v.shipping)) * n(v.other) / 100 }];
    },
    sources: [{ n: 'G마켓 카테고리별 서비스이용료 안내 (ESM Plus 공식)', u: 'https://www.esmplus.com/commonpopup/gmarketusecost' },
      { n: '레비오사: 11번가·옥션·G마켓 수수료 비교', u: 'https://leviosa.ai.kr/articles/platform-fee-comparison' },
      { n: '퍼센티: 옥션/G마켓 판매 수수료 및 마진 계산 방법', u: 'https://www.percenty.co.kr/blog/how-to-calculate-auction-gmarket-fee-and-margin' },
      { n: '올라: G마켓·옥션 정산 주기 및 수수료 산정', u: 'https://allra.co.kr/blogs/145' }],
    s: {
      ko: { title: 'G마켓·옥션 수수료 계산기 2026 | 카테고리별 서비스이용료·마진 계산', desc: 'G마켓과 옥션(ESM)의 카테고리별 서비스이용료(6.5~13%), 유료배송 배송비 수수료 3.3%, 서버이용료를 반영해 정산금액·순이익·마진율·손익분기 판매가를 무료로 계산합니다.', h1: 'G마켓·옥션 수수료 계산기 (2026년)', intro: 'G마켓과 옥션은 ESM Plus로 함께 운영되며 수수료 체계도 같습니다. 판매수수료는 카테고리별 서비스이용료로 6.5~13% 수준이고, 기준 금액은 판매가 + 주문옵션금액입니다. 유료배송이면 선결제 배송비에 3.3%가 별도로 붙습니다. 카테고리만 고르면 정산금액·순이익·손익분기 판매가가 바로 계산됩니다.',
        cats: ['패션의류 – 10%', '홈·키친·인테리어 – 8%', '식품·건강 – 9%', '디지털·가전 – 6.5%', '뷰티·화장품 – 9%', '스포츠·레저 – 9%', '도서·음반 – 7%', '출산·유아·완구 – 9%', '자동차용품 – 7%', '시계·주얼리 – 13%', '가방·잡화 – 11%', '기타 – 10%'],
        f: { commission: '서비스이용료 %', shipFee: '배송비 수수료 % (유료배송)', svc: '서버이용료 (월, 해당 시)' },
        fee: { commission: '서비스이용료', shipFee: '배송비 수수료', svc: '서버이용료 (주문당 배분)' },
        notes: ['서비스이용료 기준 = 판매가 + 주문옵션금액(또는 추가구성금액). 유료배송이면 선결제 배송비에 3.3%가 별도 부과됩니다.', 'G마켓과 옥션은 ESM Plus에서 함께 관리되며 카테고리 요율도 동일하게 적용됩니다.', '일부 상품은 카테고리 요율 대신 고정 수수료가 적용됩니다.', '서버이용료는 매출 구간에 따라 부과될 수 있어 기본값을 0으로 뒀습니다. 해당되면 금액을 입력하세요.', '카테고리별 정확한 요율은 ESM Plus 서비스이용료 안내에서 확인하세요.'],
        faq: [{ q: 'G마켓과 옥션 수수료가 같나요?', a: '네. 두 마켓은 ESM Plus 하나로 운영되고 카테고리별 서비스이용료 체계도 같습니다. 디지털·가전이 6.5%로 가장 낮고 시계·주얼리가 13% 수준입니다.' },
          { q: '수수료는 어떤 금액을 기준으로 계산되나요?', a: '판매가에 주문옵션금액(또는 추가구성금액)을 더한 금액입니다. 여기에 유료배송이면 선결제 배송비 × 3.3%가 추가됩니다.' },
          { q: '쿠폰 할인을 하면 수수료가 줄어드나요?', a: '판매가 기준으로 부과되므로 쿠폰 할인분이 그대로 반영되지는 않습니다. 셀러가 부담하는 쿠폰 금액은 기타 비용 칸에 입력해 순이익에 반영하세요.' },
          { q: '서버이용료가 있나요?', a: '매출 구간에 따라 부과될 수 있습니다. 정책이 바뀌는 항목이라 기본값을 0으로 두었으니 본인에게 부과되는 금액을 직접 입력하면 주문 1건당 부담으로 배분해 계산합니다.' }] },
      en: { title: 'Gmarket & Auction Fee Calculator 2026 – ESM Seller Fees', desc: 'Free Gmarket and Auction (ESM Korea) fee calculator: 6.5–13 % category service fee, 3.3 % paid-shipping fee, server fee, payout and net profit.', h1: 'Gmarket & Auction Fee Calculator (2026)', intro: 'Gmarket and Auction run on the same ESM Plus back end and share one fee schedule. The service fee is 6.5–13 % by category, charged on the selling price plus option price. Paid shipping adds a separate 3.3 %. Pick a category to see payout, net profit and break-even price.',
        cats: ['Fashion & clothing – 10 %', 'Home, kitchen & interior – 8 %', 'Food & health – 9 %', 'Digital & appliances – 6.5 %', 'Beauty & cosmetics – 9 %', 'Sports & leisure – 9 %', 'Books & music – 7 %', 'Baby, kids & toys – 9 %', 'Car accessories – 7 %', 'Watches & jewellery – 13 %', 'Bags & accessories – 11 %', 'Other – 10 %'],
        f: { commission: 'Service fee %', shipFee: 'Shipping fee % (paid shipping)', svc: 'Server fee (monthly, if charged)' },
        fee: { commission: 'Service fee', shipFee: 'Shipping fee', svc: 'Server fee (spread per order)' },
        notes: ['Service fee base = selling price + option price. Paid shipping is charged a separate 3.3 % on the prepaid shipping amount.', 'Gmarket and Auction are managed together in ESM Plus and use the same category rates.', 'Some products are charged a fixed fee instead of the category rate.', 'The server fee depends on your revenue band and policy changes, so it defaults to zero. Enter your amount if one applies.', 'Confirm exact category rates in the ESM Plus service fee guide.'],
        faq: [{ q: 'Do Gmarket and Auction charge the same fees?', a: 'Yes. Both run on ESM Plus and share the same category service fee schedule, from about 6.5 % for digital and appliances up to around 13 % for watches and jewellery.' },
          { q: 'What is the fee calculated on?', a: 'The selling price plus the option or add-on price. If you use paid shipping, 3.3 % of the prepaid shipping amount is added.' },
          { q: 'Do coupon discounts reduce the fee?', a: 'The fee follows the selling price, so a coupon does not simply reduce it. Put the discount you fund into the other-costs field so it shows in net profit.' },
          { q: 'Is there a server fee?', a: 'It can apply depending on your revenue band, and the policy changes, so the calculator defaults it to zero. Enter your amount and it is spread across your monthly orders.' }] }
    }
  });
})(typeof window !== 'undefined' ? window : global);
