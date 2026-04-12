import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPokemonDetail, fetchSpeciesByUrl } from '../../../api/pokeApi';
import { getTypeColor } from '../../../utils/typeColors';
import { useNavigate } from 'react-router-dom';

interface PokemonCardProps {
  name: string;
}

export const PokemonCard = ({ name }: PokemonCardProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 1. ポケモン詳細データの取得
  const { data: pokemon, isLoading: isPokemonLoading, error: pokemonError } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetail(name),
  });

  // 2. 詳細データの species.url を使って種族データを取得
  // こうすることで、'zygarde-10' のようなフォルム名で 404 エラーになるのを防げる
  const { data: species, isLoading: isSpeciesLoading } = useQuery({
    queryKey: ['species', pokemon?.species.url],
    queryFn: () => fetchSpeciesByUrl(pokemon!.species.url),
    enabled: !!pokemon?.species.url,
  });

  if (isPokemonLoading || isSpeciesLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 w-full h-64 animate-pulse flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  if (pokemonError || !pokemon || !species) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-200 w-full h-64 flex items-center justify-center text-sm">
        {t('common.no_pokemon')}
      </div>
    );
  }

  const currentLang = i18n.language.startsWith('ja') ? 'ja' : 'en';
  const localizedName = species.names.find(n => n.language.name === (currentLang === 'ja' ? 'ja' : 'en'))?.name || pokemon.name;
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

  return (
    <div 
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
      className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      <div className="p-5 flex flex-col items-center relative">
        <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 dark:text-slate-500">
          #{String(pokemon.id).padStart(4, '0')}
        </span>
        <div className="w-32 h-32 mt-4 mb-4 relative drop-shadow-md group-hover:scale-110 transition-transform duration-300">
          {imageUrl ? (
            <img src={imageUrl} alt={localizedName} className="w-full h-full object-contain" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">{t('common.no_image')}</div>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize mb-4 tracking-wide">
          {localizedName}
        </h3>
        <div className="flex gap-2">
          {pokemon.types.map((type_info) => (
            <span
              key={type_info.type.name}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getTypeColor(type_info.type.name)}`}
            >
              {t(`types.${type_info.type.name}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
