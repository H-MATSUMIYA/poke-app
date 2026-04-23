import { useTranslation } from 'react-i18next';

interface PhysicalTraitsProps {
  height: number;
  weight: number;
}

export const PhysicalTraits = ({ height, weight }: PhysicalTraitsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-black mb-4 text-slate-800 dark:text-white border-b-2 border-slate-100 dark:border-slate-700 pb-4 inline-block">
        {t('detail.physical_traits')}
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 text-center transition-all hover:shadow-md">
          <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            {t('detail.height')}
          </p>
          <p className="text-3xl font-black text-slate-700 dark:text-slate-200">
            {height / 10} <span className="text-lg text-slate-400">m</span>
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 text-center transition-all hover:shadow-md">
          <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            {t('detail.weight')}
          </p>
          <p className="text-3xl font-black text-slate-700 dark:text-slate-200">
            {weight / 10} <span className="text-lg text-slate-400">kg</span>
          </p>
        </div>
      </div>
    </div>
  );
};
