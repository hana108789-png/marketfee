(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  SF.add({
    id: '11st-kr', currency: 'KRW', flag: '', platform: '11st', region: 'KR', countries: ['KR'], names: {ko: '11번가'},
    slug: { en: '11st-fee-calculator', ko: '11st-fee-calculator' },
    fields: [F.price(29900), F.shipping(3000), F.cost(12000), F.shipCost(3000),
      F.cat(['11', '9', '9', '7', '10', '10', '7', '10', '8', '13', '12', '10'], '11'), F.commission(11),
      { k: 'shipFee', l: 'shipFee', t: 'num', u: '%', d: 3.3, step: 0.1 },
      { k: 'aff', l: 'aff', t: 'num', u: '%', d: 0, step: 0.1 },
      { k: 'svc', l: 'svc', t: 'sel', d: '0', o: [{ l: 'svc0', v: '0' }, { l: 'svc1', v: '77000' }] },
      F.orders(100), F.vat(10), F.other(), F.target()],
    fees: function (v) {
      var p = n(v.price);
      var com = p * n(v.commission) / 100, ship = n(v.shipping) * n(v.shipFee) / 100, aff = p * n(v.aff) / 100;
      return [{ k: 'commission', a: com }, { k: 'shipFee', a: ship }, { k: 'aff', a: aff },
        { k: 'vatOnFees', a: com * n(v.vat) / 100 }, { k: 'svc', a: n(v.svc) / Math.max(1, n(v.orders)) },
        { k: 'otherCost', a: (p + n(v.shipping)) * n(v.other) / 100 }];
    },
    sources: [{ n: '윈들리: 11번가 입점·수수료·정산 가이드', u: 'https://www.windly.cc/blog/11st-onboarding-fee-settlement-guide' },
      { n: '레비오사: 11번가·옥션·G마켓 수수료 비교', u: 'https://leviosa.ai.kr/articles/platform-fee-comparison' },
      { n: '퍼센티: 11번가 판매 수수료 및 마진 계산 방법', u: 'https://www.percenty.co.kr/blog/how-to-calculate-11st-fee-and-margin' },
      { n: '11번가 셀러오피스 (공식)', u: 'https://soffice.11st.co.kr/' }],
    s: {
      ko: { title: '11번가 수수료 계산기 2026 | 카테고리별 판매수수료·배송비 수수료·마진', desc: '11번가 카테고리별 판매수수료(7~13%), 유료배송 배송비 수수료 3.3%, 제휴수수료, 서버이용료 77,000원까지 반영해 정산금액·순이익·마진율·손익분기 판매가를 무료로 계산합니다.', h1: '11번가 수수료 계산기 (2026년)', intro: '11번가 판매수수료는 카테고리별 7~13%이며 할인 전 판매가와 옵션가를 기준으로 부과됩니다. 유료배송을 설정하면 선결제 배송비에 3.3%가 별도로 붙고, 외부 채널 유입 시 제휴수수료 2%, 전월 구매확정액 500만원 이상이면 월 77,000원의 서버이용료가 추가됩니다. 카테고리만 고르면 나머지가 자동 계산됩니다.',
        cats: ['패션의류 – 11%', '홈·키친·인테리어 – 9%', '식품·건강 – 9%', '디지털·가전 – 7%', '뷰티·화장품 – 10%', '스포츠·레저 – 10%', '도서·음반 – 7%', '출산·유아·완구 – 10%', '자동차용품 – 8%', '시계·주얼리 – 13%', '가방·잡화 – 12%', '기타 – 10%'],
        f: { shipFee: '배송비 수수료 % (유료배송)', aff: '제휴수수료 % (외부 유입)', svc: '서버이용료' },
        o: { svc0: '해당 없음 (전월 구매확정 500만원 미만)', svc1: '적용 (월 77,000원, VAT 포함)' },
        fee: { commission: '판매수수료', shipFee: '배송비 수수료', aff: '제휴수수료', svc: '서버이용료 (주문당 배분)' },
        notes: ['판매수수료 기준은 할인 전 판매가 + 옵션가입니다. 배송비에는 별도로 3.3%(VAT 포함)가 부과됩니다.', '네이버·다음 등 외부 채널을 통해 유입된 주문에는 제휴수수료 2%(VAT 포함)가 추가됩니다.', '전월 구매확정 금액이 500만원 이상이면 월 77,000원(VAT 포함)의 서버이용료가 부과됩니다.', '쿠폰 할인 진행 시 할인액의 일부를 셀러가 부담합니다. 해당 금액은 기타 비용 칸에 반영하세요.', '카테고리별 정확한 요율은 셀러오피스에서 확인하세요. 신규 셀러는 1년간 고정 수수료 프로모션이 적용될 수 있습니다.'],
        faq: [{ q: '11번가 판매수수료는 몇 %인가요?', a: '카테고리별로 7~13%입니다. 디지털·가전과 도서·음반이 7%로 가장 낮고, 패션의류 11%, 가방·잡화 12%, 시계·주얼리 13% 수준입니다. 정확한 요율은 셀러오피스 카테고리별 수수료 안내에서 확인하세요.' },
          { q: '수수료는 할인 전 가격 기준인가요?', a: '네. 11번가는 할인 전 판매가와 옵션가를 기준으로 판매수수료를 부과합니다. 쿠폰 할인을 진행하면 할인액의 일부를 셀러가 별도로 부담하게 됩니다.' },
          { q: '배송비에도 수수료가 붙나요?', a: '유료배송으로 설정한 경우 선결제 배송비에 3.3%(VAT 포함)의 배송비 수수료가 부과됩니다. 무료배송이면 이 항목은 발생하지 않습니다.' },
          { q: '서버이용료는 언제 내나요?', a: '전월 구매확정 금액이 500만원 이상인 셀러에게 월 77,000원(VAT 포함)이 부과됩니다. 계산기는 이 금액을 월 주문 수로 나눠 주문 1건당 부담으로 보여줍니다.' }] },
      en: { title: '11st Fee Calculator 2026 – Category Commission, Shipping Fee & Margin', desc: 'Calculate 11st (Korea) seller fees: 7–13 % category commission, 3.3 % paid-shipping fee, affiliate fee and the ₩77,000 server fee, with payout, net profit, margin and break-even price.', h1: '11st Fee Calculator (2026)', intro: '11st charges a category commission of 7–13 %, calculated on the pre-discount price plus option price. Paid shipping adds a separate 3.3 % fee, orders arriving from external channels add a 2 % affiliate fee, and sellers with over ₩5M in confirmed purchases last month pay a ₩77,000 monthly server fee. Pick a category and the rest is filled in.',
        cats: ['Fashion & clothing – 11 %', 'Home, kitchen & interior – 9 %', 'Food & health – 9 %', 'Digital & appliances – 7 %', 'Beauty & cosmetics – 10 %', 'Sports & leisure – 10 %', 'Books & music – 7 %', 'Baby, kids & toys – 10 %', 'Car accessories – 8 %', 'Watches & jewellery – 13 %', 'Bags & accessories – 12 %', 'Other – 10 %'],
        f: { shipFee: 'Shipping fee % (paid shipping)', aff: 'Affiliate fee % (external traffic)', svc: 'Server fee' },
        o: { svc0: 'Not applicable (under ₩5M confirmed last month)', svc1: 'Applies (₩77,000/month, VAT incl.)' },
        fee: { commission: 'Sales commission', shipFee: 'Shipping fee', aff: 'Affiliate fee', svc: 'Server fee (spread per order)' },
        notes: ['The commission base is the pre-discount price plus option price. Shipping is charged separately at 3.3 % (VAT included).', 'Orders that arrive through external channels such as Naver or Daum add a 2 % affiliate fee (VAT included).', 'Sellers with confirmed purchases above ₩5M in the previous month pay a ₩77,000 monthly server fee (VAT included).', 'When you run coupon promotions you carry part of the discount. Put that amount in the other-costs field.', 'Exact category rates are in Seller Office. New sellers may get a fixed promotional rate for their first year.'],
        faq: [{ q: 'What is the 11st sales commission?', a: '7–13 % by category. Digital, appliances, books and music are lowest at 7 %; fashion is 11 %, bags 12 % and watches or jewellery 13 %. Check Seller Office for the exact rate on your category.' },
          { q: 'Is the fee based on the price before discounts?', a: 'Yes. 11st charges commission on the pre-discount price plus option price. If you run a coupon promotion you separately carry part of the discount.' },
          { q: 'Is shipping charged a fee?', a: 'If you set paid shipping, the prepaid shipping amount is charged a 3.3 % fee (VAT included). Free shipping means no such fee.' },
          { q: 'When does the server fee apply?', a: 'To sellers whose confirmed purchases exceeded ₩5M in the previous month: ₩77,000 per month, VAT included. The calculator divides it across your monthly orders.' }] }
    }
  });
})(typeof window !== 'undefined' ? window : global);
