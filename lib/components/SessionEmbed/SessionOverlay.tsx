import Loader from '@/components/Loader'
import type { SessionEmbedOverlayState, SessionEmbedProps, SessionState } from './types'
import styles from './SessionEmbed.module.css'

interface SessionOverlayProps {
  statusOverlays: SessionEmbedProps['statusOverlays']
  state: SessionState | null
  frameLoaded: boolean
}

const SessionOverlay = ({
  statusOverlays,
  state,
  frameLoaded
}: SessionOverlayProps) => {
  const overlayState: SessionEmbedOverlayState | null = !frameLoaded || !state
    ? 'loading'
    : state === 'active'
      ? null
      : state

  if (!overlayState) {
    return null
  }

  if (overlayState === 'loading') {
    return (
      <div className={styles.statusScreen}>
        <div className={styles.defaultLoading}>
          <Loader />
        </div>
      </div>
    )
  }

  const overlay = statusOverlays?.[overlayState]

  if (!overlay) {
    return null
  }

  return (
    <div key={overlayState} className={styles.statusScreen}>
      {overlay}
    </div>
  )
}

export default SessionOverlay
