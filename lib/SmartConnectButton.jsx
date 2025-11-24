import React from 'react'
import './SmartConnectButton.css'

export default function SmartConnectButton ({ device, onClick: onClickCallback, label }) {
  function onClick () {
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
