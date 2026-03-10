import Frame from '@/components/Frame'
import Overlay from './Overlay'
import OverlayContext from './OverlayContext'
import type { SessionEmbedProps } from './types'
import useSessionEmbedState from './useSessionEmbedState'
import { useSessionUrl } from './useSessionUrl'
import styles from './SessionEmbed.module.css'

export type { SessionEmbedOverlay, SessionEmbedOverlayProps, SessionEmbedOverlayState, SessionEmbedProps } from './types'

type SessionEmbedComponent = typeof SessionEmbedBase & {
  Overlay: typeof Overlay
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
  const {
    session,
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
    endAction,
    popout,
    agentTools,
    deviceControls,
    sessionDetails,
    messages
  })

  return (
    <OverlayContext.Provider value={{ session }}>
      <div className={styles.root}>
        <Frame
          src={url}
          className={className}
          onSessionLoaded={handleSessionLoaded}
          onSessionUpdated={handleSessionUpdated}
          onSessionActivated={handleSessionActivated}
          onSessionEnded={handleSessionEnded}
          onError={onError}
          {...props}
        >
          {children}
        </Frame>
      </div>
    </OverlayContext.Provider>
  )
}

const SessionEmbed: SessionEmbedComponent = Object.assign(SessionEmbedBase, {
  Overlay
})

export default SessionEmbed
