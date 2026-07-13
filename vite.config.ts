import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { promises as fs } from 'fs'
import { join } from 'path'
import { viteBffPlugin } from './vite-plugin-bff'

// Cloudflare PagesのSPAルーティング用フォールバックファイル(200.html)を作成するプラグイン
const copyIndexTo200 = () => {
  return {
    name: 'copy-index-to-200',
    closeBundle: async () => {
      try {
        const buildDir = join(process.cwd(), 'dist')
        await fs.copyFile(
          join(buildDir, 'index.html'),
          join(buildDir, '200.html')
        )
      } catch (err) {
        console.error('Failed to copy index.html to 200.html:', err)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    copyIndexTo200(),
    viteBffPlugin(),
  ],
})

