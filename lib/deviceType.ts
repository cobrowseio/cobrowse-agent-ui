import type { DeviceInfo as FullDeviceInfo } from 'cobrowse-agent-sdk'
import type { TFunction } from 'i18next'
import parser from 'ua-parser-js'

export type DeviceInfo = Pick<FullDeviceInfo, 'platform' | 'device'>

const PLATFORM_LABELS: Record<Exclude<DeviceInfo['platform'], 'web'>, string> = {
  ios: 'iOS',
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS'
}

export default function deviceType (t: TFunction, { platform, device }: DeviceInfo): string {
  if (platform === 'web') {
    const ua = parser(device)

    return t('{{browser}} on {{os}}', {
      browser: ua.browser.name,
      os: ua.os.name
    })
  }

  return t('{{device}} Device', { device: PLATFORM_LABELS[platform] })
}
