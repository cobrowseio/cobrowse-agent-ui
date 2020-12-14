import React from 'react';
import parser from 'ua-parser-js';
import moment from 'moment';
import SmartConnectButton from './SmartConnectButton';
import IconWeb from './icons/web.svg';
import IconApple from './icons/apple.svg';
import IconAndroid from './icons/android.svg';
import IconWindows from './icons/windows.svg';
import IconDefault from './icons/default.svg';
import './Device.css'

export default function Device(props) {

    function deviceType({ platform, device }) {
        switch (platform) {
            case 'web': {
                const ua = parser(device);
                return `${ua.browser.name} on ${ua.os.name}`;
            }
            case 'ios': return 'iOS Device';
            case 'android': return 'Android Device';
            case 'windows': return 'Windows Device';
            case 'macos': return 'Mac OS Device';
            default: return platform;
        }
    }

    function deviceIcon(platform) {
        switch (platform) {
            case 'web': return IconWeb
            case 'ios': return IconApple;
            case 'macos': return IconApple;
            case 'android': return IconAndroid;
            case 'windows': return IconWindows;
            default: return IconDefault;
        }
    }

    function renderLastSeen() {
        if (props.device.online) return <div className={'last-seen'}>Online</div>;
        else return <div className={'last-seen'}>Last seen {moment(props.device.last_active).fromNow()}</div>
    }

    const Icon = deviceIcon(props.device.device.platform);

    return (
        <div className={`Device ${props.device.online?'online':''} ${props.device.connectable?'connectable':''}`}>
            <Icon className={'platform-icon'} />
            <div className={'details'}>
                { deviceType(props.device.device) }
                { renderLastSeen() }
            </div>
            <SmartConnectButton device={props.device} onClick={props.connect} />
        </div>
  );
}
