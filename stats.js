/* Reads the usage beacons back out of Analytics Engine.
   Needs a Cloudflare API token with "Account Analytics: Read":
     CF_API_TOKEN=xxx node stats.js [days]           */
const ACCOUNT = 'ba1873cd392dccbde8f36a8a3611df64';
const TOKEN = process.env.CF_API_TOKEN;
const DAYS = Number(process.argv[2]) || 7;

if (!TOKEN) {
  console.error('CF_API_TOKEN not set.\n\nCreate one at https://dash.cloudflare.com/profile/api-tokens\n  Permissions: Account > Account Analytics > Read\nThen: CF_API_TOKEN=xxx node stats.js');
  process.exit(1);
}

const sql = q => fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}` },
  body: q
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
  const [total] = await sql(`
    SELECT sum(_sample_interval) AS views,
           sum(double2 * _sample_interval) AS used,
           avg(double1) AS avg_seconds
    FROM marketfee_events WHERE ${since}`);

  if (!total || !Number(total.views)) {
    console.log(`최근 ${DAYS}일: 기록된 방문 없음.\n(배포 직후라면 실제 방문자가 생길 때까지 비어 있습니다.)`);
    return;
  }

  const views = Math.round(Number(total.views));
  const used = Math.round(Number(total.used));
  console.log(`\n=== 최근 ${DAYS}일 ===`);
  console.log(`방문 ${views} · 계산기 사용 ${used} (${pct(used, views)}) · 평균 체류 ${Number(total.avg_seconds).toFixed(0)}초\n`);

  const pages = await sql(`
    SELECT blob1 AS path,
           sum(_sample_interval) AS views,
           sum(double2 * _sample_interval) AS used,
           avg(double1) AS secs
    FROM marketfee_events WHERE ${since}
    GROUP BY path ORDER BY views DESC LIMIT 20`);
  console.log('페이지별');
  console.log(table(pages, [
    { h: '경로', f: r => r.path },
    { h: '방문', f: r => Math.round(Number(r.views)) },
    { h: '사용', f: r => Math.round(Number(r.used)) },
    { h: '사용률', f: r => pct(Number(r.used), Number(r.views)) },
    { h: '체류', f: r => Number(r.secs).toFixed(0) + '초' }
  ]));

  const countries = await sql(`
    SELECT blob4 AS country, sum(_sample_interval) AS views, avg(double1) AS secs
    FROM marketfee_events WHERE ${since}
    GROUP BY country ORDER BY views DESC LIMIT 12`);
  console.log('\n국가별');
  console.log(table(countries, [
    { h: '국가', f: r => r.country },
    { h: '방문', f: r => Math.round(Number(r.views)) },
    { h: '체류', f: r => Number(r.secs).toFixed(0) + '초' }
  ]));

  // Bounce-ish: left within 10 seconds without touching anything.
  const [bounce] = await sql(`
    SELECT sum(_sample_interval) AS quick
    FROM marketfee_events WHERE ${since} AND double1 < 10 AND double2 = 0`);
  const quick = Math.round(Number(bounce?.quick || 0));
  console.log(`\n10초 안에 아무것도 안 하고 이탈: ${quick} (${pct(quick, views)})`);
})().catch(e => { console.error('조회 실패:', e.message); process.exit(1); });
