import type { Plugin } from 'vite';
import { buildPokemonDetailView, parsePokemonDetailParams } from './src/bff/mappers/pokemonDetail';

export function viteBffPlugin(): Plugin {
  return {
    name: 'vite-bff-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/ui/')) {
          next();
          return;
        }

        const url = new URL(req.url, 'http://localhost');
        const params = parsePokemonDetailParams(url);

        if (!params) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
        }

        try {
          const view = await buildPokemonDetailView(
            params.name,
            params.lang,
            params.version,
          );

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('x-bff-cache', 'DEV');
          res.end(JSON.stringify(view));
        } catch (error) {
          console.error('Vite BFF error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Failed to build pokemon detail view' }));
        }
      });
    },
  };
}
