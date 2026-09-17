/* Serves dist/, folds www into the apex, and records anonymous usage events.
   No cookies, no identifiers, nothing that needs a consent banner. */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/e' && request.method === 'POST') {
      ctx.waitUntil(record(request, env));
      return new Response(null, { status: 204 });
    }

    return env.ASSETS.fetch(request);
  }
};

async function record(request, env) {
  if (!env.AE) return;
  try {
    const b = await request.json();
    const path = String(b.p || '').slice(0, 128);
    const type = String(b.t || '').slice(0, 16);            // view | calc | compare
    const lang = String(b.l || '').slice(0, 8);
    const seconds = Math.min(3600, Math.max(0, Number(b.s) || 0));
    const used = b.u ? 1 : 0;                                // did they touch the calculator
    env.AE.writeDataPoint({
      blobs: [path, type, lang, request.cf?.country || '??', request.cf?.colo || ''],
      doubles: [seconds, used],
      indexes: [path]
    });
  } catch (e) { /* a malformed beacon is not worth failing a request over */ }
}
