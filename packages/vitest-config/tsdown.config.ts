import tsdownConfig from '@zentro/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
  ...tsdownConfig,
  entry: ['./src/*.ts'],
})
