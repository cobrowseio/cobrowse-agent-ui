import { useEffect, useRef } from 'react'
import type { RemoteContext, Session } from 'cobrowse-agent-sdk'
import useStableCallback from '@/hooks/useStableCallback'

export interface SessionEventHandlers {
  /** Called when a session is loaded into the context. */
  onLoaded?: (session: Session) => void
  /** Called for every session update. */
  onUpdated?: (session: Session) => void
  /** Called once per session, when it becomes active. */
  onActivated?: (session: Session) => void
  /** Called once per session, when it ends. */
  onEnded?: (session: Session) => void
}

/**
 * Observes the sessions of a remote context, adding activated/ended edges on top
 * of the context's own load/update events. Both are raised at most once per
 * session: a session already active when it is first seen counts as activated
 * before this context saw it, so `onActivated` is not called for it.
 */
const useSessionEvents = (
  remoteContext: RemoteContext | null,
  { onLoaded, onUpdated, onActivated, onEnded }: SessionEventHandlers
) => {
  const onLoadedCallback = useStableCallback(onLoaded)
  const onUpdatedCallback = useStableCallback(onUpdated)
  const onActivatedCallback = useStableCallback(onActivated)
  const onEndedCallback = useStableCallback(onEnded)
  const sessionActivatedRef = useRef(false)
  const sessionEndedRef = useRef(false)

  useEffect(() => {
    if (!remoteContext) {
      sessionActivatedRef.current = false
      sessionEndedRef.current = false

      return
    }

    const handleSessionLoaded = (session: Session) => {
      sessionActivatedRef.current = session.isActive()
      sessionEndedRef.current = false
      onLoadedCallback(session)
    }

    const handleSessionUpdated = (session: Session) => {
      onUpdatedCallback(session)

      if (session.isActive() && !sessionActivatedRef.current) {
        sessionActivatedRef.current = true
        onActivatedCallback(session)
      }

      if (session.isEnded() && !sessionEndedRef.current) {
        sessionEndedRef.current = true
        onEndedCallback(session)
      }
    }

    remoteContext.on('session.loaded', handleSessionLoaded)
    remoteContext.on('session.updated', handleSessionUpdated)

    return () => {
      remoteContext.off('session.loaded', handleSessionLoaded)
      remoteContext.off('session.updated', handleSessionUpdated)
      sessionActivatedRef.current = false
      sessionEndedRef.current = false
    }
  }, [onActivatedCallback, onEndedCallback, onLoadedCallback, onUpdatedCallback, remoteContext])
}

export default useSessionEvents
