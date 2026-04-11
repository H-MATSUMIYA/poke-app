import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPokemonDetail, fetchPokemonSpecies } from '../api/pokeApi';
import { getTypeColor } from '../utils/typeColors';

export const PokemonDetailScreen = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data: pokemon, isLoading: isPokemonLoading } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetail(name!),
    enabled: !!name,
  });

  const { data: species, isLoading: isSpeciesLoading } = useQuery({
    queryKey: ['species', name],
    queryFn: () => fetchPokemonSpecies(name!),
    enabled: !!name,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const currentLang = i18n.language.startsWith('ja') ? 'ja' : 'en';

  const targetEntries = useMemo(() => {
    if (!species) return [];
    // 言語設定に合わせたフレーバーテキストを抽出
    const langKey = currentLang === 'ja' ? 'ja' : 'en';
    const filtered = species.flavor_text_entries.filter(e => 
      e.language.name === langKey || (langKey === 'ja' && e.language.name === 'ja-Hrkt')
    );
    if (filtered.length > 0) return filtered;
    // フォールバック
    return species.flavor_text_entries.filter(e => e.language.name === 'en');
  }, [species, currentLang]);

  const availableVersions = useMemo(() => {
    return Array.from(new Set(targetEntries.map(e => e.version.name)));
  }, [targetEntries]);

  useEffect(() => {
    if (availableVersions.length > 0 && !availableVersions.includes(selectedVersion)) {
      const defaultVer = availableVersions.find(v => v === 'sword' || v === 'shield') || availableVersions[0];
      setSelectedVersion(defaultVer);
    }
  }, [availableVersions, selectedVersion]);

  const flavorText = useMemo(() => {
    if (!selectedVersion) return '';
    const entry = targetEntries.find(e => e.version.name === selectedVersion);
    return (entry?.flavor_text || '').replace(/[\f\n\r\t\v]+/g, ' ');
  }, [selectedVersion, targetEntries]);

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
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl shadow-sm hover:shadow-md transition-all font-bold">
          {t('common.back')}
        </button>
      </div>
    );
  }

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

  // 言語に応じた名前と分類の抽出
  const localizedName = species.names.find(n => n.language.name === (currentLang === 'ja' ? 'ja' : 'en'))?.name || pokemon.name;
  const jaGenus = species.genera.find(g => g.language.name === 'ja');
  const enGenus = species.genera.find(g => g.language.name === 'en');
  const genus = (currentLang === 'ja' ? jaGenus?.genus : enGenus?.genus) || jaGenus?.genus || enGenus?.genus || '';

  const totalStats = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-bold z-10 relative"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        {t('common.back')}
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60">
        <div className="p-8 md:p-16 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute -right-32 -top-32 opacity-5 dark:opacity-10 pointer-events-none transform -rotate-12">
            <svg width="600" height="600" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>
          </div>

          <div className="w-72 h-72 md:w-96 md:h-96 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
             {imageUrl ? <img src={imageUrl} alt={localizedName} className="w-full h-full object-contain filter" /> : <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400">{t('common.no_image')}</div>}
          </div>

          <div className="flex-1 z-10 w-full">
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-2xl font-black text-slate-400/80 tracking-widest">#{String(pokemon.id).padStart(4, '0')}</span>
              <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white capitalize tracking-tighter drop-shadow-sm">{localizedName}</h2>
            </div>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 font-bold tracking-wide">{genus}</p>

            <div className="flex gap-3 mb-10">
              {pokemon.types.map((t_info) => (
                <span key={t_info.type.name} className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md ${getTypeColor(t_info.type.name)}`}>
                  {t(`types.${t_info.type.name}`)}
                </span>
              ))}
            </div>

            <div className="bg-white/60 dark:bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-white/40 dark:border-slate-700/40 shadow-inner backdrop-blur-sm -skew-x-1">
              <div className="flex justify-between items-center mb-4 border-b border-slate-300/50 dark:border-slate-600/50 pb-3 h-[2rem]">
                <span className="font-bold text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">{t('detail.pokedex_entry')}</span>
                <select 
                  value={selectedVersion}
                  onChange={e => setSelectedVersion(e.target.value)}
                  className="bg-transparent border-none text-slate-800 dark:text-white font-bold capitalize cursor-pointer focus:ring-0 outline-none hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded px-2 py-1 transition-colors"
                >
                  {availableVersions.map(v => (
                    <option key={v} value={v} className="bg-white dark:bg-slate-800">
                      {t(`versions.${v}`, v.replace('-', ' '))}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xl min-h-[5rem]">
                {flavorText}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-slate-800">
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-black mb-8 text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-700 pb-4 inline-block">{t('detail.physical_traits')}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 text-center">
                  <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t('detail.height')}</p>
                  <p className="text-3xl font-black text-slate-700 dark:text-slate-200">{pokemon.height / 10} <span className="text-lg text-slate-400">m</span></p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 text-center">
                  <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t('detail.weight')}</p>
                  <p className="text-3xl font-black text-slate-700 dark:text-slate-200">{pokemon.weight / 10} <span className="text-lg text-slate-400">kg</span></p>
                </div>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-2xl font-black mb-8 text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-700 pb-4 inline-block">{t('detail.base_stats')}</h3>
             <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6">
               {pokemon.stats.map(s => {
                  const statPerc = Math.min(100, Math.max(0, (s.base_stat / 255) * 100));
                  return (
                    <div key={s.stat.name} className="flex items-center gap-6">
                      <span className="w-32 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {t(`stats.${s.stat.name}`, s.stat.name.replace('-', ' '))}
                      </span>
                      <div className="flex-1 h-4 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            s.base_stat >= 110 ? 'bg-green-500' : s.base_stat >= 70 ? 'bg-yellow-400' : 'bg-red-500'
                          }`} 
                          style={{ width: `${statPerc}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-right font-mono font-black text-xl text-slate-700 dark:text-slate-200">{s.base_stat}</span>
                    </div>
                  );
               })}
               <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                 <span className="w-32 text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{t('detail.total')}</span>
                 <div className="flex-1"></div>
                 <span className="w-10 text-right font-mono font-black text-2xl text-slate-800 dark:text-white">{totalStats}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
