/* Comparison runtime: one product, every marketplace in a country, ranked by net profit.
   The table ships as HTML (SF.cmpFormHtml / SF.cmpOutHtml); this only redraws after an edit. */
function initCompare(code, lang) {
  var g = SF.GROUPS.filter(function (x) { return x.code === code; })[0];
  var form = document.getElementById('f'), out = document.getElementById('out');
  var KEY = 'sf:cmp:' + code, n = SF.n;
  var d = SF.cmpDefaults(g), shared = d.shared, cats = d.cats, pristine = true;

  function render() { form.innerHTML = SF.cmpFormHtml(g, lang, shared); }
  function show() { out.innerHTML = SF.cmpOutHtml(g, lang, shared, cats); }

  function syncUnits() {
    var zero = g.currency === 'JPY' || g.currency === 'KRW';
    var fmt = new Intl.NumberFormat(SF.LOCALE[lang], { style: 'currency', currency: g.currency, maximumFractionDigits: zero ? 0 : 2 });
    SF.PRODUCT.forEach(function (k) {
      var u = form.querySelector('[data-u="' + k + '"]');
      if (u) u.textContent = n(shared[k]) ? fmt.format(n(shared[k])) : g.currency;
    });
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
    var fresh = SF.cmpDefaults(g);
    shared = fresh.shared; cats = fresh.cats;
    render(); show();
  });
  out.addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-m');
    if (!id) return;
    cats[id] = Number(e.target.value); save(); show();
  });

  var before = JSON.stringify([shared, cats]);
  try {
    var st = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (st) {
      if (st.shared) SF.PRODUCT.forEach(function (k) { if (st.shared[k] !== undefined) shared[k] = st.shared[k]; });
      if (st.cats) for (var id in st.cats) if (id in cats) {
        var f = SF.get(id).fields.filter(function (x) { return x.k === 'cat'; })[0], raw = st.cats[id];
        var i = typeof raw === 'number' ? raw : f.o.map(function (o) { return String(o.v); }).indexOf(String(raw));
        if (f.o[i]) cats[id] = i;
      }
    }
  } catch (e) {}
  SF.loadProduct(g.currency, shared);
  if (JSON.stringify([shared, cats]) !== before) pristine = false;
  if (!pristine) { render(); show(); }
}
