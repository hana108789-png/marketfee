/* Reads the usage beacons back out of Analytics Engine.
   Needs a Cloudflare API token with "Account Analytics: Read":
     CF_API_TOKEN=xxx node stats.js [days]                                     */
const ACCOUNT = 'ba1873cd392dccbde8f36a8a3611df64';
const TOKEN = process.env.CF_API_TOKEN;
const DAYS = Number(process.argv[2]) || 7;

if (!TOKEN) {
  console.error('CF_API_TOKEN 이 설정되지 않았습니다.\n\n1) https://dash.cloudflare.com/profile/api-tokens\n2) Create Token > Create Custom Token\n3) 권한: Account > Account Analytics > Read\n\n실행: CF_API_TOKEN=토큰값 node stats.js 7');
  process.exit(1);
}

const sql = q => fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, {
  method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` }, body: q
}).then(async r => {
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${text.slice(0, 300)}`);
  return JSON.parse(text).data || [];
});

const since = `toDateTime(timestamp) > now() - INTERVAL '${DAYS}' DAY`;
const pct = (a, b) => b ? (a / b * 100).toFixed(0) + '%' : '–';
const table = (rows, cols) => {
  if (!rows.length) return '  (없음)';
  const w = cols.map(c => Math.max(c.h.length, ...rows.map(r => String(c.f(r)).length)));
  const line = r => '  ' + cols.map((c, i) => String(c.f(r)).padEnd(w[i])).join('  ');
  return ['  ' + cols.map((c, i) => c.h.padEnd(w[i])).join('  '), ...rows.map(line)].join('\n');
};

(async () => {
  const [t] = await sql(`
    SELECT sum(_sample_interval) AS views,
           sum(double2 * _sample_interval) AS used,
           avg(double1) AS secs,
           avg(double3) AS edits,
           sum(double4 * _sample_interval) AS adv,
           sum(if(double5 > 0, 1, 0) * _sample_interval) AS faq,
           avg(double6) AS depth
    FROM analytics_engine WHERE ${since}`);

  if (!t || !Number(t.views)) {
    console.log(`최근 ${DAYS}일: 기록된 방문 없음.\n(배포 직후라면 실제 방문자가 생길 때까지 비어 있습니다.)`);
    return;
  }

  const views = Math.round(Number(t.views));
  const used = Math.round(Number(t.used));
  console.log(`\n═══ 최근 ${DAYS}일 ═══`);
  console.log(`방문 ${views} · 계산기 사용 ${used} (${pct(used, views)}) · 평균 체류 ${Number(t.secs).toFixed(0)}초`);
  console.log(`평균 편집 횟수 ${Number(t.edits).toFixed(1)}회 · 상세설정 열기 ${pct(Math.round(Number(t.adv)), views)} · FAQ 열기 ${pct(Math.round(Number(t.faq)), views)} · 평균 스크롤 ${Number(t.depth).toFixed(0)}%\n`);

  // Which inputs people actually keep changing — the answer to "what do they use repeatedly".
  const raw = await sql(`
    SELECT blob6 AS fields, sum(_sample_interval) AS n
    FROM analytics_engine WHERE ${since} AND blob6 != '' GROUP BY fields`);
  const tally = {};
  for (const r of raw) {
    const weight = Number(r.n) || 1;
    for (const part of String(r.fields).split(',')) {
      const [k, c] = part.split(':');
      if (!k) continue;
      tally[k] = tally[k] || { field: k, edits: 0, sessions: 0 };
      tally[k].edits += (Number(c) || 0) * weight;
      tally[k].sessions += weight;
    }
  }
  const fields = Object.values(tally).sort((a, b) => b.edits - a.edits).slice(0, 15);
  console.log('많이 쓰는 입력칸');
  console.log(table(fields, [
    { h: '항목', f: r => r.field },
    { h: '총 편집', f: r => Math.round(r.edits) },
    { h: '쓴 방문', f: r => Math.round(r.sessions) },
    { h: '1회당', f: r => (r.edits / r.sessions).toFixed(1) }
  ]));

  const pages = await sql(`
    SELECT blob1 AS path, sum(_sample_interval) AS views,
           sum(double2 * _sample_interval) AS used,
           avg(double1) AS secs, avg(double3) AS edits, avg(double6) AS depth
    FROM analytics_engine WHERE ${since}
    GROUP BY path ORDER BY views DESC LIMIT 20`);
  console.log('\n페이지별');
  console.log(table(pages, [
    { h: '경로', f: r => r.path },
    { h: '방문', f: r => Math.round(Number(r.views)) },
    { h: '사용률', f: r => pct(Number(r.used), Number(r.views)) },
    { h: '체류', f: r => Number(r.secs).toFixed(0) + '초' },
    { h: '편집', f: r => Number(r.edits).toFixed(1) },
    { h: '스크롤', f: r => Number(r.depth).toFixed(0) + '%' }
  ]));

  const countries = await sql(`
    SELECT blob4 AS country, sum(_sample_interval) AS views,
           avg(double1) AS secs, sum(double2 * _sample_interval) AS used
    FROM analytics_engine WHERE ${since}
    GROUP BY country ORDER BY views DESC LIMIT 12`);
  console.log('\n국가별');
  console.log(table(countries, [
    { h: '국가', f: r => r.country },
    { h: '방문', f: r => Math.round(Number(r.views)) },
    { h: '사용률', f: r => pct(Number(r.used), Number(r.views)) },
    { h: '체류', f: r => Number(r.secs).toFixed(0) + '초' }
  ]));

  const [b] = await sql(`
    SELECT sum(_sample_interval) AS quick
    FROM analytics_engine WHERE ${since} AND double1 < 10 AND double2 = 0`);
  const quick = Math.round(Number(b?.quick || 0));
  console.log(`\n10초 안에 아무것도 안 하고 이탈: ${quick} (${pct(quick, views)})`);

  await webAnalytics();
})().catch(e => { console.error('조회 실패:', e.message); process.exit(1); });

/* Cloudflare Web Analytics has been recording since launch, unlike the beacon above.
   Its counts are sampled, so they arrive rounded to the sample interval. */
async function webAnalytics() {
  const from = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 19) + 'Z';
  const to = new Date().toISOString().slice(0, 19) + 'Z';
  const filter = `datetime_geq: "${from}", datetime_leq: "${to}"`;
  const gq = async (fields, order, limit = 15) => {
    const q = `query { viewer { accounts(filter: {accountTag: "${ACCOUNT}"}) { rumPageloadEventsAdaptiveGroups(limit: ${limit}, filter: {${filter}}, orderBy: [${order}]) { count sum { visits } ${fields} } } } }`;
    const r = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q })
    }).then(x => x.json());
    return r?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups || [];
  };

  const [tot] = await gq('', 'count_DESC', 1);
  if (!tot) return;
  console.log(`\n═══ Cloudflare Web Analytics (최근 ${DAYS}일) ═══`);
  console.log(`페이지뷰 ${tot.count} · 방문 ${tot.sum.visits} · 방문당 ${(tot.count / Math.max(1, tot.sum.visits)).toFixed(1)}페이지`);
  console.log('(샘플링 집계라 10 단위로 반올림됩니다)\n');

  const entry = await gq('dimensions { requestPath }', 'sum_visits_DESC', 15);
  console.log('진입 페이지 (방문 / 총 뷰)');
  console.log(table(entry.filter(r => r.sum.visits > 0), [
    { h: '경로', f: r => r.dimensions.requestPath },
    { h: '방문', f: r => r.sum.visits },
    { h: '뷰', f: r => r.count }
  ]));

  const inner = entry.filter(r => r.sum.visits === 0 && r.count > 0);
  if (inner.length) {
    console.log('\n사이트 안에서만 열린 페이지 (검색 유입 없음)');
    console.log(table(inner, [
      { h: '경로', f: r => r.dimensions.requestPath },
      { h: '뷰', f: r => r.count }
    ]));
  }

  const ref = await gq('dimensions { refererHost }', 'sum_visits_DESC', 10);
  console.log('\n유입 경로');
  console.log(table(ref, [
    { h: '출처', f: r => r.dimensions.refererHost || '(직접 방문)' },
    { h: '방문', f: r => r.sum.visits },
    { h: '뷰', f: r => r.count }
  ]));

  const geo = await gq('dimensions { countryName }', 'sum_visits_DESC', 10);
  console.log('\n국가');
  console.log(table(geo, [
    { h: '국가', f: r => r.dimensions.countryName },
    { h: '방문', f: r => r.sum.visits },
    { h: '뷰', f: r => r.count }
  ]));
}
