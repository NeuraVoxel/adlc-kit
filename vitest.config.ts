import { defineConfig, defineProject } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      defineProject({
        test: {
          name: 'node',
          environment: 'node',
          include: [
            'server/tests/**/*.spec.ts',
            'scripts/**/*.spec.ts',
            'packages/contracts/tests/**/*.spec.ts',
          ],
        },
      }),
      defineProject({
        esbuild: { jsx: 'automatic' },
        test: {
          name: 'web',
          environment: 'jsdom',
          include: ['apps/web/tests/**/*.spec.tsx'],
        },
      }),
    ],
  },
})
