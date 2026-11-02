// Lille hentetjeneste til Spisetid (Cloudflare Worker).
// Henter en opskriftsside for appen, så browseren ikke bliver stoppet af CORS.
// Den svarer kun til Spisetid på denne adresse:
const TILLADT = 'https://octst8749-svg.github.io';

export default {
  async fetch(req) {
    const cors = { 'access-control-allow-origin': TILLADT, 'vary': 'origin' };
    if (req.headers.get('origin') !== TILLADT) return new Response('Ikke tilladt', { status: 403 });
    const u = new URL(req.url).searchParams.get('url');
    if (!u || !/^https?:\/\//i.test(u)) return new Response('Mangler url', { status: 400, headers: cors });
    try {
      const r = await fetch(u, {
        headers: {
          'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'accept': 'text/html,application/xhtml+xml',
          'accept-language': 'da-DK,da;q=0.9,en;q=0.5',
        },
        redirect: 'follow',
      });
      const text = await r.text();
      return new Response(text.slice(0, 3_000_000), {
        status: r.status,
        headers: { ...cors, 'content-type': 'text/html; charset=utf-8' },
      });
    } catch (e) {
      return new Response('Kunne ikke hente siden', { status: 502, headers: cors });
    }
  },
};
