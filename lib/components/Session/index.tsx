import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import clsx from 'clsx'
import deviceType from '../../deviceType'
import Stopwatch from '../Stopwatch'
import i18n from '../../i18n'
import { Trans } from 'react-i18next'
import styles from './Session.module.css'

const DEFAULT_TAG = 'div' as const

type PropsOf<T extends ElementType> = ComponentPropsWithoutRef<T>

interface BaseSessionProps {
  session: Session
  className?: string
  children?: ReactNode
}

export type SessionProps<T extends ElementType = typeof DEFAULT_TAG> =
  BaseSessionProps &
  PropsOf<T> & {
    as?: T
  }

const Session = <T extends ElementType = typeof DEFAULT_TAG>({ as, session, onClick, className, children, ...props }: SessionProps<T>) => {
  const Tag = as ?? DEFAULT_TAG

  return (
    <Tag
      onClick={onClick}
      className={clsx(styles.root, className)}
      {...props}
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
    </Tag>
  )
}

export default Session
