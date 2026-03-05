import { useState } from 'react'
import Frame from '@/components/Frame'
import Loader from '@/components/Loader'
import clsx from 'clsx'
import Overlay from './Overlay'
import OverlayContext, { useOverlayRegistry } from './OverlayContext'
import type { SessionEmbedOverlayState, SessionEmbedProps, SessionState } from './types'
import useSessionEmbedState from './useSessionEmbedState'
import { useSessionUrl } from './useSessionUrl'
import styles from './SessionEmbed.module.css'

export type {
  SessionEmbedOverlay,
  SessionEmbedOverlayProps,
  SessionEmbedOverlayState,
  SessionEmbedProps
} from './types'

const getOverlayState = (frameLoaded: boolean, sessionState: SessionState | null): SessionEmbedOverlayState | null => {
  if (!frameLoaded || !sessionState) {
    return 'loading'
  }

  return sessionState === 'active'
    ? null
    : sessionState
}

type SessionEmbedComponent = typeof SessionEmbedBase & {
  Overlay: typeof Overlay
}

const SessionEmbedBase = ({
  id,
  token,
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
  const [frameLoaded, setFrameLoaded] = useState(false)

  const handleFrameLoad = () => {
    setFrameLoaded(true)
  }

  const {
    sessionState,
    handleSessionLoaded,
    handleSessionUpdated,
    handleSessionActivated,
    handleSessionEnded
  } = useSessionEmbedState({
    onLoaded,
    onUpdated,
    onActivated,
    onEnded
  })

  const url = useSessionUrl({
    id,
    token,
    endAction,
    popout,
    agentTools,
    deviceControls,
    sessionDetails,
    messages
  })

  const activeOverlayState = getOverlayState(frameLoaded, sessionState)
  const {
    overlayContextValue,
    hasActiveCustomOverlay
  } = useOverlayRegistry({ activeOverlayState })

  const hideFrame = !frameLoaded || (activeOverlayState !== 'loading' && hasActiveCustomOverlay)

  return (
    <OverlayContext.Provider value={overlayContextValue}>
      <div className={styles.root}>
        <Frame
          src={url}
          className={clsx(className, hideFrame && styles.frameHidden)}
          onLoad={handleFrameLoad}
          onSessionLoaded={handleSessionLoaded}
          onSessionUpdated={handleSessionUpdated}
          onSessionActivated={handleSessionActivated}
          onSessionEnded={handleSessionEnded}
          onError={onError}
          {...props}
        />
        {activeOverlayState === 'loading' && !hasActiveCustomOverlay && (
          <div className={styles.statusScreen}>
            <div className={styles.defaultLoading}>
              <Loader />
            </div>
          </div>
        )}
        {children}
      </div>
    </OverlayContext.Provider>
  )
}

const SessionEmbed: SessionEmbedComponent = Object.assign(SessionEmbedBase, {
  Overlay
})

export default SessionEmbed
