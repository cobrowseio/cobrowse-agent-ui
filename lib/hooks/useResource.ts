import { useMemo } from 'react'
import { type ObservableEntity, useObservableEntity } from './useObservable'
import { type QueryOptions, useQuery } from './useQuery'
import type { QueryShape, RequestOptions } from 'cobrowse-agent-sdk'

export function useResource<Args extends unknown[], TQuery extends QueryShape<TQuery>, Entity extends ObservableEntity>(
  fn: (...args: [...Args, options?: RequestOptions<TQuery>]) => Promise<Entity>,
  options?: QueryOptions,
  ...args: Args
) {
  const query = useQuery(fn, options, ...args)
  const data = useObservableEntity(query.data)

  return useMemo(
    () => ({
      ...query,
      data
    }),
    [query, data]
  )
}
