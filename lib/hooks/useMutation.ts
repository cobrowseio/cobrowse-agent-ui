import { type ObservableEntity, useObservableEntity } from './useObservable'
import { useAsync } from './useAsync'
import { useCallback, useMemo } from 'react'

export function useMutation<Args extends unknown[], Entity extends ObservableEntity>(
  fn: (...args: Args) => Promise<Entity>
) {
  const { data: result, error, isPending, isError, executeAsync: mutateAsync } = useAsync(fn)
  const data = useObservableEntity(result)

  const mutate = useCallback(
    (...args: Args): void => {
      void mutateAsync(...args).catch(() => undefined)
    },
    [mutateAsync]
  )

  return useMemo(
    () => ({
      data,
      error,
      isPending,
      isError,
      mutate,
      mutateAsync
    }),
    [data, error, isPending, isError, mutate, mutateAsync]
  )
}
