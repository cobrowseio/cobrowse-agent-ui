import { type ObservableEntity, useObservableEntity } from './useObservable'
import { useAsync } from './useAsync'
import { useMemo } from 'react'

export function useMutation<Args extends unknown[], Entity extends ObservableEntity>(
  fn: (...args: Args) => Promise<Entity>
) {
  const { data: result, error, isPending, isError, execute: mutate, executeAsync: mutateAsync } = useAsync(fn)
  const data = useObservableEntity(result)

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
