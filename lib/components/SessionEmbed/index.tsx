import Frame from '@/components/Frame'
import clsx from 'clsx'
import type { SessionEmbedProps } from './types'
import SessionOverlay from './SessionOverlay'
import useSessionEmbedState from './useSessionEmbedState'
import { useSessionUrl } from './useSessionUrl'
import styles from './SessionEmbed.module.css'

export type {
  SessionEmbedOverlay,
  SessionEmbedOverlayState,
  SessionEmbedProps
} from './types'

const SessionEmbed = ({
  id,
  token,
  filters,
  navigation,
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
  statusOverlays,
  className,
  ...props
}: SessionEmbedProps) => {
  const {
    frameLoaded,
    sessionState,
    handleFrameLoad,
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
    filters,
    navigation,
    endAction,
    popout,
    agentTools,
    deviceControls,
    sessionDetails,
    messages
  })

  const hasActiveStatusOverlay = sessionState !== null && sessionState !== 'active' && !!statusOverlays?.[sessionState]

  return (
    <div className={styles.root}>
      <Frame
        src={url}
        className={clsx(className, (!frameLoaded || hasActiveStatusOverlay) && styles.frameHidden)}
        onLoad={handleFrameLoad}
        onSessionLoaded={handleSessionLoaded}
        onSessionUpdated={handleSessionUpdated}
        onSessionActivated={handleSessionActivated}
        onSessionEnded={handleSessionEnded}
        onError={onError}
        {...props}
      />
      <SessionOverlay
        statusOverlays={statusOverlays}
        state={sessionState}
        frameLoaded={frameLoaded}
      />
    </div>
  )
}

export default SessionEmbed
