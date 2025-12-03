import type { DeviceInfo as FullDeviceInfo } from 'cobrowse-agent-sdk'
import parser from 'ua-parser-js'
import i18n from './i18n'

export type Platform =
  | 'web'
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | (string & {})

export type DeviceInfo = Pick<FullDeviceInfo, 'platform' | 'device'> & { platform: Platform }

export default function deviceType ({ platform, device }: DeviceInfo): string {
  const translateDevice = (label: string) => i18n.t('{{device}} Device', { device: label })

  switch (platform) {
    case 'web': {
      const ua = parser(device)
      return i18n.t('{{browser}} on {{os}}', {
        browser: ua.browser.name,
        os: ua.os.name
      })
    }
    case 'ios':
      return translateDevice('iOS')
    case 'android':
      return translateDevice('Android')
    case 'windows':
      return translateDevice('Windows')
    case 'macos':
      return translateDevice('macOS')
    default:
      return platform
  }
}
