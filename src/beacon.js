/* Anonymous usage beacon. One POST when the page is closed.
   No cookies, no identifiers, nothing stored in the browser — just what was used and for how long. */
(function () {
  var start = Date.now(), sent = false;
  var edits = {};          // which inputs were touched, and how often
  var advOpened = 0;       // opened "advanced settings"
  var faqOpened = 0;       // opened FAQ entries
  var depth = 0;           // furthest scroll, in percent

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
      d: depth
    });
    if (navigator.sendBeacon) navigator.sendBeacon('/e', new Blob([body], { type: 'application/json' }));
    else try { fetch('/e', { method: 'POST', body: body, keepalive: true }); } catch (e) {}
  }

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
