import type { UserConfig } from 'tsdown'

const tsdownConfig: UserConfig = {
  deps: {
    skipNodeModulesBundle: true,
  },
  dts: true,
  target: 'es2024',
  platform: 'node',
  sourcemap: true,
}

export default tsdownConfig
