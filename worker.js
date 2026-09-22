/* Serves dist/, sends every URL variant to one canonical form, and records anonymous usage events.
   No cookies, no identifiers, nothing that needs a consent banner. */
import GONE from './gone.js';

const RETIRED = new Set(GONE);

// Browsers that have seen this once go straight to https. No preload: that is hard to undo.
const HSTS = 'max-age=31536000';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/e' && request.method === 'POST') {
      // Read the body before responding: the stream is gone once the response is returned.
      await record(request, env);
      return new Response(null, { status: 204 });
    }

    // One canonical form, reached in one permanent hop. http served pages as 200, which put
    // http:// URLs in the index, and www → apex kept http; Cloudflare's own trailing-slash
    // handling answers 307, which Google treats as temporary and is slow to consolidate.
    if (request.method === 'GET' || request.method === 'HEAD') {
      const to = new URL(url);
      to.protocol = 'https:';
      if (to.hostname.startsWith('www.')) to.hostname = to.hostname.slice(4);
      if (to.pathname.endsWith('/index.html')) to.pathname = to.pathname.slice(0, -'index.html'.length);
      else if (!to.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(to.pathname)) to.pathname += '/';
      if (to.href !== url.href) return Response.redirect(to.href, 301);
    }

    if (RETIRED.has(url.pathname)) {
      return new Response('Gone', { status: 410, headers: { 'content-type': 'text/plain', 'strict-transport-security': HSTS } });
    }

    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    out.headers.set('strict-transport-security', HSTS);
    return out;
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
        b.h ? 1 : 0,                                          // a trusted pointer/key event fired
        num(b.r, 2)                                           // 1 new, 2 back on a later day, 0 not measured
      ],
      indexes: [path]
    });
  } catch (e) { /* a malformed beacon is not worth failing a request over */ }
}
