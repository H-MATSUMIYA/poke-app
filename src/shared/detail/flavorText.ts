import type { FlavorTextEntry, PokemonSpecies } from '../../types/pokemon';

export function getTargetFlavorEntries(
  species: PokemonSpecies,
  lang: 'ja' | 'en',
): FlavorTextEntry[] {
  const langKey = lang === 'ja' ? 'ja' : 'en';
  const filtered = species.flavor_text_entries.filter(
    (e) => e.language.name === langKey || (langKey === 'ja' && e.language.name === 'ja-Hrkt'),
  );
  return filtered.length > 0
    ? filtered
    : species.flavor_text_entries.filter((e) => e.language.name === 'en');
}

export function getAvailableVersions(entries: FlavorTextEntry[]): string[] {
  return Array.from(new Set(entries.map((e) => e.version.name)));
}

export function resolveActiveVersion(
  availableVersions: string[],
  userSelectedVersion: string | null,
): string {
  if (userSelectedVersion && availableVersions.includes(userSelectedVersion)) {
    return userSelectedVersion;
  }
  return availableVersions.find((v) => v === 'sword' || v === 'shield') ?? availableVersions[0] ?? '';
}

export function getFlavorText(entries: FlavorTextEntry[], activeVersion: string): string {
  if (!activeVersion) return '';
  const entry = entries.find((e) => e.version.name === activeVersion);
  return (entry?.flavor_text ?? '').replace(/[\f\n\r\t\v]+/g, ' ');
}
