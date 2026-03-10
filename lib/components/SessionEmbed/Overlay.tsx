import { useEffect, useState } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import { useRemoteContext } from '@/components/Frame'
import styles from './Overlay.module.css'
import type { SessionEmbedOverlayProps } from './types'

const Overlay = ({ state, children }: SessionEmbedOverlayProps) => {
  const context = useRemoteContext()
  const [sessionState, setSessionState] = useState<Session['state'] | undefined>(undefined)

  useEffect(() => {
    if (!context) {
      setSessionState(undefined)

      return
    }

    let cancelled = false

    const updateSessionState = (nextSession: Session | null | undefined) => {
      if (!cancelled) {
        setSessionState(nextSession?.state)
      }
    }

    const handleSessionUpdated = (nextSession: Session) => {
      updateSessionState(nextSession)
    }

    context.on('session.loaded', handleSessionUpdated)
    context.on('session.updated', handleSessionUpdated)

    return () => {
      cancelled = true
    }
  }, [context])

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
