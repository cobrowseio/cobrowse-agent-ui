import Session, { type SessionData } from '@/components/Session'
import Loader from '@/components/Loader'
import { useTranslation } from '@/i18n'
import type { BasePanelProps } from './BasePanel'
import Button, { type ButtonProps } from '@/components/Button'

export interface SessionsPanelProps<T extends SessionData = SessionData> extends BasePanelProps {
  sessions: T[] | null
  onSessionClick?: (session: T) => void
  joinSessionButtonClassName?: string
}

const SessionAction = ({ session, onClick }: { session: SessionData, onClick: ButtonProps['onClick'] }) => {
  const { t } = useTranslation()

  return (
    <Button onClick={onClick}>
      {(session.state === 'ended' && session.recorded) && (
        <>
          {t('Recorded')}
        </>
      )}
      {(session.state === 'ended' && !session.recorded) && (
        <>
          {t('Expired')}
        </>
      )}
      {session.state === 'active' && t('Join Session')}
    </Button>
  )
}

const SessionsPanel = <T extends SessionData = SessionData>({ sessions, onSessionClick, joinSessionButtonClassName, loader }: SessionsPanelProps<T>) => {
  const { t } = useTranslation()

  if (sessions === null) {
    return (
      <Loader>{loader}</Loader>
    )
  }

  if (sessions.length === 0) {
    return <p>{t('No sessions')}</p>
  }

  return (
    <>
      {sessions.map((session, index) => (
        <Session key={index} session={session} joinSessionButtonClassName={joinSessionButtonClassName}>
          <SessionAction session={session} onClick={() => onSessionClick?.(session)} />
        </Session>
      ))}
    </>
  )
}

export default SessionsPanel
