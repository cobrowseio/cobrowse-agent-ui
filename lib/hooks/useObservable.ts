import type { RESTResource, RESTResourceEventMap } from 'cobrowse-agent-sdk'
import { useEffect, useState } from 'react'

export type ObservableEntity = {
  on: <Event extends keyof RESTResourceEventMap>(
    event: Event,
    listener: (...args: RESTResourceEventMap[Event]) => void
  ) => unknown

  off: <Event extends keyof RESTResourceEventMap>(
    event: Event,
    listener: (...args: RESTResourceEventMap[Event]) => void
  ) => unknown
}

export function createEntityProxy<Entity extends object>(entity: Entity): Entity {
  const methodCache = new Map<
    PropertyKey,
    {
      source: Function
      bound: Function
    }
  >()

  return new Proxy(entity, {
    get(target, property) {
      const value = Reflect.get(target, property, target)

      if (typeof value !== 'function') {
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
  const [proxy, setProxy] = useState<Entity | null>(() => (entity ? createEntityProxy(entity) : null))

  useEffect(() => {
    if (!entity) {
      setProxy(null)
      return
    }

    setProxy(createEntityProxy(entity))

    const handleUpdate = () => {
      setProxy(createEntityProxy(entity))
    }

    entity.on('updated', handleUpdate)

    return () => {
      entity.off('updated', handleUpdate)
    }
  }, [entity])

  return proxy
}

export function useObservableEntities<Entity extends ObservableEntity>(
  entities: readonly Entity[] | null
): Entity[] | null {
  const [proxies, setProxies] = useState<Entity[] | null>(null)

  useEffect(() => {
    if (!entities) {
      setProxies(null)
      return
    }

    setProxies(entities.map(createEntityProxy))

    const listeners = entities.map((entity) => {
      const listener = () => {
        setProxies((current) => {
          if (!current) return current

          return entities.map((item, index) => (item === entity ? createEntityProxy(item) : current[index]))
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
  }, [entities])

  return proxies
}
