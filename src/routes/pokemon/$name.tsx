import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { fetchPokemonDetail, fetchSpeciesByUrl } from '../../api/pokeApi';
import { DetailHero } from './-$name/components/DetailHero';
import { DetailVersionSelect } from './-$name/components/DetailVersionSelect';
import { FlavorTextSection } from './-$name/components/FlavorTextSection';
import { PhysicalTraits } from './-$name/components/PhysicalTraits';
import { BaseStats } from './-$name/components/BaseStats';
import { MovesSection } from './-$name/components/MovesSection';
import { usePokemonDetailPage } from './-$name/hooks/usePokemonDetailPage';

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
  const { t } = useTranslation();

  const {
    pokemon,
    species,
    isLoading,
    localizedName,
    genus,
    currentLang,
    versionState,
    flavorText,
    moveEntries,
    isVersionGroupLoading,
  } = usePokemonDetailPage(name);

  if (isLoading) {
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
        />

        <div className="p-8 md:p-16 bg-white dark:bg-slate-800">
          <DetailVersionSelect {...versionState} />
          <FlavorTextSection flavorText={flavorText} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <PhysicalTraits height={pokemon.height} weight={pokemon.weight} />
            <BaseStats stats={pokemon.stats} />
          </div>

          <MovesSection
            moveEntries={moveEntries}
            currentLang={currentLang}
            isVersionGroupLoading={isVersionGroupLoading}
          />
        </div>
      </div>
    </div>
  );
}
