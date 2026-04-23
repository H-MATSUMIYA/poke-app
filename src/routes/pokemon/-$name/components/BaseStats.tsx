import { useTranslation } from 'react-i18next';

interface BaseStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface BaseStatsProps {
  stats: BaseStat[];
}

export const BaseStats = ({ stats }: BaseStatsProps) => {
  const { t } = useTranslation();
  const totalStats = stats.reduce((acc, s) => acc + s.base_stat, 0);

  return (
    <div>
      <h3 className="text-2xl font-black mb-8 text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-700 pb-4 inline-block">
        {t('detail.base_stats')}
      </h3>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 space-y-6">
        {stats.map((s) => {
          const statPerc = Math.min(100, Math.max(0, (s.base_stat / 255) * 100));
          return (
            <div key={s.stat.name} className="flex items-center gap-6">
              <span className="w-32 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {t(`stats.${s.stat.name}`, s.stat.name.replace('-', ' '))}
              </span>
              <div className="flex-1 h-4 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    s.base_stat >= 110 ? 'bg-green-500' : s.base_stat >= 70 ? 'bg-yellow-400' : 'bg-red-500'
                  }`} 
                  style={{ width: `${statPerc}%` }}
                ></div>
              </div>
              <span className="w-10 text-right font-mono font-black text-xl text-slate-700 dark:text-slate-200">
                {s.base_stat}
              </span>
            </div>
          );
        })}
        
        <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="w-32 text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
            {t('detail.total')}
          </span>
          <div className="flex-1"></div>
          <span className="w-10 text-right font-mono font-black text-2xl text-slate-800 dark:text-white">
            {totalStats}
          </span>
        </div>
      </div>
    </div>
  );
};
