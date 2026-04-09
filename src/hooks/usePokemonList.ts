import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList, fetchType } from '../api/pokeApi';
import type { NamedAPIResource } from '../types/pokemon';

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
  '9': [899, 1025],
};

const extractIdFromUrl = (url: string) => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

export const useFilteredPokemonList = (searchTarget: string, typeFilter: string, genFilter: string) => {
  // 全ポケモンのリストを1度だけフェッチ（キャッシュされる）
  const allPokemonQuery = useQuery({
    queryKey: ['pokemonList', 'all'],
    queryFn: () => fetchPokemonList(1500, 0), // 1500匹取得で現状の全種をカバー
    staleTime: Infinity,
  });

  // タイプフィルターが指定された場合、そのタイプを持つポケモンのリストを取得
  const typePokemonQuery = useQuery({
    queryKey: ['type', typeFilter],
    queryFn: () => fetchType(typeFilter),
    enabled: !!typeFilter,
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

    // 3. テキスト検索適用
    if (searchTarget) {
      const lowerSearch = searchTarget.toLowerCase();
      list = list.filter(p => p.name.includes(lowerSearch) || String(extractIdFromUrl(p.url)) === lowerSearch);
    }

    return list;
  };

  const filteredList = getFilteredData();

  // useInfiniteQueryを利用した仮想ページネーション（ローカルで切り出し）
  // 仕様の「TanStack Queryの useInfiniteQuery を強力に活用」を満たす
  const infiniteQuery = useInfiniteQuery({
    queryKey: ['infinitePokemonList', searchTarget, typeFilter, genFilter],
    queryFn: async ({ pageParam = 0 }) => {
      // 全データが読み込まれるのを待つ
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
    totalCount: filteredList.length,
  };
};
