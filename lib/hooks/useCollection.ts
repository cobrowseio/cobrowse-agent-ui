import { useMemo } from 'react'
import { ObservableEntity, useObservableEntities } from './useObservable'
import { useQuery } from './useQuery'

export function useCollection<Args extends unknown[], Entity extends ObservableEntity>(
  fn: (...args: Args) => Promise<Entity[]>
) {
  const query = useQuery(fn)
  const data = useObservableEntities(query.data)

  return useMemo(
    () => ({
      ...query,
      data
    }),
    [query, data]
  )
}
