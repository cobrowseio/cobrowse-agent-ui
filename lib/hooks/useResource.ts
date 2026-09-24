import { useMemo } from 'react'
import { ObservableEntity, useObservableEntity } from './useObservable'
import { useQuery } from './useQuery'

export function useResource<Args extends unknown[], Entity extends ObservableEntity>(
  fn: (...args: Args) => Promise<Entity>
) {
  const query = useQuery(fn)
  const data = useObservableEntity(query.data)

  return useMemo(
    () => ({
      ...query,
      data
    }),
    [query, data]
  )
}
