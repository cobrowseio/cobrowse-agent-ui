import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Session as FullSession } from 'cobrowse-agent-sdk'
import useDeviceType, { type DeviceInfo } from '@/hooks/useDeviceType'
import clsx from 'clsx'
import Stopwatch from '@/components/Stopwatch'
import PlatformIcon from '@/components/PlatformIcon'
import ClockIcon from '@/icons/clock.svg?react'
import { useTranslation } from '@/i18n'
import styles from './Session.module.css'

const DEFAULT_TAG = 'div' as const

type PropsOf<T extends ElementType> = ComponentPropsWithoutRef<T>

export type SessionData = Pick<FullSession, 'id' | 'state' | 'recorded' | 'activated' | 'ended' | 'getRecording' | 'recording'> & { device: DeviceInfo }

interface BaseSessionProps<TSession extends SessionData = SessionData> {
  session: TSession
  className?: string
  children?: ReactNode
}

export type SessionProps<TSession extends SessionData = SessionData, TElement extends ElementType = typeof DEFAULT_TAG> =
  BaseSessionProps<TSession> &
  Omit<PropsOf<TElement>, 'onClick'> & {
    as?: TElement
    onClick?: (session: TSession) => void
  }

const Session = <TSession extends SessionData = SessionData, TElement extends ElementType = typeof DEFAULT_TAG>({
  as,
  session,
  onClick,
  className,
  children,
  ...props
}: SessionProps<TSession, TElement>) => {
  const { t } = useTranslation()
  const deviceType = useDeviceType(session.device)
  const isClickable = typeof onClick === 'function'
  const Tag = as ?? isClickable ? 'button' : DEFAULT_TAG

  return (
    <Tag
      onClick={isClickable ? () => { onClick(session) } : undefined}
      className={clsx(styles.root, isClickable && styles.clickable, className)}
      {...props}
    >
      <span className={styles.details}>
        <span className={styles.deviceType}>
          <PlatformIcon device={session.device} />
          {deviceType}
        </span>
        <span className={styles.subdetails}>
          {session.state === 'ended'
            ? (
              <span className={styles.activated}>
                {t('{{date, dateRelative}}', {
                  date: session.activated
                })}
                <span className={styles.duration}>
                  <ClockIcon />
                  <Stopwatch
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime value can be undefined despite the type. Fixed on full agent-sdk TS migration
                    start={session.activated ? new Date(session.activated) : new Date()}
                    end={session.ended ? new Date(session.ended) : undefined}
                  />
                </span>
              </span>
            )
            : (
              <span className={styles.active}>
                <span className={styles.activeIndicator}></span>
                {t('Active')}
              </span>
            )
          }
        </span>
      </span>
      {children}
    </Tag>
  )
}

export default Session
