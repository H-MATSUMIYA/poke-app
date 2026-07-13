import { handlePokemonDetail } from './handlers/pokemonDetail';

export async function handleBff(request: Request, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname.match(/^\/api\/ui\/pokemon\/[^/]+$/)) {
    return handlePokemonDetail(request, ctx);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}
