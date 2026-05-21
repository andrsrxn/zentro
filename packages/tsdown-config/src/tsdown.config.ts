/** biome-ignore-all lint/style/noProcessEnv: no other way */
/** biome-ignore-all lint/correctness/noProcessGlobal: no other way */
import type { UserConfig } from 'tsdown'

const tsdownConfig: UserConfig = {
  deps: {
    skipNodeModulesBundle: true,
  },
  format: ['esm'],
  dts: {
    sourcemap: true,
  },
  sourcemap: 'hidden',
  target: 'es2024',
  platform: 'neutral',
  clean: true,
}

export default tsdownConfig
