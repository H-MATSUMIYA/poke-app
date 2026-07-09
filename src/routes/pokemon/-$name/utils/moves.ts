import type { MoveDetail, PokemonMove } from '../../../../types/pokemon';

export interface MoveEntry {
  moveName: string;
  learnMethod: string;
  levelLearnedAt: number;
}

export interface MoveGroup {
  learnMethod: string;
  entries: MoveEntry[];
}

const LEARN_METHOD_ORDER = [
  'level-up',
  'machine',
  'tutor',
  'egg',
] as const;

export function getMovesForVersionGroup(
  moves: PokemonMove[],
  versionGroup: string,
): MoveEntry[] {
  const entries: MoveEntry[] = [];

  for (const pokemonMove of moves) {
    for (const detail of pokemonMove.version_group_details) {
      if (detail.version_group.name !== versionGroup) continue;
      entries.push({
        moveName: pokemonMove.move.name,
        learnMethod: detail.move_learn_method.name,
        levelLearnedAt: detail.level_learned_at,
      });
    }
  }

  return entries;
}

export function groupMovesByLearnMethod(entries: MoveEntry[]): MoveGroup[] {
  const grouped = new Map<string, MoveEntry[]>();

  for (const entry of entries) {
    const method = entry.learnMethod;
    const list = grouped.get(method) ?? [];
    list.push(entry);
    grouped.set(method, list);
  }

  const result: MoveGroup[] = [];

  for (const method of LEARN_METHOD_ORDER) {
    const groupEntries = grouped.get(method);
    if (groupEntries) {
      result.push({ learnMethod: method, entries: sortMoveEntries(groupEntries, method) });
      grouped.delete(method);
    }
  }

  for (const [method, groupEntries] of grouped) {
    result.push({ learnMethod: method, entries: sortMoveEntries(groupEntries, method) });
  }

  return result;
}

function sortMoveEntries(entries: MoveEntry[], learnMethod: string): MoveEntry[] {
  if (learnMethod === 'level-up') {
    return [...entries].sort((a, b) => a.levelLearnedAt - b.levelLearnedAt);
  }
  return [...entries].sort((a, b) => a.moveName.localeCompare(b.moveName));
}

export function getLocalizedMoveName(
  move: MoveDetail,
  lang: 'ja' | 'en',
): string {
  const langKey = lang === 'ja' ? 'ja' : 'en';
  const localized = move.names.find((n) => n.language.name === langKey);
  if (localized) return localized.name;
  if (lang === 'ja') {
    const jaHrkt = move.names.find((n) => n.language.name === 'ja-Hrkt');
    if (jaHrkt) return jaHrkt.name;
  }
  return move.names.find((n) => n.language.name === 'en')?.name ?? move.name;
}

export function formatStat(value: number | null): string {
  return value === null ? '—' : String(value);
}

export function getLearnMethodGroupKey(learnMethod: string): string {
  if (LEARN_METHOD_ORDER.includes(learnMethod as (typeof LEARN_METHOD_ORDER)[number])) {
    return learnMethod;
  }
  return 'other';
}
