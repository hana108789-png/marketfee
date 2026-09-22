/* Anonymous usage beacon. One POST when the page is closed.
   No cookies, no identifiers, nothing stored in the browser — just what was used and for how long. */
(function () {
  // The owner opens /?me=1 once on each device so their own testing stays out of the numbers.
  // The flag lives only in this browser and is never sent; /?me=0 clears it.
  try {
    var me = new URLSearchParams(location.search).get('me');
    if (me === '1') { localStorage.setItem('sf:me', '1'); alert('이 기기의 방문은 통계에서 제외됩니다. / This device is now excluded from stats.'); }
    if (me === '0') { localStorage.removeItem('sf:me'); alert('이 기기의 방문을 다시 기록합니다. / This device is counted again.'); }
    if (localStorage.getItem('sf:me')) return;
  } catch (e) {}

  // New or returning, and nothing more. The browser keeps only the date of its last visit and
  // decides for itself; the event carries 1 (new) or 2 (back on a later day), never the date.
  // Skipped in European time zones, where storing anything for analytics needs consent.
  var visit = 0;
  try {
    // EU/EEA time zones, including the parts not named Europe/ (Canaries, Madeira, Azores,
    // Cyprus, Iceland, the French overseas departments).
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (!/^(Europe\/|Atlantic\/(Canary|Madeira|Azores|Faroe|Reykjavik)|Asia\/(Nicosia|Famagusta)|Indian\/(Reunion|Mayotte)|America\/(Martinique|Guadeloupe|Cayenne))/.test(tz)) {
      var today = new Date().toLocaleDateString('en-CA');       // local YYYY-MM-DD
      var last = localStorage.getItem('sf:last');
      if (last !== today) {                                      // first page of the day decides it
        localStorage.setItem('sf:back', last ? '2' : '1');
        localStorage.setItem('sf:last', today);
      }
      visit = Number(localStorage.getItem('sf:back')) || 0;
    }
  } catch (e) {}

  var start = Date.now(), sent = false;
  var edits = {};          // which inputs were touched, and how often
  var advOpened = 0;       // opened "advanced settings"
  var faqOpened = 0;       // opened FAQ entries
  var depth = 0;           // furthest scroll, in percent
  var human = 0;           // a real pointer/key/touch event happened — crawlers rarely produce one

  function bump(key) { if (key) edits[key] = (edits[key] || 0) + 1; }

  function fieldsUsed() {
    // "price:5,cat:2" — ordered by how often each was changed, capped so the payload stays small.
    return Object.keys(edits)
      .sort(function (a, b) { return edits[b] - edits[a]; })
      .slice(0, 12)
      .map(function (k) { return k + ':' + edits[k]; })
      .join(',')
      .slice(0, 256);
  }

  function total() {
    var n = 0;
    for (var k in edits) n += edits[k];
    return n;
  }

  function send() {
    if (sent) return;
    sent = true;
    var body = JSON.stringify({
      p: location.pathname,
      t: 'view',
      l: document.documentElement.lang || '',
      s: Math.round((Date.now() - start) / 1000),
      u: total() ? 1 : 0,
      e: total(),
      f: fieldsUsed(),
      a: advOpened,
      q: faqOpened,
      d: depth,
      h: human,
      r: visit
    });
    if (navigator.sendBeacon) navigator.sendBeacon('/e', new Blob([body], { type: 'application/json' }));
    else try { fetch('/e', { method: 'POST', body: body, keepalive: true }); } catch (e) {}
  }

  // Trusted input devices only: a synthetic event from a headless crawler has isTrusted false.
  ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'].forEach(function (type) {
    addEventListener(type, function (e) { if (e.isTrusted) human = 1; }, { passive: true, capture: true });
  });

  document.addEventListener('input', function (e) {
    if (e.target.closest('#f')) bump(e.target.getAttribute('data-k') || 'other');
  }, true);

  document.addEventListener('change', function (e) {
    if (e.target.closest('#out')) bump('cmp-category');           // per-market category on the comparison table
    else if (e.target.closest('#f')) bump(e.target.getAttribute('data-k') || 'other');
  }, true);

  document.addEventListener('toggle', function (e) {
    if (!e.target.open) return;
    if (e.target.matches('details.adv')) advOpened = 1;
    else if (e.target.closest('.wrap')) faqOpened++;
  }, true);

  addEventListener('scroll', function () {
    var h = document.body.scrollHeight;
    if (h > 0) depth = Math.min(100, Math.max(depth, Math.round((scrollY + innerHeight) / h * 100)));
  }, { passive: true });

  addEventListener('pagehide', send);
  addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') send();
  });
})();
