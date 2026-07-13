import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { fetchPokemonDetailView } from '../../api/bffApi';
import { getCurrentLang } from '../../shared/detail/speciesDisplay';
import { DetailHero } from './-$name/components/DetailHero';
import { DetailVersionSelect } from './-$name/components/DetailVersionSelect';
import { FlavorTextSection } from './-$name/components/FlavorTextSection';
import { PhysicalTraits } from './-$name/components/PhysicalTraits';
import { BaseStats } from './-$name/components/BaseStats';
import { MovesSection } from './-$name/components/MovesSection';

export const Route = createFileRoute('/pokemon/$name')({
  component: PokemonDetail,
  loader: async ({ context: { queryClient }, params: { name } }) => {
    const lang =
      typeof navigator !== 'undefined' ? getCurrentLang(navigator.language) : 'en';

    await queryClient.ensureQueryData({
      queryKey: ['pokemonDetailView', name, lang, null],
      queryFn: () => fetchPokemonDetailView(name, { lang, version: null }),
    });

    return { name };
  },
});

function PokemonDetail() {
  const { name } = Route.useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = getCurrentLang(i18n.language);
  const [userSelectedVersion, setUserSelectedVersion] = useState<string | null>(null);

  const { data: view, isLoading } = useQuery({
    queryKey: ['pokemonDetailView', name, currentLang, userSelectedVersion],
    queryFn: () =>
      fetchPokemonDetailView(name, {
        lang: currentLang,
        version: userSelectedVersion,
      }),
    enabled: !!name,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  if (!view) {
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
          id={view.id}
          localizedName={view.localizedName}
          genus={view.genus}
          types={view.types}
        />

        <div className="p-8 md:p-16 bg-white dark:bg-slate-800">
          <DetailVersionSelect
            activeVersion={view.activeVersion}
            availableVersions={view.availableVersions}
            onVersionChange={setUserSelectedVersion}
          />
          <FlavorTextSection flavorText={view.flavorText} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <PhysicalTraits height={view.height} weight={view.weight} />
            <BaseStats stats={view.stats} />
          </div>

          <MovesSection moveGroups={view.moveGroups} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
