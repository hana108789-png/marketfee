# MarketFee

Free marketplace seller fee calculators for 13 marketplaces, live at **[marketfee.org](https://marketfee.org)**.

Most fee calculators only cover Amazon, eBay and Etsy. This one covers the marketplaces the big tools ignore — Coupang, Naver SmartStore, Rakuten Ichiba, Yahoo! Shopping, Kaufland, OTTO, Cdiscount, Fnac, bol and more — each written in the language its sellers actually use, with 2026 rates prefilled and editable.

Everything runs in the browser. No server, no accounts, no data leaves the page.

## What it does

- **Per-marketplace calculators** — pick a category and the commission rate fills in; see payout, net profit, margin, ROI and the break-even price.
- **Country comparison** — enter one product and rank every marketplace in that country by net profit. Korea, Japan, Germany and France.
- **Real fee structures**, not just a headline percentage: VAT on fees, monthly plans spread per order, shipping charged separately, payment fees, point funding, tiered rates by product condition.

| Country | Marketplaces |
|---|---|
| Korea | Coupang, Naver SmartStore, 11st, Gmarket / Auction |
| Japan | Rakuten Ichiba, Yahoo! Shopping, Qoo10 |
| Germany | Kaufland, OTTO Market, TikTok Shop |
| France | Cdiscount, Fnac, TikTok Shop |
| Netherlands / Belgium | bol |

Languages: English, Deutsch, Français, Italiano, Español, Nederlands, 日本語, 한국어.

A marketplace is published in the languages of its own trading bloc plus English, not in all eight. Cross-border selling within a bloc is ordinary — Dutch and French sellers list on Kaufland, Korean sellers on Qoo10 Japan — so EU marketplaces carry de/fr/it/es/nl, Japanese ones ja/ko and Korean ones ko/ja. A German page for Coupang had no audience, so those combinations are retired and answered `410`.

## How it is built

A small static site generator. No framework, no build step beyond `node build.js`, no runtime dependencies.

```
src/sf.js            core: languages, shared UI strings, calculation engine
src/m-*.js           one file per marketplace: fee formula + per-language content
src/compare-data.js  country comparison groups
src/app.js           single-market calculator (browser)
src/compare.js       comparison table (browser)
build.js             generates dist/ — 89 static pages, sitemap with hreflang, robots.txt
gone.js              generated: retired URLs, served as 410 by worker.js
worker.js            www → apex redirect, 410s, anonymous usage beacon
notify.js            IndexNow ping after deploy
```

A marketplace is one object: its fields, a `fees(v)` function returning line items, and a `s` map of per-language content. The generator and both runtimes are generic, so adding a marketplace means adding one file.

```js
SF.add({
  id: 'coupang-kr', currency: 'KRW', countries: ['KR'],
  fields: [F.price(29900), F.cost(12000), F.cat([...], '10.5'), F.vat(10), ...],
  fees: function (v) {
    var base = n(v.price) + n(v.shipping);
    return [
      { k: 'commission', a: base * n(v.commission) / 100 },
      { k: 'pay',        a: base * n(v.pay) / 100 },
      ...
    ];
  },
  s: { ko: { title, desc, h1, intro, cats, notes, faq }, en: { ... } }
});
```

## Run it

```bash
node build.js          # -> dist/
npx serve dist
```

Deploy (Cloudflare Workers static assets):

```bash
node build.js && npx wrangler deploy && node notify.js
```

## Fee data

Rates are taken from official fee schedules and reputable seller guides, with sources linked at the bottom of every page. Marketplaces change their fees often — the figures are a starting point, not gospel, and every rate in the calculator is editable.

Found a rate that is wrong or out of date? Open an issue with a source and it will be corrected.

## Licence

MIT.
