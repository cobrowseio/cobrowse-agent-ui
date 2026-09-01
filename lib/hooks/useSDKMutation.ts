import { useCallback, useState } from "react"
import useStableCallback from "./useStableCallback"

export function useSDKMutation<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>
) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useStableCallback(fn)

  // use `mutateAsync` when you want to handle the error state
  // inline to control application flow easier - ie close popup etc
  const mutateAsync = useCallback(
    async (...args: Args): Promise<Result> => {
      setError(null)
      setIsPending(true)

      try {
        const promise = execute(...args)

        // this should not happen but useStableCallback is typed to
        // potentially return undefined
        if (!promise) {
          throw new Error('SDK mutation callback is unavailable')
        }

        return await promise
      } catch (err) {
        const error = err instanceof Error
          ? err
          : new Error(String(err))

        setError(error)

        throw error
      } finally {
        setIsPending(false)
      }
    },
    [execute]
  )

  // to be used with components that want fire and forget
  // or that use the error returned by the hook
  const mutate = useCallback(
    (...args: Args): void => {
      void mutateAsync(...args).catch(() => undefined)
    },
    [mutateAsync]
  )

  return {
    mutate,
    mutateAsync,
    error,
    isPending
  }
}