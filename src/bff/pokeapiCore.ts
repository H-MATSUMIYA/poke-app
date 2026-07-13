import type { MoveDetail, PokemonDetail, PokemonSpecies, VersionResponse } from '../types/pokemon';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

async function fetchFromPokeApi<T>(path: string): Promise<T> {
  const response = await fetch(`${POKEAPI_BASE}/${path}`, {
    headers: { 'User-Agent': 'poke-app-bff' },
  });

  if (!response.ok) {
    throw new Error(`PokeAPI error: ${response.status} ${path}`);
  }

  return response.json() as Promise<T>;
}

export function fetchPokemon(name: string): Promise<PokemonDetail> {
  return fetchFromPokeApi<PokemonDetail>(`pokemon/${name}`);
}

export function fetchSpeciesByUrl(url: string): Promise<PokemonSpecies> {
  const path = url.replace(`${POKEAPI_BASE}/`, '');
  return fetchFromPokeApi<PokemonSpecies>(path);
}

export function fetchVersion(name: string): Promise<VersionResponse> {
  return fetchFromPokeApi<VersionResponse>(`version/${name}`);
}

export function fetchMove(name: string): Promise<MoveDetail> {
  return fetchFromPokeApi<MoveDetail>(`move/${name}`);
}

export async function fetchMovesByName(
  moveNames: string[],
): Promise<Record<string, MoveDetail>> {
  const uniqueNames = Array.from(new Set(moveNames));
  const results = await Promise.all(
    uniqueNames.map(async (moveName) => {
      const detail = await fetchMove(moveName);
      return [moveName, detail] as const;
    }),
  );

  const movesByName: Record<string, MoveDetail> = {};
  for (const [moveName, detail] of results) {
    movesByName[moveName] = detail;
  }
  return movesByName;
}
