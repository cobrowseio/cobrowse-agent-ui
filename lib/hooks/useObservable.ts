import type { RESTResourceEventMap } from 'cobrowse-agent-sdk'
import { useEffect, useMemo, useState } from 'react'

export interface ObservableEntity {
  // The SDK types id as a string, but a destroyed resource is updated with an empty payload and loses it
  id?: string
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

type MethodCache = Map<
  PropertyKey,
  {
    source: Method
    bound: Method
  }
>

// Keyed by the underlying entity, so a new proxy created for an `updated`
// event reuses the same bound methods and their identity stays stable across updates as well as renders.
const methodCaches = new WeakMap<object, MethodCache>()

function getMethodCache(entity: object): MethodCache {
  let cache = methodCaches.get(entity)

  if (!cache) {
    cache = new Map()
    methodCaches.set(entity, cache)
  }

  return cache
}

export function createEntityProxy<Entity extends object>(entity: Entity): Entity {
  const methodCache = getMethodCache(entity)

  return new Proxy(entity, {
    get(target, property) {
      const value: unknown = Reflect.get(target, property, target)

      // constructor is a class, not a method. Binding it would hide its statics and
      // break `proxy.constructor === Entity`, so it's passed through untouched.
      if (!isMethod(value) || property === 'constructor') {
        return value
      }

      const cached = methodCache.get(property)

      // reuse the previously bound function while the underlying method
      // reference is the same
      if (cached?.source === value) {
        return cached.bound
      }

      // we need to bind methods to the original entity rather than the
      // proxy to preserve the `this` context
      const bound = value.bind(target)

      // cache the bound method to preserve stable function identity
      methodCache.set(property, {
        source: value,
        bound
      })

      return bound
    }
  })
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

  return useMemo(() => {
    if (!entities) return null

    const proxies = updated?.entities === entities ? updated.proxies : baseProxies

    // A destroyed resource is updated with an empty payload, which leaves it without an id. Drop it so
    // consumers don't see a dead entity, and so a single resource reads as null once destroyed.
    return proxies?.filter((entity) => entity.id !== undefined) ?? null
  }, [updated, entities, baseProxies])
}

export function useObservableEntity<Entity extends ObservableEntity>(entity: Entity | null): Entity | null {
  const entities = useMemo(() => (entity === null ? null : [entity]), [entity])

  return useObservableEntities(entities)?.[0] ?? null
}
