import { useCallback, useMemo, useState } from 'react'
import useStableCallback from './useStableCallback'

export function useAsync<Args extends unknown[], Result>(fn: (...args: Args) => Promise<Result>) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Result | null>(null)

  const stableFn = useStableCallback(fn)

  const executeAsync = useCallback(
    async (...args: Args): Promise<Result> => {
      setError(null)
      setIsPending(true)

      try {
        const promise = stableFn(...args)

        // useStableCallback is typed to potentially return undefined.
        if (!promise) {
          throw new Error('Async callback is unavailable')
        }

        const result = await promise

        setData(result)

        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

        setError(error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    [stableFn]
  )

  return useMemo(
    () => ({
      data,
      error,
      isPending,
      isError: error !== null,
      executeAsync
    }),
    [data, error, isPending, executeAsync]
  )
}
