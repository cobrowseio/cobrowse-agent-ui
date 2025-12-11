import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import i18n from '@/i18n'
import clsx from 'clsx'
import styles from './SmartConnectButton.module.css'
import type { DeviceData } from '@/components/Device'

export interface SmartConnectButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
  device: DeviceData
  onClick?: (device: DeviceData) => void
  children?: ReactNode
}

const SmartConnectButton = ({ device, onClick: onClickCallback, className, children, ...props }: SmartConnectButtonProps) => {
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
      {children ?? i18n.t('Connect')}
    </button>
  )
}

export default SmartConnectButton
