import Session, { type SessionData } from '@/components/Session'
import Loader from '@/components/Loader'
import { useTranslation } from '@/i18n'
import type { BasePanelProps } from './BasePanel'
import SessionAction from './SessionAction'

export interface SessionsPanelProps<T extends SessionData = SessionData> extends BasePanelProps {
  sessions: T[] | null
  onSessionClick?: (session: T) => void
  sessionButtonClassName?: string
}

const SessionsPanel = <T extends SessionData = SessionData>({ sessions, onSessionClick, sessionButtonClassName, loader }: SessionsPanelProps<T>) => {
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
        <Session key={index} session={session}>
          <SessionAction session={session} onClick={() => onSessionClick?.(session)} className={sessionButtonClassName} />
        </Session>
      ))}
    </>
  )
}

export default SessionsPanel
