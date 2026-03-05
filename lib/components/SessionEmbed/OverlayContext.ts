import { createContext, use, useCallback, useMemo, useState } from 'react'
import type { SessionEmbedOverlayState } from './types'

export interface OverlayContextValue {
  activeOverlayState: SessionEmbedOverlayState | null
  registerOverlayState: (state: SessionEmbedOverlayState) => void
  unregisterOverlayState: (state: SessionEmbedOverlayState) => void
}

interface UseOverlayRegistryProps {
  activeOverlayState: SessionEmbedOverlayState | null
}

const OverlayContext = createContext<OverlayContextValue | null>(null)

export const useOverlayContext = () => {
  const overlayContext = use(OverlayContext)

  if (!overlayContext) {
    throw new Error('SessionEmbed.Overlay must be used within SessionEmbed.')
  }

  return overlayContext
}

// This keeps track of custom overlays so that we know when to show/hide the underlying Frame.
// For example, for a consumer using the main component with one custom overlay:
//
// ```
// <SessionEmbed ...>
//   <SessionEmbed.Overlay state='authorizing'>
//     <CustomAuthorizingOverlay />
//   </SessionEmbed.Overlay>
// </SessionEmbed>
// ```
//
// This would result in:
// - Default loading screen. Framed url is still loading.
// - state = pending. Visible Frame component.
// - state = authorizing. Hidden Frame component. Visible CustomAuthorizingOverlay component.
// - state = active. Visible Frame component with active session screen.
export const useOverlayRegistry = ({ activeOverlayState }: UseOverlayRegistryProps) => {
  const [registeredOverlayStates, setRegisteredOverlayStates] = useState<Partial<Record<SessionEmbedOverlayState, true>>>({})

  const registerOverlayState = useCallback((state: SessionEmbedOverlayState) => {
    setRegisteredOverlayStates((states) => {
      if (states[state]) {
        throw new Error(`Only one SessionEmbed.Overlay is allowed for state '${state}'.`)
      }

      return {
        ...states,
        [state]: true
      }
    })
  }, [])

  const unregisterOverlayState = useCallback((state: SessionEmbedOverlayState) => {
    setRegisteredOverlayStates((states) => {
      if (!states[state]) {
        return states
      }

      const {
        [state]: _deleted,
        ...restStates
      } = states

      return restStates
    })
  }, [])

  const overlayContextValue = useMemo(() => ({
    activeOverlayState,
    registerOverlayState,
    unregisterOverlayState
  }), [activeOverlayState, registerOverlayState, unregisterOverlayState])

  const hasActiveCustomOverlay = !!activeOverlayState && !!registeredOverlayStates[activeOverlayState]

  return {
    overlayContextValue,
    hasActiveCustomOverlay
  }
}

export default OverlayContext
