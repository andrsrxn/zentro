import { defineConfig } from 'vitest/config'

const baseConfig = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    passWithNoTests: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],

      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**',
        '**/index.ts',
      ],
    },
  },
})

export default baseConfig
