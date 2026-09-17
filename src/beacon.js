/* Anonymous usage beacon: did they stay, and did they actually calculate?
   One POST when the page is closed. No cookies, no ids, nothing stored in the browser. */
(function () {
  var start = Date.now(), used = false, sent = false;
  var path = location.pathname, lang = document.documentElement.lang || '';

  function send(type) {
    if (sent) return;
    sent = true;
    var body = JSON.stringify({
      p: path, t: type, l: lang,
      s: Math.round((Date.now() - start) / 1000),
      u: used ? 1 : 0
    });
    // sendBeacon survives the page being closed; fetch is the fallback for old browsers.
    if (navigator.sendBeacon) navigator.sendBeacon('/e', new Blob([body], { type: 'application/json' }));
    else try { fetch('/e', { method: 'POST', body: body, keepalive: true }); } catch (e) {}
  }

  // Any edit to the calculator counts as real use.
  document.addEventListener('input', function (e) {
    if (e.target.closest('#f')) used = true;
  }, true);
  document.addEventListener('change', function (e) {
    if (e.target.closest('#f, #out')) used = true;
  }, true);

  addEventListener('pagehide', function () { send('view'); });
  addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') send('view');
  });
})();
