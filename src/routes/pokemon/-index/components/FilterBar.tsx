import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { typeColors } from '../../../../utils/typeColors';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (t: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  genFilter: string;
  setGenFilter: (g: string) => void;
}

export const FilterBar = ({
  searchTerm, setSearchTerm, typeFilter, setTypeFilter, genFilter, setGenFilter
}: FilterBarProps) => {
  const { t } = useTranslation();
  
  // IME入力を邪魔しないためのローカル状態
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // プロパティ（URL）が外部から変更された場合に同期
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // デバウンス処理: 入力が止まってから 300ms 後に親の状態を更新
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        setSearchTerm(localSearch);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, searchTerm, setSearchTerm]);

  const types = Object.keys(typeColors);
  const generationOptions = [
    '1', '2', '3', '4', '5', '6', '7', '8', 'hisui', '9'
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
      <div className="flex-1">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('common.search')}</label>
        <input 
          type="text" 
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={t('common.search_placeholder')}
          className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none text-slate-800 dark:text-white transition-all shadow-inner"
        />
      </div>

      <div className="md:w-48">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('common.type_label')}</label>
        <div className="relative">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full appearance-none bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 pr-10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none text-slate-800 dark:text-white capitalize transition-all shadow-inner cursor-pointer"
          >
            <option value="">{t('common.all_types')}</option>
            {types.map(type => (
              <option key={type} value={type}>{t(`types.${type}`)}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="md:w-48">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('common.generation_label')}</label>
        <div className="relative">
          <select 
            value={genFilter}
            onChange={(e) => setGenFilter(e.target.value)}
            className="w-full appearance-none bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 pr-10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none text-slate-800 dark:text-white transition-all shadow-inner cursor-pointer"
          >
            <option value="">{t('common.all_generations')}</option>
            {generationOptions.map(g => (
              <option key={g} value={g}>
                {g === 'hisui' ? t('common.legends_arceus') : t('common.generation', { n: g })}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
};
