interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // /api/* へのリクエストを PokéAPI にプロキシ＆キャッシュします
    if (url.pathname.startsWith('/api/')) {
      const apiPath = url.pathname.replace(/^\/api\//, '');
      const targetUrl = `https://pokeapi.co/api/${apiPath}${url.search}`;

      const cacheKey = new Request(targetUrl, {
        method: 'GET',
      });

      const cache = (caches as any).default;

      try {
        // 1. キャッシュからレスポンスを検索
        let cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          const responseHeaders = new Headers(cachedResponse.headers);
          responseHeaders.set('x-proxy-cache', 'HIT');
          responseHeaders.set('Access-Control-Allow-Origin', '*');
          return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: responseHeaders,
          });
        }

        // 2. キャッシュにない場合はオリジナルAPIにフェッチ
        const originResponse = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'cloudflare-workers-pokeapi-proxy',
          },
        });

        if (originResponse.ok) {
          // キャッシュ保存用にレスポンスをクローンしてヘッダーを設定
          const cacheResponse = originResponse.clone();
          const cacheHeaders = new Headers(cacheResponse.headers);
          
          // ブラウザ側で1日(86400秒)、Cloudflareエッジ側で7日(604800秒)キャッシュします
          cacheHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');
          
          // VaryやSet-Cookieなどのヘッダーがキャッシュマッチングの邪魔をしないように削除します
          cacheHeaders.delete('Vary');
          cacheHeaders.delete('Set-Cookie');
          
          const responseToCache = new Response(cacheResponse.body, {
            status: cacheResponse.status,
            statusText: cacheResponse.statusText,
            headers: cacheHeaders,
          });

          // バックグラウンドで非同期にキャッシュへ書き込み
          ctx.waitUntil(cache.put(cacheKey, responseToCache));
        }

        const clientResponse = originResponse.clone();
        const clientHeaders = new Headers(clientResponse.headers);
        clientHeaders.set('x-proxy-cache', 'MISS');
        clientHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(clientResponse.body, {
          status: clientResponse.status,
          statusText: clientResponse.statusText,
          headers: clientHeaders,
        });

      } catch (error) {
        // ローカル開発や Cache API エラー時のフォールバック処理
        console.warn('Cache API error or not available. Falling back to direct fetch.', error);
        
        try {
          const directResponse = await fetch(targetUrl);
          const directHeaders = new Headers(directResponse.headers);
          directHeaders.set('x-proxy-cache', 'BYPASS');
          directHeaders.set('Access-Control-Allow-Origin', '*');
          
          return new Response(directResponse.body, {
            status: directResponse.status,
            statusText: directResponse.statusText,
            headers: directHeaders,
          });
        } catch (fetchError) {
          return new Response(JSON.stringify({ error: 'Failed to fetch from PokeAPI' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // /api/ 以外は静的アセット配信（not_found_handling: SPA → index.html）
    return env.ASSETS.fetch(request);
  },
};
