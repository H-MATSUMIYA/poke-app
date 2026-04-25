import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {

  return (
    <div className="relative min-h-[calc(100vh-200px)] flex items-center justify-center overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/10 dark:bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-block px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
            Next Generation Pokédex
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 dark:text-white tracking-tighter leading-tight">
            Discover the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Pokémon World</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Explore detailed stats, abilities, and evolutionary paths of over 1,000 Pokémon through our premium, high-precision global database.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Link 
              to="/pokemon"
              className="px-10 py-5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Open Pokédex
            </Link>
            <button className="px-10 py-5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-lg shadow-sm hover:shadow-md transition-all active:scale-95 opacity-50 cursor-not-allowed">
              Market Analytics (Soon)
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative animate-in fade-in zoom-in duration-1000">
          <div className="relative z-10 p-8">
            <img 
              src="/pokedex_landing_hero.png" 
              alt="Pokeball Hero" 
              className="w-full h-auto drop-shadow-[0_35px_45px_rgba(239,68,68,0.25)] dark:drop-shadow-[0_35px_45px_rgba(239,68,68,0.15)] hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* 装飾的なフローティング要素 */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl rotate-12 opacity-20 blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-10 blur-2xl animate-bounce duration-[3000ms]"></div>
        </div>
      </div>
    </div>
  );
}
