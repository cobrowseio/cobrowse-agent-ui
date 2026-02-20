import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import type CobrowseAPI from 'cobrowse-agent-sdk'
import type { RemoteContext, Session } from 'cobrowse-agent-sdk'

type IframeProps = Omit<ComponentPropsWithoutRef<'iframe'>, 'frameBorder' | 'onError' | 'src'>

export interface FrameProps extends IframeProps {
  cobrowse: CobrowseAPI
  src: string
  onSessionLoaded?: (session: Session) => void
  onSessionUpdated?: (session: Session) => void
  onSessionActivated?: (session: Session) => void
  onSessionEnded?: (session: Session) => void
  onError?: (error: unknown) => void
}

const Frame = ({
  cobrowse,
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
  ...props
}: FrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
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

      context.on('session.loaded', (session: Session) => {
        sessionActivated = session.isActive()
        sessionEnded = false

        onSessionLoadedRef.current?.(session)
      })

      context.on('session.updated', (session: Session) => {
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

      if (context) {
        context.destroy()
        context = null
      }
    }
  }, [cobrowse])

  return (
    <iframe
      ref={iframeRef}
      title={title}
      width={width}
      height={height}
      src={src}
      style={{ border: 0, ...style }}
      {...props}
    />
  )
}

export default Frame
