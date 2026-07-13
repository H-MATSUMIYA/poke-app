import type { MoveDetail, PokemonDetail, PokemonSpecies, VersionResponse } from '../types/pokemon';
import { matchCachedResponse, putCachedResponse } from '../worker/cache';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

async function fetchFromPokeApi<T>(path: string, ctx: ExecutionContext): Promise<T> {
  const targetUrl = `${POKEAPI_BASE}/${path}`;

  const cached = await matchCachedResponse(targetUrl);
  if (cached) {
    return cached.json() as Promise<T>;
  }

  const response = await fetch(targetUrl, {
    headers: { 'User-Agent': 'cloudflare-workers-pokeapi-bff' },
  });

  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status} ${path}`);
  }

  await putCachedResponse(targetUrl, response, ctx);
  return response.json() as Promise<T>;
}

export function fetchPokemon(name: string, ctx: ExecutionContext): Promise<PokemonDetail> {
  return fetchFromPokeApi<PokemonDetail>(`pokemon/${name}`, ctx);
}

export function fetchSpeciesByUrl(url: string, ctx: ExecutionContext): Promise<PokemonSpecies> {
  const path = url.replace(`${POKEAPI_BASE}/`, '');
  return fetchFromPokeApi<PokemonSpecies>(path, ctx);
}

export function fetchVersion(name: string, ctx: ExecutionContext): Promise<VersionResponse> {
  return fetchFromPokeApi<VersionResponse>(`version/${name}`, ctx);
}

export function fetchMove(name: string, ctx: ExecutionContext): Promise<MoveDetail> {
  return fetchFromPokeApi<MoveDetail>(`move/${name}`, ctx);
}

export async function fetchMovesByName(
  moveNames: string[],
  ctx: ExecutionContext,
): Promise<Record<string, MoveDetail>> {
  const uniqueNames = Array.from(new Set(moveNames));
  const results = await Promise.all(
    uniqueNames.map(async (moveName) => {
      const detail = await fetchMove(moveName, ctx);
      return [moveName, detail] as const;
    }),
  );

  const movesByName: Record<string, MoveDetail> = {};
  for (const [moveName, detail] of results) {
    movesByName[moveName] = detail;
  }
  return movesByName;
}
