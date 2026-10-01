import { useCallback, useMemo, useState } from 'react'

export interface AsyncStateOptions {
  /**
   * Pending state to apply, on mount or alongside a reset. Defaults to false.
   * Set to true when a call is guaranteed to follow, so consumers never observe
   * a "no data, not loading" frame before it starts.
   */
  isPending?: boolean
}

export function useAsync<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  { isPending: initialPending = false }: AsyncStateOptions = {}
) {
  const [isPending, setIsPending] = useState(initialPending)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Result | null>(null)

  const executeAsync = useCallback(
    async (...args: Args): Promise<Result> => {
      setError(null)
      setIsPending(true)

      try {
        const result = await fn(...args)

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
    [fn]
  )

  const reset = useCallback(({ isPending = false }: AsyncStateOptions = {}) => {
    setData(null)
    setError(null)
    setIsPending(isPending)
  }, [])

  return useMemo(
    () => ({
      data,
      error,
      isPending,
      isError: error !== null,
      executeAsync,
      reset
    }),
    [data, error, isPending, executeAsync, reset]
  )
}
