import Frame, { useRemoteContext } from '@/components/Frame'
import useSessionEvents from '@/hooks/useSessionEvents'
import Overlay from './Overlay'
import type { SessionEmbedProps } from './types'
import { useSessionUrl } from './useSessionUrl'
import styles from './SessionEmbed.module.css'

export type { SessionEmbedOverlay, SessionEmbedOverlayProps, SessionEmbedOverlayState, SessionEmbedProps } from './types'

type SessionEmbedComponent = typeof SessionEmbedBase & {
  Overlay: typeof Overlay
}

const SessionEventObserver = (handlers: Pick<SessionEmbedProps, 'onLoaded' | 'onUpdated' | 'onActivated' | 'onEnded'>) => {
 useSessionEvents(useRemoteContext(), handlers)
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
