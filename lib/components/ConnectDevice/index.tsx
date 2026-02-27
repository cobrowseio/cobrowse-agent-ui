import { useState, type ReactNode } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import BaseLoader from '@/components/Loader'
import CancelButton, { type CancelButtonProps } from '@/components/CancelButton'
import useConnectDevice, {
  ERROR_DEVICE_NOT_FOUND,
  ERROR_PUSH_ATTEMPT_LIMIT_REACHED,
  ERROR_PUSH_ERROR,
  ERROR_SESSION_ERROR,
  ERROR_SESSION_NOT_FOUND,
  MAX_PUSH_ATTEMPTS,
  PUSH_RETRY_MS
} from './useConnectDevice'
import styles from './ConnectDevice.module.css'

export {
  ERROR_DEVICE_NOT_FOUND,
  ERROR_PUSH_ATTEMPT_LIMIT_REACHED,
  ERROR_PUSH_ERROR,
  ERROR_SESSION_ERROR,
  ERROR_SESSION_NOT_FOUND,
  MAX_PUSH_ATTEMPTS,
  PUSH_RETRY_MS
}

export interface ConnectDeviceStatusMessageProps {
  attempt: number
  maxPushAttempts?: number
  className?: string
}

export interface ConnectDeviceLoaderProps {
  attempt: number
  maxPushAttempts?: number
}

export interface ConnectDeviceProps {
  deviceId: string,
  onConnectAttempt?: (attempt: number) => void
  onConnected?: (session: Session) => void
  onCancelled?: (session: Session) => void
  onEnded?: (session: Session) => void
  onError?: (error: unknown) => void
  maxPushAttempts?: number,
  pushRetryMs?: number
  className?: string
  children: (attempt: number, cancel: () => void) => ReactNode
}

const StatusMessage = ({ attempt, maxPushAttempts = MAX_PUSH_ATTEMPTS, className }: ConnectDeviceStatusMessageProps) => {
  const { t } = useTranslation()
  let message = t('Contacting device')

  if (attempt >= maxPushAttempts) {
    message = t('Device not responding')
  } else if (attempt >= maxPushAttempts - 1) {
    message = t('Trying once more')
  } else if (attempt > 2) {
    message = t('Retrying connection')
  }

  return (
    <div className={clsx(styles.statusMessage, className)}>
      {message}
    </div>
  )
}

const Loader = ({ attempt, maxPushAttempts = MAX_PUSH_ATTEMPTS }: ConnectDeviceLoaderProps) => {
  if (attempt >= maxPushAttempts) {
    return null
  }

  return <BaseLoader />
}

type ConnectDeviceComponent = ((props: ConnectDeviceProps) => ReactNode) & {
  StatusMessage: (props: ConnectDeviceStatusMessageProps) => ReactNode
  Loader: (props: ConnectDeviceLoaderProps) => ReactNode
  CancelButton: (props: CancelButtonProps) => ReactNode
}

const ConnectDeviceBase = ({
  deviceId,
  onConnectAttempt,
  onConnected,
  onCancelled,
  onEnded,
  onError,
  maxPushAttempts = MAX_PUSH_ATTEMPTS,
  pushRetryMs = PUSH_RETRY_MS,
  className,
  children
}: ConnectDeviceProps) => {
  const [attempt, setAttempt] = useState(1)

  const handleConnectAttempt = (currentAttempt: number) => {
    setAttempt(currentAttempt)
    onConnectAttempt?.(currentAttempt)
  }

  const { cancel } = useConnectDevice({
    deviceId,
    onConnectAttempt: handleConnectAttempt,
    onConnected,
    onCancelled,
    onEnded,
    onError,
    maxPushAttempts,
    pushRetryMs
  })

  const handleCancel = () => {
    void cancel()
  }

  return (
    <div className={clsx(styles.root, className)}>
      {children(attempt, handleCancel)}
    </div>
  )
}

const ConnectDevice = Object.assign(ConnectDeviceBase, {
  StatusMessage,
  Loader,
  CancelButton
}) as ConnectDeviceComponent

export default ConnectDevice
