import { handleBff } from './bff/router';
import { handlePokeApiProxy } from './worker/proxy';

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/ui/')) {
      return handleBff(request, ctx);
    }

    if (url.pathname.startsWith('/api/v2/')) {
      return handlePokeApiProxy(request, ctx);
    }

    return env.ASSETS.fetch(request);
  },
};
