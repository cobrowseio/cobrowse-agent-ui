import { createContext, use } from 'react'
import type { RemoteContext as CobrowseRemoteContext } from 'cobrowse-agent-sdk'

const RemoteContext = createContext<CobrowseRemoteContext | null | undefined>(undefined)

export const useRemoteContext = () => {
  const remoteContext = use(RemoteContext)

  if (remoteContext === undefined) {
    throw new Error('useRemoteContext must be used within Frame or SessionEmbed.')
  }

  return remoteContext
}

export default RemoteContext
