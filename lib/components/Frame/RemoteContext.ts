import { createContext, use, useEffect, useState } from 'react'
import type { RemoteContext as CobrowseRemoteContext } from 'cobrowse-agent-sdk'
import { useCobrowseValue } from '@/components/CobrowseProvider'

const RemoteContext = createContext<CobrowseRemoteContext | null>(null)

export function useRemoteContext(target?: HTMLIFrameElement | null): CobrowseRemoteContext | null {
  const providedRemoteContext = use(RemoteContext)
  const cobrowse = useCobrowseValue()
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
      attachedContext = await cobrowse.attachContext(target)

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
  }, [cobrowse, target])

  if (target === undefined) {
    return providedRemoteContext
  }

  if (!target || !cobrowse) {
    return null
  }

  return remoteContext
}

export default RemoteContext
