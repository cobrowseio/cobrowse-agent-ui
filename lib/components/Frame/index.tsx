import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import type { RemoteContext, Session } from 'cobrowse-agent-sdk'
import { useCobrowse } from '@/components/CobrowseProvider'
import RemoteContextProvider, { useRemoteContext } from './RemoteContext'

type IframeProps = Omit<ComponentPropsWithoutRef<'iframe'>, 'frameBorder' | 'onError' | 'src'>

export interface FrameProps extends IframeProps {
  src: string
  children?: ReactNode
  onSessionLoaded?: (session: Session) => void
  onSessionUpdated?: (session: Session) => void
  onSessionActivated?: (session: Session) => void
  onSessionEnded?: (session: Session) => void
  onError?: (error: unknown) => void
}

const Frame = ({
  src,
  onSessionLoaded,
  onSessionUpdated,
  onSessionActivated,
  onSessionEnded,
  onError,
  title = 'Frame',
  width = '100%',
  height = '100%',
  style,
  children,
  ...props
}: FrameProps) => {
  const cobrowse = useCobrowse()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [remoteContext, setRemoteContext] = useState<RemoteContext | null>(null)
  const [currentSessionState, setCurrentSessionState] = useState<{ session: Session | null, eventCount: number }>({ session: null, eventCount: 0 })
  const onSessionLoadedRef = useRef(onSessionLoaded)
  const onSessionUpdatedRef = useRef(onSessionUpdated)
  const onSessionActivatedRef = useRef(onSessionActivated)
  const onSessionEndedRef = useRef(onSessionEnded)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onSessionLoadedRef.current = onSessionLoaded
    onSessionUpdatedRef.current = onSessionUpdated
    onSessionActivatedRef.current = onSessionActivated
    onSessionEndedRef.current = onSessionEnded
    onErrorRef.current = onError
  }, [onSessionLoaded, onSessionUpdated, onSessionActivated, onSessionEnded, onError])

  useEffect(() => {
    let cancelled = false
    let context: RemoteContext | null = null
    let sessionActivated = false
    let sessionEnded = false

    const updateCurrentSession = (session: Session | null) => {
      setCurrentSessionState((current) => ({
        session,
        eventCount: current.eventCount + 1
      }))
    }

    const attachContext = async () => {
      if (!iframeRef.current) {
        return
      }

      try {
        context = await cobrowse.attachContext(iframeRef.current)
      } catch (error) {
        if (!cancelled) {
          onErrorRef.current?.(error)
        }

        return
      }

      if (cancelled) {
        context.destroy()
        context = null

        return
      }

      setRemoteContext(context)
      updateCurrentSession(null)

      context.on('session.loaded', (session: Session) => {
        updateCurrentSession(session)
        sessionActivated = session.isActive()
        sessionEnded = false

        onSessionLoadedRef.current?.(session)
      })

      context.on('session.updated', (session: Session) => {
        updateCurrentSession(session)
        onSessionUpdatedRef.current?.(session)

        if (session.isActive() && !sessionActivated) {
          sessionActivated = true
          onSessionActivatedRef.current?.(session)
        }

        if (session.isEnded() && !sessionEnded) {
          sessionEnded = true
          onSessionEndedRef.current?.(session)
        }
      })

      context.on('error', (error: unknown) => {
        onErrorRef.current?.(error)
      })
    }

    void attachContext()

    return () => {
      cancelled = true
      sessionActivated = false
      sessionEnded = false
      setRemoteContext(null)
      updateCurrentSession(null)

      if (context) {
        context.destroy()
        context = null
      }
    }
  }, [cobrowse])

  return (
    <RemoteContextProvider.Provider value={{
      remoteContext,
      currentSession: currentSessionState.session
    }}>
      <iframe
        ref={iframeRef}
        title={title}
        width={width}
        height={height}
        src={src}
        style={{ border: 0, ...style }}
        {...props}
      />
      {children}
    </RemoteContextProvider.Provider>
  )
}

export { useRemoteContext }
export default Frame
