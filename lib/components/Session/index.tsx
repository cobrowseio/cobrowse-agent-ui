import type { ElementType, ComponentPropsWithoutRef, ReactNode, MouseEventHandler } from 'react'
import type { Session as FullSession } from 'cobrowse-agent-sdk'
import deviceType, { type DeviceInfo } from '@/deviceType'
import clsx from 'clsx'
import Stopwatch from '@/components/Stopwatch'
import i18n from '@/i18n'
import { Trans } from 'react-i18next'
import styles from './Session.module.css'

const DEFAULT_TAG = 'div' as const

type PropsOf<T extends ElementType> = ComponentPropsWithoutRef<T>

export type SessionData = Pick<FullSession, 'id' | 'state' | 'recorded' | 'activated' | 'ended'> & { device: DeviceInfo }

interface BaseSessionProps {
  session: SessionData
  className?: string
  children?: ReactNode
}

export type SessionProps<T extends ElementType = typeof DEFAULT_TAG> =
  BaseSessionProps &
  Omit<PropsOf<T>, 'onClick'> & {
    as?: T
    onClick?: MouseEventHandler
  }

const Session = <T extends ElementType = typeof DEFAULT_TAG>({ as, session, onClick, className, children, ...props }: SessionProps<T>) => {
  const Tag = as ?? DEFAULT_TAG
  const isClickable = typeof onClick === 'function'

  return (
    <Tag
      onClick={isClickable ? onClick : undefined}
      className={clsx(styles.root, isClickable && styles.clickable, className)}
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
