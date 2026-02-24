import { useCallback, useEffect, useRef } from 'react'

const useStableCallback = <TArgs extends unknown[], TResult>(callback?: (...args: TArgs) => TResult) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args: TArgs): TResult | undefined => (
    callbackRef.current?.(...args)
  ), [])
}

export default useStableCallback
