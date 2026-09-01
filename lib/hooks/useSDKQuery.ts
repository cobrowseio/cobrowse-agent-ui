import { useCallback, useMemo, useState } from "react"
import useStableCallback from "./useStableCallback"

const isAbortError = (error: unknown): boolean => (
  error instanceof Error && error.name === 'AbortError'
)

export function useSDKQuery<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>
) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Result | null>(null)

  const execute = useStableCallback(fn)

  const refetch = useCallback(
    async (...args: Args): Promise<undefined> => {
      setError(null)
      setIsPending(true)

      try {
        const result = await execute(...args)
        if (result) setData(result)
      } catch (err) {
        if (isAbortError(err)) return

        setError(
          err instanceof Error
            ? err
            : new Error(String(err))
        )
      } finally {
        setIsPending(false)
      }
    },
    [execute]
  )

  return useMemo(() => ({
    data,
    isPending,
    error,
    refetch
  }), [data, isPending, error, refetch])
}