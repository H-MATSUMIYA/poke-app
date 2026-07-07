import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPokemonDetail, fetchSpeciesByUrl } from '../../../../api/pokeApi';
import {
  getAvailableVersions,
  getFlavorText,
  getTargetFlavorEntries,
  resolveActiveVersion,
} from '../utils/flavorText';
import {
  getCurrentLang,
  getLocalizedGenus,
  getLocalizedName,
} from '../utils/speciesDisplay';

export function usePokemonDetailPage(name: string) {
  const { i18n } = useTranslation();
  const currentLang = getCurrentLang(i18n.language);

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetail(name),
    enabled: !!name,
  });

  const speciesQuery = useQuery({
    queryKey: ['species', pokemonQuery.data?.species.url],
    queryFn: () => fetchSpeciesByUrl(pokemonQuery.data!.species.url),
    enabled: !!pokemonQuery.data?.species.url,
  });

  const [userSelectedVersion, setUserSelectedVersion] = useState<string | null>(null);

  const targetEntries = useMemo(() => {
    if (!speciesQuery.data) return [];
    return getTargetFlavorEntries(speciesQuery.data, currentLang);
  }, [speciesQuery.data, currentLang]);

  const availableVersions = useMemo(
    () => getAvailableVersions(targetEntries),
    [targetEntries],
  );

  const activeVersion = useMemo(
    () => resolveActiveVersion(availableVersions, userSelectedVersion),
    [availableVersions, userSelectedVersion],
  );

  const flavorText = useMemo(
    () => getFlavorText(targetEntries, activeVersion),
    [targetEntries, activeVersion],
  );

  const pokemon = pokemonQuery.data;
  const species = speciesQuery.data;

  return {
    pokemon,
    species,
    isLoading: pokemonQuery.isLoading || speciesQuery.isLoading,
    localizedName:
      pokemon && species ? getLocalizedName(pokemon, species, currentLang) : '',
    genus: species ? getLocalizedGenus(species, currentLang) : '',
    flavorTextState: {
      activeVersion,
      availableVersions,
      flavorText,
      onVersionChange: setUserSelectedVersion,
    },
  };
}
