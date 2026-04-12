import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilteredPokemonList } from './hooks/usePokemonList';
import { PokemonCard } from './components/PokemonCard';
import { FilterBar } from './components/FilterBar';

export const PokemonList = () => {
  const { t } = useTranslation();

  // 初期値としてsessionStorageから取得
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('pokedex-search') || '');
  const [typeFilter, setTypeFilter] = useState(() => sessionStorage.getItem('pokedex-type') || '');
  const [genFilter, setGenFilter] = useState(() => sessionStorage.getItem('pokedex-gen') || '');

  // フィルタが変更されるたびにsessionStorageを更新
  useEffect(() => {
    sessionStorage.setItem('pokedex-search', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('pokedex-type', typeFilter);
  }, [typeFilter]);

  useEffect(() => {
    sessionStorage.setItem('pokedex-gen', genFilter);
  }, [genFilter]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    totalCount
  } = useFilteredPokemonList(searchTerm, typeFilter, genFilter);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // スクロール位置の復元と保存
  useEffect(() => {
    // 復元: データ読み込み完了後に実行
    if (!isInitialLoading && data) {
      const savedPos = sessionStorage.getItem('pokedex-scroll-pos');
      if (savedPos) {
        // DOMの描画完了を待つために少し遅延させる
        const timer = setTimeout(() => {
          window.scrollTo(0, parseInt(savedPos, 10));
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isInitialLoading, data]);

  useEffect(() => {
    // 保存: スクロールするたびに位置を記憶
    const savePos = () => {
      if (window.location.pathname === '/') {
        sessionStorage.setItem('pokedex-scroll-pos', window.scrollY.toString());
      }
    };
    window.addEventListener('scroll', savePos);
    return () => window.removeEventListener('scroll', savePos);
  }, []);

  return (
    <div className="pb-12">
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        genFilter={genFilter}
        setGenFilter={setGenFilter}
      />

      {isInitialLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 text-slate-500 dark:text-slate-400 font-medium">
            {t('common.found_count', { count: totalCount })}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.data.map(pokemon => (
                  <PokemonCard key={pokemon.name} name={pokemon.name} />
                ))}
              </React.Fragment>
            ))}
          </div>

          {totalCount === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-lg">{t('common.no_pokemon')}</p>
            </div>
          )}

          {isFetchingNextPage && (
            <div className="flex justify-center mt-12 mb-4">
              <div className="animate-pulse flex space-x-3">
                <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                <div className="h-3 w-3 bg-red-400 rounded-full animate-bounce"></div>
                <div className="h-3 w-3 bg-red-400 rounded-full"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
