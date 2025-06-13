// wagmi/types.ts
import type { config } from './config'

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
