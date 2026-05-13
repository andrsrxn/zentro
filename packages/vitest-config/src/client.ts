import react from '@vitejs/plugin-react'
import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './base.ts'

const clientConfig = mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [react()],
    test: {
      environment: 'happy-dom',
    },
  })
)
export default clientConfig
