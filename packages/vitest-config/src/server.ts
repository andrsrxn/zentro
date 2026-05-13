import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './base.ts'

const serverConfig = mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'node',
      pool: 'forks',
    },
  })
)
export default serverConfig
