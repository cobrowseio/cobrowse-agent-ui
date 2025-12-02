import type { MouseEventHandler, ReactNode } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import clsx from 'clsx'
import deviceType from '../../deviceType'
import Stopwatch from '../Stopwatch'
import i18n from '../../i18n'
import { Trans } from 'react-i18next'
import styles from './Session.module.css'

export interface SessionProps {
  session: Session
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  children?: ReactNode
}

const Session = ({ session, onClick, className, children }: SessionProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(styles.root, className)}
    >
      <span className={styles.details}>
        <span>
          <Trans i18n={i18n}>
            <span className='device-prefix'>Connected to </span>
            {{ deviceType: deviceType(session.device) }}
          </Trans>
        </span>
        <span className={styles.subdetails}>
          <span className={styles.activated}>
            {i18n.t('{{date, dateRelative}}', {
              date: new Date(session.activated)
            })}
          </span>
          {session.state === 'ended' && session.recorded
            ? (
              <span className={styles.recorded}>
                {i18n.t('Recorded')}
              </span>
              )
            : null}
        </span>
      </span>
      {session.state === 'ended'
        ? (
          <Stopwatch
            className={styles.duration}
            start={new Date(session.activated)}
            end={session.ended ? new Date(session.ended) : undefined}
          />
          )
        : (
          <span className={styles.active}>{i18n.t('Active')}</span>
          )}
      {children}
    </button>
  )
}

export default Session
