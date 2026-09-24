import type { RESTResourceEventMap } from 'cobrowse-agent-sdk'
import { useEffect, useMemo, useState } from 'react'

export interface ObservableEntity {
  on: <Event extends keyof RESTResourceEventMap>(
    event: Event,
    listener: (...args: RESTResourceEventMap[Event]) => void
  ) => unknown

  off: <Event extends keyof RESTResourceEventMap>(
    event: Event,
    listener: (...args: RESTResourceEventMap[Event]) => void
  ) => unknown
}

type Method = (...args: unknown[]) => unknown

function isMethod(value: unknown): value is Method {
  return typeof value === 'function'
}

export function createEntityProxy<Entity extends object>(entity: Entity): Entity {
  const methodCache = new Map<
    PropertyKey,
    {
      source: Method
      bound: Method
    }
  >()

  return new Proxy(entity, {
    get(target, property) {
      const value: unknown = Reflect.get(target, property, target)

      if (!isMethod(value)) {
        return value
      }

      const cached = methodCache.get(property)

      if (cached?.source === value) {
        return cached.bound
      }

      const bound = value.bind(target)

      methodCache.set(property, {
        source: value,
        bound
      })

      return bound
    }
  })
}

export function useObservableEntity<Entity extends ObservableEntity>(entity: Entity | null): Entity | null {
  const baseProxy = useMemo(() => (entity ? createEntityProxy(entity) : null), [entity])

  const [updated, setUpdated] = useState<{
    entity: Entity
    proxy: Entity
  } | null>(null)

  useEffect(() => {
    if (!entity) return

    const handleUpdate = () => {
      setUpdated({
        entity,
        proxy: createEntityProxy(entity)
      })
    }

    entity.on('updated', handleUpdate)

    return () => {
      entity.off('updated', handleUpdate)
    }
  }, [entity])

  if (!entity) return null

  return updated?.entity === entity ? updated.proxy : baseProxy
}

export function useObservableEntities<Entity extends ObservableEntity>(
  entities: readonly Entity[] | null
): Entity[] | null {
  const baseProxies = useMemo(() => entities?.map(createEntityProxy) ?? null, [entities])

  const [updated, setUpdated] = useState<{
    entities: readonly Entity[]
    proxies: Entity[]
  } | null>(null)

  useEffect(() => {
    if (!entities || !baseProxies) return

    const listeners = entities.map((entity, index) => {
      const listener = () => {
        setUpdated((current) => {
          const proxies = current?.entities === entities ? [...current.proxies] : [...baseProxies]

          proxies[index] = createEntityProxy(entity)

          return {
            entities,
            proxies
          }
        })
      }

      entity.on('updated', listener)

      return { entity, listener }
    })

    return () => {
      for (const { entity, listener } of listeners) {
        entity.off('updated', listener)
      }
    }
  }, [entities, baseProxies])

  if (!entities) return null

  return updated?.entities === entities ? updated.proxies : baseProxies
}
