import React from 'react';
import deviceType from './utils/deviceType';
import Stopwatch from './Stopwatch.js';
import './Session.css';
import { dateFromNow } from './utils';

export default function Session(props) {
  function openRecording() {
    if (props.openRecording) props.openRecording(props.session);
  }

  return (
    <div
      style={props.style}
      onClick={props.onClick}
      className={`Session ${props.className || ''}`}
    >
      <div className='details'>
        <div>
          <span className='device-prefix'>
            {props.devicePrefix || 'Connected to'}{' '}
          </span>
          {props.deviceType ||
            deviceType(
              props.session.device?.platform,
              props.session.device?.device
            )}
        </div>
        <div className='subdetails'>
          <div className='activated'>
            {props.activated || dateFromNow(props.session.activated)}
          </div>
          {props.session.state === 'ended' && props.session.recorded ? (
            <div className='recorded' onClick={openRecording}>
              {props.recorded || 'Recorded'}
            </div>
          ) : null}
        </div>
      </div>
      {props.session.state === 'ended' ? (
        <Stopwatch
          className='duration'
          start={props.session.activated}
          end={props.session.ended || new Date()}
        />
      ) : (
        <div className='active'>{props.active || 'Active'}</div>
      )}
      {props.children}
    </div>
  );
}
