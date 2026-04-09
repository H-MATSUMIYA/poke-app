import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { PokemonList } from './pages/PokemonList';
import { PokemonDetailScreen } from './pages/PokemonDetailScreen';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 図鑑アプリなので頻繁な再取得は抑制
      staleTime: 1000 * 60 * 5, // 5分間はキャッシュを有効化
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <header className="bg-red-500 dark:bg-slate-800 text-white p-4 shadow-md sticky top-0 z-50 border-b border-red-600 dark:border-slate-700">
            <div className="container mx-auto flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-inner">
                  <div className="w-3 h-3 bg-red-500 dark:bg-slate-900 rounded-full"></div>
                </div>
                <h1 className="text-2xl font-bold tracking-wider">Pokédex</h1>
              </Link>
              <ThemeSwitcher />
            </div>
          </header>
          <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/pokemon/:name" element={<PokemonDetailScreen />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
