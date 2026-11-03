(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  // Rates from the official seller guide (shopping-docs.toss.im, checked 2026-11-03): product sales fee 8%
  // (6% delivery incentive, 0% on ad sales) on price minus seller coupon, never on shipping; Toss Pay payment
  // fee by the card-law revenue tier on everything the buyer pays. All VAT 별도.
  var m = {
    id: 'toss-kr', updated: '2026-11-03', currency: 'KRW', flag: '', platform: 'Toss Shopping', region: 'KR', countries: ['KR'], names: { ko: '토스쇼핑' },
    slug: { ko: 'toss-shopping-fee-calculator' },
    fields: [F.price(29900), F.shipping(3000), F.cost(12000), F.shipCost(3000),
      F.cat(['8', '6', '0'], '8'), F.commission(8),
      { k: 'tier', l: 'tier', t: 'sel', d: '1.6', sets: 'pay', o: [{ l: 't0', v: '1.6' }, { l: 't1', v: '1.9' }, { l: 't2', v: '2.15' }, { l: 't3', v: '2.4' }, { l: 't4', v: '3' }] },
      { k: 'pay', l: 'pay', t: 'num', u: '%', d: 1.6, step: 0.01 },
      { k: 'coupon', l: 'coupon', t: 'num', u: 'cur', d: 0 },
      F.vat(10), F.other(), F.target()],
    primary: ['tier'],
    fees: function (v) {
      var item = n(v.price) - n(v.coupon);
      var com = item * n(v.commission) / 100, pay = (item + n(v.shipping)) * n(v.pay) / 100;
      return [{ k: 'commission', a: com }, { k: 'pay', a: pay }, { k: 'vatOnFees', a: (com + pay) * n(v.vat) / 100 },
        { k: 'coupon', a: n(v.coupon) }, { k: 'otherCost', a: (n(v.price) + n(v.shipping)) * n(v.other) / 100 }];
    },
    sources: [{ n: '토스쇼핑 셀러 가이드 – 정산하기 (공식)', u: 'https://shopping-docs.toss.im/shopping-operations/order/settlement' },
      { n: '토스쇼핑 셀러 가이드 – 토스페이 정산 정책 (공식)', u: 'https://shopping-docs.toss.im/shopping-operations/shop/undefined' },
      { n: '토스쇼핑 셀러 가이드 – 배송 품질 우수 인센티브 (공식)', u: 'https://shopping-docs.toss.im/penalty/incentive/delivery-incentive' },
      { n: '토스쇼핑 셀러 가이드 – 토스쇼핑 광고 소개 (공식)', u: 'https://shopping-docs.toss.im/ads/intro' }],
    s: {
      ko: { title: '토스쇼핑 수수료 계산기 2026 | 판매 8%+결제 1.6~3%, 배송 우수 6%·광고 0%', desc: '토스쇼핑 상품 판매 수수료 8%(배송 품질 우수 6%, 광고 판매 0%)와 연매출 등급별 결제 수수료 1.60~3.00%(모두 VAT 별도), 셀러 부담 쿠폰까지 반영해 정산금액·순이익·마진율을 무료로 계산합니다.', h1: '토스쇼핑 수수료 계산기 (2026년)',
        intro: '토스쇼핑 수수료는 상품 판매 수수료와 결제 수수료 두 가지입니다. 상품 판매 수수료는 기본 8%이고, 오늘 출발 상품이 발송기한을 빠짐없이 지키면 6%, 토스쇼핑 광고를 클릭하고 7일 안에 팔린 건은 0%입니다. 결제 수수료는 연매출 규모(영중소 등급)에 따라 1.60~3.00%이며, 배송비에는 결제 수수료만 붙습니다. 모두 VAT 별도입니다. 수수료 구분과 연매출 등급만 고르면 수수료가 자동으로 들어갑니다.',
        cats: ['기본 – 8%', '배송 품질 우수 인센티브 (오늘 출발) – 6%', '광고 클릭 후 7일 안에 판매 – 0%'],
        f: { category: '판매 수수료 구분', commission: '상품 판매 수수료 %', tier: '연매출 등급 (결제 수수료)', pay: '결제 수수료 %', coupon: '셀러 부담 쿠폰 할인액' },
        o: { t0: '영세 (연매출 3억 이하) – 1.60%', t1: '중소1 (3억~5억) – 1.90%', t2: '중소2 (5억~10억) – 2.15%', t3: '중소3 (10억~30억) – 2.40%', t4: '일반 (30억 초과) – 3.00%' },
        fee: { commission: '상품 판매 수수료', pay: '결제 수수료', coupon: '셀러 부담 쿠폰' },
        notes: ['상품 판매 수수료는 기본 8%(VAT 별도)로 상품 금액에만 붙고 배송비에는 붙지 않습니다. 2026년 1월 19일 결제분부터는 판매가에서 셀러 부담 쿠폰 할인액을 뺀 금액에 매깁니다.',
          '결제 수수료(토스머니·카드, VAT 별도)는 영세(연매출 3억 이하) 1.60%, 중소1(3억~5억) 1.90%, 중소2(5억~10억) 2.15%, 중소3(10억~30억) 2.40%, 일반 3.00%입니다. 상품 금액과 배송비를 합친 결제금액에 붙고, 등급은 반기마다 여신금융협회 기준으로 다시 정해집니다. 업종·품목에 따라 다를 수 있습니다.',
          '배송 품질 우수 인센티브는 페널티 점수 0점, 오늘 출발 적용, 직전 7영업일 안에 발송 이력 1건 이상, 그 기간 발송기한 준수율 100%를 모두 채운 옵션에 다음 날 01:00부터 하루 동안 판매 수수료 6%를 적용합니다. 조건을 계속 지키면 매일 자동으로 이어지고, 발송지연 처리를 한 주문은 기한을 넘긴 것으로 봅니다.',
          '토스쇼핑 성과형(CPC) 광고를 클릭하고 7일 안에 팔린 광고 상품은 판매 수수료가 0%입니다. 대신 클릭당 광고비가 들므로 매출 대비 광고비 비율을 상세 설정의 기타 비용 %에 넣어 비교해 보세요. 한 주문에는 가장 낮은 수수료 혜택 하나만 적용됩니다.',
          '토스쇼핑은 토스페이 결제만 받으므로 결제 수수료는 토스페이 정산 정책을 따릅니다. 토스 포인트·즉시할인처럼 토스가 부담한 금액에도 원래 결제수단의 수수료율이 붙습니다.',
          '정산은 구매확정일 기준 D+2영업일에 두 수수료를 뺀 금액으로 지급됩니다. 수수료 세금계산서는 매월 1영업일 오전에 전월분이 한 장으로 발행됩니다.'],
        faq: [] }
    }
  };
  // Worked examples come from the calculator itself, so they follow any rate change above.
  var v = SF.defaults(m), r = SF.calc(m, v), won = function (x) { return Math.round(x).toLocaleString('ko-KR') + '원'; };
  var fee = function (k) { return r.fees.filter(function (x) { return x.k === k; })[0].a; };
  var v6 = SF.defaults(m); v6.commission = 6; var r6 = SF.calc(m, v6);
  var vc = SF.defaults(m); vc.coupon = 3000; var rc = SF.calc(m, vc);
  var fees = function (res) { return res.fees.filter(function (x) { return x.k === 'commission' || x.k === 'pay'; }).reduce(function (s, x) { return s + x.a; }, 0); };
  m.s.ko.faq = [{ q: '토스쇼핑 수수료는 몇 %인가요?', a: '상품 판매 수수료 기본 8%와 결제 수수료 1.60~3.00%(연매출 등급별)를 냅니다. 모두 VAT 별도입니다. 연매출 3억 이하 영세 셀러라면 8% + 1.6% = 9.6%이고, 부가세를 더하면 약 10.6%입니다. 배송비에는 결제 수수료만 붙습니다.' },
    { q: '29,900원짜리 상품을 팔면 얼마가 남나요?', a: '영세 등급, 기본 수수료 기준으로 판매가 ' + won(v.price) + ', 배송비 ' + won(v.shipping) + '(구매자 부담), 원가 ' + won(v.cost) + ', 택배비 ' + won(v.shipCost) + '이면 수수료 ' + won(r.total) + '(판매 ' + won(fee('commission')) + ' + 결제 ' + won(fee('pay')) + ')이 빠지고 순이익은 약 ' + won(r.profit) + ', 마진율 ' + (r.margin * 100).toFixed(1) + '%입니다. 배송 품질 우수 인센티브(6%)를 받으면 ' + won(r6.profit - r.profit) + '이 더 남습니다. 간이과세자처럼 수수료 부가세를 공제받지 못하면 ' + won(r.total / 10) + '이 더 빠집니다.' },
    { q: '배송 품질 우수 인센티브(수수료 6%)는 어떻게 받나요?', a: '신청할 필요 없이 조건을 채운 옵션에 자동으로 적용됩니다. 페널티 점수 0점, 상품에 오늘 출발 적용, 직전 7영업일 안에 발송 이력 1건 이상, 그 기간 발송기한 준수율 100%를 모두 채우면 다음 날 01:00부터 하루 동안 판매 수수료가 8%에서 6%로 내려가고, 조건을 계속 지키면 매일 이어집니다. 발송지연 처리를 하면 바뀐 기한 안에 보내도 미준수로 봅니다.' },
    { q: '광고로 팔면 수수료가 정말 0%인가요?', a: '토스쇼핑 성과형 광고를 클릭하고 7일 안에 팔린 광고 상품은 판매 수수료가 0%입니다. 결제 수수료는 그대로 붙습니다. 광고비는 클릭당 따로 들기 때문에, 광고로 팔린 1건당 광고비가 판매가의 8%보다 적어야 아낀 수수료가 광고비보다 큽니다(부가세 제외 기준).' },
    { q: '셀러 부담 쿠폰을 쓰면 수수료는 어떻게 되나요?', a: '2026년 1월 19일 결제분부터 상품 판매 수수료는 판매가에서 셀러 부담 쿠폰 할인액을 뺀 금액에 붙습니다. 위 예시에 3,000원 쿠폰을 붙이면 수수료가 ' + won(fees(r) - fees(rc)) + ' 줄어 ' + won(fees(rc)) + '이 되지만, 쿠폰 3,000원을 셀러가 부담하므로 순이익은 약 ' + won(rc.profit) + '입니다.' },
    { q: '결제 수수료 등급은 어떻게 정해지고 정산은 언제 받나요?', a: '연매출 3억 이하 영세, 3억~5억 중소1, 5억~10억 중소2, 10억~30억 중소3, 그 이상은 일반으로, 반기마다 여신금융협회(또는 국세청) 기준으로 다시 정해집니다. 토스머니 결제는 바로 적용되고 카드 결제는 차액을 나중에 돌려받습니다. 판매대금은 구매확정일 기준 D+2영업일에 수수료를 뺀 금액으로 들어옵니다.' }];
  SF.add(m);
})(typeof window !== 'undefined' ? window : global);
