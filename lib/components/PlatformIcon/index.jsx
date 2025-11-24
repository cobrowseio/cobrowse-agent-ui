import React from 'react'
import clsx from 'clsx'
import IconGlobe from '../../icons/globe.svg?react'
import IconApple from '../../icons/apple.svg?react'
import IconAndroid from '../../icons/android.svg?react'
import IconWindows from '../../icons/windows.svg?react'
import IconDefault from '../../icons/default.svg?react'
import styles from './PlatformIcon.module.css'

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
  return (
    <Icon
      fill='currentColor'
      data-component='PlatformIcon'
      data-platform={platform}
      {...props}
      className={clsx(styles.root, className)}
    />
  )
}

export default PlatformIcon
