import { useTranslation } from 'react-i18next';

interface FlavorTextSectionProps {
  flavorText: string;
}

export const FlavorTextSection = ({ flavorText }: FlavorTextSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-white/40 dark:border-slate-700/40 shadow-inner backdrop-blur-sm -skew-x-1 mt-6">
      <div className="mb-4 border-b border-slate-300/50 dark:border-slate-600/50 pb-3">
        <span className="font-bold text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">
          {t('detail.pokedex_entry')}
        </span>
      </div>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xl min-h-[5rem]">
        {flavorText}
      </p>
    </div>
  );
};
