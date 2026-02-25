import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import BaseConnectDevice, { MAX_PUSH_ATTEMPTS, type ConnectDeviceProps as BaseConnectDeviceProps } from '@/components/ConnectDevice'
import Loader from '@/components/Loader'
import styles from './ConnectDevice.module.css'

export interface ConnectDeviceProps extends BaseConnectDeviceProps {
  statusMessageClassName?: string
}

const StatusMessage = ({ attempts }: { attempts: number }) => {
  const { t } = useTranslation()

  if (attempts >= MAX_PUSH_ATTEMPTS) {
    return t('Device not responding')
  }

  if (attempts >= MAX_PUSH_ATTEMPTS - 1) {
    return t('Trying once more')
  }

  if (attempts > 2) {
    return t('Retrying connection')
  }

  return t('Contacting device')
}

const ConnectDevice = ({
  className,
  statusMessageClassName,
  ...props
}: ConnectDeviceProps) => {
  const [attempts, setAttempts] = useState(1)

  const handleConnectAttempt = (attempts: number) => {
    setAttempts(attempts)
  }

  return (
    <BaseConnectDevice
      onConnectAttempt={handleConnectAttempt}
      className={clsx(styles.root, className)}
      {...props}
    >
      {attempts < MAX_PUSH_ATTEMPTS && (
        <Loader />
      )}
      <div className={clsx(styles.statusMessage, statusMessageClassName)}>
        <StatusMessage attempts={attempts} />
      </div>
    </BaseConnectDevice>
  )
}

export default ConnectDevice
