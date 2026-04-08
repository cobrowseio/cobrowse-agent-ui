import clsx from 'clsx'
import parser from 'ua-parser-js'
import IconGlobe from '@/icons/globe.svg?react'
import IconApple from '@/icons/apple.svg?react'
import IconAndroid from '@/icons/android.svg?react'
import IconBrowserChrome from '@/icons/browser-chrome.svg?react'
import IconBrowserEdge from '@/icons/browser-edge.svg?react'
import IconBrowserFirefox from '@/icons/browser-firefox.svg?react'
import IconBrowserOpera from '@/icons/browser-opera.svg?react'
import IconBrowserSafari from '@/icons/browser-safari.svg?react'
import IconBrowserSamsungInternet from '@/icons/browser-samsung-internet.svg?react'
import IconWindows from '@/icons/windows.svg?react'
import type { DeviceInfo } from '@/hooks/useDeviceType'
import styles from './PlatformIcon.module.css'
import type { ComponentType, SVGProps } from 'react'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const PLATFORM_ICONS: Record<Exclude<DeviceInfo['platform'], 'web'>, IconComponent> = {
  ios: IconApple,
  macos: IconApple,
  android: IconAndroid,
  windows: IconWindows
}

const BROWSER_ICONS: Record<string, IconComponent> = {
  chrome: IconBrowserChrome,
  edge: IconBrowserEdge,
  firefox: IconBrowserFirefox,
  opera: IconBrowserOpera,
  safari: IconBrowserSafari,
  'samsung-internet': IconBrowserSamsungInternet,
  globe: IconGlobe
}

const getBrowserKey = (userAgent: string) => parser(userAgent).browser.name
  ?.toLowerCase()
  .replace(/ /g, '-')
  .replace('mobile-', '')

export interface PlatformIconProps extends SVGProps<SVGSVGElement> {
  device: DeviceInfo
  className?: string
}

const PlatformIcon = ({ device, className, ...props }: PlatformIconProps) => {
  const Icon = device.platform === 'web'
    ? BROWSER_ICONS[getBrowserKey(device.device) ?? 'globe']
    : PLATFORM_ICONS[device.platform]

  return (
    <Icon
      {...props}
      className={clsx(styles.root, className)}
    />
  )
}

export default PlatformIcon
