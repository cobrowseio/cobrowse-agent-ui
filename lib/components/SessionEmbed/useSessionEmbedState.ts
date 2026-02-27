import { useState } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import type { SessionEmbedProps } from './types'

interface UseSessionEmbedStateProps {
  onLoaded?: SessionEmbedProps['onLoaded']
  onUpdated?: SessionEmbedProps['onUpdated']
  onActivated?: SessionEmbedProps['onActivated']
  onEnded?: SessionEmbedProps['onEnded']
}

const useSessionEmbedState = ({
  onLoaded,
  onUpdated,
  onActivated,
  onEnded
}: UseSessionEmbedStateProps) => {
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [sessionState, setSessionState] = useState<Session['state'] | null>(null)

  const handleFrameLoad = () => {
    setFrameLoaded(true)
  }

  const handleSessionLoaded = (session: Session) => {
    setSessionState(session.state)
    onLoaded?.(session)
  }

  const handleSessionUpdated = (session: Session) => {
    setSessionState(session.state)
    onUpdated?.(session)
  }

  const handleSessionActivated = (session: Session) => {
    setSessionState(session.state)
    onActivated?.(session)
  }

  const handleSessionEnded = (session: Session) => {
    setSessionState(session.state)
    onEnded?.(session)
  }

  return {
    frameLoaded,
    sessionState,
    handleFrameLoad,
    handleSessionLoaded,
    handleSessionUpdated,
    handleSessionActivated,
    handleSessionEnded
  }
}

export default useSessionEmbedState
