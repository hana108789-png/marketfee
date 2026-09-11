/* Comparison runtime: one product, every marketplace in a country, ranked by net profit. */
function initCompare(code, lang) {
  var g = SF.GROUPS.filter(function (x) { return x.code === code; })[0];
  var t = SF.I18N[lang], locale = SF.LOCALE[lang];
  var form = document.getElementById('f'), out = document.getElementById('out');
  var KEY = 'sf:cmp:' + code, n = SF.n;
  var zeroDec = g.currency === 'JPY' || g.currency === 'KRW';
  var fmtC = new Intl.NumberFormat(locale, { style: 'currency', currency: g.currency, maximumFractionDigits: zeroDec ? 0 : 2 });
  var markets = g.markets.map(SF.get);

  // Shared inputs live here; every other field keeps the market's own default.
  var SHARED = ['price', 'shipping', 'cost', 'shipCost'];
  var shared = {}, cats = {};

  function esc(x) { return String(x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pct(x) { return (x * 100).toLocaleString(locale, { maximumFractionDigits: 1 }) + ' %'; }
  function ms(m) { return m.s[lang] || m.s.en; }
  function href(m) { var l = m.slug[lang] ? lang : 'en'; return '/' + l + '/' + m.slug[l] + '/'; }
  function catField(m) { return m.fields.filter(function (f) { return f.k === 'cat'; })[0]; }

  function values(m) {
    var v = SF.defaults(m);
    SHARED.forEach(function (k) { if (k in v) v[k] = shared[k]; });
    if (cats[m.id] !== undefined) { v.cat = cats[m.id]; SF.derive(m, v, 'cat'); }
    return v;
  }

  function defaults() {
    var base = markets[0] ? SF.defaults(markets[0]) : {};
    SHARED.forEach(function (k) { shared[k] = base[k] !== undefined ? base[k] : 0; });
    markets.forEach(function (m) { var f = catField(m); if (f) cats[m.id] = f.d; });
  }

  // Money inputs echo the amount formatted, so ₩29,900 is never misread as ₩299,000.
  function unit(k) { return n(shared[k]) ? fmtC.format(n(shared[k])) : g.currency; }

  function render() {
    form.innerHTML = '<h2>' + esc(t.sharedInputs) + '</h2>' + SHARED.map(function (k) {
      return '<label for="c_' + k + '">' + esc(t[k]) + '</label><div class="in"><input id="c_' + k + '" data-k="' + k + '" type="number" inputmode="decimal" min="0" step="' + (zeroDec ? '1' : 'any') + '" value="' + esc(String(shared[k])) + '"><span data-u="' + k + '">' + esc(unit(k)) + '</span></div>';
    }).join('') + '<button type="button" id="reset">' + esc(t.reset) + '</button>';
  }

  function syncUnits() {
    SHARED.forEach(function (k) {
      var u = form.querySelector('[data-u="' + k + '"]');
      if (u) u.textContent = unit(k);
    });
  }

  function show() {
    var rows = markets.map(function (m) {
      var v = values(m), r = SF.calc(m, v);
      return { m: m, v: v, r: r };
    }).sort(function (a, b) { return b.r.profit - a.r.profit; });

    out.innerHTML = '<h2>' + esc(t.results) + ' <span class="sub">· ' + esc(t.bestFirst) + '</span></h2>' +
      '<div class="cmpwrap"><table class="cmp"><thead><tr>' +
      '<th>' + esc(t.marketplace) + '</th><th>' + esc(t.category) + '</th><th>' + esc(t.feesTotal) + '</th>' +
      '<th>' + esc(t.payout) + '</th><th>' + esc(t.profit) + '</th><th>' + esc(t.margin) + '</th>' +
      '</tr></thead><tbody>' + rows.map(function (row, i) {
        var m = row.m, s = ms(m), f = catField(m);
        var sel = f ? '<select data-m="' + m.id + '">' + f.o.map(function (o, j) {
          return '<option value="' + esc(String(o.v)) + '"' + (String(o.v) === String(cats[m.id]) ? ' selected' : '') + '>' + esc(s.cats[j]) + '</option>';
        }).join('') + '</select>' : '<span class="dash">—</span>';
        return '<tr' + (i === 0 ? ' class="best"' : '') + '>' +
          '<td class="name"><a href="' + href(m) + '">' + esc((m.names && m.names[lang]) || m.platform) + '</a></td>' +
          '<td class="catcell">' + sel + '</td>' +
          '<td>' + fmtC.format(row.r.total) + '</td>' +
          '<td>' + fmtC.format(row.r.payout) + '</td>' +
          '<td class="' + (row.r.profit >= 0 ? 'pos' : 'neg') + '"><b>' + fmtC.format(row.r.profit) + '</b></td>' +
          '<td>' + pct(row.r.margin) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ shared: shared, cats: cats })); } catch (e) {}
    SF.saveProduct(g.currency, shared);
  }

  form.addEventListener('input', function (e) {
    var k = e.target.getAttribute('data-k');
    if (!k) return;
    shared[k] = e.target.value; syncUnits(); save(); show();
  });
  form.addEventListener('click', function (e) {
    if (e.target.id !== 'reset') return;
    try { localStorage.removeItem(KEY); } catch (err) {}
    SF.clearProduct(g.currency);
    defaults(); render(); show();
  });
  out.addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-m');
    if (!id) return;
    cats[id] = e.target.value; save(); show();
  });

  defaults();
  try {
    var st = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (st) {
      if (st.shared) SHARED.forEach(function (k) { if (st.shared[k] !== undefined) shared[k] = st.shared[k]; });
      if (st.cats) for (var id in st.cats) if (id in cats) cats[id] = st.cats[id];
    }
  } catch (e) {}
  SF.loadProduct(g.currency, shared);
  render(); show();
}
