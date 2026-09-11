/* sellerfee runtime — one generic calculator for every market and language. No deps, no server. */
function init(id, lang) {
  var m = SF.get(id), t = SF.I18N[lang], s = m.s[lang];
  var form = document.getElementById('f'), out = document.getElementById('out');
  var KEY = 'sf:' + id, locale = SF.LOCALE[lang];
  var zeroDec = m.currency === 'JPY' || m.currency === 'KRW';
  var fmtC = new Intl.NumberFormat(locale, { style: 'currency', currency: m.currency, maximumFractionDigits: zeroDec ? 0 : 2 });
  var n = SF.n, v = {};

  function esc(x) { return String(x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pct(x) { return (x * 100).toLocaleString(locale, { maximumFractionDigits: 1 }) + ' %'; }
  function fieldLabel(f) { return (s.f && s.f[f.l]) || t[f.l] || f.l; }
  function optLabel(o) { return typeof o.l === 'number' ? s.cats[o.l] : ((s.o && s.o[o.l]) || t[o.l] || o.l); }
  function feeLabel(k) { return (s.fee && s.fee[k]) || t[k] || k; }
  // Money inputs echo the amount formatted, so ₩29,900 is never misread as ₩299,000.
  function unit(f) { return f.u === 'cur' ? (n(v[f.k]) ? fmtC.format(n(v[f.k])) : m.currency) : (f.u || ''); }

  function fieldHtml(f) {
    var id = 'f_' + f.k;
    if (f.t === 'sel') {
      return '<label for="' + id + '">' + esc(fieldLabel(f)) + '</label><select id="' + id + '" data-k="' + f.k + '">' +
        f.o.map(function (o) { return '<option value="' + esc(String(o.v)) + '"' + (String(o.v) === String(v[f.k]) ? ' selected' : '') + '>' + esc(optLabel(o)) + '</option>'; }).join('') + '</select>';
    }
    return '<label for="' + id + '">' + esc(fieldLabel(f)) + '</label><div class="in"><input id="' + id + '" data-k="' + f.k + '" type="number" inputmode="decimal" min="0" step="' + (f.step || (zeroDec && f.u === 'cur' ? '1' : 'any')) + '" value="' + esc(String(v[f.k])) + '"><span data-u="' + f.k + '">' + esc(unit(f)) + '</span></div>';
  }

  function render() {
    var primary = m.fields.filter(function (f) { return SF.isPrimary(m, f); });
    var advanced = m.fields.filter(function (f) { return !SF.isPrimary(m, f); });
    form.innerHTML = primary.map(fieldHtml).join('') +
      (advanced.length ? '<details class="adv"><summary>' + esc(t.advanced) + '</summary><div>' + advanced.map(fieldHtml).join('') + '</div></details>' : '') +
      '<button type="button" id="reset">' + esc(t.reset) + '</button>';
  }

  function sync() {
    m.fields.forEach(function (f) {
      var el = document.getElementById('f_' + f.k);
      if (el && document.activeElement !== el) el.value = v[f.k];
      var u = form.querySelector('[data-u="' + f.k + '"]');
      if (u) u.textContent = unit(f);
    });
  }

  function kpi(l, val, cls) { return '<div class="kpi ' + (cls || '') + '"><span>' + esc(l) + '</span><b>' + val + '</b></div>'; }

  function show() {
    var r = SF.calc(m, v), target = n(v.target);
    out.innerHTML = '<h2>' + esc(t.results) + '</h2><div class="kpis">' +
      kpi(t.payout, fmtC.format(r.payout)) +
      kpi(t.profit, fmtC.format(r.profit), r.profit >= 0 ? 'pos' : 'neg') +
      kpi(t.margin, pct(r.margin)) +
      kpi(t.roi, pct(r.roi)) + '</div>' +
      '<table class="fees"><caption>' + esc(t.feeBreakdown) + '</caption><tbody>' +
      r.fees.map(function (x) { return '<tr><td>' + esc(feeLabel(x.k)) + '</td><td>' + fmtC.format(x.a) + '</td></tr>'; }).join('') +
      '<tr class="total"><th>' + esc(t.feesTotal) + '</th><td>' + fmtC.format(r.total) + '</td></tr></tbody></table>' +
      '<p class="be">' + esc(t.breakEven) + ': <b>' + fmtC.format(SF.solve(m, v, 0)) + '</b>' +
      (target > 0 ? ' · ' + esc(t.requiredPrice) + ': <b>' + fmtC.format(SF.solve(m, v, target)) + '</b>' : '') + '</p>';
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    SF.saveProduct(m.currency, v);
  }

  form.addEventListener('input', function (e) {
    var k = e.target.getAttribute('data-k');
    if (!k) return;
    v[k] = e.target.value;
    SF.derive(m, v, k); sync(); save(); show();
  });
  form.addEventListener('click', function (e) {
    if (e.target.id !== 'reset') return;
    try { localStorage.removeItem(KEY); } catch (err) {}
    SF.clearProduct(m.currency);
    v = SF.defaults(m); render(); show();
  });

  v = SF.defaults(m);
  try { var st = JSON.parse(localStorage.getItem(KEY) || 'null'); if (st) { for (var k in st) if (k in v) v[k] = st[k]; } } catch (e) {}
  SF.loadProduct(m.currency, v);
  render(); show();
}
