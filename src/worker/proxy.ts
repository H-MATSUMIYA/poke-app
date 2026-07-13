import { matchCachedResponse, putCachedResponse, withCacheHeader } from './cache';

export async function handlePokeApiProxy(
  request: Request,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const apiPath = url.pathname.replace(/^\/api\//, '');
  const targetUrl = `https://pokeapi.co/api/${apiPath}${url.search}`;

  try {
    const cachedResponse = await matchCachedResponse(targetUrl);
    if (cachedResponse) {
      return withCacheHeader(cachedResponse, 'HIT', 'x-proxy-cache');
    }

    const originResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'cloudflare-workers-pokeapi-proxy',
      },
    });

    if (originResponse.ok) {
      await putCachedResponse(targetUrl, originResponse, ctx);
    }

    return withCacheHeader(originResponse, 'MISS', 'x-proxy-cache');
  } catch (error) {
    console.warn('Cache API error or not available. Falling back to direct fetch.', error);

    try {
      const directResponse = await fetch(targetUrl);
      return withCacheHeader(directResponse, 'BYPASS', 'x-proxy-cache');
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to fetch from PokeAPI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
