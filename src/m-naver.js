(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  SF.add({
    id: 'naver-kr', currency: 'KRW', flag: '', platform: 'Naver SmartStore', region: 'KR', countries: ['KR'], names: {ko: '네이버 스마트스토어'},
    slug: { en: 'naver-smartstore-fee-calculator', ko: 'naver-smartstore-fee-calculator' },
    fields: [F.price(29900), F.shipping(3000), F.cost(12000), F.shipCost(3000),
      F.cat(['2.73', '0.91', '3.64', '1.82'], '2.73'), F.commission(2.73),
      { k: 'omf', l: 'omf', t: 'sel', d: '1.98', o: [{ l: 'omf0', v: '1.98' }, { l: 'omf1', v: '2.585' }, { l: 'omf2', v: '2.75' }, { l: 'omf3', v: '3.025' }, { l: 'omf4', v: '3.63' }] },
      { k: 'linked', l: 'linked', t: 'num', u: '%', d: 0, step: 0.1 },
      F.vat(10), F.other(), F.target()],
    fees: function (v) {
      var base = n(v.price) + n(v.shipping);
      var com = base * n(v.commission) / 100;
      return [{ k: 'commission', a: com }, { k: 'omf', a: base * n(v.omf) / 100 }, { k: 'linked', a: base * n(v.linked) / 100 },
        { k: 'vatOnFees', a: com * n(v.vat) / 100 }, { k: 'otherCost', a: base * n(v.other) / 100 }];
    },
    sources: [{ n: '셀러킹: 네이버 스마트스토어 수수료 2025년 6월 개편', u: 'https://www.sellerking.io/blog/%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%8A%A4%ED%86%A0%EC%96%B4-%EC%88%98%EC%88%98%EB%A3%8C-%EA%B3%84%EC%82%B0%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-2025%EB%85%84-6%EC%9B%94-%EA%B0%9C%ED%8E%B8-58772' },
      { n: '올라: 주문관리 수수료·매출연동 수수료 정리', u: 'https://allra.co.kr/blogs/101' },
      { n: '윈들리: 2025 네이버 스마트스토어 수수료 개편 총정리', u: 'https://www.windly.cc/blog/windly-cc-blog-2025-naver-smartstore-fee-update-summary' },
      { n: '네이버 스마트스토어센터 (공식)', u: 'https://sell.smartstore.naver.com/' }],
    s: {
      ko: { title: '네이버 스마트스토어 수수료 계산기 2026 | 판매수수료·주문관리수수료·마진', desc: '네이버 스마트스토어 판매수수료(2.73%/0.91%)와 매출 등급별 주문관리수수료(1.98~3.63%)를 반영해 정산금액·순이익·마진율·손익분기 판매가를 무료로 계산합니다.', h1: '네이버 스마트스토어 수수료 계산기 (2026년)', intro: '2025년 6월 개편으로 네이버 수수료는 판매수수료와 주문관리수수료 두 층이 됐습니다. 판매수수료는 일반 유입 2.73%(부가세 별도), 셀러 마케팅 링크 유입은 0.91%로 낮아집니다. 주문관리수수료는 국세청 신고 매출 등급에 따라 1.98%(영세)~3.63%(일반)이며 부가세가 포함된 요율입니다. 유입 경로와 매출 등급만 고르면 정산금액·순이익·손익분기 판매가가 바로 계산됩니다.',
        cats: ['스마트스토어 · 일반 유입 – 2.73%', '스마트스토어 · 셀러 마케팅 링크 – 0.91%', '브랜드스토어 · 일반 유입 – 3.64%', '브랜드스토어 · 셀러 마케팅 링크 – 1.82%'],
        h: { shipping: '네이버 수수료는 판매가와 고객이 낸 배송비를 합친 금액에 붙습니다.', cat: '판매수수료는 주문이 어디서 들어왔는지에 따라 다릅니다. 판매자가 직접 공유한 셀러 마케팅 링크로 들어온 주문은 0.91%, 그 밖의 일반 유입은 2.73%입니다. 브랜드스토어는 각각 1.82%, 3.64%입니다.', omf: '국세청에 신고된 연 매출 규모로 등급이 정해지고 매년 다시 산정됩니다. 연 매출 3억 미만이면 1.98%입니다. 이 요율은 부가세가 포함된 값이라 부가세가 따로 붙지 않습니다.', linked: '2025년 6월 개편으로 예전 네이버쇼핑 매출연동수수료 2%는 없어지고 판매수수료에 통합됐습니다. 별도 제휴·연동 수수료가 있을 때만 입력하고, 없으면 0으로 두세요.', vat: '판매수수료에는 부가세 10%가 따로 붙습니다(주문관리수수료는 이미 포함). 일반과세자는 매입세액공제로 돌려받아 비용이 아니고, 간이과세자·면세사업자는 그대로 비용이 됩니다.' },
        f: { category: '유입 경로 / 스토어 유형', commission: '판매수수료 %', omf: '주문관리수수료 (매출 등급)', linked: '기타 연동·제휴 수수료 %' },
        o: { omf0: '영세 (연 매출 3억 미만) – 1.98%', omf1: '중소1 (3~5억) – 2.585%', omf2: '중소2 (5~10억) – 2.75%', omf3: '중소3 (10~30억) – 3.025%', omf4: '일반 (30억 이상) – 3.63%' },
        fee: { commission: '판매수수료', omf: '주문관리수수료', linked: '기타 연동·제휴 수수료' },
        notes: ['판매수수료는 부가세 별도 요율(2.73% / 0.91%), 주문관리수수료는 부가세가 포함된 요율(1.98~3.63%)입니다.', '수수료 기준 금액은 고객이 결제한 금액(판매가 + 배송비)입니다.', '2025년 6월 개편으로 기존 네이버쇼핑 매출연동수수료 2%는 판매수수료로 통합·대체됐습니다. 별도 연동 수수료가 있으면 해당 칸에 입력하세요.', '주문관리수수료 등급은 국세청 신고 매출 기준으로 매년 재산정됩니다.'],
        faq: [{ q: '네이버 스마트스토어 수수료는 총 몇 %인가요?', a: '판매수수료 2.73%(부가세 별도)에 매출 등급별 주문관리수수료 1.98~3.63%(부가세 포함)를 더해 대략 4.7~6.4% 수준입니다. 셀러 마케팅 링크로 유입되면 판매수수료가 0.91%로 낮아져 부담이 줄어듭니다.' },
          { q: '주문관리수수료는 왜 사람마다 다른가요?', a: '국세청에 신고된 연 매출 규모로 등급이 나뉘기 때문입니다. 영세(3억 미만) 1.98%, 중소1(3~5억) 2.585%, 중소2(5~10억) 2.75%, 중소3(10~30억) 3.025%, 일반(30억 이상) 3.63%이며 매년 재산정됩니다.' },
          { q: '배송비에도 수수료가 붙나요?', a: '네. 수수료는 고객이 실제 결제한 금액 기준이라 판매가와 배송비를 합한 금액에 부과됩니다.' },
          { q: '네이버쇼핑 매출연동수수료 2%는 아직 있나요?', a: '2025년 6월 개편으로 기존 2% 매출연동수수료는 폐지되고 판매수수료 체계로 통합됐습니다. 계산기의 기타 연동·제휴 수수료 칸은 기본 0이며, 별도 제휴가 있을 때만 입력하면 됩니다.' }] },
      en: { title: 'Naver SmartStore Fee Calculator 2026 – Commission, Payout', desc: 'Free Naver SmartStore fee calculator: 2.73 % sales commission plus the 1.98–3.63 % order management fee by revenue tier, payout, profit and margin.', h1: 'Naver SmartStore Fee Calculator (2026)', intro: 'Since the June 2025 reform Naver charges two layers: a sales commission of 2.73 % (ex VAT) for normal traffic, dropping to 0.91 % when the buyer arrives through your own marketing link, plus an order management fee of 1.98 % (small business) to 3.63 % (standard) set by your reported annual revenue, VAT included. Pick your traffic source and revenue tier to see payout, net profit and break-even price.',
        cats: ['SmartStore · normal traffic – 2.73 %', 'SmartStore · seller marketing link – 0.91 %', 'Brand Store · normal traffic – 3.64 %', 'Brand Store · seller marketing link – 1.82 %'],
        h: { shipping: 'Naver charges its fees on the price plus the shipping the customer pays.', cat: 'The sales commission depends on where the order came from: 0.91 % through your own seller marketing link, 2.73 % for any other traffic. On a Brand Store the same pair is 1.82 % and 3.64 %.', omf: 'Set by your annual revenue as reported to the Korean tax office and recalculated every year; under ₩300M it is 1.98 %. The rate already includes VAT, so none is added on top.', linked: 'The old 2 % Naver Shopping sales-linked fee was folded into the sales commission in June 2025. Enter something here only if you have a separate affiliate or linking fee; otherwise leave it at 0.', vat: '10 % VAT is charged on the sales commission; the order management fee already includes it. A VAT-registered general taxpayer reclaims it, so it is not a cost; a simplified or exempt business cannot, so it is.' },
        f: { category: 'Traffic source / store type', commission: 'Sales commission %', omf: 'Order management fee (revenue tier)', linked: 'Other linked / affiliate fee %' },
        o: { omf0: 'Small business (under ₩300M) – 1.98 %', omf1: 'SME 1 (₩300–500M) – 2.585 %', omf2: 'SME 2 (₩500M–1B) – 2.75 %', omf3: 'SME 3 (₩1–3B) – 3.025 %', omf4: 'Standard (over ₩3B) – 3.63 %' },
        fee: { commission: 'Sales commission', omf: 'Order management fee', linked: 'Other linked / affiliate fee' },
        notes: ['The sales commission is quoted ex VAT (2.73 % / 0.91 %); the order management fee already includes VAT (1.98–3.63 %).', 'Fees are charged on the amount the customer actually paid: price plus shipping.', 'The old 2 % Naver Shopping referral fee was folded into the sales commission in the June 2025 reform. Use the "other linked fee" field only if you have a separate affiliate deal.', 'Your order management tier is recalculated yearly from the revenue you report to the tax office.'],
        faq: [{ q: 'What is the total Naver SmartStore fee?', a: 'Roughly 4.7–6.4 %: a 2.73 % sales commission (ex VAT) plus an order management fee of 1.98–3.63 % (VAT included) depending on your revenue tier. Traffic arriving through your own marketing link pays only 0.91 % commission.' },
          { q: 'Why does the order management fee differ between sellers?', a: 'It is tiered by the annual revenue you report to the Korean tax office: 1.98 % under ₩300M, 2.585 % for ₩300–500M, 2.75 % for ₩500M–1B, 3.025 % for ₩1–3B and 3.63 % above ₩3B. Tiers are recalculated every year.' },
          { q: 'Is shipping included in the fee base?', a: 'Yes. Fees apply to the total the customer paid, so the shipping you charge is part of the base.' },
          { q: 'Does the 2 % Naver Shopping referral fee still exist?', a: 'No. It was abolished in the June 2025 reform and replaced by the new sales commission structure. The calculator defaults that field to zero.' }] }
    }
  });
})(typeof window !== 'undefined' ? window : global);
