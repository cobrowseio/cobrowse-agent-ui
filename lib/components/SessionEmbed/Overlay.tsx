import useSession from '@/hooks/useSession'
import styles from './Overlay.module.css'
import type { SessionEmbedOverlayProps } from './types'

const Overlay = ({ state, children }: SessionEmbedOverlayProps) => {
  const session = useSession()
  const sessionState = session?.state

  const shouldRender = state === 'loading'
    ? sessionState === undefined
    : sessionState === state

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
