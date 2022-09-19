import parser from 'ua-parser-js';
import i18n from './i18n';

export default function deviceType({ platform, device }) {
  const translateDevice = (device) => i18n.t('{{device}} Device', { device });

  switch (platform) {
    case 'web': {
      const ua = parser(device);
      return i18n.t('{{browser}} on {{os}}', {
        browser: ua.browser.name,
        os: ua.os.name,
      });
    }
    case 'ios':
      return translateDevice('iOS');
    case 'android':
      return translateDevice('Android');
    case 'windows':
      return translateDevice('Windows');
    case 'macos':
      return translateDevice('Mac OS');
    default:
      return platform;
  }
}
