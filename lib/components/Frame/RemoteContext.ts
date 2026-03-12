import { createContext, use } from 'react'
import type { RemoteContext as CobrowseRemoteContext, Session as CobrowseSession } from 'cobrowse-agent-sdk'

interface RemoteContextValue {
  remoteContext: CobrowseRemoteContext | null
  currentSession: CobrowseSession | null
}

const RemoteContext = createContext<RemoteContextValue | undefined>(undefined)

export const useRemoteContextValue = () => use(RemoteContext)

export const useRemoteContext = () => useRemoteContextValue()?.remoteContext ?? null

export default RemoteContext
