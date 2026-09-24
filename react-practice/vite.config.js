import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Module Federation host config (Week 5 Day 3): consumes the
    // `recommendations` remote exposed by smartcart-recommendations.
    // The remote must be built + previewed (`npm run preview:remote`
    // in that project) on port 4173 before this app can load it.
    // Skipped in `test` mode — Vitest mocks the remote import directly,
    // and the federation plugin has no useful role in a jsdom test run.
    mode !== 'test' &&
      federation({
        name: 'react_practice_host',
        // This is a JS/JSX-only project — the plugin's .d.ts generation
        // sub-feature shells out to `tsc` and expects a tsconfig.json,
        // which doesn't exist here on purpose. Disable it explicitly.
        dts: false,
        remotes: {
          recommendations: {
            type: 'module',
            name: 'smartcart_recommendations',
            entry: 'http://localhost:4173/remoteEntry.js',
            entryGlobalName: 'smartcart_recommendations',
            shareScope: 'default',
          },
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
        },
      }),
  ],
  build: {
    target: 'chrome89',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setupTests.js',
    css: true,
    pool: 'threads',
  },
}))
