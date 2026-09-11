/* Static site generator: node build.js  ->  dist/  (deploy with `npx wrangler deploy`) */
const fs = require('fs');
const path = require('path');

const SRC = ['sf.js', 'm-tiktok.js', 'm-kaufland.js', 'm-otto.js', 'm-cdiscount.js', 'm-fnac.js', 'm-bol.js',
  'm-qoo10.js', 'm-rakuten.js', 'm-yahoo.js', 'm-coupang.js', 'm-naver.js', 'm-11st.js', 'm-gmarket.js', 'compare-data.js'];
for (const f of SRC) require('./src/' + f);
const SF = global.SF;

const SITE = { name: 'MarketFee', url: 'https://marketfee.org', adsensePub: 'ca-pub-5695549885895685' };
const ADSENSE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsensePub}" crossorigin="anonymous"></script>`;
const LOGO = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#2f5bd0"/><path d="M7 15.5 10.2 11l2.6 2.6L17 8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="8" r="1.6" fill="#fff"/></svg>`;
const FAVICON = `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#2f5bd0"/><path d="M7 15.5 10.2 11l2.6 2.6L17 8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="8" r="1.6" fill="#fff"/></svg>')}">`;

const OG_LOCALE = { en: 'en_US', de: 'de_DE', fr: 'fr_FR', it: 'it_IT', es: 'es_ES', nl: 'nl_NL', ja: 'ja_JP', ko: 'ko_KR' };
const dist = (...p) => path.join(__dirname, 'dist', ...p);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pathOf = (m, lang) => `/${lang}/${m.slug[lang]}/`;
const cmpPath = (g, lang) => `/${lang}/${g.slug[lang]}/`;
const hubOf = lang => lang === 'en' ? '/' : `/${lang}/`;
const pname = (m, lang) => (m.names && m.names[lang]) || m.platform;
const langsOf = m => SF.LANGS.filter(l => m.s[l] && m.slug[l]);
const cmpLangs = g => SF.LANGS.filter(l => g.s[l] && g.slug[l]);
const marketsIn = lang => SF.MARKETS.filter(m => m.s[lang] && m.slug[lang]);
const groupsIn = lang => SF.GROUPS.filter(g => g.s[lang] && g.slug[lang]);

fs.rmSync(dist(), { recursive: true, force: true });
fs.mkdirSync(dist(), { recursive: true });
fs.writeFileSync(dist('markets.js'), SRC.map(f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8')).join('\n'));
for (const f of ['app.js', 'compare.js', 'style.css']) fs.copyFileSync(path.join(__dirname, 'src', f), dist(f));
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
    ...groupsIn(lang).map(g => `<a href="${cmpPath(g, lang)}">${esc(g.s[lang].h1)}</a>`)];
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
<link rel="stylesheet" href="/style.css">
${ADSENSE}
${head}
</head>
<body>
<header><div class="bar"><a href="${hubOf(lang)}" class="brand">${LOGO}${SITE.name}</a>${switcher}</div></header>
<main>
${body}
</main>
<footer><a href="${hubOf(lang)}">${esc(t.home)}</a> · ${foot.join(' · ')}</footer>
<script>document.addEventListener('click',function(e){var d=document.querySelector('.langs[open]');if(d&&!d.contains(e.target))d.removeAttribute('open')});</script>
</body>
</html>
`;
};

const feeTable = (m, lang) => {
  const t = SF.I18N[lang], s = m.s[lang];
  const cat = m.fields.find(f => f.k === 'cat');
  const dec = (lang === 'ja' || lang === 'ko' || lang === 'en') ? '.' : ',';
  const rows = cat ? cat.o.map((o, i) => {
    const rate = String(o.v).split('+')[0].split('|').map(x => x.replace('.', dec) + ' %').join(' / ');
    return `<tr><td>${esc(s.cats[i].replace(/\s[–-]\s[\d.,]+\s?%.*$/, ''))}</td><td>${rate}</td></tr>`;
  }).join('') : '';
  const head = s.cond ? `${t.ratesH} (${s.cond.join(' / ')})` : t.ratesH;
  return `<section class="wrap"><h2>${esc(t.feeTableH)}</h2>
${rows ? `<table class="rates"><thead><tr><th>${esc(t.category)}</th><th>${esc(head)}</th></tr></thead><tbody>${rows}</tbody></table>` : ''}
<ul class="notes">${s.notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>`;
};

const faqHtml = (faq, lang) => `<section class="wrap"><h2>${esc(SF.I18N[lang].faqH)}</h2>${faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`;
const faqLd = faq => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })}</script>`;
const sourcesLine = (m, lang) => `<p class="meta">${esc(SF.I18N[lang].updated)}: ${SF.UPDATED} · ${esc(SF.I18N[lang].sources)}: ${m.sources.map(x => `<a href="${x.u}" rel="nofollow noopener" target="_blank">${esc(x.n)}</a>`).join(', ')}</p>`;

// Commission range straight from the category options — language-neutral, no translation needed.
const rateRange = (m, lang) => {
  const cat = m.fields.find(f => f.k === 'cat');
  // Markets without categories (Rakuten) advertise a rate range on another field instead.
  if (!cat) return m.rateNote ? `${SF.I18N[lang][m.rateNote.key] || m.rateNote.key} ${m.rateNote.lo}–${m.rateNote.hi} %` : '';
  const nums = cat.o.flatMap(o => String(o.v).split('+')[0].split('|').map(Number)).filter(x => x > 0);
  if (!nums.length) return '';
  const dec = x => x.toLocaleString(SF.LOCALE[lang], { maximumFractionDigits: 1 });
  const lo = Math.min(...nums), hi = Math.max(...nums);
  return `${SF.I18N[lang].commission.replace(/\s*%$/, '')} ${lo === hi ? dec(lo) : dec(lo) + '–' + dec(hi)} %`;
};
const card = (m, lang) => `<li><a href="${pathOf(m, lang)}"><b>${esc(pname(m, lang))}</b> <i>${esc(m.region)}</i> <span>${esc(rateRange(m, lang) || m.s[lang].h1)}</span></a></li>`;
const cmpCard = (g, lang) => `<li><a href="${cmpPath(g, lang)}"><b>${esc(g.s[lang].h1)}</b> <i>${esc(g.code)}</i> <span>${g.markets.map(id => esc(pname(SF.get(id), lang))).join(' · ')}</span></a></li>`;

const urls = [];

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
<section class="calc"><form id="f" autocomplete="off"></form><div id="out" class="out"></div></section>
<p class="note">${esc(t.editableNote)} ${esc(t.disclaimer)}</p>
${myGroups.length ? `<p class="cta">${myGroups.map(g => `<a href="${cmpPath(g, lang)}">${esc(g.s[lang].h1)} →</a>`).join(' · ')}</p>` : ''}
${feeTable(m, lang)}
${faqHtml(s.faq, lang)}
${sourcesLine(m, lang)}
<div class="ad" data-slot="bottom"></div>
<section class="wrap"><h2>${esc(t.otherCalcs)}</h2><ul class="list">${related.map(x => card(x, lang)).join('')}</ul></section>
</article>
<script src="/markets.js"></script><script src="/app.js"></script><script>init(${JSON.stringify(m.id)}, ${JSON.stringify(lang)})</script>`;
    fs.mkdirSync(dist(url), { recursive: true });
    fs.writeFileSync(dist(url, 'index.html'), layout({ lang, title: s.title, desc: s.desc, url, body, head: faqLd(s.faq), alternates }));
    urls.push(url);
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
<section class="calc compare"><form id="f" autocomplete="off"></form><div id="out" class="out"></div></section>
<p class="note">${esc(t.editableNote)} ${esc(t.disclaimer)}</p>
<section class="wrap"><h2>${esc(t.feeTableH)}</h2><ul class="notes">${s.notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul></section>
${faqHtml(s.faq, lang)}
<p class="meta">${esc(t.updated)}: ${SF.UPDATED}. ${esc(t.disclaimer)}</p>
<div class="ad" data-slot="bottom"></div>
<section class="wrap"><h2>${esc(t.otherCalcs)}</h2><ul class="list">${members.map(m => card(m, m.s[lang] ? lang : 'en')).join('')}</ul></section>
</article>
<script src="/markets.js"></script><script src="/compare.js"></script><script>initCompare(${JSON.stringify(g.code)}, ${JSON.stringify(lang)})</script>`;
    fs.mkdirSync(dist(url), { recursive: true });
    fs.writeFileSync(dist(url, 'index.html'), layout({ lang, title: s.title, desc: s.desc, url, body, head: faqLd(s.faq), alternates }));
    urls.push(url);
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
${/* one group would just repeat the link in its country heading below */ gs.length > 1 ? `<h2>${esc(t.compareH)}</h2><ul class="list cards">${gs.map(g => cmpCard(g, lang)).join('')}</ul>` : ''}
${order.map(code => {
    const g = gs.find(x => x.code === code);
    return `<h2>${esc(SF.COUNTRY[code][lang])}${g ? ` <a class="h2link" href="${cmpPath(g, lang)}">${esc(t.compareH)} →</a>` : ''}</h2>
<ul class="list cards">${byCountry[code].map(m => card(m, lang)).join('')}</ul>`;
  }).join('')}
<p class="meta">${esc(t.updated)}: ${SF.UPDATED}. ${esc(t.disclaimer)}</p>
</article>`;
  fs.mkdirSync(dist(hubUrl), { recursive: true });
  fs.writeFileSync(dist(hubUrl, 'index.html'), layout({ lang, title: t.hubTitle, desc: t.hubDesc, url: hubUrl, body: hubBody, alternates: SF.LANGS.map(l => ({ lang: l, url: hubOf(l) })) }));
  urls.push(hubUrl);
}

fs.writeFileSync(dist('sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE.url}${u}</loc><lastmod>${SF.UPDATED}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(dist('robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
fs.writeFileSync(dist('ads.txt'), `google.com, ${SITE.adsensePub.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`);
console.log('built', urls.length, 'pages ->', dist());
