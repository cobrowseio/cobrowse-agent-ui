import { useTranslation } from 'react-i18next'
import Device, { type DeviceData } from '@/components/Device'
import SmartConnectButton from '@/components/SmartConnectButton'
import Loader from '@/components/Loader'
import type { BasePanelProps } from './BasePanel'

interface DevicesPanelProps extends BasePanelProps {
  devices: DeviceData[] | null
  smartConnectButtonClassName?: string
}

const DevicesPanel = ({ devices, smartConnectButtonClassName, loader }: DevicesPanelProps) => {
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
      {devices.map((device, index) => (
        <Device key={index} device={device}>
          <SmartConnectButton
            device={device}
            className={smartConnectButtonClassName}
          >
            {t('Connect')}
          </SmartConnectButton>
        </Device>
      ))}
    </>
  )
}

export default DevicesPanel
