import { defineConfig, mergeConfig } from 'vitest/config'
import vitestConfig from './vitest.config'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  }),
)
