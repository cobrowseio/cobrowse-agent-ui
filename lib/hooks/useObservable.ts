import type { RESTResourceEventMap } from 'cobrowse-agent-sdk'
import { useEffect, useMemo, useReducer } from 'react'

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

// Getters read the SDK's private state through `this`, so they must run against the entity rather than the proxy.
// Methods are bound by the SDK, so they keep their context and identity without any help here.
export function createEntityProxy<Entity extends object>(entity: Entity): Entity {
  return new Proxy(entity, {
    get: (target, property) => Reflect.get(target, property, target)
  })
}

// The latest proxy per entity. An entry only exists once the entity has been updated.
const currentProxies = new WeakMap<object, object>()

function currentProxyOf<Entity extends object>(entity: Entity): Entity {
  // Entries are only ever set to createEntityProxy(entity), so the proxy has the entity's type.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- see above
  return (currentProxies.get(entity) as Entity | undefined) ?? entity
}

export function useObservableEntities<Entity extends ObservableEntity>(
  entities: readonly Entity[] | null
): Entity[] | null {
  const [version, bump] = useReducer((version: number) => version + 1, 0)

  useEffect(() => {
    if (!entities) return

    const listeners = entities.map((entity) => {
      const listener = () => {
        // A fresh proxy gives React a new identity for this entity only
        currentProxies.set(entity, createEntityProxy(entity))
        bump()
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

  return useMemo(
    () =>
      entities
        ?.map(currentProxyOf)
        // A destroyed resource is updated with an empty payload, which leaves it without an id. Drop it so
        // consumers don't see a dead entity, and so a single resource reads as null once destroyed.
        .filter((entity) => entity.id !== undefined) ?? null,
    // version isn't read, it's what invalidates the memo when an entity is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
    [entities, version]
  )
}

export function useObservableEntity<Entity extends ObservableEntity>(entity: Entity | null): Entity | null {
  const entities = useMemo(() => (entity === null ? null : [entity]), [entity])

  return useObservableEntities(entities)?.[0] ?? null
}

