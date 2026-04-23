import { useTranslation } from 'react-i18next';

interface FlavorTextSectionProps {
  activeVersion: string;
  availableVersions: string[];
  onVersionChange: (version: string) => void;
  flavorText: string;
}

export const FlavorTextSection = ({ 
  activeVersion, 
  availableVersions, 
  onVersionChange, 
  flavorText 
}: FlavorTextSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-white/40 dark:border-slate-700/40 shadow-inner backdrop-blur-sm -skew-x-1 mt-10">
      <div className="flex justify-between items-center mb-4 border-b border-slate-300/50 dark:border-slate-600/50 pb-3 h-[2rem]">
        <span className="font-bold text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">
          {t('detail.pokedex_entry')}
        </span>
        <select
          value={activeVersion}
          onChange={(e) => onVersionChange(e.target.value)}
          className="bg-transparent border-none text-slate-800 dark:text-white font-bold capitalize cursor-pointer focus:ring-0 outline-none hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded px-2 py-1 transition-colors"
        >
          {availableVersions.map((v) => (
            <option key={v} value={v} className="bg-white dark:bg-slate-800">
              {t(`versions.${v}`, v.replace('-', ' '))}
            </option>
          ))}
        </select>
      </div>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xl min-h-[5rem]">
        {flavorText}
      </p>
    </div>
  );
};
