import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/common/useTheme';

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex bg-red-600 dark:bg-slate-800 rounded-lg p-1 space-x-1 shadow-inner border border-red-700 dark:border-slate-700">
      <button 
        onClick={() => setTheme('light')}
        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
          theme === 'light' 
            ? 'bg-white text-red-600 shadow-sm' 
            : 'text-white/80 hover:bg-white/20 dark:hover:bg-slate-700'
        }`}
      >
        {t('theme.light')}
      </button>
      <button 
        onClick={() => setTheme('dark')}
        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
          theme === 'dark' 
            ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-700' 
            : 'text-white/80 hover:bg-white/20 dark:hover:bg-slate-700'
        }`}
      >
        {t('theme.dark')}
      </button>
      <button 
        onClick={() => setTheme('system')}
        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
          theme === 'system' 
            ? 'bg-white text-red-600 shadow-sm dark:bg-slate-600 dark:text-white' 
            : 'text-white/80 hover:bg-white/20 dark:hover:bg-slate-700'
        }`}
      >
        {t('theme.system')}
      </button>
    </div>
  );
};
