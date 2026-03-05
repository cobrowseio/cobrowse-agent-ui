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
  // The Agent SDK mutates the `session` object so we track `session.state`
  // separately to trigger re-renders that will toggle overlays
  const [session, setSession] = useState<Session | null>(null)
  const [sessionState, setSessionState] = useState<Session['state'] | null>(null)

  const handleSessionChange = (session: Session, callback?: (session: Session) => void) => {
    if (sessionState !== session.state) {
      setSession(session)
      setSessionState(session.state)
    }

    callback?.(session)
  }

  const handleSessionLoaded = (session: Session) => {
    handleSessionChange(session, onLoaded)
  }

  const handleSessionUpdated = (session: Session) => {
    handleSessionChange(session, onUpdated)
  }

  const handleSessionActivated = (session: Session) => {
    handleSessionChange(session, onActivated)
  }

  const handleSessionEnded = (session: Session) => {
    handleSessionChange(session, onEnded)
  }

  return {
    session,
    handleSessionLoaded,
    handleSessionUpdated,
    handleSessionActivated,
    handleSessionEnded
  }
}

export default useSessionEmbedState
