import type { CSSProperties, ReactNode } from 'react'
import type { Device as FullDevice } from 'cobrowse-agent-sdk'
import deviceType, { type DeviceInfo } from '@/deviceType'
import clsx from 'clsx'
import i18n from '@/i18n'
import PlatformIcon from '@/components/PlatformIcon'
import styles from './Device.module.css'

export type DeviceData = Pick<FullDevice, 'id' | 'online' | 'connectable' | 'last_active'> & { device: DeviceInfo }

export interface DeviceProps<T extends DeviceData = DeviceData> {
  style?: CSSProperties
  className?: string
  device: T
  children?: ReactNode
}

const LastSeen = ({ device }: { device: DeviceData }) => (
  <div className={styles.lastSeen}>
    {device.online
      ? i18n.t('Online')
      : i18n.t('Last seen {{date, dateRelative}}', {
        date: new Date(device.last_active)
      })}
  </div>
)

const Device = <T extends DeviceData = DeviceData>({ style, className, device, children }: DeviceProps<T>) => (
  <div
    style={style}
    className={clsx(
      styles.root,
      device.online && styles.online,
      device.connectable && styles.connectable,
      className
    )}
  >
    <div className={styles.deviceStatus}>
      <PlatformIcon
        platform={device.device.platform}
        className={styles.platformIcon}
      />
    </div>
    <div className={styles.details}>
      {deviceType(device.device)}
      <LastSeen device={device} />
    </div>
    {children}
  </div>
)

export default Device
