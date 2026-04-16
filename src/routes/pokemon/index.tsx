import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useFilteredPokemonList } from '../../hooks/pokemon-list/usePokemonList';
import { PokemonCard } from '../../components/pokemon-list/PokemonCard';
import { FilterBar } from '../../components/pokemon-list/FilterBar';

export const Route = createFileRoute('/pokemon/')({
  component: PokemonList,
});

function PokemonList() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('pokedex-search') || '');
  const [typeFilter, setTypeFilter] = useState(() => sessionStorage.getItem('pokedex-type') || '');
  const [genFilter, setGenFilter] = useState(() => sessionStorage.getItem('pokedex-gen') || '');

  // ハンドラーで直接Storageを更新（useEffectを使わない）
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    sessionStorage.setItem('pokedex-search', val);
  };
  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    sessionStorage.setItem('pokedex-type', val);
  };
  const handleGenChange = (val: string) => {
    setGenFilter(val);
    sessionStorage.setItem('pokedex-gen', val);
  };

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

  return (
    <div className="pb-12">
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        typeFilter={typeFilter}
        setTypeFilter={handleTypeChange}
        genFilter={genFilter}
        setGenFilter={handleGenChange}
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
}
