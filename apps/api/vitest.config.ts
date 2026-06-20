import serverConfig from '@zentro/vitest-config/server'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  serverConfig,
  defineConfig({
    test: {
      name: 'api',
      setupFiles: ['./__tests__/unit/setup.ts'],
      include: ['./__tests__/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    },
  })
)
