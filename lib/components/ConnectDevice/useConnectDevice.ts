import { useCallback, useEffect, useRef } from 'react'
import type { Device, Session } from 'cobrowse-agent-sdk'
import useStableCallback from '@/hooks/useStableCallback'
import { useCobrowse } from '@/components/CobrowseProvider'

export const MAX_PUSH_ATTEMPTS = 5
export const PUSH_RETRY_MS = 4000
export const ERROR_PUSH_ERROR = 'push_error'
export const ERROR_PUSH_ATTEMPT_LIMIT_REACHED = 'push_attempt_limit_reached'
export const ERROR_DEVICE_NOT_FOUND = 'device_not_found'
export const ERROR_SESSION_NOT_FOUND = 'session_not_found'
export const ERROR_SESSION_ERROR = 'session_error'

export interface UseConnectDeviceOptions {
  deviceId: string
  onConnectAttempt?: (attempt: number) => void
  onConnected?: (session: Session) => void
  onCancelled?: (session: Session) => void
  onEnded?: (session: Session) => void
  onError?: (error: unknown) => void
  maxPushAttempts?: number
  pushRetryMs?: number
}

const useConnectDevice = ({
  deviceId,
  onConnectAttempt,
  onConnected,
  onCancelled,
  onEnded,
  onError,
  maxPushAttempts = MAX_PUSH_ATTEMPTS,
  pushRetryMs = PUSH_RETRY_MS
}: UseConnectDeviceOptions) => {
  const cobrowse = useCobrowse()
  const deviceRef = useRef<Device>(null)
  const sessionRef = useRef<Session>(null)
  const sessionConnectedRef = useRef(false)
  const sessionEndedRef = useRef(false)
  const pushTimerRef = useRef(0)
  const onConnectAttemptCallback = useStableCallback(onConnectAttempt)
  const onConnectedCallback = useStableCallback(onConnected)
  const onCancelledCallback = useStableCallback(onCancelled)
  const onEndedCallback = useStableCallback(onEnded)
  const onErrorCallback = useStableCallback(onError)

  const stopPush = useCallback(() => {
    clearTimeout(pushTimerRef.current)
  }, [])

  const handleSessionUpdated = useCallback((session: Session) => {
    if (!['pending', 'ended'].includes(session.state) && !sessionConnectedRef.current) {
      stopPush()
      onConnectedCallback(session)
      sessionConnectedRef.current = true
    }
  }, [onConnectedCallback, stopPush])

  const handleSessionEnded = useCallback((session: Session) => {
    if (!sessionEndedRef.current) {
      onEndedCallback(session)
      sessionEndedRef.current = true
      void sessionRef.current?.end()
    }
  }, [onEndedCallback])

  const triggerPushError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      onErrorCallback({ id: ERROR_PUSH_ERROR, message: error.message })
    } else {
      onErrorCallback(error)
    }
  }, [onErrorCallback])

  const sendPush = useCallback(async function send (attempt = 1, abortController: AbortController) {
    onConnectAttemptCallback(attempt)

    if (attempt >= maxPushAttempts) {
      triggerPushError({ id: ERROR_PUSH_ATTEMPT_LIMIT_REACHED, message: 'Push attempt limit reached.' })

      return
    }

    if (!deviceRef.current) {
      triggerPushError({ id: ERROR_DEVICE_NOT_FOUND, message: 'Device not found.' })

      return
    }

    if (!sessionRef.current) {
      triggerPushError({ id: ERROR_SESSION_NOT_FOUND, message: 'Session not found.' })

      return
    }

    try {
      await deviceRef.current.notify({ session: sessionRef.current, attempt }, undefined, { signal: abortController.signal })
    } catch (error) {
      triggerPushError(error)
    }

    pushTimerRef.current = setTimeout(() => {
      void send(attempt + 1, abortController)
    }, pushRetryMs)
  }, [maxPushAttempts, onConnectAttemptCallback, pushRetryMs, triggerPushError])

  const createSession = useCallback(async (abortController: AbortController) => {
    const { signal } = abortController

    try {
      deviceRef.current = null
      sessionRef.current = null
      sessionConnectedRef.current = false
      sessionEndedRef.current = false

      const [region, device] = await Promise.all([
        cobrowse.regions.closest(undefined, { signal }),
        cobrowse.devices.get(deviceId, undefined, { signal })
      ])

      deviceRef.current = device

      const session = await cobrowse.sessions.create({
        custom_data: device.custom_data,
        region: region.id,
        agent: 'me'
      }, undefined, { signal })

      sessionRef.current = session

      session.on('updated', handleSessionUpdated)
      session.on('ended', handleSessionEnded)

      await session.subscribe()
    } catch (error) {
      if (error instanceof Error) {
        onErrorCallback({ id: ERROR_SESSION_ERROR, message: error.message })
      } else {
        onErrorCallback({ id: ERROR_SESSION_ERROR, message: 'The session could not be created.' })
      }
    }
  }, [cobrowse, deviceId, handleSessionEnded, handleSessionUpdated, onErrorCallback])

  const cancel = useCallback(async () => {
    stopPush()

    const session = sessionRef.current

    if (session) {
      await session.end()
      onCancelledCallback(session)
    }
  }, [onCancelledCallback, stopPush])

  useEffect(() => {
    const abortController = new AbortController()

    const runEffect = async () => {
      await createSession(abortController)

      if (abortController.signal.aborted) {
        return
      }

      await sendPush(1, abortController)
    }

    void runEffect()

    return () => {
      abortController.abort()
      stopPush()
    }
  }, [createSession, sendPush, stopPush])

  return { cancel }
}

export default useConnectDevice
