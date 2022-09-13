import React from 'react';
import PlatformIcon from './PlatformIcon';
import deviceType from './utils/deviceType';
import './Device.css';
import LastSeen from './LastSeen';

const Device = ({ device, style, details, children }) => (
  <div
    style={style}
    className={`Device ${device.online ? 'online' : ''} ${
      device.connectable ? 'connectable' : ''
    }`}
  >
    <PlatformIcon
      platform={device?.device.platform}
      className='platform-icon'
    />
    <div className='details'>
      {details || (
        <>
          {deviceType(device?.device.platform, device?.device.device)}
          <LastSeen online={device?.online} lastActive={device?.last_active} />
        </>
      )}
    </div>
    {children}
  </div>
);

export default Device;
