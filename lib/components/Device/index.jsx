import React from 'react'
import i18n from '../../i18n'
import PlatformIcon from '../PlatformIcon'
import deviceType from '../../deviceType.js'
import './Device.css'

const Device = ({ style, device, children }) => {
  const renderLastSeen = () => {
    if (device.online) {
      return <div className='last-seen'>{i18n.t('Online')}</div>
    } else {
      return (
        <div className='last-seen'>
          {i18n.t('Last seen {{date, dateRelative}}', {
            date: new Date(device.last_active)
          })}
        </div>
      )
    }
  }

  return (
    <div
      style={style}
      className={`Device ${device.online ? 'online' : ''} ${
        device.connectable ? 'connectable' : ''
      }`}
    >
      <div className='device-status'>
        <PlatformIcon
          platform={device.device.platform}
          className='platform-icon'
        />
      </div>
      <div className='details'>
        {deviceType(device.device)}
        {renderLastSeen()}
      </div>
      {children}
    </div>
  )
}

export default Device
