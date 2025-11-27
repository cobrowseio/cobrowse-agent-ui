import React from 'react'
import clsx from 'clsx'
import styles from './SmartConnectButton.module.css'

const SmartConnectButton = ({ device, onClick: onClickCallback, label, className, style }) => {
  const onClick = () => {
    if (device.connectable && onClickCallback) onClickCallback(device)
  }

  return (
    <div
      role='button'
      tabIndex={device.connectable ? 0 : -1}
      aria-disabled={!device.connectable}
      style={style}
      className={clsx(
        styles.root,
        device.online && styles.online,
        device.connectable && styles.connectable,
        className
      )}
      onClick={onClick}
    >{label || 'Connect'}
    </div>
  )
}

export default SmartConnectButton
