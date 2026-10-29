/* Search Console exports, read without dependencies (zip central directory + zlib).
     node sc.js export.xlsx              every sheet as tab-separated text
     node sc.js new.xlsx old.xlsx        what changed between two performance exports
   Exports are cumulative, so the difference between two files is the performance of the days
   in between; the position shown is the average position of only those new impressions. */
const fs = require('fs'), zlib = require('zlib');

function sheets(file) {
  const buf = fs.readFileSync(file);
  let eocd = buf.length - 22;
  while (buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  const files = {};
  for (let i = 0, p = buf.readUInt32LE(eocd + 16); i < buf.readUInt16LE(eocd + 10); i++) {
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28);
    const off = buf.readUInt32LE(p + 42), name = buf.toString('utf8', p + 46, p + 46 + nl);
    const start = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28), data = buf.subarray(start, start + size);
    files[name] = (method ? zlib.inflateRawSync(data) : data).toString('utf8');
    p += 46 + nl + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  const unx = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  const shared = [...(files['xl/sharedStrings.xml'] || '').matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => unx([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]).join('')));
  const names = [...files['xl/workbook.xml'].matchAll(/<sheet [^>]*name="([^"]+)"/g)].map(m => unx(m[1]));
  return names.map((name, i) => ({ name, rows: [...(files[`xl/worksheets/sheet${i + 1}.xml`] || '').matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map(row =>
    [...row[1].matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map(c => {
      const t = (c[1].match(/t="(\w+)"/) || [])[1], v = ((c[2] || '').match(/<v>([\s\S]*?)<\/v>/) || [])[1];
      if (t === 's') return shared[+v];
      if (t === 'inlineStr') return unx(((c[2] || '').match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1] || '');
      return v === undefined ? '' : unx(v);
    })) }));
}

// Queries and pages as { key: {clicks, impressions, position} }; www/http copies of a URL are merged.
function table(file) {
  const out = {};
  for (const s of sheets(file)) {
    const kind = /검색어|Quer/i.test(s.name) ? 'q' : /페이지|Page/i.test(s.name) ? 'p' : null;
    if (!kind) continue;
    for (const [k, c, i, , p] of s.rows.slice(1)) {
      if (!k || isNaN(+i)) continue;
      const key = kind + ' ' + k.replace(/^https?:\/\/(www\.)?marketfee\.org/, ''), o = out[key];
      out[key] = o ? { c: o.c + +c, i: o.i + +i, p: (o.p * o.i + +p * +i) / (o.i + +i) } : { c: +c, i: +i, p: +p };
    }
  }
  return out;
}

const [a, b] = process.argv.slice(2);
if (!a) { console.log('node sc.js export.xlsx [older-export.xlsx]'); process.exit(1); }
if (!b) {
  for (const s of sheets(a)) console.log(`### ${s.name}\n` + s.rows.map(r => r.join('\t')).join('\n'));
} else {
  const now = table(a), was = table(b), rows = [];
  for (const [k, y] of Object.entries(now)) {
    const x = was[k] || { c: 0, i: 0, p: 0 }, di = y.i - x.i;
    if (di > 0) rows.push({ k, dc: y.c - x.c, di, pos: (y.p * y.i - x.p * x.i) / di, before: x.i ? x.p : null });
  }
  rows.sort((r, s) => s.di - r.di);
  const day = s => s.rows.slice(1).filter(r => /^\d{4}-/.test(r[0]));
  const chart = sheets(a).find(s => /차트|Chart|날짜|Date/i.test(s.name));
  if (chart) console.log('일별 (새 파일)\n' + day(chart).slice(-21).map(r => `  ${r[0]}  클릭 ${(+r[1]).toString().padStart(2)}  노출 ${(+r[2]).toString().padStart(4)}  순위 ${r[4] || '-'}`).join('\n'));
  console.log('\n두 파일 사이 새 노출 (q 검색어 / p 페이지)');
  for (const r of rows) console.log(`  ${r.k.padEnd(58)} +${String(r.di).padStart(3)} 노출 +${r.dc} 클릭  순위 ${r.pos.toFixed(1).padStart(5)}  (이전 ${r.before === null ? '-' : r.before.toFixed(1)})`);
}
