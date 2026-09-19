/* IndexNow ping: tells Bing/Yandex/Naver about every URL in the sitemap. Run after `wrangler deploy`. */
const fs = require('fs');
const path = require('path');

const KEY = fs.readdirSync(path.join(__dirname, 'static')).find(f => /^[0-9a-f]{32}\.txt$/.test(f)).replace('.txt', '');
const HOST = 'marketfee.org';
const urlList = [...fs.readFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
// Retired URLs go in too: a recrawl is how the engines learn they now answer 410.
const gone = (fs.readFileSync(path.join(__dirname, 'gone.js'), 'utf8').match(/"[^"]+"/g) || []).map(x => `https://${HOST}${x.slice(1, -1)}`);
urlList.push(...gone);

fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList })
}).then(r => console.log('IndexNow', r.status, r.statusText, '·', urlList.length, 'urls'))
  .catch(e => console.error('IndexNow failed:', e.message));
