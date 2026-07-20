import { useCallback, useEffect, useState } from 'react'
import { useCobrowse } from '@/components/CobrowseProvider'
import type { Account, AccountFeature } from 'cobrowse-agent-sdk'

const isAbortError = (error: unknown): boolean => (
  error instanceof Error && error.name === 'AbortError'
)

const useAccount = () => {
  const cobrowse = useCobrowse()
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const runEffect = async () => {
      setAccount(null)

      try {
        const accounts = await cobrowse.accounts.list({ request: { signal: abortController.signal } })

        setAccount(accounts.length > 0 ? accounts[0] : null)
      } catch (error) {
        if (!isAbortError(error)) {
          throw error
        }
      }
    }

    void runEffect()

    return () => {
      abortController.abort()
    }
  }, [cobrowse])

  const hasFeature = useCallback((feature: AccountFeature) => {
    // Features are enabled by default and won't be included in the server response
    if (typeof account?.features[feature] === 'undefined') return true

    return account.features[feature]
  }, [account])

  return {
    hasFeature,
    account
  }
}

export default useAccount
