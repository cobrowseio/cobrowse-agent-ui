import React from 'react'
import deviceType from './deviceType.js'
import Stopwatch from './Stopwatch.js'
import i18n from './i18n'
import { Trans } from 'react-i18next'
import './Session.css'

export default function Session (props) {
  function openRecording () {
    if (props.openRecording) props.openRecording(props.session)
  }

  return (
    <div
      style={props.style}
      onClick={props.onClick}
      className={`Session ${props.className || ''}`}
    >
      <div className='details'>
        <div>
          <Trans i18n={i18n}>
            <span className='device-prefix'>Connected to </span>
            {{ deviceType: deviceType(props.session.device) }}
          </Trans>
        </div>
        <div className='subdetails'>
          <div className='activated'>
            {i18n.t('{{date, dateRelative}}', {
              date: props.session.activated
            })}
          </div>
          {props.session.state === 'ended' && props.session.recorded
            ? (
              <div className='recorded' onClick={openRecording}>
                {i18n.t('Recorded')}
              </div>
              )
            : null}
        </div>
      </div>
      {props.session.state === 'ended'
        ? (
          <Stopwatch
            className='duration'
            start={props.session.activated}
            end={props.session.ended || new Date()}
          />
          )
        : (
          <div className='active'>{i18n.t('Active')}</div>
          )}
      {props.children}
    </div>
  )
}
