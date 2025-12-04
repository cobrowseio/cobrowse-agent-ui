import clsx from 'clsx'
import IconGlobe from '@/icons/globe.svg?react'
import IconApple from '@/icons/apple.svg?react'
import IconAndroid from '@/icons/android.svg?react'
import IconWindows from '@/icons/windows.svg?react'
import IconDefault from '@/icons/default.svg?react'
import styles from './PlatformIcon.module.css'
import type { ComponentType, SVGProps } from 'react'
import type { Platform } from '@/deviceType'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const ICONS: Record<Platform, IconComponent> = {
  web: IconGlobe,
  ios: IconApple,
  macos: IconApple,
  android: IconAndroid,
  windows: IconWindows
}

export interface PlatformIconProps extends SVGProps<SVGSVGElement> {
  platform: Platform
  className?: string
}

const PlatformIcon = ({ platform, className, ...props }: PlatformIconProps) => {
  const Icon = ICONS[platform] ?? IconDefault

  return (
    <Icon
      fill='currentColor'
      {...props}
      className={clsx(styles.root, className)}
    />
  )
}

export default PlatformIcon
