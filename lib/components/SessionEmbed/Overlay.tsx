import { useEffect } from 'react'
import { useOverlayContext } from './OverlayContext'
import styles from './SessionEmbed.module.css'
import type { SessionEmbedOverlayProps } from './types'

const Overlay = ({ state, children }: SessionEmbedOverlayProps) => {
  const context = useOverlayContext()

  useEffect(() => {
    context.registerOverlayState(state)

    return () => {
      context.unregisterOverlayState(state)
    }
  }, [context, state])

  if (context.activeOverlayState !== state) {
    return null
  }

  return (
    <div className={styles.statusScreen}>
      {children}
    </div>
  )
}

export default Overlay
