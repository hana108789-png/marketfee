/* Offers the page in the visitor's own language when one exists. A suggestion, never a redirect:
   redirecting by language would bounce Google's crawler (en-US) off every non-English page and
   drop them from the index, and it would override people who chose English on purpose.
   Uses the browser's language list, not location; remembers a dismissal in localStorage. */
function sfLangBar() {
  try {
    if (localStorage.getItem('sf:lang:off')) return;
    var cur = document.documentElement.lang;
    var alts = {};
    var links = document.querySelectorAll('link[rel="alternate"][hreflang]');
    for (var i = 0; i < links.length; i++) alts[links[i].getAttribute('hreflang')] = links[i].getAttribute('href');
    // Walk the visitor's languages in their order of preference. If the page's own language
    // comes first, they are already served; otherwise offer the first one the page exists in.
    var want = navigator.languages || [navigator.language || ''];
    var pick = null;
    for (var j = 0; j < want.length; j++) {
      var l = String(want[j]).slice(0, 2).toLowerCase();
      if (l === cur) return;
      if (alts[l] && l !== 'x-default') { pick = l; break; }
    }
    if (!pick) return;
    var T = {
      en: 'This page is also available in English', de: 'Diese Seite gibt es auch auf Deutsch',
      fr: 'Cette page existe aussi en français', it: 'Questa pagina è disponibile anche in italiano',
      es: 'Esta página también está en español', nl: 'Deze pagina is er ook in het Nederlands',
      ja: 'このページは日本語でもご覧になれます', ko: '이 페이지는 한국어로도 있습니다'
    };
    var V = {
      en: 'View in English', de: 'Auf Deutsch ansehen', fr: 'Voir en français', it: 'Vedi in italiano',
      es: 'Ver en español', nl: 'Bekijk in het Nederlands', ja: '日本語で見る', ko: '한국어로 보기'
    };
    var bar = document.createElement('div');
    bar.className = 'langbar';
    bar.setAttribute('role', 'status');
    bar.innerHTML = '<span></span><a></a><button type="button" aria-label="close">×</button>';
    bar.querySelector('span').textContent = T[pick];
    var a = bar.querySelector('a');
    a.textContent = V[pick] + ' →';
    a.href = alts[pick];
    a.hreflang = pick;
    bar.querySelector('button').onclick = function () {
      try { localStorage.setItem('sf:lang:off', '1'); } catch (e) {}
      bar.remove();
    };
    document.body.appendChild(bar);
  } catch (e) {}
}
sfLangBar();
