import { createContext, use, type ReactNode } from 'react'
import type CobrowseAPI from 'cobrowse-agent-sdk'

const CobrowseContext = createContext<CobrowseAPI | null>(null)

export interface CobrowseProviderProps {
  cobrowse: CobrowseAPI
  children?: ReactNode
}

export const CobrowseProvider = ({ cobrowse, children }: CobrowseProviderProps) => (
  <CobrowseContext.Provider value={cobrowse}>{children}</CobrowseContext.Provider>
)

export const useCobrowse = () => {
  const cobrowse = use(CobrowseContext)

  if (!cobrowse) {
    throw new Error('CobrowseProvider is required to use this component.')
  }

  return cobrowse
}

export default CobrowseProvider
