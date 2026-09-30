import { useMemo } from 'react'
import { type ObservableEntity, useObservableEntities } from './useObservable'
import { type QueryOptions, useQuery } from './useQuery'
import type { QueryShape, RequestOptions } from 'cobrowse-agent-sdk'

export function useCollection<
  Args extends unknown[],
  TQuery extends QueryShape<TQuery>,
  Entity extends ObservableEntity
>(
  fn: (...args: [...Args, options?: RequestOptions<TQuery>]) => Promise<Entity[]>,
  options?: QueryOptions,
  ...args: Args
) {
  const query = useQuery(fn, options, ...args)
  const data = useObservableEntities(query.data)

  return useMemo(
    () => ({
      ...query,
      data
    }),
    [query, data]
  )
}
