/* Serves dist/, folds www into the apex, and records anonymous usage events.
   No cookies, no identifiers, nothing that needs a consent banner. */
import GONE from './gone.js';

const RETIRED = new Set(GONE);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    if (RETIRED.has(url.pathname) || RETIRED.has(url.pathname + '/')) {
      return new Response('Gone', { status: 410, headers: { 'content-type': 'text/plain' } });
    }

    if (url.pathname === '/e' && request.method === 'POST') {
      // Read the body before responding: the stream is gone once the response is returned.
      await record(request, env);
      return new Response(null, { status: 204 });
    }

    return env.ASSETS.fetch(request);
  }
};

async function record(request, env) {
  if (!env.AE) return;
  try {
    const b = await request.json();
    const num = (x, max) => Math.min(max, Math.max(0, Number(x) || 0));
    const path = String(b.p || '').slice(0, 128);
    env.AE.writeDataPoint({
      blobs: [
        path,
        String(b.t || '').slice(0, 16),                       // view
        String(b.l || '').slice(0, 8),                        // language
        request.cf?.country || '??',
        request.cf?.colo || '',
        String(b.f || '').slice(0, 256)                       // "price:5,cat:2" — what they actually changed
      ],
      doubles: [
        num(b.s, 3600),                                       // seconds on page
        b.u ? 1 : 0,                                          // used the calculator at all
        num(b.e, 1000),                                       // how many edits
        b.a ? 1 : 0,                                          // opened advanced settings
        num(b.q, 100),                                        // FAQ entries opened
        num(b.d, 100),                                        // scroll depth %
        b.h ? 1 : 0                                           // a trusted pointer/key event fired
      ],
      indexes: [path]
    });
  } catch (e) { /* a malformed beacon is not worth failing a request over */ }
}
