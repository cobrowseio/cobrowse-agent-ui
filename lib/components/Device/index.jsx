import React from 'react'
import i18n from '../../i18n'
import PlatformIcon from '../PlatformIcon'
import deviceType from '../../deviceType.js'
import './Device.css'

const LastSeen = ({ device }) => (
  <div className='last-seen'>
    {device.online
      ? i18n.t('Online')
      : i18n.t('Last seen {{date, dateRelative}}', {
        date: new Date(device.last_active)
      })}
  </div>
)

const Device = ({ style, device, children }) => (
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
      <LastSeen device={device} />
    </div>
    {children}
  </div>
)

export default Device
