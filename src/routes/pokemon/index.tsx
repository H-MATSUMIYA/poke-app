import React, { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useFilteredPokemonList } from '../../hooks/pokemon-list/usePokemonList';
import { PokemonCard } from './-index/components/PokemonCard';
import { FilterBar } from './-index/components/FilterBar';
import type { NamedAPIResource } from '../../types/pokemon';

// 検索パラメータのバリデーションスキーマ
const pokemonSearchSchema = z.object({
  search: z.string().optional().catch(''),
  type: z.string().optional().catch(''),
  gen: z.string().optional().catch(''),
});

export const Route = createFileRoute('/pokemon/')({
  validateSearch: pokemonSearchSchema,
  component: PokemonList,
});

function PokemonList() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  
  // URLから現在の検索状態を取得 (型安全)
  const { search = '', type = '', gen = '' } = Route.useSearch();

  // URLを更新してフィルターを適用
  const handleSearchChange = (val: string) => {
    navigate({ search: (prev) => ({ ...prev, search: val || undefined }) });
  };
  const handleTypeChange = (val: string) => {
    navigate({ search: (prev) => ({ ...prev, type: val || undefined }) });
  };
  const handleGenChange = (val: string) => {
    navigate({ search: (prev) => ({ ...prev, gen: val || undefined }) });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    totalCount
  } = useFilteredPokemonList(search, type, gen);

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
            {t('common.pokedex_title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {t('common.pokedex_subtitle', { count: totalCount })}
          </p>
        </div>
      </div>

      <FilterBar 
        searchTerm={search}
        setSearchTerm={handleSearchChange}
        typeFilter={type}
        setTypeFilter={handleTypeChange}
        genFilter={gen}
        setGenFilter={handleGenChange}
      />

      {totalCount === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">{t('common.no_pokemon')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.data.map((pokemon: NamedAPIResource) => (
                <PokemonCard key={pokemon.name} name={pokemon.name} />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}
    </div>
  );
}
