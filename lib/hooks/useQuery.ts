import { useCallback, useMemo } from 'react'
import { useAsync } from './useAsync'

export function useQuery<Args extends unknown[], Result>(fn: (...args: Args) => Promise<Result>) {
  const { data, error, isPending, isError, executeAsync } = useAsync(fn)

  const refetch = useCallback(
    async (...args: Args): Promise<void> => {
      try {
        await executeAsync(...args)
      } catch {
        // errors are handled through the state.
        // Abort errors are intentionally swallowed here
      }
    },
    [executeAsync]
  )

  return useMemo(
    () => ({
      data,
      error,
      isFetching: isPending,
      refetch,
      isError
    }),
    [data, error, isPending, refetch, isError]
  )
}
