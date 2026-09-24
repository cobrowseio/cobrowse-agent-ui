import { useCallback, useState } from 'react'
import useStableCallback from './useStableCallback'
import { type ObservableEntity, useObservableEntity } from './useObservable'

export function useMutation<Args extends unknown[], Entity extends ObservableEntity>(
  fn: (...args: Args) => Promise<Entity>
) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<Entity | null>(null)

  const execute = useStableCallback(fn)

  // use `mutateAsync` when you want to handle the error state
  // inline to control application flow easier - ie close popup etc
  const mutateAsync = useCallback(
    async (...args: Args): Promise<Entity> => {
      setError(null)
      setIsPending(true)

      try {
        const promise = execute(...args)

        // this should not happen but useStableCallback is typed to
        // potentially return undefined
        if (!promise) {
          throw new Error('SDK mutation callback is unavailable')
        }

        const result = await promise

        setResult(result)

        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

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

  const data = useObservableEntity(result)

  return {
    data,
    mutate,
    mutateAsync,
    error,
    isPending,
    isError: error !== null
  }
}
