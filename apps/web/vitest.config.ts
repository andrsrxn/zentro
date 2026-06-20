import clientConfig from '@zentro/vitest-config/client'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  clientConfig,
  defineConfig({
    test: {
      name: 'web',
      setupFiles: ['./__tests__/unit/setup.ts'],
      include: ['./__tests__/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    },
  })
)
