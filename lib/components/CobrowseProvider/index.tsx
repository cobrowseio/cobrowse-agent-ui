import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import type CobrowseAPI from 'cobrowse-agent-sdk'
import type { Policy } from 'cobrowse-agent-sdk'

const CobrowseContext = createContext<CobrowseAPI | null>(null)

export interface PolicyState {
  policy: Policy | null
  loading: boolean
  error: Error | null
}

interface ResolvedPolicyState {
  cobrowse: CobrowseAPI | null
  policy: Policy | null
  error: Error | null
}

const DEFAULT_POLICY_STATE: PolicyState = {
  policy: null,
  loading: false,
  error: null
}

const DEFAULT_RESOLVED_POLICY_STATE: ResolvedPolicyState = {
  cobrowse: null,
  policy: null,
  error: null
}

const toPolicyError = (error: unknown) => error instanceof Error ? error : new Error('Failed to load policy.')

const PolicyContext = createContext(DEFAULT_POLICY_STATE)

export interface CobrowseProviderProps {
  cobrowse: CobrowseAPI
  children?: ReactNode
}

export const CobrowseProvider = ({ cobrowse, children }: CobrowseProviderProps) => {
  const [resolvedPolicyState, setResolvedPolicyState] = useState(DEFAULT_RESOLVED_POLICY_STATE)

  useEffect(() => {
    const abortController = new AbortController()

    const loadPolicy = async () => {
      try {
        const policy = await cobrowse.policies.current(undefined, { signal: abortController.signal })

        setResolvedPolicyState({
          cobrowse,
          policy,
          error: null
        })
      } catch (error: unknown) {
        if (abortController.signal.aborted) {
          return
        }

        setResolvedPolicyState({
          cobrowse,
          policy: null,
          error: toPolicyError(error)
        })
      }
    }

    void loadPolicy()

    return () => {
      abortController.abort()
    }
  }, [cobrowse])

  // Only use policy state that belongs to the current cobrowse instance
  const isPolicyResolved = resolvedPolicyState.cobrowse === cobrowse

  const policyState = {
    policy: isPolicyResolved ? resolvedPolicyState.policy : null,
    loading: !isPolicyResolved,
    error: isPolicyResolved ? resolvedPolicyState.error : null
  }

  return (
    <CobrowseContext value={cobrowse}>
      <PolicyContext value={policyState}>
        {children}
      </PolicyContext>
    </CobrowseContext>
  )
}

export const useCobrowseValue = () => use(CobrowseContext)

export const useCobrowse = () => {
  const cobrowse = useCobrowseValue()

  if (!cobrowse) {
    throw new Error('CobrowseProvider is required to use this component.')
  }

  return cobrowse
}

export const usePolicy = () => use(PolicyContext)

export default CobrowseProvider
