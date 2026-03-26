import { useEffect, useRef } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import Frame, { useRemoteContext } from '@/components/Frame'
import useStableCallback from '@/hooks/useStableCallback'
import Overlay from './Overlay'
import type { SessionEmbedProps } from './types'
import { useSessionUrl } from './useSessionUrl'
import styles from './SessionEmbed.module.css'

export type { SessionEmbedOverlay, SessionEmbedOverlayProps, SessionEmbedOverlayState, SessionEmbedProps } from './types'

type SessionEmbedComponent = typeof SessionEmbedBase & {
  Overlay: typeof Overlay
}

const SessionEventObserver = ({ onLoaded, onUpdated, onActivated, onEnded }: Pick<SessionEmbedProps, 'onLoaded' | 'onUpdated' | 'onActivated' | 'onEnded'>) => {
  const remoteContext = useRemoteContext()
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

  return null
}

const SessionEmbedBase = ({
  id,
  endAction,
  popout,
  agentTools,
  deviceControls,
  sessionDetails,
  messages,
  onError,
  onLoaded,
  onUpdated,
  onActivated,
  onEnded,
  className,
  children,
  ...props
}: SessionEmbedProps) => {
  const url = useSessionUrl({
    id,
    endAction,
    popout,
    agentTools,
    deviceControls,
    sessionDetails,
    messages
  })

  return (
    <div className={styles.root}>
      <Frame
        src={url}
        className={className}
        onError={onError}
        {...props}
      >
        <SessionEventObserver
          onLoaded={onLoaded}
          onUpdated={onUpdated}
          onActivated={onActivated}
          onEnded={onEnded}
        />
        {children}
      </Frame>
    </div>
  )
}

const SessionEmbed: SessionEmbedComponent = Object.assign(SessionEmbedBase, {
  Overlay
})
export default SessionEmbed
