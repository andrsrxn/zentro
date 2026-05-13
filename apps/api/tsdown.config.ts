import tsdownConfig from '@zentro/tsdown-config'
import { defineConfig } from 'tsdown'

export const config = defineConfig({
  entry: ['./src/index.ts'],
  ...tsdownConfig,
})
