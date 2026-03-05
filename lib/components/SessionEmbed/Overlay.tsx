import { useOverlayContext } from './OverlayContext'
import styles from './Overlay.module.css'
import type { SessionEmbedOverlayProps } from './types'

const Overlay = ({ state, children }: SessionEmbedOverlayProps) => {
  const { session } = useOverlayContext()

  const shouldRender = state === 'loading'
    ? session === null
    : session?.state === state

  if (!shouldRender) {
    return null
  }

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default Overlay
