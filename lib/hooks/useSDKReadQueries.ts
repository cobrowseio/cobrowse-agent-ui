import { useMemo } from "react"
import { useLiveSDKEntities, useLiveSDKEntity } from "./useLiveSDKEntities"
import type {
  ObservableSDKEntity
} from "./useLiveSDKEntities"
import { useSDKQuery } from "./useSDKQuery"

export function useSDKCollectionQuery<
  Args extends unknown[],
  Entity extends ObservableSDKEntity
>(
  fn: (...args: Args) => Promise<Entity[]>
) {
  const query = useSDKQuery(fn)
  const revision = useLiveSDKEntities(query.data)
  
  return useMemo(
    () => ({
      ...query,
      revision
    }),
    [query, revision]
  )
}

export function useSDKResourceQuery<
  Args extends unknown[],
  Entity extends ObservableSDKEntity
>(
  fn: (...args: Args) => Promise<Entity>
) {
  const query = useSDKQuery(fn)

  const revision = useLiveSDKEntity(query.data)

  return useMemo(
    () => ({
      ...query,
      revision
    }),
    [query, revision]
  )
}