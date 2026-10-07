import { useCallback, useMemo, useRef, useState } from 'react'

export function useAsync<Args extends unknown[], Result>(fn: (...args: Args) => Promise<Result>) {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
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

        if (isCurrent()) {
          setData(result)
          setIsSuccess(true)
        }

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

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsPending(false)
    setIsSuccess(false)
  }, [])

  return useMemo(
    () => ({
      data,
      error,
      isPending,
      // A later failure keeps this true, since the data from the earlier success is still held. Only a reset clears it.
      isSuccess,
      isError: error !== null,
      executeAsync,
      reset
    }),
    [data, error, isPending, isSuccess, executeAsync, reset]
  )
}
