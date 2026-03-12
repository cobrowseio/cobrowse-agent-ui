import { useEffect, useReducer } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import { useRemoteContextValue } from '@/components/Frame/RemoteContext'

export interface UseSessionProps {
  session?: Session | null
}

const useSession = (props?: UseSessionProps) => {
  const remoteContextValue = useRemoteContextValue()
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  const explicitSession = props?.session
  const session = explicitSession ?? remoteContextValue?.currentSession ?? null

  useEffect(() => {
    if (!explicitSession) {
      return
    }

    const handleSessionChange = () => {
      rerender()
    }

    explicitSession.on('updated', handleSessionChange)
    explicitSession.on('ended', handleSessionChange)

    return () => {
      explicitSession.off('updated', handleSessionChange)
      explicitSession.off('ended', handleSessionChange)
    }
  }, [explicitSession])

  return session
}

export default useSession
