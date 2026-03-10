import { createContext, use } from 'react'
import type { Session } from 'cobrowse-agent-sdk'

export interface OverlayContextValue {
  session: Session | null
}

const OverlayContext = createContext<OverlayContextValue | undefined>(undefined)

export const useOverlayContext = () => {
  const overlayContext = use(OverlayContext)

  if (overlayContext === undefined) {
    throw new Error('useOverlayContext must be used within SessionEmbed.')
  }

  return overlayContext
}

export default OverlayContext
