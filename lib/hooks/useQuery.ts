import { useMemo } from 'react'
import { useAsync } from './useAsync'

export function useQuery<Args extends unknown[], Result>(fn: (...args: Args) => Promise<Result>) {
  const { data, error, isPending, isError, execute } = useAsync(fn)

  return useMemo(
    () => ({
      data,
      error,
      isFetching: isPending,
      refetch: execute,
      isError
    }),
    [data, isPending, error, execute, isError]
  )
}
