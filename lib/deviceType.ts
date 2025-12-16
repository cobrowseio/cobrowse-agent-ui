import type { DeviceInfo as FullDeviceInfo } from 'cobrowse-agent-sdk'
import parser from 'ua-parser-js'
import i18n from '@/i18n'

export type DeviceInfo = Pick<FullDeviceInfo, 'platform' | 'device'>

const PLATFORM_LABELS: Record<Exclude<DeviceInfo['platform'], 'web'>, string> = {
  ios: 'iOS',
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS'
}

export default function deviceType ({ platform, device }: DeviceInfo): string {
  if (platform === 'web') {
    const ua = parser(device)

    return i18n.t('{{browser}} on {{os}}', {
      browser: ua.browser.name,
      os: ua.os.name
    })
  }

  return i18n.t('{{device}} Device', { device: PLATFORM_LABELS[platform] })
}
