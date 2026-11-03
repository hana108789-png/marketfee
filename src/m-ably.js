(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  // Rates by entry type, from the official 셀러스퀘어 entry pages (checked 2026-11-03). Only 셀러스 lists a
  // separate payment fee, so it rides along after "+" and derive() copies it into the payment field.
  var m = {
    id: 'ably-kr', updated: '2026-11-03', currency: 'KRW', flag: '', platform: 'ABLY', region: 'KR', countries: ['KR'], names: { ko: '에이블리' },
    slug: { ko: 'ably-fee-calculator' },
    fields: [F.price(29900), F.shipping(0), F.cost(12000), F.shipCost(3000),
      F.cat(['4+3.96', '16+0', '21+0', '25+0'], '4+3.96'), F.commission(4),
      { k: 'pay', l: 'pay', t: 'num', u: '%', d: 3.96, step: 0.01 },
      { k: 'coupon', l: 'coupon', t: 'num', u: '%', d: 0, step: 0.1 },
      F.vat(10), F.other(), F.target()],
    fees: function (v) {
      var base = n(v.price) + n(v.shipping);
      var com = base * n(v.commission) / 100, pay = base * n(v.pay) / 100;
      return [{ k: 'commission', a: com }, { k: 'pay', a: pay }, { k: 'vatOnFees', a: (com + pay) * n(v.vat) / 100 },
        { k: 'coupon', a: n(v.price) * n(v.coupon) / 100 }, { k: 'otherCost', a: base * n(v.other) / 100 }];
    },
    derive: function (v, k) { if (k === undefined || k === 'cat') v.pay = SF.extra(v, 1); },
    sources: [{ n: '에이블리 셀러스퀘어 – 셀러스 입점 안내 (공식)', u: 'https://square.a-bly.com/businesspage-sellers' },
      { n: '에이블리 셀러스퀘어 – 라이프·뷰티·브랜드 입점 안내 (공식)', u: 'https://square.a-bly.com/businesspage-all' },
      { n: '에이블리 셀러스퀘어 – 파트너스 입점 안내 (공식)', u: 'https://square.a-bly.com/businesspage-partners' }],
    s: {
      ko: { title: '에이블리 수수료 계산기 2026 | 셀러스 4%+결제 3.96%, 입점 유형별 수수료·마진', desc: '에이블리 입점 유형별 수수료(셀러스 플랫폼 4%+결제 3.96%, 라이프 16%, 뷰티 21%, 브랜드 25%, 모두 VAT 별도)와 쿠폰·적립금 부담까지 반영해 정산금액·순이익·마진율을 무료로 계산합니다.', h1: '에이블리 수수료 계산기 (2026년)',
        intro: '에이블리 수수료는 입점 유형에 따라 다릅니다. 쇼핑몰·셀럽이 직접 판매하는 셀러스는 플랫폼 수수료 4%와 결제 수수료 3.96%(모두 VAT 별도)로, 부가세까지 더하면 판매가의 약 8.8%입니다. 라이프·디지털·푸드는 16%, 뷰티 21%, 브랜드와 남성 패션(4910)은 25%(VAT 별도)입니다. 입점 유형만 고르면 수수료가 자동으로 들어가고, 쿠폰·적립금 셀러 부담분도 넣을 수 있습니다.',
        cats: ['셀러스 (쇼핑몰·셀럽, 패션) – 4%', '라이프·디지털·푸드 – 16%', '뷰티 – 21%', '브랜드·4910 (남성 패션) – 25%'],
        f: { category: '입점 유형', commission: '판매(플랫폼) 수수료 %', pay: '결제 수수료 %', coupon: '쿠폰·적립금 셀러 부담 %' },
        fee: { commission: '판매(플랫폼) 수수료', pay: '결제 수수료', coupon: '쿠폰·적립금 셀러 부담' },
        notes: ['셀러스는 플랫폼 수수료 4% + 결제 수수료 3.96%이며 모두 VAT 별도입니다. 플랫폼 수수료를 3%로 적은 글도 있지만, 에이블리 공식 입점 안내(셀러스퀘어)에는 4%로 나와 있습니다(2026년 11월 확인).',
          '라이프·디지털·푸드 16%, 뷰티 21%, 브랜드·4910(남성) 25%는 판매 수수료 하나로 안내되며 모두 VAT 별도입니다. 결제 수수료가 따로 적혀 있지 않아 계산기에서는 0%로 둡니다.',
          '쿠폰·적립금의 셀러 부담금은 쿠폰과 적립금 각각 판매가의 최대 5%이고, 나머지는 에이블리가 부담해 정산 때 지급합니다. 행사에 참여하면 상세 설정의 셀러 부담 %에 넣으세요.',
          '정산은 월 2회입니다. 1~15일 구매 확정분은 당월 25일, 16일~말일 구매 확정분은 다음 달 10일에 지급됩니다.',
          '수수료는 구매자가 낸 결제금액(판매가 + 구매자 부담 배송비) 기준으로 계산합니다. 정확한 부과 기준은 어드민의 정산 내역에서 확인하세요.',
          '파트너스는 구조가 다릅니다. 사입·배송·CS·재고를 에이블리가 맡고, 판매자는 구매 확정 매출의 10%를 3.3% 원천징수 후 월 1회 받습니다. 원가가 들지 않는 방식이라 이 계산기로 계산할 대상이 아닙니다.'],
        faq: [] }
    }
  };
  // The worked example is computed from the calculator itself, so it follows any rate change above.
  var v = SF.defaults(m), r = SF.calc(m, v), won = function (x) { return Math.round(x).toLocaleString('ko-KR') + '원'; };
  var fee = function (k) { return r.fees.filter(function (x) { return x.k === k; })[0].a; };
  m.s.ko.faq = [{ q: '에이블리 수수료는 몇 %인가요?', a: '입점 유형마다 다릅니다. 셀러스(쇼핑몰·셀럽)는 플랫폼 4% + 결제 3.96%, 라이프·디지털·푸드 16%, 뷰티 21%, 브랜드·4910(남성) 25%이며 모두 VAT 별도입니다. 셀러스 기준으로 부가세까지 합치면 판매가의 약 8.8%입니다.' },
    { q: '29,900원짜리 옷을 팔면 얼마가 남나요?', a: '셀러스 기준으로 판매가 ' + won(v.price) + '(무료배송), 원가 ' + won(v.cost) + ', 택배비 ' + won(v.shipCost) + '이면 수수료 ' + won(r.total) + '(플랫폼 ' + won(fee('commission')) + ' + 결제 ' + won(fee('pay')) + ')이 빠지고 순이익은 약 ' + won(r.profit) + ', 마진율 ' + (r.margin * 100).toFixed(1) + '%입니다. 간이과세자처럼 수수료 부가세를 공제받지 못하면 ' + won(r.total / 10) + '이 더 빠집니다.' },
    { q: '셀러스와 파트너스는 뭐가 다른가요?', a: '셀러스는 직접 상품을 올리고 배송·CS까지 하는 방식으로, 플랫폼 4% + 결제 3.96%(VAT 별도)를 내고 월 2회 정산받습니다. 파트너스는 사입·배송·CS·재고를 에이블리가 맡고, 판매자는 구매 확정 매출의 10%를 3.3% 원천징수 후 월 1회 받습니다. 파트너스는 부가세 신고 없이 종합소득세만 신고합니다.' },
    { q: '쿠폰·적립금은 누가 부담하나요?', a: '셀러 부담은 쿠폰과 적립금 각각 판매가의 최대 5%이고, 나머지는 에이블리가 부담해 정산 때 지급합니다. 셀러 부담분을 계산기 상세 설정에 넣으면 순이익에 반영됩니다.' },
    { q: '정산은 언제 받나요?', a: '셀러스는 월 2회입니다. 1~15일에 구매 확정된 주문은 당월 25일, 16일~말일에 구매 확정된 주문은 다음 달 10일에 정산됩니다.' }];
  SF.add(m);
})(typeof window !== 'undefined' ? window : global);
