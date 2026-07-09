import { useTranslation } from 'react-i18next';
import type { MoveDetail } from '../../../../types/pokemon';
import { useMoveDetails } from '../hooks/useMoveDetails';
import {
  formatStat,
  getLearnMethodGroupKey,
  getLocalizedMoveName,
  groupMovesByLearnMethod,
  type MoveEntry,
} from '../utils/moves';

interface MovesSectionProps {
  moveEntries: MoveEntry[];
  currentLang: 'ja' | 'en';
  isVersionGroupLoading: boolean;
}

export const MovesSection = ({
  moveEntries,
  currentLang,
  isVersionGroupLoading,
}: MovesSectionProps) => {
  const { t } = useTranslation();
  const moveNames = moveEntries.map((e) => e.moveName);
  const { movesByName, isLoading: isMovesLoading } = useMoveDetails(moveNames);
  const groupedMoves = groupMovesByLearnMethod(moveEntries);

  const isLoading = isVersionGroupLoading || isMovesLoading;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-black mb-8 text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-700 pb-4 inline-block">
        {t('detail.moves')}
      </h3>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-500" />
        </div>
      )}

      {!isLoading && moveEntries.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          {t('detail.no_moves')}
        </p>
      )}

      {!isLoading && groupedMoves.length > 0 && (
        <div className="space-y-8">
          {groupedMoves.map((group) => (
            <MoveGroupTable
              key={group.learnMethod}
              learnMethod={group.learnMethod}
              entries={group.entries}
              movesByName={movesByName}
              currentLang={currentLang}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface MoveGroupTableProps {
  learnMethod: string;
  entries: MoveEntry[];
  movesByName: Record<string, MoveDetail>;
  currentLang: 'ja' | 'en';
}

const MoveGroupTable = ({
  learnMethod,
  entries,
  movesByName,
  currentLang,
}: MoveGroupTableProps) => {
  const { t } = useTranslation();
  const groupKey = getLearnMethodGroupKey(learnMethod);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-x-auto">
      <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
        {t(`learn_methods.${groupKey}`, learnMethod.replace('-', ' '))}
      </h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
            <th className="pb-3 pr-4 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('detail.move_name')}
            </th>
            <th className="pb-3 pr-4 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('detail.move_element')}
            </th>
            <th className="pb-3 pr-4 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('detail.move_category')}
            </th>
            <th className="pb-3 pr-4 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
              {t('detail.move_power')}
            </th>
            <th className="pb-3 pr-4 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
              {t('detail.move_accuracy')}
            </th>
            <th className="pb-3 font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
              {t('detail.learn_level')}
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => {
            const move = movesByName[entry.moveName];
            return (
              <tr
                key={`${entry.moveName}-${entry.learnMethod}-${entry.levelLearnedAt}-${idx}`}
                className="border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <td className="py-3 pr-4 font-bold text-slate-800 dark:text-slate-200">
                  {move ? getLocalizedMoveName(move, currentLang) : entry.moveName}
                </td>
                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                  {move
                    ? t(`types.${move.type.name}`, move.type.name)
                    : '—'}
                </td>
                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                  {move
                    ? t(`damage_class.${move.damage_class.name}`, move.damage_class.name)
                    : '—'}
                </td>
                <td className="py-3 pr-4 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                  {move ? formatStat(move.power) : '—'}
                </td>
                <td className="py-3 pr-4 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                  {move ? formatStat(move.accuracy) : '—'}
                </td>
                <td className="py-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                  {entry.learnMethod === 'level-up' && entry.levelLearnedAt > 0
                    ? `Lv.${entry.levelLearnedAt}`
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
