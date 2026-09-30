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
  const { data, isPending, isError, executeAsync } = useAsync(
    async (options?: RequestOptions<TQuery>) => await fn(...args, options)
  )
  const controllerRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(
    async (options?: QueryRequestOptions<TQuery>): Promise<void> => {
      controllerRef.current?.abort()

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
      isError
    }),
    [data, error, refetch, isError, cancel, isPending]
  )
}
