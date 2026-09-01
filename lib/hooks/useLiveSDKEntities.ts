import {
  useCallback,
  useMemo,
  useSyncExternalStore
} from 'react'

export interface ObservableSDKEntity {
  readonly revision: number

  on: (event: 'updated', listener: () => void) => void
  off: (event: 'updated', listener: () => void) => void
}

export function useLiveSDKEntities(
  entities: readonly ObservableSDKEntity[] | null
): string {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!entities) return () => undefined

      for (const entity of entities) {
        entity.on('updated', notify)
      }

      return () => {
        for (const entity of entities) {
          entity.off('updated', notify)
        }
      }
    },
    [entities]
  )

  const getSnapshot = useCallback(() => {
    if (!entities) return ''

    return `${entities.length}:${entities
      .map(entity => entity.revision)
      .join(',')}`
  }, [entities])

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  )
}

export function useLiveSDKEntity(
  entity: ObservableSDKEntity | null
): string {
  const entities = useMemo(
    () => entity ? [entity] : null,
    [entity]
  )

  return useLiveSDKEntities(entities)
}