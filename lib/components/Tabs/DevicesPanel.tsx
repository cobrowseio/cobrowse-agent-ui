import { useTranslation } from 'react-i18next'
import Device, { type DeviceData } from '@/components/Device'
import SmartConnectButton from '@/components/SmartConnectButton'
import Loader from '@/components/Loader'
import type { BasePanelProps } from './BasePanel'

export interface DevicesPanelProps<T extends DeviceData = DeviceData> extends BasePanelProps {
  devices: T[] | null
  onConnectClick?: (device: T) => void
  smartConnectButtonClassName?: string
}

const DevicesPanel = <T extends DeviceData = DeviceData>({ devices, onConnectClick, smartConnectButtonClassName, loader }: DevicesPanelProps<T>) => {
  const { t } = useTranslation()

  if (devices === null) {
    return (
      <Loader>{loader}</Loader>
    )
  }

  if (devices.length === 0) {
    return <p>{t('No devices')}</p>
  }

  return (
    <>
      {devices.map((device) => (
        <Device key={device.id} device={device}>
          <SmartConnectButton
            device={device}
            className={smartConnectButtonClassName}
            onClick={onConnectClick}
          >
            {t('Connect')}
          </SmartConnectButton>
        </Device>
      ))}
    </>
  )
}

export default DevicesPanel
