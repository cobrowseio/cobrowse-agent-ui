import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import type CobrowseAPI from 'cobrowse-agent-sdk'
import type { Device, Session } from 'cobrowse-agent-sdk'
import { useTranslation } from 'react-i18next'
import styles from './ConnectDevice.module.css'
import PhoneIcon from '@/icons/phone.svg?react'

export const MAX_PUSH_ATTEMPTS = 5
export const PUSH_RETRY_MS = 4000

export interface ConnectDeviceProps {
  cobrowse: CobrowseAPI,
  deviceId: string,
  onConnectAttempt?: (attempt: number) => void
  onConnected?: (session: Session) => void
  onCancelled?: (session: Session) => void
  onEnded?: (session: Session) => void
  onError?: (error: unknown) => void
  maxPushAttempts?: number,
  pushRetryMs?: number
  className?: string
  renderCancelButton?: (onCancel: () => void) => ReactNode
  children?: ReactNode
}

const ConnectDevice = ({
  cobrowse,
  deviceId,
  onConnectAttempt,
  onConnected,
  onCancelled,
  onEnded,
  onError,
  maxPushAttempts = MAX_PUSH_ATTEMPTS,
  pushRetryMs = PUSH_RETRY_MS,
  className,
  renderCancelButton,
  children
}: ConnectDeviceProps) => {
  const cobrowseRef = useRef(cobrowse)
  const deviceRef = useRef<Device>(null)
  const sessionRef = useRef<Session>(null)
  const onConnectAttemptRef = useRef(onConnectAttempt)
  const onConnectedRef = useRef(onConnected)
  const onCancelledRef = useRef(onCancelled)
  const onEndedRef = useRef(onEnded)
  const onErrorRef = useRef(onError)
  const pushTimerRef = useRef(0)
  const sessionConnectedRef = useRef(false)
  const sessionEndedRef = useRef(false)
  const { t } = useTranslation()

  useEffect(() => {
    cobrowseRef.current = cobrowse
  }, [cobrowse])

  useEffect(() => {
    onConnectAttemptRef.current = onConnectAttempt
    onConnectedRef.current = onConnected
    onCancelledRef.current = onCancelled
    onEndedRef.current = onEnded
    onErrorRef.current = onError
  }, [onConnectAttempt, onConnected, onCancelled, onEnded, onError])

  const stopPush = useCallback(() => {
    clearTimeout(pushTimerRef.current)
  }, [])

  const handleSessionUpdated = useCallback((session: Session) => {
    if (!['pending', 'ended'].includes(session.state) && !sessionConnectedRef.current) {
      stopPush()
      onConnectedRef.current?.(session)
      sessionConnectedRef.current = true
    }
  }, [stopPush])

  const handleSessionEnded = useCallback((session: Session) => {
    if (!sessionEndedRef.current) {
      onEndedRef.current?.(session)
      sessionEndedRef.current = true
    }
  }, [])

  const handleCancel = useCallback(async () => {
    const session = sessionRef.current

    if (session) {
      stopPush()
      await session.end()
      onCancelledRef.current?.(session)
    }
  }, [stopPush])

  const triggerPushError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      onErrorRef.current?.({ id: 'push_error', message: error.message })
    } else {
      onErrorRef.current?.(error)
    }
  }, [])

  const sendPush = useCallback(async function send (attempt = 1, abortController: AbortController) {
    onConnectAttemptRef.current?.(attempt)

    if (attempt >= maxPushAttempts) {
      triggerPushError({ id: 'push_attempt_limit_reached', message: 'Push attempt limit reached.' })

      return
    }

    if (!deviceRef.current) {
      triggerPushError({ id: 'device_not_found', message: 'Device not found.' })

      return
    }

    if (!sessionRef.current) {
      triggerPushError({ id: 'session_not_found', message: 'Session not found.' })

      return
    }

    try {
      await deviceRef.current.notify({ session: sessionRef.current, attempt }, { signal: abortController.signal })
    } catch (error) {
      triggerPushError(error)
    }

    pushTimerRef.current = setTimeout(() => {
      void send(attempt + 1, abortController)
    }, pushRetryMs)
  }, [maxPushAttempts, pushRetryMs, triggerPushError])

  const createSession = useCallback(async (abortController: AbortController) => {
    const { signal } = abortController
    const cobrowse = cobrowseRef.current

    try {
      deviceRef.current = null
      sessionRef.current = null
      sessionConnectedRef.current = false

      const [region, device] = await Promise.all([
        cobrowse.regions.closest({ signal }),
        cobrowse.devices.get(deviceId, undefined, { signal })
      ])

      deviceRef.current = device

      const session = await cobrowse.sessions.create({
        custom_data: device.custom_data,
        region: region.id,
        agent: 'me'
      }, undefined, { signal })

      sessionRef.current = session

      // Subscribe to session
      session.on('updated', handleSessionUpdated)
      session.on('ended', handleSessionEnded)

      await session.subscribe()
    } catch (error) {
      if (error instanceof Error) {
        onErrorRef.current?.({ id: 'session_error', message: error.message })
      } else {
        onErrorRef.current?.({ id: 'session_error', message: 'The session could not be created.' })
      }
    }
  }, [deviceId, handleSessionUpdated, handleSessionEnded])

  useEffect(() => {
    const abortController = new AbortController()

    const runEffect = async () => {
      await createSession(abortController)

      // This will only happen during local dev due to strict mode. The first unmount will trigger
      // the abort signal, so we won't have a session available to send push notifications to.
      if (abortController.signal.aborted) {
        return
      }

      void sendPush(1, abortController)
    }

    void runEffect()

    return () => {
      abortController.abort()
      stopPush()
    }
  }, [createSession, sendPush, stopPush])

  return (
    <div className={className}>
      {children}
      {renderCancelButton
        ? renderCancelButton(() => { void handleCancel() })
        : (
          <button className={styles.cancelButton} onClick={() => { void handleCancel() }} aria-label={t('Cancel')}>
            <PhoneIcon />
          </button>
        )}
    </div>
  )
}

export default ConnectDevice
