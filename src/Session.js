import React from 'react';
import UserIcon from './UserIcon.js';
import deviceType from './deviceType.js';
import PlatformIcon from './PlatformIcon.js';
import Stopwatch from './Stopwatch.js';
import moment from 'moment';
import './Session.css'

export default function Session(props) {

    return (
        <div style={props.style} className={`Session ${props.className||''}`}>
            <UserIcon user={props.session.agent} />
            <div className={'details'}>
                <div>Connected to <PlatformIcon platform={props.session.device.platform}/> <b>{deviceType(props.session.device)}</b></div>
                <div className={'activated'}>{ moment(props.session.activated).fromNow() }</div>
            </div>
            { props.session.state === 'ended' && props.session.recorded ? <div className={'recorded'}>Recorded</div> : null }
            <Stopwatch className={'duration'} start={props.session.activated} end={props.session.ended} />
            { props.children }
        </div>
    );
}
