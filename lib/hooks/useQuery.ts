import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAsync } from './useAsync'
import type { QueryParams, QueryShape, RequestOptions } from 'cobrowse-agent-sdk'

export interface QueryOptions {
  fetchOnMount?: boolean
}

type QueryRequestInit = Omit<RequestInit, 'signal'>

export type QueryRequestOptions<TQuery extends QueryShape<TQuery> = QueryParams> = Omit<
  RequestOptions<TQuery>,
  'request'
> & {
  request?: QueryRequestInit
}

const isAbortError = (error: unknown): boolean => error instanceof Error && error.name === 'AbortError'

export function useQuery<Args extends unknown[], TQuery extends QueryShape<TQuery>, Result>(
  fn: (...args: [...Args, options?: RequestOptions<TQuery>]) => Promise<Result>,
  { fetchOnMount = true }: QueryOptions = {},
  ...args: Args
) {
  // Each arg is a dependency so a change (e.g. a resource id) produces a new callback and triggers a refetch.
  // Call sites pass a fixed number of args, so the deps array length is stable across renders.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- rest args can't be listed statically, the spread is intentional
  const wrappedFn = useCallback(async (options?: RequestOptions<TQuery>) => await fn(...args, options), [fn, ...args])
  const { data, isPending, executeAsync, reset } = useAsync(wrappedFn, { isPending: fetchOnMount })

  const controllerRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // A new fn or args means a different resource, so drop the previous result rather than showing it under the
  // new identity. A refetch with the same args keeps the current data to avoid UI flashes. This runs during render
  // so there's no committed frame with stale data.
  const [prevFn, setPrevFn] = useState(() => wrappedFn)
  if (prevFn !== wrappedFn) {
    setPrevFn(() => wrappedFn)
    setError(null)
    reset({ isPending: fetchOnMount })
  }

  const refetch = useCallback(
    async (options?: QueryRequestOptions<TQuery>): Promise<void> => {
      controllerRef.current?.abort()
      setError(null)

      const controller = new AbortController()
      controllerRef.current = controller

      const requestOptions: RequestOptions<TQuery> = {
        ...options,
        request: {
          ...options?.request,
          signal: controller.signal
        }
      }

      try {
        await executeAsync(requestOptions)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))

        // errors are handled through the state.
        // Abort errors are intentionally swallowed here
        if (!isAbortError(error)) {
          setError(error)
        }
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null
        }
      }
    },
    [executeAsync]
  )

  const cancel = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  useEffect(() => cancel, [cancel])

  useEffect(() => {
    if (fetchOnMount) void refetch().catch()
  }, [fetchOnMount, refetch])

  return useMemo(
    () => ({
      data,
      error,
      isPending,
      refetch,
      cancel,
      isError: error !== null
    }),
    [data, error, refetch, cancel, isPending]
  )
}
