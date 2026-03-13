import { createContext, use, useEffect, useState } from 'react'
import type { RemoteContext as CobrowseRemoteContext } from 'cobrowse-agent-sdk'
import { useCobrowseValue } from '@/components/CobrowseProvider'
import useStableCallback from '@/hooks/useStableCallback'

const RemoteContext = createContext<CobrowseRemoteContext | null>(null)

export function useRemoteContext(target?: HTMLIFrameElement | null, onError?: (error: unknown) => void): CobrowseRemoteContext | null {
  const providedRemoteContext = use(RemoteContext)
  const cobrowse = useCobrowseValue()
  const onErrorCallback = useStableCallback(onError)
  const [remoteContext, setRemoteContext] = useState<CobrowseRemoteContext | null>(null)

  useEffect(() => {
    if (target === undefined) {
      return
    }

    if (!target || !cobrowse) {
      return
    }

    let cancelled = false
    let attachedContext: CobrowseRemoteContext | null = null

    const attachContext = async () => {
      try {
        attachedContext = await cobrowse.attachContext(target)
      } catch (error) {
        if (!cancelled) {
          onErrorCallback(error)
        }

        return
      }

      if (cancelled) {
        attachedContext.destroy()
        attachedContext = null

        return
      }

      setRemoteContext(attachedContext)
    }

    void attachContext()

    return () => {
      cancelled = true
      setRemoteContext(null)

      if (attachedContext) {
        attachedContext.destroy()
        attachedContext = null
      }
    }
  }, [cobrowse, onErrorCallback, target])

  if (target === undefined) {
    return providedRemoteContext
  }

  if (!target || !cobrowse) {
    return null
  }

  return remoteContext
}

export default RemoteContext
