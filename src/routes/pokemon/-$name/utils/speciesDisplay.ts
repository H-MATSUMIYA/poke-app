import type { PokemonDetail, PokemonSpecies } from '../../../../types/pokemon';

export function getCurrentLang(language: string): 'ja' | 'en' {
  return language.startsWith('ja') ? 'ja' : 'en';
}

export function getLocalizedName(
  pokemon: PokemonDetail,
  species: PokemonSpecies,
  lang: 'ja' | 'en',
): string {
  const langKey = lang === 'ja' ? 'ja' : 'en';
  return species.names.find((n) => n.language.name === langKey)?.name ?? pokemon.name;
}

export function getLocalizedGenus(
  species: PokemonSpecies,
  lang: 'ja' | 'en',
): string {
  const jaGenus = species.genera.find((g) => g.language.name === 'ja');
  const enGenus = species.genera.find((g) => g.language.name === 'en');
  return (lang === 'ja' ? jaGenus?.genus : enGenus?.genus) ?? jaGenus?.genus ?? enGenus?.genus ?? '';
}
