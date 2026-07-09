import { useQueries } from '@tanstack/react-query';
import { fetchMove } from '../../../../api/pokeApi';
import type { MoveDetail } from '../../../../types/pokemon';

export function useMoveDetails(moveNames: string[]) {
  const uniqueNames = Array.from(new Set(moveNames));

  const queries = useQueries({
    queries: uniqueNames.map((moveName) => ({
      queryKey: ['move', moveName],
      queryFn: () => fetchMove(moveName),
      staleTime: Infinity,
    })),
  });

  const movesByName: Record<string, MoveDetail> = {};
  for (let i = 0; i < uniqueNames.length; i++) {
    const data = queries[i]?.data;
    if (data) {
      movesByName[uniqueNames[i]] = data;
    }
  }

  const isLoading = queries.some((q) => q.isLoading);

  return { movesByName, isLoading };
}
