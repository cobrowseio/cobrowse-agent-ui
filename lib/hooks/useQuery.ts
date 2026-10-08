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
  const { data, isPending: isExecuting, isSuccess, isError: isAsyncError, executeAsync, reset } = useAsync(wrappedFn)

  const controllerRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // A new fn or args means a different resource, so drop the previous result rather than showing it under the
  // new identity. A refetch with the same args keeps the current data to avoid UI flashes. This runs during render
  // so there's no committed frame with stale data.
  const [prevFn, setPrevFn] = useState(() => wrappedFn)
  if (prevFn !== wrappedFn) {
    setPrevFn(() => wrappedFn)
    setError(null)
    reset()
  }

  // With fetchOnMount a request is guaranteed to follow, so a query with no outcome yet is pending even before the
  // effect starts it. This avoids a "no data, not loading" frame on mount and after a reset. The async error state
  // (unlike the query's, it includes aborts) counts as an outcome so a failed or cancelled request settles.
  const isPending = isExecuting || (fetchOnMount && !isSuccess && !isAsyncError)

  const refetch = useCallback(
    async (options?: QueryRequestOptions<TQuery>): Promise<void> => {
      controllerRef.current?.abort()
      setError(null)

      const controller = new AbortController()
      controllerRef.current = controller

      // A newer refetch replaces the controller, so this tells us whether this request is still the active one.
      const isCurrent = () => controllerRef.current === controller

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

        // errors are handled through the state. Abort errors are intentionally swallowed, and a refetch that
        // has since been superseded must not surface its error over the newer request's state.
        if (isCurrent() && !isAbortError(error)) {
          setError(error)
        }
      } finally {
        if (isCurrent()) {
          controllerRef.current = null
        }
      }
    },
    [executeAsync]
  )

  const cancel = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  useEffect(() => {
    if (fetchOnMount) void refetch()

    return cancel
  }, [fetchOnMount, refetch, cancel])

  return useMemo(
    () => ({
      data,
      error,
      /** A request is in flight, whether the first load or a refetch. */
      isPending,
      /** A request has resolved since the query was mounted or its args changed. Stays true if a later refetch fails. */
      isSuccess,
      /** The first load is in flight and there's no data yet, e.g. to show a skeleton. */
      isLoading: isPending && !isSuccess,
      /** A refetch is in flight while previous data is shown, e.g. to show a subtle indicator. */
      isRefetching: isPending && isSuccess,
      refetch,
      cancel,
      isError: error !== null
    }),
    [data, error, refetch, cancel, isPending, isSuccess]
  )
}
