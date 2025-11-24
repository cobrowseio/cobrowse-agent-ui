import React from 'react'
import deviceType from './deviceType.js'
import Stopwatch from './Stopwatch.jsx'
import i18n from './i18n'
import { Trans } from 'react-i18next'
import './Session.css'

export default function Session ({ style, onClick, className, session, openRecording: openRecordingCallback, children }) {
  function openRecording () {
    if (openRecordingCallback) openRecordingCallback(session)
  }

  return (
    <div
      style={style}
      onClick={onClick}
      className={`Session ${className || ''}`}
    >
      <div className='details'>
        <div>
          <Trans i18n={i18n}>
            <span className='device-prefix'>Connected to </span>
            {{ deviceType: deviceType(session.device) }}
          </Trans>
        </div>
        <div className='subdetails'>
          <div className='activated'>
            {i18n.t('{{date, dateRelative}}', {
              date: new Date(session.activated)
            })}
          </div>
          {session.state === 'ended' && session.recorded
            ? (
              <div className='recorded' onClick={openRecording}>
                {i18n.t('Recorded')}
              </div>
              )
            : null}
        </div>
      </div>
      {session.state === 'ended'
        ? (
          <Stopwatch
            className='duration'
            start={new Date(session.activated)}
            end={new Date(session.ended || Date.now())}
          />
          )
        : (
          <div className='active'>{i18n.t('Active')}</div>
          )}
      {children}
    </div>
  )
}
