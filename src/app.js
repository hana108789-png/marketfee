/* sellerfee runtime — one generic calculator for every market and language. No deps, no server.
   The page already ships the default form and results as HTML (see SF.formHtml / SF.outHtml),
   so first paint is final: this only re-renders once the visitor changes something. */
function init(id, lang) {
  var m = SF.get(id);
  var form = document.getElementById('f'), out = document.getElementById('out');
  var KEY = 'sf:' + id;
  var v = SF.defaults(m), idx = {}, pristine = true;   // idx: which option a select is on, by position

  function render() { form.innerHTML = SF.formHtml(m, lang, v, idx); }
  function show() { out.innerHTML = SF.outHtml(m, lang, v); }

  function sync() {
    m.fields.forEach(function (f) {
      var el = document.getElementById('f_' + f.k);
      if (!el || document.activeElement === el) return;
      if (el.tagName === 'SELECT' && idx[f.k] !== undefined) el.selectedIndex = idx[f.k]; else el.value = v[f.k];
    });
    // Only the currency readouts change as you type; rebuilding the form would drop focus.
    var fmt = SF.fmt(m, lang), n = SF.n;
    m.fields.forEach(function (f) {
      if (f.u !== 'cur') return;
      var u = form.querySelector('[data-u="' + f.k + '"]');
      if (u) u.textContent = n(v[f.k]) ? fmt.format(n(v[f.k])) : m.currency;
    });
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(v)); localStorage.setItem(KEY + ':i', JSON.stringify(idx)); } catch (e) {}
    SF.saveProduct(m.currency, v);
  }

  // Chrome/Edge turn a wheel over a focused number input into +/-1 instead of a page scroll;
  // a visitor scrolling past the form silently changed shipping 132 times. Drop focus first.
  form.addEventListener('wheel', function (e) { if (e.target === document.activeElement && e.target.type === 'number') e.target.blur(); }, { passive: true });

  form.addEventListener('input', function (e) {
    var k = e.target.getAttribute('data-k');
    if (!k) return;
    v[k] = e.target.value;
    SF.derive(m, v, k); sync(); save(); show();
  });
  form.addEventListener('change', function (e) {
    var k = e.target.getAttribute('data-k');
    if (!k) return;
    v[k] = e.target.value;
    if (e.target.tagName === 'SELECT') idx[k] = e.target.selectedIndex;
    SF.derive(m, v, k); sync(); save(); show();
  });
  form.addEventListener('click', function (e) {
    if (e.target.id !== 'reset') return;
    try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + ':i'); } catch (err) {}
    SF.clearProduct(m.currency);
    v = SF.defaults(m); idx = {}; render(); show();
  });

  // Saved products: named snapshots of every field, per market, in this browser only.
  var SKEY = 'sf:s:' + id, box = document.getElementById('saved'), name = document.getElementById('sname');
  function items() {
    var a = [];
    try { a = JSON.parse(localStorage.getItem(SKEY) || '[]'); } catch (e) {}
    return a.map(function (x) { var o = SF.defaults(m); for (var k in x.v) if (k in o) o[k] = x.v[k]; return { n: x.n, v: o, i: x.i || {} }; });
  }
  function list() { box.querySelector('ul').innerHTML = SF.savedHtml(m, lang, items()); }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var a = items(), i = Number(b.getAttribute('data-i') || b.getAttribute('data-del'));
    if (b.id === 'save') {
      var nm = name.value.trim() || SF.I18N[lang].savedItem + ' ' + (a.length + 1);
      a = a.filter(function (x) { return x.n !== nm; });   // same name overwrites
      a.unshift({ n: nm, v: v, i: idx });
      name.value = nm;
    } else if (b.hasAttribute('data-del')) {
      a.splice(i, 1);
    } else {
      v = a[i].v; idx = a[i].i; name.value = a[i].n;
      save(); render(); show();
      return;
    }
    try { localStorage.setItem(SKEY, JSON.stringify(a.slice(0, 30).map(function (x) { return { n: x.n, v: x.v, i: x.i }; }))); } catch (err) {}
    list();
  });
  name.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('save').click(); });
  list();

  // Restore anything the visitor set before, then redraw only if it differs from the static HTML.
  try { var st = JSON.parse(localStorage.getItem(KEY) || 'null'); if (st) { for (var k in st) if (k in v) { if (String(st[k]) !== String(v[k])) pristine = false; v[k] = st[k]; } } } catch (e) {}
  try { var si = JSON.parse(localStorage.getItem(KEY + ':i') || 'null'); if (si) { idx = si; pristine = false; } } catch (e) {}
  var before = JSON.stringify(v);
  SF.loadProduct(m.currency, v);
  if (JSON.stringify(v) !== before) pristine = false;
  if (!pristine) { render(); show(); }
}
