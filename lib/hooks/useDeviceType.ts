import type { DeviceInfo as FullDeviceInfo } from 'cobrowse-agent-sdk'
import type { TFunction } from 'i18next'
import parser from 'ua-parser-js'
import { useTranslation } from '@/i18n'

export type DeviceInfo = Pick<FullDeviceInfo, 'platform' | 'device'>

const PLATFORM_LABELS: Record<Exclude<DeviceInfo['platform'], 'web'>, string> = {
  ios: 'iOS',
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS'
}

const deviceType = (t: TFunction, { platform, device }: DeviceInfo) => {
  if (platform === 'web') {
    const ua = parser(device)

    return t('{{browser}} on {{os}}', {
      browser: ua.browser.name,
      os: ua.os.name
    })
  }

  return t('{{device}} Device', { device: PLATFORM_LABELS[platform] })
}

const useDeviceType = (deviceInfo: DeviceInfo) => {
  const { t } = useTranslation()

  return deviceType(t, deviceInfo)
}

export default useDeviceType
