import React from 'react';
import moment from 'moment';
import PlatformIcon from './PlatformIcon.js';
import deviceType from './deviceType.js';
import './Device.css'

export default function Device(props) {

    function renderLastSeen() {
        if (props.device.online) return <div className={'last-seen'}>Online</div>;
        else return <div className={'last-seen'}>Last seen {moment(props.device.last_active).fromNow()}</div>
    }

    return (
        <div style={props.style} className={`Device ${props.device.online?'online':''} ${props.device.connectable?'connectable':''}`}>
            <PlatformIcon platform={props.device.device.platform} className={'platform-icon'} />
            <div className={'details'}>
                { deviceType(props.device.device) }
                { renderLastSeen() }
            </div>
            { props.children }
        </div>
    );
}
