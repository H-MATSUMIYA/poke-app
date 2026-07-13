import type { PokemonDetailView } from '../types/views/pokemonDetail';

const BFF_BASE = '/api/ui';

export interface FetchPokemonDetailViewOptions {
  lang: 'ja' | 'en';
  version?: string | null;
}

export async function fetchPokemonDetailView(
  name: string,
  options: FetchPokemonDetailViewOptions,
): Promise<PokemonDetailView> {
  const params = new URLSearchParams({ lang: options.lang });
  if (options.version) {
    params.set('version', options.version);
  }

  const res = await fetch(`${BFF_BASE}/pokemon/${encodeURIComponent(name)}?${params}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon detail view for ${name}`);
  }
  return res.json();
}
