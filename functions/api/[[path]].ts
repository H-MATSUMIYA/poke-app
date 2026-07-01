export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // パスから /api/ 部分を取り除き、pokeapi.co への宛先を作成します。
  // 例: /api/v2/pokemon/pikachu -> v2/pokemon/pikachu
  const apiPath = url.pathname.replace(/^\/api\//, '');
  const targetUrl = `https://pokeapi.co/api/${apiPath}${url.search}`;

  // キャッシュのキーとしてターゲットURLのRequestオブジェクトを使用します。
  const cacheKey = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
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

    // 2. キャッシュにない場合はオリジナルAPIへフェッチ
    const originResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'cloudflare-pages-pokeapi-proxy',
      },
    });

    if (originResponse.ok) {
      // キャッシュに保存するためにレスポンスをクローンし、Cache-Controlを上書きします
      const cacheResponse = originResponse.clone();
      const cacheHeaders = new Headers(cacheResponse.headers);
      
      // ブラウザ側で1日(86400秒)、Cloudflareエッジ側で7日(604800秒)キャッシュさせます
      cacheHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');
      
      const responseToCache = new Response(cacheResponse.body, {
        status: cacheResponse.status,
        statusText: cacheResponse.statusText,
        headers: cacheHeaders,
      });

      // キャッシュの書き込みをバックグラウンドで非同期実行します
      context.waitUntil(cache.put(cacheKey, responseToCache));
    }

    // クライアント向けのレスポンスを返却
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
    // ローカルの wrangler dev 環境など、Cache APIが利用できない場合のフォールバック処理
    console.warn('Cache API is not available in this environment. Falling back to direct fetch.', error);
    
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
};
