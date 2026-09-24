/* Static site generator: node build.js  ->  dist/  (deploy with `npx wrangler deploy`) */
const fs = require('fs');
const path = require('path');

const SRC = ['sf.js', 'm-tiktok.js', 'm-kaufland.js', 'm-otto.js', 'm-cdiscount.js', 'm-fnac.js', 'm-bol.js',
  'm-qoo10.js', 'm-rakuten.js', 'm-yahoo.js', 'm-coupang.js', 'm-naver.js', 'm-11st.js', 'm-gmarket.js', 'compare-data.js'];
for (const f of SRC) require('./src/' + f);
require('./src/pages-data.js'); // site pages only — no need to ship these to the browser
require('./src/guides-data.js'); // informational guides, also build-time only
const SF = global.SF;

const SITE = { name: 'MarketFee', url: 'https://marketfee.org', adsensePub: 'ca-pub-5695549885895685', email: 'hana108789@gmail.com' };
const ADSENSE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsensePub}" crossorigin="anonymous"></script>`;
const LOGO = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#2f5bd0"/><path d="M7 15.5 10.2 11l2.6 2.6L17 8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="8" r="1.6" fill="#fff"/></svg>`;
const FAVICON = `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#2f5bd0"/><path d="M7 15.5 10.2 11l2.6 2.6L17 8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="8" r="1.6" fill="#fff"/></svg>')}">`;

const OG_LOCALE = { en: 'en_US', de: 'de_DE', fr: 'fr_FR', it: 'it_IT', es: 'es_ES', nl: 'nl_NL', ja: 'ja_JP', ko: 'ko_KR' };
const NL = String.fromCharCode(10);
const dist = (...p) => path.join(__dirname, 'dist', ...p);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pathOf = (m, lang) => `/${lang}/${m.slug[lang]}/`;
const cmpPath = (g, lang) => `/${lang}/${g.slug[lang]}/`;
const hubOf = lang => lang === 'en' ? '/' : `/${lang}/`;
const guideOf = (m, lang) => (SF.GUIDES[m.id] || {})[lang];
const guidePath = (m, lang) => `/${lang}/${guideOf(m, lang).slug}/`;
const pgPath = (k, lang) => `/${lang}/${SF.PAGES[k].slug[lang]}/`;
const pname = (m, lang) => (m.names && m.names[lang]) || m.platform;
// Cross-border selling inside a trading bloc is normal, across blocs it is not: a Dutch or
// French seller listing on Kaufland (DE) is routine, and Korean sellers are a main channel for
// Qoo10 Japan. Search Console confirms both — /nl/kaufland- sat at position 5.8 with 51
// impressions. What has no audience is a bloc's language on the other bloc's marketplaces
// (a German Coupang page drew 1 impression). So publish per bloc, plus English everywhere.
const EU_LANGS = ['de', 'fr', 'it', 'es', 'nl'];
const REGION_LANGS = { EU: EU_LANGS, DE: EU_LANGS, FR: EU_LANGS, NL: EU_LANGS, JP: ['ja', 'ko'], KR: ['ko', 'ja'] };
const regionOf = m => m.countries.length > 1 ? 'EU' : m.countries[0];
const wanted = (m, l) => l === 'en' || (REGION_LANGS[regionOf(m)] || []).includes(l);
const translated = m => SF.LANGS.filter(l => m.s[l] && m.slug[l]);
const langsOf = m => translated(m).filter(l => wanted(m, l));
const cmpLangs = g => SF.LANGS.filter(l => g.s[l] && g.slug[l]);
const marketsIn = lang => SF.MARKETS.filter(m => langsOf(m).includes(lang));
const groupsIn = lang => SF.GROUPS.filter(g => g.s[lang] && g.slug[lang]);

fs.rmSync(dist(), { recursive: true, force: true });
fs.mkdirSync(dist(), { recursive: true });
fs.writeFileSync(dist('markets.js'), SRC.map(f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8')).join('\n'));
for (const f of ['app.js', 'compare.js', 'beacon.js', 'langbar.js', 'style.css']) fs.copyFileSync(path.join(__dirname, 'src', f), dist(f));
// static/ is copied verbatim: search-engine verification files and anything else served as-is.
if (fs.existsSync(path.join(__dirname, 'static'))) fs.cpSync(path.join(__dirname, 'static'), dist(), { recursive: true });

const layout = ({ lang, title, desc, url, body, head = '', alternates = [] }) => {
  const t = SF.I18N[lang];
  const links = alternates.map(a => `<link rel="alternate" hreflang="${a.lang}" href="${SITE.url}${a.url}">`).join('\n');
  const xdef = alternates.find(a => a.lang === 'en');
  // <details> keeps every locale as a real crawlable <a> while showing a dropdown.
  const globe = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>`;
  const switcher = alternates.length > 1 ? `<details class="langs"><summary title="${esc(t.languages)}">${globe}<span>${esc(t.langName)}</span></summary><nav class="langmenu" aria-label="${esc(t.languages)}">${alternates.map(a => `<a href="${a.url}" hreflang="${a.lang}"${a.lang === lang ? ' aria-current="true"' : ''}>${esc(SF.I18N[a.lang].langName)}</a>`).join('')}</nav></details>` : '';
  const foot = [...marketsIn(lang).map(m => `<a href="${pathOf(m, lang)}">${esc(pname(m, lang))}</a>`),
    ...marketsIn(lang).filter(m => guideOf(m, lang)).map(m => `<a href="${guidePath(m, lang)}">${esc(guideOf(m, lang).h1)}</a>`),
    ...groupsIn(lang).map(g => `<a href="${cmpPath(g, lang)}">${esc(g.s[lang].h1)}</a>`)];
  const sitePages = Object.keys(SF.PAGES).map(k => `<a href="${pgPath(k, lang)}">${esc(SF.PAGES[k].s[lang].h1)}</a>`);
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE.url}${url}">
${links}${xdef ? `\n<link rel="alternate" hreflang="x-default" href="${SITE.url}${xdef.url}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE.url}${url}">
<meta property="og:locale" content="${OG_LOCALE[lang]}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="author" content="${SITE.name}">
<meta name="theme-color" content="#f6f7f9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1116" media="(prefers-color-scheme: dark)">
${FAVICON}
<meta name="naver-site-verification" content="9ea9c1d78657e817a92643c84dd80d7f1694d82a">
<meta name="msvalidate.01" content="53E71143E4CDAD9B99742112547081BF">
<link rel="stylesheet" href="/style.css">${lang === 'ko' ? `\n<link rel="alternate" type="application/rss+xml" title="${SITE.name}" href="${SITE.url}/rss.xml">` : ''}
${ADSENSE}
${head}
</head>
<body>
<header><div class="bar"><a href="${hubOf(lang)}" class="brand">${LOGO}${SITE.name}</a>${switcher}</div></header>
<main>
${body}
</main>
<footer><p><a href="${hubOf(lang)}">${esc(t.home)}</a> · ${foot.join(' · ')}</p>
<p class="site">${sitePages.join(' · ')} · <span>© ${new Date().getFullYear()} ${SITE.name}</span></p></footer>
<script>document.addEventListener('click',function(e){var d=document.querySelector('.langs[open]');if(d&&!d.contains(e.target))d.removeAttribute('open')});</script>
<script src="/beacon.js" defer></script>
<script src="/langbar.js" defer></script>
</body>
</html>
`;
};

const ratesTable = (m, lang) => {
  const t = SF.I18N[lang], s = m.s[lang];
  const cat = m.fields.find(f => f.k === 'cat');
  if (!cat) return '';
  const dec = (lang === 'ja' || lang === 'ko' || lang === 'en') ? '.' : ',';
  const rows = cat.o.map((o, i) => {
    // "7 / 8 / 10 %" rather than "7 % / 8 % / 10 %": shorter, and it fits a phone.
    const rate = String(o.v).split('+')[0].split('|').map(x => x.replace('.', dec)).join(' / ') + ' %';
    // Category labels end in their rate ("… – 7 / 8 / 10 %"); the rate has its own column.
    return `<tr><td>${esc(s.cats[i].replace(/\s*[–-]\s[\d.,\s\/]+%.*$/, ''))}</td><td>${rate}</td></tr>`;
  }).join('');
  const head = s.cond ? `${t.ratesH} (${s.cond.join(' / ')})` : t.ratesH;
  return `<table class="rates"><thead><tr><th>${esc(t.category)}</th><th>${esc(head)}</th></tr></thead><tbody>${rows}</tbody></table>`;
};
const feeTable = (m, lang) => `<section class="wrap"><h2>${esc(SF.I18N[lang].feeTableH)}</h2>
${ratesTable(m, lang)}
<ul class="notes">${m.s[lang].notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>`;

// A select field's options as a two-column table (label, value %) — the Naver revenue tiers.
const optsTable = (m, lang, key) => {
  const f = m.fields.find(x => x.k === key), L = SF.labels(m, lang);
  if (!f || !f.o) return '';
  const dec = x => Number(x).toLocaleString(SF.LOCALE[lang], { maximumFractionDigits: 3 });
  return `<table class="rates"><thead><tr><th>${esc(L.field(f))}</th><th>${esc(SF.I18N[lang].ratesH)}</th></tr></thead><tbody>${
    f.o.map(o => `<tr><td>${esc(L.opt(o).replace(/\s*[–-]\s[\d.,\s\/]+%.*$/, ''))}</td><td>${dec(String(o.v).split('+')[0])} %</td></tr>`).join('')}</tbody></table>`;
};

// The guide's worked cases, computed through the same SF.calc the calculator uses.
const casesTable = (m, lang, cases) => {
  const t = SF.I18N[lang], fmt = SF.fmt(m, lang);
  const pct = x => (x * 100).toLocaleString(SF.LOCALE[lang], { maximumFractionDigits: 1 }) + ' %';
  const rows = cases.map(c => {
    const v = { ...SF.defaults(m), ...c.v };
    SF.derive(m, v);   // plan/tier/category overrides set the rates they imply, as the form would
    const r = SF.calc(m, v);
    return `<tr><td>${esc(c.label)}</td><td>${fmt.format(r.total)}</td><td>${fmt.format(r.payout)}</td><td class="${r.profit >= 0 ? 'pos' : 'neg'}">${fmt.format(r.profit)}</td><td>${pct(r.margin)}</td><td>${fmt.format(SF.solve(m, v, 0))}</td></tr>`;
  }).join('');
  return `<div class="scroll"><table class="rates cases"><thead><tr><th>${esc(t.caseH)}</th><th>${esc(t.feesTotal)}</th><th>${esc(t.payout)}</th><th>${esc(t.profit)}</th><th>${esc(t.margin)}</th><th>${esc(t.breakEven)}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
};

// Same product, five prices. Real numbers a seller can read off before deciding what to list at,
// and the one part of the page whose figures differ for every marketplace.
const scenarios = (m, lang) => {
  const t = SF.I18N[lang];
  const v = SF.defaults(m), base = SF.n(v.price);
  if (!base) return '';
  const zero = m.currency === 'JPY' || m.currency === 'KRW';
  const fmt = x => new Intl.NumberFormat(SF.LOCALE[lang], { style: 'currency', currency: m.currency, maximumFractionDigits: zero ? 0 : 2 }).format(x);
  const pct = x => (x * 100).toLocaleString(SF.LOCALE[lang], { maximumFractionDigits: 1 }) + ' %';
  // Round each point to a price a human would actually list at, and keep the default exact.
  const step = Math.pow(10, Math.max(0, Math.floor(Math.log10(base)) - 1));
  const prices = [...new Set([0.6, 0.8, 1, 1.3, 1.6].map(k =>
    k === 1 ? base : Math.round(base * k / step) * step))].sort((a, b) => a - b);
  const rows = prices.map(p => {
    const r = SF.calc(m, { ...v, price: p });
    const cls = [p === base ? 'now' : '', r.profit < 0 ? 'loss' : ''].filter(Boolean).join(' ');
    return `<tr${cls ? ` class="${cls}"` : ''}>
<td>${fmt(p)}</td><td>−${fmt(r.total)}</td><td>${fmt(r.payout)}</td><td>${fmt(r.profit)}</td><td>${pct(r.margin)}</td></tr>`;
  }).join('\n');
  return `<section class="wrap"><h2>${esc(t.scenarioH)}</h2>
<p class="note">${esc(t.scenarioLead)}</p>
<div class="scroll"><table class="rates scen"><thead><tr><th>${esc(t.price)}</th><th>${esc(t.feesTotal)}</th><th>${esc(t.payout)}</th><th>${esc(t.profit)}</th><th>${esc(t.margin)}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
};

const faqHtml = (faq, lang) => `<section class="wrap"><h2>${esc(SF.I18N[lang].faqH)}</h2>${faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`;
// A free browser tool is a WebApplication; saying so plainly is how Google learns the page
// is a calculator rather than an article. Breadcrumbs replace the bare URL in the result line.
const ld = o => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...o })}</script>`;
const appLd = (lang, url, name, desc) => ld({
  '@type': 'WebApplication', name, description: desc, url: SITE.url + url,
  applicationCategory: 'BusinessApplication', operatingSystem: 'Any', inLanguage: lang,
  isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url }
});
const crumbLd = (lang, name) => ld({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: SF.I18N[lang].home, item: SITE.url + hubOf(lang) },
    { '@type': 'ListItem', position: 2, name }
  ]
});
const faqLd = faq => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })}</script>`;
const sourcesLine = (m, lang) => `<p class="meta">${esc(SF.I18N[lang].updated)}: ${SF.UPDATED} · ${esc(SF.I18N[lang].sources)}: ${m.sources.map(x => `<a href="${x.u}" rel="nofollow noopener" target="_blank">${esc(x.n)}</a>`).join(', ')}</p>`;

// Commission range straight from the category options — language-neutral, no translation needed.
const rateRange = (m, lang) => {
  const cat = m.fields.find(f => f.k === 'cat');
  // Markets without categories (Rakuten, Yahoo) advertise a rate on another field instead,
  // labelled with the market's own fee name where it has one.
  if (!cat) {
    const n = m.rateNote;
    if (!n) return '';
    const label = (m.s[lang].fee && m.s[lang].fee[n.key]) || SF.I18N[lang][n.key] || n.key;
    const dec = x => x.toLocaleString(SF.LOCALE[lang], { maximumFractionDigits: 1 });
    return `${label} ${n.lo === n.hi ? dec(n.lo) : dec(n.lo) + '–' + dec(n.hi)} %`;
  }
  const nums = cat.o.flatMap(o => String(o.v).split('+')[0].split('|').map(Number)).filter(x => x > 0);
  if (!nums.length) return '';
  const dec = x => x.toLocaleString(SF.LOCALE[lang], { maximumFractionDigits: 1 });
  const lo = Math.min(...nums), hi = Math.max(...nums);
  return `${SF.I18N[lang].commission.replace(/\s*%$/, '')} ${lo === hi ? dec(lo) : dec(lo) + '–' + dec(hi)} %`;
};
const card = (m, lang) => `<li><a href="${pathOf(m, lang)}"><b>${esc(pname(m, lang))}</b> <i>${esc(m.region)}</i> <span>${esc(rateRange(m, lang) || m.s[lang].h1)}</span></a></li>`;
const cmpCard = (g, lang) => `<li><a href="${cmpPath(g, lang)}"><b>${esc(g.s[lang].h1)}</b> <i>${esc(g.code)}</i> <span>${g.markets.map(id => esc(pname(SF.get(id), lang))).join(' · ')}</span></a></li>`;

const urls = [];  // { url, alternates } — alternates feed the sitemap's hreflang block

// Market pages
for (const m of SF.MARKETS) {
  for (const lang of langsOf(m)) {
    const t = SF.I18N[lang], s = m.s[lang], url = pathOf(m, lang);
    const alternates = langsOf(m).map(l => ({ lang: l, url: pathOf(m, l) }));
    const related = marketsIn(lang).filter(x => x.id !== m.id);
    const myGroups = groupsIn(lang).filter(g => g.markets.includes(m.id));
    const body = `<article>
<h1>${esc(s.h1)}</h1>
<p class="intro">${esc(s.intro)}</p>
<div class="ad" data-slot="top"></div>
<section class="calc"><form id="f" autocomplete="off">${SF.formHtml(m, lang, SF.defaults(m))}</form><div id="out" class="out">${SF.outHtml(m, lang, SF.defaults(m))}</div></section>
<p class="note">${esc(t.editableNote)} ${esc(t.disclaimer)}</p>
${(links => links.length ? `<p class="cta big">${links.join(' ')}</p>` : '')([
      ...(guideOf(m, lang) ? [`<a class="btn" href="${guidePath(m, lang)}">${esc(t.guideLink)} →</a>`] : []),
      ...myGroups.map(g => `<a class="btn ghost" href="${cmpPath(g, lang)}">${esc(g.s[lang].h1)} →</a>`)])}
${scenarios(m, lang)}
${feeTable(m, lang)}
${faqHtml(s.faq, lang)}
${sourcesLine(m, lang)}
<div class="ad" data-slot="bottom"></div>
<section class="wrap"><h2>${esc(t.otherCalcs)}</h2><ul class="list">${related.map(x => card(x, lang)).join('')}</ul></section>
</article>
<script src="/markets.js"></script><script src="/app.js"></script><script>init(${JSON.stringify(m.id)}, ${JSON.stringify(lang)})</script>`;
    fs.mkdirSync(dist(url), { recursive: true });
    fs.writeFileSync(dist(url, 'index.html'), layout({ lang, title: s.title, desc: s.desc, url, body,
      head: faqLd(s.faq) + appLd(lang, url, s.h1, s.desc) + crumbLd(lang, s.h1), alternates }));
    urls.push({ url, alternates, lang, title: s.title, desc: s.desc });
  }
}

// Country comparison pages
for (const g of SF.GROUPS) {
  for (const lang of cmpLangs(g)) {
    const t = SF.I18N[lang], s = g.s[lang], url = cmpPath(g, lang);
    const alternates = cmpLangs(g).map(l => ({ lang: l, url: cmpPath(g, l) }));
    const members = g.markets.map(SF.get);
    const body = `<article>
<h1>${esc(s.h1)}</h1>
<p class="intro">${esc(s.intro)}</p>
<div class="ad" data-slot="top"></div>
<section class="calc compare"><form id="f" autocomplete="off">${SF.cmpFormHtml(g, lang, SF.cmpDefaults(g).shared)}</form><div id="out" class="out">${(d => SF.cmpOutHtml(g, lang, d.shared, d.cats))(SF.cmpDefaults(g))}</div></section>
<p class="note">${esc(t.editableNote)} ${esc(t.disclaimer)}</p>
<section class="wrap"><h2>${esc(t.feeTableH)}</h2><ul class="notes">${s.notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
${faqHtml(s.faq, lang)}
<p class="meta">${esc(t.updated)}: ${SF.UPDATED}. ${esc(t.disclaimer)}</p>
<div class="ad" data-slot="bottom"></div>
<section class="wrap"><h2>${esc(t.otherCalcs)}</h2><ul class="list">${members.map(m => card(m, langsOf(m).includes(lang) ? lang : 'en')).join('')}</ul></section>
</article>
<script src="/markets.js"></script><script src="/compare.js"></script><script>initCompare(${JSON.stringify(g.code)}, ${JSON.stringify(lang)})</script>`;
    fs.mkdirSync(dist(url), { recursive: true });
    fs.writeFileSync(dist(url, 'index.html'), layout({ lang, title: s.title, desc: s.desc, url, body,
      head: faqLd(s.faq) + appLd(lang, url, s.h1, s.desc) + crumbLd(lang, s.h1), alternates }));
    urls.push({ url, alternates, lang, title: s.title, desc: s.desc });
  }
}

// Language hubs
for (const lang of SF.LANGS) {
  const t = SF.I18N[lang], hubUrl = hubOf(lang);
  const gs = groupsIn(lang);
  // Group markets by country and float the reader's own country to the top.
  const home = SF.HOMECOUNTRY[lang];
  const byCountry = {};
  for (const m of marketsIn(lang)) {
    const key = m.countries.length > 1 ? 'EU' : m.countries[0];
    (byCountry[key] ||= []).push(m);
  }
  // Rank by how many marketplaces the country has overall, not how many are translated into `lang`.
  const size = code => SF.MARKETS.filter(m => (m.countries.length > 1 ? 'EU' : m.countries[0]) === code).length;
  const order = Object.keys(byCountry).sort((a, b) =>
    (b === home) - (a === home) || size(b) - size(a) || a.localeCompare(b));
  const hubBody = `<article>
<h1>${esc(t.hubH1)}</h1>
<p class="intro">${esc(t.hubIntro)}</p>
<div class="ad" data-slot="top"></div>
${/* one group would just repeat the link in its country heading below */ gs.length > 1 ? `<h2>${esc(t.compareH)}</h2><ul class="list cards cmps">${gs.map(g => cmpCard(g, lang)).join('')}</ul>` : ''}
${order.map(code => {
    const g = gs.find(x => x.code === code);
    return `<h2>${esc(SF.COUNTRY[code][lang])}${g ? ` <a class="h2link" href="${cmpPath(g, lang)}">${esc(t.compareH)} →</a>` : ''}</h2>
<ul class="list cards">${byCountry[code].map(m => card(m, lang)).join('')}</ul>${(gs => gs.length ? `<p class="guides">${esc(t.guidesH)}: ${gs.map(m => `<a href="${guidePath(m, lang)}">${esc(pname(m, lang))}</a>`).join(' · ')}</p>` : '')(byCountry[code].filter(m => guideOf(m, lang)))}`;
  }).join('')}
<p class="meta">${esc(t.updated)}: ${SF.UPDATED}. ${esc(t.disclaimer)}</p>
</article>`;
  fs.mkdirSync(dist(hubUrl), { recursive: true });
  // Each hub now carries a different set of marketplaces, so name the ones it actually links to
  // rather than repeating one hard-coded list in eight languages.
  const sep = lang === 'ja' ? '・' : lang === 'ko' ? '·' : ', ';
  // Budget by characters, not by count: Google cuts a title near 60 and a description near 155,
  // and marketplace names vary wildly in length. Take names while they still fit.
  const names = budget => {
    const out = [];
    for (const m of marketsIn(lang)) {
      const n = pname(m, lang);
      if ((out.length ? out.join(sep).length + sep.length : 0) + n.length > budget) break;
      out.push(n);
    }
    return out.join(sep);
  };
  const room = (tpl, cap) => cap - tpl.length + '{markets}'.length;
  const hubTitle = t.hubTitle.replace('{markets}', names(room(t.hubTitle, 60)));
  const hubDesc = t.hubDesc.replace('{markets}', names(room(t.hubDesc, 155)));
  const hubAlts = SF.LANGS.map(l => ({ lang: l, url: hubOf(l) }));
  fs.writeFileSync(dist(hubUrl, 'index.html'), layout({ lang, url: hubUrl, body: hubBody, title: hubTitle, desc: hubDesc, alternates: hubAlts }));
  urls.push({ url: hubUrl, alternates: hubAlts, lang, title: hubTitle, desc: hubDesc });
}

// About / privacy / contact — required of any ad-supported site, and the privacy
// page is the only honest place to describe what the usage beacon records.
for (const key of Object.keys(SF.PAGES)) {
  const p = SF.PAGES[key];
  for (const lang of SF.LANGS) {
    const t = SF.I18N[lang], s = p.s[lang], url = pgPath(key, lang);
    const alternates = SF.LANGS.map(l => ({ lang: l, url: pgPath(key, l) }));
    const blocks = s.body.map(([h, ...ps]) =>
      `<section class="wrap"><h2>${esc(h)}</h2>${ps.map(x => {
        const html = esc(x).replace('{EMAIL}', `<a href="mailto:${SITE.email}">${SITE.email}</a>`);
        return `<p>${html}</p>`;
      }).join('')}</section>`).join('\n');
    const body = `<article class="page">
<h1>${esc(s.h1)}</h1>
${blocks}
<p class="meta">${esc(t.updated)}: ${p.updated || SF.UPDATED}</p>
</article>`;
    fs.mkdirSync(dist(url), { recursive: true });
    fs.writeFileSync(dist(url, 'index.html'), layout({ lang, title: s.title, desc: s.desc, url, body,
      head: crumbLd(lang, s.h1), alternates }));
    urls.push({ url, alternates, lang, title: s.title, desc: s.desc, date: p.updated });
  }
}

// Informational guides: for people who search "쿠팡 수수료", not "쿠팡 수수료 계산기".
// Prose lives in guides-data.js; every table is generated from the market file so it cannot drift.
for (const id of Object.keys(SF.GUIDES)) {
  const m = SF.get(id);
  for (const lang of Object.keys(SF.GUIDES[id])) {
    const g = SF.GUIDES[id][lang], t = SF.I18N[lang], url = guidePath(m, lang);
    const alternates = Object.keys(SF.GUIDES[id]).map(l => ({ lang: l, url: guidePath(m, l) }));
    const block = x => {
      if (x === '@rates') return ratesTable(m, lang);
      if (x === '@example') return casesTable(m, lang, g.example || []);
      if (x.startsWith('@opts:')) return optsTable(m, lang, x.slice(6));
      return `<p>${esc(x)}</p>`;
    };
    const myGroups = groupsIn(lang).filter(x => x.markets.includes(m.id));
    const calcLink = `<a class="btn" href="${pathOf(m, lang)}">${esc(t.guideCta)} →</a>`;
    const body = `<article class="page guide">
<h1>${esc(g.h1)}</h1>
<p class="intro">${esc(g.lead)}</p>
<p class="cta big">${calcLink}</p>
${g.body.map(([h, ...ps]) => `<section class="wrap"><h2>${esc(h)}</h2>${ps.map(block).join('')}</section>`).join('\n')}
${g.faq ? faqHtml(g.faq, lang) : ''}
<p class="cta big">${calcLink}${myGroups.map(x => ` <a class="btn ghost" href="${cmpPath(x, lang)}">${esc(x.s[lang].h1)} →</a>`).join('')}</p>
${sourcesLine(m, lang)}
<p class="meta">${esc(t.updated)}: ${g.updated || SF.UPDATED}</p>
</article>`;
    const articleLd = ld({ '@type': 'Article', headline: g.h1, description: g.desc, inLanguage: lang,
      datePublished: g.updated || SF.UPDATED, dateModified: g.updated || SF.UPDATED,
      author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      mainEntityOfPage: SITE.url + url });
    fs.mkdirSync(dist(url), { recursive: true });
    fs.writeFileSync(dist(url, 'index.html'), layout({ lang, title: g.title, desc: g.desc, url, body,
      head: articleLd + (g.faq ? faqLd(g.faq) : '') + crumbLd(lang, g.h1), alternates }));
    urls.push({ url, alternates, lang, title: g.title, desc: g.desc, date: g.updated });
  }
}

// lastmod has to be true to be useful: a sitemap that dated every page 2026-09-09, including
// guides written on the 24th, teaches search engines to ignore the field. Hash what a reader
// would call the content (title, description, <main>) and move a page's date only when that
// hash changes. lastmod.json is committed so the dates survive between builds.
const crypto = require('crypto');
const LASTMOD_FILE = path.join(__dirname, 'lastmod.json');
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
const known = fs.existsSync(LASTMOD_FILE) ? JSON.parse(fs.readFileSync(LASTMOD_FILE, 'utf8')) : {};
const lastmod = {};
for (const u of urls) {
  const html = fs.readFileSync(dist(u.url, 'index.html'), 'utf8');
  const part = re => (html.match(re) || [''])[0];
  const hash = crypto.createHash('sha1')
    .update(part(/<title>[\s\S]*?<\/title>/) + part(/<meta name="description"[^>]*>/) + part(/<main>[\s\S]*?<\/main>/))
    .digest('hex').slice(0, 16);
  const prev = known[u.url];
  lastmod[u.url] = { hash, date: prev && prev.hash === hash ? prev.date : today };
}
const lastmodJson = JSON.stringify(Object.fromEntries(Object.keys(lastmod).sort().map(k => [k, lastmod[k]])), null, 1);
if (!fs.existsSync(LASTMOD_FILE) || fs.readFileSync(LASTMOD_FILE, 'utf8') !== lastmodJson + '\n') fs.writeFileSync(LASTMOD_FILE, lastmodJson + '\n');
const changedToday = Object.values(lastmod).filter(x => x.date === today).length;

// Declaring the language set in the sitemap as well as in the head is what lets Google treat
// the translations as one cluster and serve the right one instead of choosing for itself.
const sitemapUrl = ({ url, alternates = [] }) => {
  const tag = (rel, href) => '\n  <xhtml:link rel=\"alternate\" hreflang=\"' + rel + '\" href=\"' + SITE.url + href + '\"/>';
  const alts = alternates.map(a => tag(a.lang, a.url)).join('');
  const xdef = alternates.find(a => a.lang === 'en');
  return '<url>\n  <loc>' + SITE.url + url + '</loc>\n  <lastmod>' + lastmod[url].date + '</lastmod>'
    + alts + (xdef ? tag('x-default', xdef.url) : '') + '\n</url>';
};
fs.writeFileSync(dist('sitemap.xml'),
  '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n'
  + '<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n'
  + urls.map(sitemapUrl).join('\n') + '\n</urlset>\n');
fs.writeFileSync(dist('robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);

// Naver's crawler discovers pages through RSS far more readily than through a sitemap; two
// weeks of sitemap alone got one page indexed. Korean pages only: Naver ranks Korean content.
const rfc822 = d => new Date(d + 'T00:00:00+09:00').toUTCString();
const rssItem = u => ['<item>',
  '  <title>' + esc(u.title) + '</title>',
  '  <link>' + SITE.url + u.url + '</link>',
  '  <guid isPermaLink="true">' + SITE.url + u.url + '</guid>',
  '  <description>' + esc(u.desc) + '</description>',
  '  <pubDate>' + rfc822(lastmod[u.url].date) + '</pubDate>',
  '</item>'].join(NL);
const ko = urls.filter(u => u.lang === 'ko').sort((a, b) => lastmod[b.url].date.localeCompare(lastmod[a.url].date));
fs.writeFileSync(dist('rss.xml'), ['<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  '<channel>',
  '  <title>' + esc(SF.I18N.ko.hubH1) + ' – ' + SITE.name + '</title>',
  '  <link>' + SITE.url + '/ko/</link>',
  '  <atom:link href="' + SITE.url + '/rss.xml" rel="self" type="application/rss+xml"/>',
  '  <description>' + esc(SF.I18N.ko.hubIntro) + '</description>',
  '  <language>ko</language>',
  '  <lastBuildDate>' + rfc822(ko[0] ? lastmod[ko[0].url].date : today) + '</lastBuildDate>',
  ...ko.map(rssItem),
  '</channel>', '</rss>', ''].join(NL));

// These were published before the language prune. 410 tells Google they are gone on purpose,
// which drops them from the index faster than letting them 404.
const gone = SF.MARKETS.flatMap(m => translated(m).filter(l => !wanted(m, l)).map(l => pathOf(m, l)));
fs.writeFileSync(path.join(__dirname, 'gone.js'),
  `/* generated by build.js — URLs retired in the language prune, served as 410 */\nexport default ${JSON.stringify(gone, null, 1)};\n`);

fs.writeFileSync(dist('ads.txt'), `google.com, ${SITE.adsensePub.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
console.log('built', urls.length, 'pages ->', dist(), '·', changedToday, 'dated', today);
