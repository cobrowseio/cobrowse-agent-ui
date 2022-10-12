import React from 'react'
import IconWeb from '../icons/web.svg'
import IconApple from '../icons/apple.svg'
import IconAndroid from '../icons/android.svg'
import IconWindows from '../icons/windows.svg'
import IconDefault from '../icons/default.svg'
import './PlatformIcon.css'

function icon (platform) {
  switch (platform) {
    case 'web': return IconWeb
    case 'ios': return IconApple
    case 'macos': return IconApple
    case 'android': return IconAndroid
    case 'windows': return IconWindows
    default: return IconDefault
  }
}

export default function PlatformIcon (props) {
  const Icon = icon(props.platform)
  return <Icon fill='currentColor' {...props} className={`PlatformIcon ${props.className || ''}`} />
}
