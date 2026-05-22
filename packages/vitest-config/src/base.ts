import { defineConfig } from 'vitest/config'

const baseConfig = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  test: {
    pool: 'typescript',
    globals: true,
    passWithNoTests: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],

      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.turbo/**',
        '**/.next/**',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**',
        '**/index.ts',
      ],
    },
  },
})

export default baseConfig
