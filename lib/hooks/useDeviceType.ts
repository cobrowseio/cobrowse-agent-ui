import type { DeviceInfo as FullDeviceInfo } from 'cobrowse-agent-sdk'
import parser from 'ua-parser-js'
import { useTranslation } from '@/i18n'

export type DeviceInfo = Pick<FullDeviceInfo, 'platform' | 'device'>

const PLATFORM_LABELS: Record<Exclude<DeviceInfo['platform'], 'web'>, string> = {
  ios: 'iOS',
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS'
}

const useDeviceType = ({ device, platform }: DeviceInfo) => {
  const { t } = useTranslation()

  if (platform === 'web') {
    const ua = parser(device)

    return t('{{browser}} on {{os}}', {
      browser: ua.browser.name,
      os: ua.os.name
    })
  }

  return t('{{device}} Device', { device: PLATFORM_LABELS[platform] })
}

export default useDeviceType
