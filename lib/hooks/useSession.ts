import { useEffect, useState } from 'react'
import { RemoteContext, type Session } from 'cobrowse-agent-sdk'

const isRemoteContext = (source: RemoteContext | Session): source is RemoteContext => (
  source instanceof RemoteContext
)

const hasSessionProperty = (target: Session, property: PropertyKey): property is keyof Session => property in target

const createReactiveSession = (session: Session | null) => {
  if (!session) {
    return null
  }

  return new Proxy(session, {
    get: (target, property) => hasSessionProperty(target, property) ? target[property] : undefined
  })
}

const useSession = (source: RemoteContext | Session | null) => {
  const remoteContext = source && isRemoteContext(source) ? source : null
  const sessionSource = source && !isRemoteContext(source) ? source : null
  const [sessionState, setSessionState] = useState<Session | null>(sessionSource)

  useEffect(() => {
    if (!remoteContext) {
      return
    }

    const handleSessionChange = (session: Session) => {
      setSessionState(createReactiveSession(session))
    }

    remoteContext.on('session.loaded', handleSessionChange)
    remoteContext.on('session.updated', handleSessionChange)

    return () => {
      remoteContext.off('session.loaded', handleSessionChange)
      remoteContext.off('session.updated', handleSessionChange)

      setSessionState(null)
    }
  }, [remoteContext])

  useEffect(() => {
    if (!sessionSource) {
      return
    }

    const handleSessionChange = () => {
      setSessionState(createReactiveSession(sessionSource))
    }

    sessionSource.on('updated', handleSessionChange)
    sessionSource.on('ended', handleSessionChange)

    return () => {
      sessionSource.off('updated', handleSessionChange)
      sessionSource.off('ended', handleSessionChange)

      setSessionState(null)
    }
  }, [sessionSource])

  return sessionState ?? sessionSource
}

export default useSession
