import { useTranslation } from 'react-i18next';

interface DetailVersionSelectProps {
  activeVersion: string;
  availableVersions: string[];
  onVersionChange: (version: string) => void;
}

export const DetailVersionSelect = ({
  activeVersion,
  availableVersions,
  onVersionChange,
}: DetailVersionSelectProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-4 mt-10 px-2">
      <span className="font-bold text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">
        {t('detail.game_version')}
      </span>
      <select
        value={activeVersion}
        onChange={(e) => onVersionChange(e.target.value)}
        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold capitalize cursor-pointer focus:ring-2 focus:ring-red-500/30 outline-none rounded-xl px-4 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {availableVersions.map((v) => (
          <option key={v} value={v} className="bg-white dark:bg-slate-800">
            {t(`versions.${v}`, v.replace('-', ' '))}
          </option>
        ))}
      </select>
    </div>
  );
};
