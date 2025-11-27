import React from 'react'
import './SmartConnectButton.css'

const SmartConnectButton = ({ device, onClick: onClickCallback, label }) => {
  const onClick = () => {
    if (device.connectable && onClickCallback) onClickCallback(device)
  }

  return (
    <div
      className={`SmartConnectButton ${device.online ? 'online' : ''} ${device.connectable ? 'connectable' : ''}`}
      onClick={onClick}
    >{label || 'Connect'}
    </div>
  )
}

export default SmartConnectButton
