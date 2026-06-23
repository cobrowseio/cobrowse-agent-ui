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
      const context = await cobrowse.attachContext(target)

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime value can be null despite the type. Fixed on full agent-sdk TS migration
      if (!context) {
        setRemoteContext(null)

        return
      }

      attachedContext = context

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
