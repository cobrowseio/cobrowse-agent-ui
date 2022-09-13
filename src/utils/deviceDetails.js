import parser from 'ua-parser-js';

const PLATFORM_WEB = 'web';
const PLATFORMS = {
  ios: 'iOS',
  android: 'Android',
  windows: 'Windows',
  macos: 'macOS',
};

const nonWebDeviceDetails = (platform, name) => ({
  type: platform,
  isWeb: false,
  name: name || platform,
});

const webDeviceDetails = (userAgent) => {
  const ua = parser(userAgent);

  return {
    type: PLATFORM_WEB,
    isWeb: true,
    browser: ua.browser.name,
    os: ua.os.name,
  };
};

export function deviceDetails(platform, userAgent) {
  if (platform === PLATFORM_WEB) {
    return webDeviceDetails(userAgent);
  }

  return nonWebDeviceDetails(platform, PLATFORMS[platform]);
}
