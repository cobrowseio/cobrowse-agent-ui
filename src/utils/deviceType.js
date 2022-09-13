import { deviceDetails } from './deviceDetails';

export default function deviceType(platform, userAgent) {
  const details = deviceDetails(platform, userAgent);

  return details.isWeb
    ? `${details.browser} on ${details.os}`
    : `${details.name} Device`;
}
