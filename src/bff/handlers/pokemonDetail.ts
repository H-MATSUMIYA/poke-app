import { buildPokemonDetailView, parsePokemonDetailParams } from '../mappers/pokemonDetail';
import { matchCachedResponse, withCacheHeader } from '../../worker/cache';

export async function handlePokemonDetail(
  request: Request,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const params = parsePokemonDetailParams(url);

  if (!params) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cacheUrl = request.url;

  try {
    const cached = await matchCachedResponse(cacheUrl);
    if (cached) {
      const headers = new Headers(cached.headers);
      headers.set('Content-Type', 'application/json');
      return withCacheHeader(
        new Response(cached.body, { status: cached.status, headers }),
        'HIT',
        'x-bff-cache',
      );
    }

    const view = await buildPokemonDetailView(
      params.name,
      params.lang,
      params.version,
    );

    const body = JSON.stringify(view);
    const response = new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });

    ctx.waitUntil(
      caches.default.put(
        new Request(cacheUrl, { method: 'GET' }),
        response.clone(),
      ),
    );

    return withCacheHeader(response, 'MISS', 'x-bff-cache');
  } catch (error) {
    console.error('BFF pokemon detail error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('404') ? 404 : 500;
    return new Response(JSON.stringify({ error: 'Failed to build pokemon detail view' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
