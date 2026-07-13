import type { MoveDetail, PokemonDetail, PokemonSpecies } from '../../types/pokemon';
import type { PokemonDetailView } from '../../types/views/pokemonDetail';
import {
  getAvailableVersions,
  getFlavorText,
  getTargetFlavorEntries,
  resolveActiveVersion,
} from '../../shared/detail/flavorText';
import {
  getLocalizedMoveName,
  getMovesForVersionGroup,
  groupMovesByLearnMethod,
} from '../../shared/detail/moves';
import { getLocalizedGenus, getLocalizedName } from '../../shared/detail/speciesDisplay';
import * as pokeapi from '../pokeapiCore';

function parseLang(value: string | null): 'ja' | 'en' {
  return value === 'ja' ? 'ja' : 'en';
}

export async function buildPokemonDetailView(
  name: string,
  lang: 'ja' | 'en',
  requestedVersion: string | null,
): Promise<PokemonDetailView> {
  const pokemon = await pokeapi.fetchPokemon(name);
  const species = await pokeapi.fetchSpeciesByUrl(pokemon.species.url);

  const targetEntries = getTargetFlavorEntries(species, lang);
  const availableVersions = getAvailableVersions(targetEntries);
  const activeVersion = resolveActiveVersion(availableVersions, requestedVersion);
  const flavorText = getFlavorText(targetEntries, activeVersion);

  const versionData = activeVersion ? await pokeapi.fetchVersion(activeVersion) : null;
  const versionGroup = versionData?.version_group.name ?? '';

  const moveEntries = versionGroup
    ? getMovesForVersionGroup(pokemon.moves, versionGroup)
    : [];

  const movesByName = await pokeapi.fetchMovesByName(
    moveEntries.map((e) => e.moveName),
  );

  return mapToPokemonDetailView({
    pokemon,
    species,
    lang,
    availableVersions,
    activeVersion,
    flavorText,
    moveEntries,
    movesByName,
  });
}

interface MapParams {
  pokemon: PokemonDetail;
  species: PokemonSpecies;
  lang: 'ja' | 'en';
  availableVersions: string[];
  activeVersion: string;
  flavorText: string;
  moveEntries: ReturnType<typeof getMovesForVersionGroup>;
  movesByName: Record<string, MoveDetail>;
}

function mapToPokemonDetailView(params: MapParams): PokemonDetailView {
  const {
    pokemon,
    species,
    lang,
    availableVersions,
    activeVersion,
    flavorText,
    moveEntries,
    movesByName,
  } = params;

  const grouped = groupMovesByLearnMethod(moveEntries);

  return {
    id: pokemon.id,
    name: pokemon.name,
    localizedName: getLocalizedName(pokemon, species, lang),
    genus: getLocalizedGenus(species, lang),
    types: pokemon.types.map((t) => t.type.name),
    height: pokemon.height,
    weight: pokemon.weight,
    stats: pokemon.stats.map((s) => ({
      name: s.stat.name,
      baseStat: s.base_stat,
    })),
    availableVersions,
    activeVersion,
    flavorText,
    moveGroups: grouped.map((group) => ({
      learnMethod: group.learnMethod,
      moves: group.entries.map((entry) => {
        const move = movesByName[entry.moveName];
        return {
          slug: entry.moveName,
          displayName: move ? getLocalizedMoveName(move, lang) : entry.moveName,
          type: move?.type.name ?? '',
          damageClass: move?.damage_class.name ?? '',
          power: move?.power ?? null,
          accuracy: move?.accuracy ?? null,
          levelLearnedAt: entry.levelLearnedAt,
        };
      }),
    })),
  };
}

export function parsePokemonDetailParams(url: URL): {
  name: string;
  lang: 'ja' | 'en';
  version: string | null;
} | null {
  const match = url.pathname.match(/^\/api\/ui\/pokemon\/([^/]+)$/);
  if (!match) return null;

  return {
    name: decodeURIComponent(match[1]),
    lang: parseLang(url.searchParams.get('lang')),
    version: url.searchParams.get('version'),
  };
}
