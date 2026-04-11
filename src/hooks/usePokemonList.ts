import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList, fetchType } from '../api/pokeApi';

// 世代ごとのID範囲定義（基本のすがた）
const GENERATIONS: Record<string, [number, number]> = {
  '1': [1, 151],
  '2': [152, 251],
  '3': [252, 386],
  '4': [387, 493],
  '5': [494, 649],
  '6': [650, 721],
  '7': [722, 809],
  '8': [810, 898],
  'hisui': [899, 905],
  '9': [906, 1025],
};

const extractIdFromUrl = (url: string) => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

// 日本語名のマッピング（GitHubのデータセットを利用）
const LOCALIZED_NAMES_URL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json';

export const useFilteredPokemonList = (searchTarget: string, typeFilter: string, genFilter: string) => {
  // 1. 全ポケモンのリストをフェッチ
  const allPokemonQuery = useQuery({
    queryKey: ['pokemonList', 'all'],
    queryFn: () => fetchPokemonList(1500, 0),
    staleTime: Infinity,
  });

  // 2. タイプフィルター
  const typePokemonQuery = useQuery({
    queryKey: ['type', typeFilter],
    queryFn: () => fetchType(typeFilter),
    enabled: !!typeFilter,
    staleTime: Infinity,
  });

  // 3. 日本語名のマッピングをフェッチ（検索体験向上のため）
  const localizedNamesQuery = useQuery({
    queryKey: ['localizedNames'],
    queryFn: async () => {
      const res = await fetch(LOCALIZED_NAMES_URL);
      if (!res.ok) return null;
      const data = await res.json();
      // IDをキーにしたマッピングを作成
      const mapping: Record<number, { en: string; ja: string }> = {};
      data.forEach((p: any) => {
        mapping[p.id] = {
          en: p.name.english.toLowerCase(),
          ja: p.name.japanese
        };
      });
      return mapping;
    },
    staleTime: Infinity,
  });

  const getFilteredData = () => {
    if (!allPokemonQuery.data) return [];
    let list = allPokemonQuery.data.results;

    // 1. タイプフィルター適用
    if (typeFilter && typePokemonQuery.data) {
      const typePokemonNames = new Set(typePokemonQuery.data.pokemon.map(p => p.pokemon.name));
      list = list.filter(p => typePokemonNames.has(p.name));
    }

    // 2. 世代フィルター適用
    if (genFilter && GENERATIONS[genFilter]) {
      const [min, max] = GENERATIONS[genFilter];
      list = list.filter(p => {
        const id = extractIdFromUrl(p.url);
        return id >= min && id <= max;
      });
    }

    // 3. 検索キーワード適用（日本語・英語・ID）
    if (searchTarget) {
      const lowerSearch = searchTarget.toLowerCase();
      const namesMap = localizedNamesQuery.data;

      list = list.filter(p => {
        const id = extractIdFromUrl(p.url);
        const nameMatch = p.name.includes(lowerSearch);
        const idMatch = String(id) === lowerSearch;

        // 日本語名のチェック
        let jaMatch = false;
        if (namesMap && namesMap[id]) {
          jaMatch = namesMap[id].ja.includes(searchTarget);
        }

        return nameMatch || idMatch || jaMatch;
      });
    }

    return list;
  };

  const filteredList = getFilteredData();

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['infinitePokemonList', searchTarget, typeFilter, genFilter],
    queryFn: async ({ pageParam = 0 }) => {
      if (allPokemonQuery.isLoading || (typeFilter && typePokemonQuery.isLoading)) {
        return { data: [], nextPage: undefined };
      }
      const pageSize = 20;
      const start = pageParam * pageSize;
      const end = start + pageSize;
      return {
        data: filteredList.slice(start, end),
        nextPage: end < filteredList.length ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: allPokemonQuery.isSuccess && (!typeFilter || typePokemonQuery.isSuccess),
  });

  return {
    ...infiniteQuery,
    isInitialLoading: allPokemonQuery.isLoading || (typeFilter && typePokemonQuery.isLoading),
    isNamesLoading: localizedNamesQuery.isLoading,
    totalCount: filteredList.length,
  };
};
