import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './SmartConnectButton.module.css'
import type { DeviceData } from '@/components/Device'
import { useTranslation } from '@/i18n'

export interface SmartConnectButtonProps<T extends DeviceData = DeviceData> extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
  device: T
  onClick?: (device: T) => void
  children?: ReactNode
}

const SmartConnectButton = <T extends DeviceData = DeviceData>({ device, onClick: onClickCallback, className, children, ...props }: SmartConnectButtonProps<T>) => {
  const { t } = useTranslation()

  const handleClick = () => {
    if (device.connectable) onClickCallback?.(device)
  }

  const isDisabled = !device.connectable

  return (
    <button
      type='button'
      disabled={isDisabled}
      className={clsx(
        styles.root,
        device.online && styles.online,
        device.connectable && styles.connectable,
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children ?? t('Connect')}
    </button>
  )
}

export default SmartConnectButton
