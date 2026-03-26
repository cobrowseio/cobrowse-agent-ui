import { useCallback, useEffect, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import RemoteContextProvider, { useRemoteContext } from './RemoteContext'
import useStableCallback from '@/hooks/useStableCallback'

type IframeProps = Omit<ComponentPropsWithoutRef<'iframe'>, 'frameBorder' | 'onError' | 'src'>

export interface FrameProps extends IframeProps {
  src: string
  children?: ReactNode
  onError?: (error: unknown) => void
}

const Frame = ({
  src,
  onError,
  title = 'Frame',
  width = '100%',
  height = '100%',
  style,
  children,
  ...props
}: FrameProps) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)
  const onErrorCallback = useStableCallback(onError)
  const remoteContext = useRemoteContext(iframe)

  const handleIframeRef = useCallback((element: HTMLIFrameElement | null) => {
    setIframe(element)
  }, [])

  useEffect(() => {
    if (!remoteContext) {
      return
    }

    const handleError = (error: unknown) => {
      onErrorCallback(error)
    }

    remoteContext.on('error', handleError)

    return () => {
      remoteContext.off('error', handleError)
    }
  }, [remoteContext, onErrorCallback])

  return (
    <RemoteContextProvider.Provider value={remoteContext}>
      <iframe
        ref={handleIframeRef}
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
