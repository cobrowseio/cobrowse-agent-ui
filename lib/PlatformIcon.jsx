import React from 'react'
import IconGlobe from './icons/globe.svg?react'
import IconApple from './icons/apple.svg?react'
import IconAndroid from './icons/android.svg?react'
import IconWindows from './icons/windows.svg?react'
import IconDefault from './icons/default.svg?react'
import './PlatformIcon.css'

const ICONS = {
  web: IconGlobe,
  ios: IconApple,
  macos: IconApple,
  android: IconAndroid,
  windows: IconWindows
}

const icon = (platform) => {
  return ICONS[platform] || IconDefault
}

const PlatformIcon = ({ platform, className, ...props }) => {
  const Icon = icon(platform)
  return <Icon fill='currentColor' {...props} className={`PlatformIcon ${className || ''}`} />
}

export default PlatformIcon
