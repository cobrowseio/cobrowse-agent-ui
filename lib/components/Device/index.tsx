import type { CSSProperties, ReactNode } from 'react'
import type { Device as FullDevice } from 'cobrowse-agent-sdk'
import useDeviceType, { type DeviceInfo } from '@/hooks/useDeviceType'
import clsx from 'clsx'
import PlatformIcon from '@/components/PlatformIcon'
import { useTranslation } from '@/i18n'
import styles from './Device.module.css'

export type DeviceData = Pick<FullDevice, 'id' | 'online' | 'connectable' | 'last_active'> & { device: DeviceInfo }

export interface DeviceProps<T extends DeviceData = DeviceData> {
  style?: CSSProperties
  className?: string
  device: T
  children?: ReactNode
}

const LastSeen = ({ device }: { device: DeviceData }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.lastSeen}>
      {device.online
        ? t('Online')
        : t('Last seen {{date, dateRelative}}', {
          date: new Date(device.last_active)
        })}
    </div>
  )
}

const Device = <T extends DeviceData = DeviceData>({ style, className, device, children }: DeviceProps<T>) => {
  const deviceType = useDeviceType(device.device)

  return (
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
        {deviceType}
        <LastSeen device={device} />
      </div>
      {children}
    </div>
  )
}

export default Device
