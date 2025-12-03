import type { CSSProperties, ReactNode } from 'react'
import type { Device } from 'cobrowse-agent-sdk'
import deviceType, { type DeviceInfo } from '../../deviceType'
import clsx from 'clsx'
import i18n from '../../i18n'
import PlatformIcon from '../PlatformIcon'
import styles from './Device.module.css'

export type DeviceData = Pick<Device, 'online' | 'connectable' | 'last_active'> & { device: DeviceInfo }

export interface DeviceProps {
  style?: CSSProperties
  className?: string
  device: DeviceData
  children?: ReactNode
}

const LastSeen = ({ device }: { device: DeviceData }) => (
  <div className={styles.lastSeen}>
    {device.online
      ? i18n.t('Online')
      : i18n.t('Last seen {{date, dateRelative}}', {
        date: device.last_active ? new Date(device.last_active) : undefined
      })}
  </div>
)

const Device = ({ style, className, device, children }: DeviceProps) => (
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
