import React from 'react'
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
      data-component='SmartConnectButton'
      data-online={device.online ? 'true' : 'false'}
      data-connectable={device.connectable ? 'true' : 'false'}
      style={style}
      className={[
        styles.root,
        device.online ? styles.online : '',
        device.connectable ? styles.connectable : '',
        className
      ].filter(Boolean).join(' ')}
      onClick={onClick}
    >{label || 'Connect'}
    </div>
  )
}

export default SmartConnectButton
