(function (root) {
  var SF = root.SF, F = SF.F, n = SF.n;
  SF.add({
    id: 'yahoo-jp', currency: 'JPY', flag: '', platform: 'Yahoo! Shopping', region: 'JP', countries: ['JP'], names: {ja: 'Yahoo!ショッピング',ko: '야후 재팬'}, primary: ['payM', 'royalty', 'orders'], rateNote: { key: 'royalty', lo: 2.5, hi: 2.5 },
    slug: { en: 'yahoo-shopping-japan-fee-calculator', ja: 'yahoo-shopping-fee-calculator' },
    fields: [F.price(3980), F.shipping(0), F.cost(1800), F.shipCost(600),
      { k: 'royalty', l: 'royalty', t: 'num', u: '%', d: 2.5, step: 0.1 },
      { k: 'payM', l: 'payM', t: 'sel', d: '3.0', o: [{ l: 'paypay', v: '3.0' }, { l: 'card', v: '3.24' }, { l: 'carrier', v: '4.48' }], sets: 'pay' },
      { k: 'pay', l: 'pay', t: 'num', u: '%', d: 3.0, step: 0.01 },
      { k: 'points', l: 'points', t: 'num', u: '%', d: 1, step: 0.5 },
      { k: 'aff', l: 'aff', t: 'num', u: '%', d: 0, step: 0.5 },
      { k: 'pr', l: 'pr', t: 'num', u: '%', d: 0, step: 0.5 },
      { k: 'monthly', l: 'monthly', t: 'num', u: 'cur', d: 10000, step: 100 },
      F.orders(150), F.vat(10), F.other(), F.target()],
    fees: function (v) {
      var base = n(v.price) + n(v.shipping), p = n(v.price);
      var roy = base * n(v.royalty) / 100, pay = base * n(v.pay) / 100;
      var aff = p * n(v.aff) / 100 * 1.3; // partner reward + Yahoo's 30 % handling fee on it
      return [{ k: 'royalty', a: roy }, { k: 'pay', a: pay }, { k: 'points', a: p * n(v.points) / 100 },
        { k: 'aff', a: aff }, { k: 'pr', a: p * n(v.pr) / 100 },
        { k: 'monthly', a: n(v.monthly) / Math.max(1, n(v.orders)) },
        { k: 'vatOnFees', a: (roy + pay) * n(v.vat) / 100 }, { k: 'otherCost', a: base * n(v.other) / 100 }];
    },
    sources: [{ n: 'Finner：Yahoo!ショッピングの手数料・費用を徹底解説（2026）', u: 'https://finner.co.jp/media/yahoo-fees/' },
      { n: 'すけねこ：2026年9月改定 Yahoo!ショッピングが有料化へ', u: 'https://www.sukeneko.com/skblog/15679/' },
      { n: 'ファイブスプリングス：Yahoo!ショッピングの手数料と月商別の費用目安', u: 'https://www.5springs.co.jp/blog/yahoo-cost/' },
      { n: 'Yahoo!ショッピング 出店案内（公式）', u: 'https://business-ec.yahoo.co.jp/' }],
    s: {
      ja: { title: 'Yahoo!ショッピング 手数料計算ツール 2026｜月額システム利用料・売上ロイヤリティ・利益', desc: '2026年9月改定後のYahoo!ショッピング手数料を計算：月額システム利用料10,000円、売上ロイヤリティ2.5%、決済手数料、ストアポイント原資、アフィリエイトを反映して入金額・純利益・損益分岐価格を無料計算。', h1: 'Yahoo!ショッピング 手数料計算ツール（2026年版）', intro: '2026年9月の改定でYahoo!ショッピングは無料出店から有料へ変わりました。月額システム利用料10,000円（税抜）と売上ロイヤリティ2.5%が新設され、代わりにキャンペーン原資負担1.5%は廃止。これに決済手数料（PayPay 3.0%／カード 3.24%／キャリア 4.48%）、ストアポイント原資1〜15%、アフィリエイトが加わります。注文数を入れると月額費用を1件あたりに按分して計算します。',
        f: { royalty: '売上ロイヤリティ %', payM: '決済方法', pay: '決済手数料 %', points: 'ストアポイント原資 %', aff: 'アフィリエイト パートナー報酬 %', pr: 'PRオプション %（任意）', monthly: '月額システム利用料（税抜）' },
        o: { paypay: 'PayPay残高 – 3.0%', card: 'クレジットカード – 3.24%', carrier: 'キャリア決済 – 4.48%' },
        fee: { royalty: '売上ロイヤリティ', pay: '決済手数料', points: 'ストアポイント原資', aff: 'アフィリエイト（報酬＋手数料30%）', pr: 'PRオプション', monthly: '月額システム利用料（按分）' },
        notes: ['2026年9月改定：月額システム利用料10,000円（税抜）と売上ロイヤリティ2.5%が新設、キャンペーン原資負担1.5%は廃止、PRオプションは3%→2%に引き下げ。', '決済手数料は決済方法により3.0〜4.48%。ストアポイント原資は1〜15%の範囲で自分で設定します（最低1%）。', 'アフィリエイトはパートナー報酬（1〜50%で設定）に加えて、その30%が手数料として発生します。計算では報酬×1.3で概算しています。', '入金サイクルを早めると0〜0.6%の手数料が別途かかります。初期費用は無料です。'],
        faq: [{ q: '2026年9月からYahoo!ショッピングの費用はどう変わりましたか？', a: '月額システム利用料10,000円（税抜）と売上ロイヤリティ2.5%が新設されました。一方でキャンペーン原資負担1.5%が廃止され、PRオプションは3%から2%に下がっています。固定費と変動費の両方が発生する体系になりました。' },
          { q: '決済手数料はいくらですか？', a: '決済方法によって変わります。PayPay残高が3.0%、クレジットカードが3.24%、キャリア決済が4.48%です。計算ツールでは決済方法を選ぶと自動で入ります。' },
          { q: 'ストアポイント原資とは何ですか？', a: '購入者に付与されるPayPayポイントの原資で、出店者が1〜15%の範囲で設定します。最低1%は必須で、倍率を上げるほど集客力は増えますがコストも増えます。' },
          { q: '変動費は合計でどのくらいですか？', a: '売上ロイヤリティ2.5%、決済手数料3.0〜4.48%、ストアポイント原資1%以上を足すと最低でも売上の6.5〜8%程度。アフィリエイトやPRオプションを使うとさらに増えます。' }] },
      en: { title: 'Yahoo! Shopping Japan Fee Calculator 2026 – New Fees', desc: 'Free Yahoo! Shopping Japan fee calculator with the September 2026 changes: ¥10,000 monthly system fee, 2.5 % sales royalty, payment fee and payout.', h1: 'Yahoo! Shopping Japan Fee Calculator (2026)', intro: 'From September 2026 Yahoo! Shopping is no longer free to sell on: a ¥10,000 monthly system fee (ex tax) and a 2.5 % sales royalty were introduced, while the 1.5 % campaign funding charge was abolished. On top come the payment fee (PayPay 3.0 %, card 3.24 %, carrier billing 4.48 %), store point funding of 1–15 % and affiliate rewards. Enter your monthly orders and the fixed fee is spread per order.',
        f: { royalty: 'Sales royalty %', payM: 'Payment method', pay: 'Payment fee %', points: 'Store point funding %', aff: 'Affiliate partner reward %', pr: 'PR option % (optional)', monthly: 'Monthly system fee (ex tax)' },
        o: { paypay: 'PayPay balance – 3.0 %', card: 'Credit card – 3.24 %', carrier: 'Carrier billing – 4.48 %' },
        fee: { royalty: 'Sales royalty', pay: 'Payment fee', points: 'Store point funding', aff: 'Affiliate (reward + 30 % fee)', pr: 'PR option', monthly: 'Monthly system fee (spread)' },
        notes: ['September 2026 change: a ¥10,000 monthly system fee (ex tax) and a 2.5 % sales royalty were added, the 1.5 % campaign funding charge was abolished and the PR option dropped from 3 % to 2 %.', 'The payment fee is 3.0–4.48 % depending on method. Store point funding is set by you between 1 % and 15 %, with 1 % as the minimum.', 'Affiliate costs are the partner reward you set (1–50 %) plus a 30 % handling fee on that reward; the calculator estimates it as reward × 1.3.', 'Faster payout cycles cost an extra 0–0.6 %. There is no setup fee.'],
        faq: [{ q: 'What changed for Yahoo! Shopping in September 2026?', a: 'A ¥10,000 monthly system fee (ex tax) and a 2.5 % sales royalty were introduced. In exchange the 1.5 % campaign funding charge was abolished and the PR option fell from 3 % to 2 %, so the model now mixes fixed and variable costs.' },
          { q: 'How much is the payment fee?', a: 'It depends on the method: 3.0 % for PayPay balance, 3.24 % for credit cards and 4.48 % for carrier billing. Selecting the method fills the rate in automatically.' },
          { q: 'What is store point funding?', a: 'It funds the PayPay points given to buyers. You set it between 1 % and 15 %, with 1 % mandatory. A higher multiplier attracts more buyers but costs more per sale.' },
          { q: 'What do the variable fees add up to?', a: 'At least about 6.5–8 % of sales: 2.5 % royalty, 3.0–4.48 % payment fee and a minimum 1 % point funding. Affiliate rewards and the PR option push it higher.' }] }
    }
  });
})(typeof window !== 'undefined' ? window : global);
