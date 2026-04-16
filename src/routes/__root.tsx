import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeSwitcher } from '../components/common/ThemeSwitcher';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

// ルーター全体のコンテキスト定義
interface MyRouterContext {
  queryClient: QueryClient;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <header className="bg-red-500 dark:bg-slate-800 text-white p-4 shadow-md sticky top-0 z-50 border-b border-red-600 dark:border-slate-700">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-inner">
                <div className="w-3 h-3 bg-red-500 dark:bg-slate-900 rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold tracking-wider">Pokédex</h1>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),
});
