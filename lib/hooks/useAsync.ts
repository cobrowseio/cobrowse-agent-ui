import { useCallback, useMemo, useRef, useState } from 'react'

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
  const callIdRef = useRef(0)

  const executeAsync = useCallback(
    async (...args: Args): Promise<Result> => {
      // Only the most recent call may write state. A superseded call still resolves or rejects for its own
      // caller, but its result, error and pending transitions are dropped so they can't clobber a newer call.
      callIdRef.current += 1
      const callId = callIdRef.current
      const isCurrent = () => callId === callIdRef.current

      setError(null)
      setIsPending(true)

      try {
        const result = await fn(...args)

        if (isCurrent()) setData(result)

        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

        if (isCurrent()) setError(error)
        throw error
      } finally {
        if (isCurrent()) setIsPending(false)
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
