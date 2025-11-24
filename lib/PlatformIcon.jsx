import React from 'react'
import IconGlobe from '../icons/globe.svg?react'
import IconApple from '../icons/apple.svg?react'
import IconAndroid from '../icons/android.svg?react'
import IconWindows from '../icons/windows.svg?react'
import IconDefault from '../icons/default.svg?react'
import './PlatformIcon.css'

function icon (platform) {
  switch (platform) {
    case 'web': return IconGlobe
    case 'ios': return IconApple
    case 'macos': return IconApple
    case 'android': return IconAndroid
    case 'windows': return IconWindows
    default: return IconDefault
  }
}

export default function PlatformIcon ({ platform, className, ...props }) {
  const Icon = icon(platform)
  return <Icon fill='currentColor' {...props} className={`PlatformIcon ${className || ''}`} />
}
