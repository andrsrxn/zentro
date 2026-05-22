import serverConfig from '@zentro/vitest-config/server'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  serverConfig,
  defineConfig({
    test: {
      name: 'api',
      setupFiles: ['./__tests__/setup.ts'],
    },
  })
)
