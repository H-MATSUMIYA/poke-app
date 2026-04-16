import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import './i18n/config';

// 自動生成されるルートツリーをインポート
// (初回実行時はエラーに見える場合がありますが、ビルド/実行時に生成されます)
import { routeTree } from './routeTree.gen';
import { queryClient } from './routes/__root';

// ルーターインスタンスの作成
const router = createRouter({ 
  routeTree,
  context: {
    queryClient,
  },
  scrollRestoration: true,
});

// TypeScriptの型安全性を有効化
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
