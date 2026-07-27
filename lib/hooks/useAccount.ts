import { useCallback, useEffect, useState } from 'react'
import { useCobrowse } from '@/components/CobrowseProvider'
import type { Account, AccountFeature } from 'cobrowse-agent-sdk'

const isAbortError = (error: unknown): boolean => (
  error instanceof Error && error.name === 'AbortError'
)

/**
 * Provides access to the current account and its enabled features.
 *
 * Currently, the first available account is treated as the active account.
 *
 * @experimental
 * WARNING: This hook's API, behaviour, and name may change without notice.
 */
const useAccount = () => {
  const cobrowse = useCobrowse()
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const runEffect = async () => {
      setAccount(null)
      setError(null)
      setLoading(true)

      try {
        const accounts = await cobrowse.accounts.list({ request: { signal: abortController.signal } })

        // JWTs are scoped to a single account.
        // TODO: expand this to support inferring the active account
        // from the license key stored in localStorage (frontend app)
        setAccount(accounts.length > 0 ? accounts[0] : null)
      } catch (error) {
        if (isAbortError(error)) return

        setError(error instanceof Error ? error : new Error(String(error)))
      } finally {
        setLoading(false)
      }
    }

    void runEffect()

    return () => {
      abortController.abort()
    }
  }, [cobrowse])

  const hasFeature = useCallback((feature: AccountFeature) => {
    // Features are enabled by default and won't be included in the server response
    if (typeof account?.features[feature] === 'undefined') {
      return true
    }

    return account.features[feature]
  }, [account])

  return {
    hasFeature,
    account,
    loading,
    error
  }
}

export default useAccount
