import { useTranslation } from 'react-i18next';
import { getTypeColor } from '../../../../utils/typeColors';

interface DetailHeroProps {
  id: number;
  name: string;
  localizedName: string;
  genus: string;
  types: Array<{ type: { name: string } }>;
  imageUrl: string | null;
}

export const DetailHero = ({ id, name, localizedName, genus, types, imageUrl }: DetailHeroProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 md:p-16 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
      {/* 背景の装飾 */}
      <div className="absolute -right-32 -top-32 opacity-5 dark:opacity-10 pointer-events-none transform -rotate-12">
        <svg width="600" height="600" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="currentColor" />
        </svg>
      </div>

      {/* ポケモン画像 */}
      <div className="w-72 h-72 md:w-96 md:h-96 relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
        {imageUrl ? (
          <img src={imageUrl} alt={localizedName} className="w-full h-full object-contain filter" />
        ) : (
          <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400">
            {t('common.no_image')}
          </div>
        )}
      </div>

      {/* 基本情報 */}
      <div className="flex-1 z-10 w-full">
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-2xl font-black text-slate-400/80 tracking-widest">
            #{String(id).padStart(4, '0')}
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white capitalize tracking-tighter drop-shadow-sm">
            {localizedName}
          </h2>
        </div>
        
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 font-bold tracking-wide">
          {genus}
        </p>

        <div className="flex gap-3">
          {types.map((t_info) => (
            <span 
              key={t_info.type.name} 
              className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md ${getTypeColor(t_info.type.name)}`}
            >
              {t(`types.${t_info.type.name}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
