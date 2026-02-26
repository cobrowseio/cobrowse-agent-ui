import type { ReactNode } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import { useTranslation } from 'react-i18next'
import styles from './ConnectDevice.module.css'
import PhoneIcon from '@/icons/phone.svg?react'
import useConnectDevice, { MAX_PUSH_ATTEMPTS, PUSH_RETRY_MS } from './useConnectDevice'

export { MAX_PUSH_ATTEMPTS, PUSH_RETRY_MS }

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
  renderCancelButton?: (onCancel: () => void) => ReactNode
  children?: ReactNode
}

const ConnectDevice = ({
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
  const { t } = useTranslation()
  const { cancel } = useConnectDevice({
    deviceId,
    onConnectAttempt,
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
    <div className={className}>
      {children}
      {renderCancelButton
        ? renderCancelButton(handleCancel)
        : (
          <button className={styles.cancelButton} onClick={handleCancel} aria-label={t('Cancel')}>
            <PhoneIcon />
          </button>
        )}
    </div>
  )
}

export default ConnectDevice
