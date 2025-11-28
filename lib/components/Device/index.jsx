import React from 'react'
import clsx from 'clsx'
import i18n from '../../i18n'
import PlatformIcon from '../PlatformIcon'
import deviceType from '../../deviceType'
import styles from './Device.module.css'

const LastSeen = ({ device }) => (
  <div className={styles.lastSeen}>
    {device.online
      ? i18n.t('Online')
      : i18n.t('Last seen {{date, dateRelative}}', {
        date: new Date(device.last_active)
      })}
  </div>
)

const Device = ({ style, className, device, children }) => (
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
