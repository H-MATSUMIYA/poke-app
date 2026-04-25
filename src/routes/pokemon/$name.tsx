import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPokemonDetail, fetchSpeciesByUrl } from '../../api/pokeApi';
import { DetailHero } from './-$name/components/DetailHero';
import { FlavorTextSection } from './-$name/components/FlavorTextSection';
import { PhysicalTraits } from './-$name/components/PhysicalTraits';
import { BaseStats } from './-$name/components/BaseStats';

export const Route = createFileRoute('/pokemon/$name')({
  component: PokemonDetail,
  loader: async ({ context: { queryClient }, params: { name } }) => {
    const pokemon = await queryClient.ensureQueryData({
      queryKey: ['pokemon', name],
      queryFn: () => fetchPokemonDetail(name),
    });

    await queryClient.ensureQueryData({
      queryKey: ['species', pokemon.species.url],
      queryFn: () => fetchSpeciesByUrl(pokemon.species.url),
    });

    return { name };
  },
});

function PokemonDetail() {
  const { name } = Route.useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data: pokemon, isLoading: isPokemonLoading } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetail(name),
    enabled: !!name,
  });

  const { data: species, isLoading: isSpeciesLoading } = useQuery({
    queryKey: ['species', pokemon?.species.url],
    queryFn: () => fetchSpeciesByUrl(pokemon!.species.url),
    enabled: !!pokemon?.species.url,
  });

  const [userSelectedVersion, setUserSelectedVersion] = useState<string | null>(null);
  const currentLang = i18n.language.startsWith('ja') ? 'ja' : 'en';

  const targetEntries = useMemo(() => {
    if (!species) return [];
    const langKey = currentLang === 'ja' ? 'ja' : 'en';
    const filtered = species.flavor_text_entries.filter(e => 
      e.language.name === langKey || (langKey === 'ja' && e.language.name === 'ja-Hrkt')
    );
    return filtered.length > 0 ? filtered : species.flavor_text_entries.filter(e => e.language.name === 'en');
  }, [species, currentLang]);

  const availableVersions = useMemo(() => {
    return Array.from(new Set(targetEntries.map(e => e.version.name)));
  }, [targetEntries]);

  const activeVersion = useMemo(() => {
    if (userSelectedVersion && availableVersions.includes(userSelectedVersion)) {
      return userSelectedVersion;
    }
    return availableVersions.find(v => v === 'sword' || v === 'shield') || availableVersions[0] || '';
  }, [userSelectedVersion, availableVersions]);

  const flavorText = useMemo(() => {
    if (!activeVersion) return '';
    const entry = targetEntries.find(e => e.version.name === activeVersion);
    return (entry?.flavor_text || '').replace(/[\f\n\r\t\v]+/g, ' ');
  }, [activeVersion, targetEntries]);

  if (isPokemonLoading || isSpeciesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  if (!pokemon || !species) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl font-bold mb-4">{t('common.no_pokemon')}</p>
        <button
          onClick={() => navigate({ to: '/pokemon' })}
          className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl shadow-sm hover:shadow-md transition-all font-bold"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  const localizedName = species.names.find(n => n.language.name === (currentLang === 'ja' ? 'ja' : 'en'))?.name || pokemon.name;
  const jaGenus = species.genera.find(g => g.language.name === 'ja');
  const enGenus = species.genera.find(g => g.language.name === 'en');
  const genus = (currentLang === 'ja' ? jaGenus?.genus : enGenus?.genus) || jaGenus?.genus || enGenus?.genus || '';
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button
        onClick={() => history.back()}
        className="mb-6 flex items-center text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-bold z-10 relative"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        {t('common.back')}
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60">
        <DetailHero 
          id={pokemon.id}
          localizedName={localizedName}
          genus={genus}
          types={pokemon.types}
          imageUrl={imageUrl}
        />

        <div className="p-8 md:p-16 bg-white dark:bg-slate-800">
          <FlavorTextSection 
            activeVersion={activeVersion}
            availableVersions={availableVersions}
            onVersionChange={setUserSelectedVersion}
            flavorText={flavorText}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <PhysicalTraits height={pokemon.height} weight={pokemon.weight} />
            <BaseStats stats={pokemon.stats} />
          </div>
        </div>
      </div>
    </div>
  );
}
