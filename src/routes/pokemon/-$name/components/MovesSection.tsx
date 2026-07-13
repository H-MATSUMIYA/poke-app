import { useTranslation } from 'react-i18next';
import type { PokemonDetailMoveGroupView } from '../../../../types/views/pokemonDetail';
import { formatStat, getLearnMethodGroupKey } from '../../../../shared/detail/moves';

interface MovesSectionProps {
  moveGroups: PokemonDetailMoveGroupView[];
  isLoading: boolean;
}

export const MovesSection = ({
  moveGroups,
  isLoading,
}: MovesSectionProps) => {
  const { t } = useTranslation();

  const totalMoves = moveGroups.reduce((sum, g) => sum + g.moves.length, 0);

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

      {!isLoading && totalMoves === 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          {t('detail.no_moves')}
        </p>
      )}

      {!isLoading && moveGroups.length > 0 && (
        <div className="space-y-8">
          {moveGroups.map((group) => (
            <MoveGroupTable key={group.learnMethod} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

interface MoveGroupTableProps {
  group: PokemonDetailMoveGroupView;
}

const MoveGroupTable = ({ group }: MoveGroupTableProps) => {
  const { t } = useTranslation();
  const groupKey = getLearnMethodGroupKey(group.learnMethod);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-x-auto">
      <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
        {t(`learn_methods.${groupKey}`, group.learnMethod.replace('-', ' '))}
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
          {group.moves.map((move, idx) => (
            <tr
              key={`${move.slug}-${group.learnMethod}-${move.levelLearnedAt}-${idx}`}
              className="border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <td className="py-3 pr-4 font-bold text-slate-800 dark:text-slate-200">
                {move.displayName}
              </td>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                {move.type ? t(`types.${move.type}`, move.type) : '—'}
              </td>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                {move.damageClass
                  ? t(`damage_class.${move.damageClass}`, move.damageClass)
                  : '—'}
              </td>
              <td className="py-3 pr-4 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                {formatStat(move.power)}
              </td>
              <td className="py-3 pr-4 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                {formatStat(move.accuracy)}
              </td>
              <td className="py-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200">
                {group.learnMethod === 'level-up' && move.levelLearnedAt > 0
                  ? `Lv.${move.levelLearnedAt}`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
