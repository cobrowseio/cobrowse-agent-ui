import { useEffect, useState } from 'react'
import { useCobrowse } from '@/components/CobrowseProvider'

const isAbortError = (error: unknown): boolean => (
  error instanceof Error && error.name === 'AbortError'
)

/**
 * Provides the account's trusted embedding domains.
 * When the CobrowseProvider instance has no token the account settings cannot
 * be fetched, so the origins stay null.
 */
const useTrustedEmbeddingOrigins = () => {
  const cobrowse = useCobrowse()
  const [origins, setOrigins] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setOrigins(null)
    setError(null)

    if (!cobrowse.token) {
      return
    }

    const abortController = new AbortController()

    const runEffect = async () => {
      setLoading(true)

      try {
        const trusted = await cobrowse.origins.trusted({ request: { signal: abortController.signal } })

        setOrigins(trusted.origins)
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

  return {
    origins,
    loading,
    error
  }
}

export default useTrustedEmbeddingOrigins
