import React, { useState, useEffect } from 'react';
import { useFilteredPokemonList } from '../hooks/usePokemonList';
import { PokemonCard } from '../components/PokemonCard';
import { FilterBar } from '../components/FilterBar';

export const PokemonList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [genFilter, setGenFilter] = useState('');

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
            Found {totalCount} Pokémon
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

          {data?.pages[0].data.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-lg">No Pokémon found matching your criteria.</p>
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
