const POKEAPI_CACHE_TTL = 'public, max-age=86400, s-maxage=604800';

export function createCacheKey(url: string): Request {
  return new Request(url, { method: 'GET' });
}

export async function matchCachedResponse(url: string): Promise<Response | undefined> {
  const cache = caches.default;
  return cache.match(createCacheKey(url));
}

export async function putCachedResponse(
  url: string,
  response: Response,
  ctx: ExecutionContext,
): Promise<void> {
  const cacheHeaders = new Headers(response.headers);
  cacheHeaders.set('Cache-Control', POKEAPI_CACHE_TTL);
  cacheHeaders.delete('Vary');
  cacheHeaders.delete('Set-Cookie');

  const responseToCache = new Response(response.clone().body, {
    status: response.status,
    statusText: response.statusText,
    headers: cacheHeaders,
  });

  ctx.waitUntil(caches.default.put(createCacheKey(url), responseToCache));
}

export function withCacheHeader(
  response: Response,
  cacheStatus: 'HIT' | 'MISS' | 'BYPASS',
  headerName: string,
): Response {
  const headers = new Headers(response.headers);
  headers.set(headerName, cacheStatus);
  headers.set('Access-Control-Allow-Origin', '*');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
