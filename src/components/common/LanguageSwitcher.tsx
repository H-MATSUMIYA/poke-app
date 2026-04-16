import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('ja') ? 'en' : 'ja';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 text-xs font-bold rounded-md bg-red-600 dark:bg-slate-800 text-white border border-red-700 dark:border-slate-700 hover:bg-red-700 dark:hover:bg-slate-700 transition-all shadow-sm"
    >
      {i18n.language.startsWith('ja') ? 'English' : '日本語'}
    </button>
  );
};
