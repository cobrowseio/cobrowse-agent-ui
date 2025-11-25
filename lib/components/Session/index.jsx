import React from 'react'
import clsx from 'clsx'
import deviceType from '../../deviceType.js'
import Stopwatch from '../Stopwatch'
import i18n from '../../i18n'
import { Trans } from 'react-i18next'
import styles from './Session.module.css'

const Session = ({ onClick, className, session, openRecording: openRecordingCallback, children }) => {
  const openRecording = () => {
    if (openRecordingCallback) openRecordingCallback(session)
  }

  return (
    <div
      data-component='Session'
      data-state={session.state}
      data-recorded={session.recorded ? 'true' : 'false'}
      onClick={onClick}
      className={clsx(styles.root, className)}
    >
      <div className={styles.details}>
        <div>
          <Trans i18n={i18n}>
            <span className='device-prefix'>Connected to </span>
            {{ deviceType: deviceType(session.device) }}
          </Trans>
        </div>
        <div className={styles.subdetails}>
          <div className={styles.activated}>
            {i18n.t('{{date, dateRelative}}', {
              date: new Date(session.activated)
            })}
          </div>
          {session.state === 'ended' && session.recorded
            ? (
              <div className={styles.recorded} onClick={openRecording}>
                {i18n.t('Recorded')}
              </div>
              )
            : null}
        </div>
      </div>
      {session.state === 'ended'
        ? (
          <Stopwatch
            className={styles.duration}
            start={new Date(session.activated)}
            end={new Date(session.ended || Date.now())}
          />
          )
        : (
          <div className={styles.active}>{i18n.t('Active')}</div>
          )}
      {children}
    </div>
  )
}

export default Session
