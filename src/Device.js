import React from 'react'
import i18n from './i18n'
import PlatformIcon from './PlatformIcon.js'
import deviceType from './deviceType.js'
import './Device.css'

export default function Device (props) {
  function renderLastSeen () {
    if (props.device.online) { return <div className='last-seen'>{i18n.t('Online')}</div> } else {
      return (
        <div className='last-seen'>
          {i18n.t('Last seen {{date, dateRelative}}', {
            date: props.device.last_active
          })}
        </div>
      )
    }
  }

  return (
    <div
      style={props.style}
      className={`Device ${props.device.online ? 'online' : ''} ${
        props.device.connectable ? 'connectable' : ''
      }`}
    >
      <PlatformIcon
        platform={props.device.device.platform}
        className='platform-icon'
      />
      <div className='details'>
        {deviceType(props.device.device)}
        {renderLastSeen()}
      </div>
      {props.children}
    </div>
  )
}
