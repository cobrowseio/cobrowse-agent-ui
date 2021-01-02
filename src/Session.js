import React from 'react';
import deviceType from './deviceType.js';
import Stopwatch from './Stopwatch.js';
import moment from 'moment';
import './Session.css'

export default function Session(props) {

    function openRecording() {
        if (props.openRecording) props.openRecording(props.session);
    }

    return (
        <div style={props.style} onClick={props.onClick} className={`Session ${props.className||''}`}>
            <div className={'details'}>
                <div>Connected to {deviceType(props.session.device)}</div>
                <div className={'subdetails'}>
                    <div className={'activated'}>{ moment(props.session.activated).fromNow() }</div>
                    { props.session.state === 'ended' && props.session.recorded ? <div className={'recorded'} onClick={openRecording}>Recorded</div> : null }
                </div>
            </div>
            { props.session.state === 'ended' ?
                <Stopwatch className={'duration'} start={props.session.activated} end={props.session.ended || new Date()} /> :
                <div className={'active'}>Active</div>
            }
            { props.children }
        </div>
    );
}
