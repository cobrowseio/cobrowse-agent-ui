import Frame from '@/components/Frame'
import Overlay from './Overlay'
import type { SessionEmbedProps } from './types'
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
        onSessionLoaded={onLoaded}
        onSessionUpdated={onUpdated}
        onSessionActivated={onActivated}
        onSessionEnded={onEnded}
        onError={onError}
        {...props}
      >
        {children}
      </Frame>
    </div>
  )
}

const SessionEmbed: SessionEmbedComponent = Object.assign(SessionEmbedBase, {
  Overlay
})
export default SessionEmbed
