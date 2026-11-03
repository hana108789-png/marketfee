(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  // Musinsa publishes no rate card: each brand signs its own commission. The default is the average the
  // KBIZ 2024 platform survey found for Musinsa (27.8%); visitors overwrite it with their contract rate.
  var m = {
    id: 'musinsa-kr', updated: '2026-11-03', currency: 'KRW', flag: '', platform: 'MUSINSA', region: 'KR', countries: ['KR'], names: { ko: '무신사' },
    slug: { ko: 'musinsa-fee-calculator' },
    fields: [F.price(39000), F.shipping(0), F.cost(13000), F.shipCost(3000), F.commission(27.8), F.vat(10), F.other(), F.target()],
    fees: function (v) {
      var com = n(v.price) * n(v.commission) / 100;
      return [{ k: 'commission', a: com }, { k: 'vatOnFees', a: com * n(v.vat) / 100 }, { k: 'otherCost', a: (n(v.price) + n(v.shipping)) * n(v.other) / 100 }];
    },
    sources: [{ n: '중소기업중앙회 2024년 온라인 플랫폼 입점 중소기업 거래 실태조사 (메트로신문 보도)', u: 'https://www.metroseoul.co.kr/article/20240703500177' },
      { n: '무신사 실질 수수료율 발표 (바이라인네트워크 보도)', u: 'https://byline.network/2023/02/08_29871' },
      { n: '무신사 파트너 성장 솔루션 발표 (뉴데일리 보도)', u: 'https://biz.newdaily.co.kr/site/data/html/2025/02/04/2025020400045.html' }],
    s: {
      ko: { title: '무신사 수수료 계산기 2026 | 입점 수수료 평균 27.8%, 계약 수수료로 정산금·마진', desc: '무신사 입점 수수료는 브랜드별 계약이라 공개표가 없습니다. 조사 평균 27.8%(중기중앙회)를 기본으로, 내 계약 수수료를 넣으면 정산금액·순이익·마진율·목표 마진 판매가를 무료로 계산합니다.', h1: '무신사 수수료 계산기 (2026년)',
        card: '계약 수수료 입력 · 조사 평균 27.8%',
        intro: '무신사는 다른 마켓처럼 공개된 수수료표가 없고, 브랜드마다 계약으로 수수료율을 정합니다. 중소기업중앙회 2024년 실태조사에서 무신사 평균 판매수수료율은 27.8%로 조사한 쇼핑몰 중 가장 높았습니다(쿠팡 12.3%, 네이버 6.3%). 계산기는 이 평균값으로 시작하니, 계약서나 파트너센터에 있는 내 수수료율로 바꿔 넣으세요. 판매가에서 수수료를 뺀 정산금액, 순이익, 마진율과 손익분기 판매가가 바로 나옵니다.',
        f: { commission: '계약 수수료율 %' },
        fee: { commission: '판매 수수료 (계약)' },
        notes: ['무신사는 수수료율을 공개하지 않고 브랜드별 계약으로 정합니다. 기본값 27.8%는 중소기업중앙회 「2024년 온라인 플랫폼 입점 중소기업 거래 실태조사」(2024년 7월 발표)의 무신사 평균 판매수수료율입니다. 같은 조사에서 SSG닷컴은 18.8%, 11번가 12.5%, 쿠팡 12.3%, 네이버 6.3%였습니다.',
          '무신사는 계약 수수료(명목 수수료) 안에 결제 수수료, 서버비, 쿠폰·적립금 할인 비용, 마케팅 지원비가 들어 있다고 설명합니다. 무신사가 부담한 비용을 뺀 실질 수수료율은 2018년 17%에서 2022년 12.2%까지 내려갔다고 발표했고, 쿠폰·적립금 할인 비용의 95% 이상을 무신사가 낸다고 밝혔습니다(2023년 2월).',
          '실질 수수료율은 무신사가 남기는 몫이고, 판매자 정산금에서 빠지는 비율은 계약 수수료율입니다. 그래서 계산기에는 계약서에 적힌 수수료율을 넣어야 합니다.',
          '2025년 3월부터 무신사 상품 광고가 생겼습니다. PB를 뺀 입점 브랜드는 판매 수수료의 1%를 광고 포인트로 받고(월 10만~100만원), 더 노출하려면 유상 광고를 씁니다. 유상 광고비는 매출 대비 비율로 상세 설정의 기타 비용 %에 넣으세요.',
          '이 계산기는 상품 판매가에만 수수료를 매기고, 구매자가 낸 배송비는 그대로 정산된다고 봅니다. 배송비 수수료와 수수료 부가세 포함 여부는 계약마다 다르니 계약서를 확인하세요.'],
        faq: [] }
    }
  };
  // Worked examples come from the calculators themselves; the Ably comparison reuses this product.
  var v = SF.defaults(m), r = SF.calc(m, v), won = function (x) { return Math.round(x).toLocaleString('ko-KR') + '원'; };
  var a = SF.get('ably-kr'), va = SF.defaults(a);
  ['price', 'shipping', 'cost', 'shipCost'].forEach(function (k) { va[k] = v[k]; });
  var ra = SF.calc(a, va), p30 = SF.solveMargin(m, v, 0.3);
  m.s.ko.faq = [{ q: '무신사 입점 수수료는 몇 %인가요?', a: '무신사는 수수료율을 공개하지 않고 브랜드마다 계약으로 정합니다. 중소기업중앙회 2024년 실태조사에서 무신사 평균 판매수수료율은 27.8%로, 조사한 온라인 쇼핑몰 중 가장 높았습니다(SSG닷컴 18.8%, 11번가 12.5%, 쿠팡 12.3%, 네이버 6.3%). 내 수수료율은 입점 계약서나 파트너센터에서 확인할 수 있습니다.' },
    { q: '39,000원짜리 옷을 팔면 얼마가 남나요?', a: '수수료 ' + v.commission + '% 기준으로 판매가 ' + won(v.price) + '(무료배송), 원가 ' + won(v.cost) + ', 택배비 ' + won(v.shipCost) + '이면 수수료 ' + won(r.total) + '이 빠지고 순이익은 약 ' + won(r.profit) + ', 마진율 ' + (r.margin * 100).toFixed(1) + '%입니다. 같은 상품을 에이블리 셀러스(플랫폼 4% + 결제 3.96%)에서 팔면 순이익은 약 ' + won(ra.profit) + '입니다.' },
    { q: '수수료 27.8%면 판매가를 얼마로 정해야 하나요?', a: '판매가 = (원가 + 택배비) ÷ (1 − 수수료율 − 목표 마진율)입니다. 원가 ' + won(v.cost) + ', 택배비 ' + won(v.shipCost) + '으로 마진율 30%를 남기려면 ' + won(v.cost + v.shipCost) + ' ÷ (1 − 0.278 − 0.3) = 약 ' + won(p30) + '이 필요합니다. 수수료가 높을수록 목표 마진을 맞추는 판매가가 빠르게 올라가니, 마진율 계산기의 목표 마진율 칸으로 확인해 보세요.' },
    { q: '무신사가 말하는 실질 수수료 12%와 실제 떼는 수수료는 왜 다른가요?', a: '무신사는 계약 수수료(명목 수수료) 안에 결제 수수료, 서버비, 쿠폰·적립금 할인 비용, 마케팅 지원비가 들어 있고, 이 중 무신사가 부담한 비용을 빼면 실질 수수료율이 2022년 12.2%라고 발표했습니다. 실질 수수료율은 무신사가 남기는 몫이고, 판매자 정산금에서 빠지는 것은 계약 수수료율입니다. 대신 무신사 발표로는 쿠폰·적립금 할인 비용의 95% 이상을 무신사가 냅니다.' },
    { q: '무신사 광고비는 따로 내나요?', a: '2025년 3월부터 무신사 상품 광고가 생겼습니다. PB를 뺀 입점 브랜드는 판매 수수료의 1%를 광고 포인트로 무상 지급받고(월 최소 10만원, 최대 100만원), 더 많이 노출하려면 유상 광고를 추가로 집행합니다. 유상 광고비는 매출 대비 비율로 계산기 상세 설정의 기타 비용 %에 넣으면 순이익에 반영됩니다.' }];
  SF.add(m);
})(typeof window !== 'undefined' ? window : global);
