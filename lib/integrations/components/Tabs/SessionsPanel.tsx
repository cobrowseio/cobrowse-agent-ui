import { useTranslation } from 'react-i18next'
import Session, { type SessionData } from '@/components/Session'
import Loader from '@/components/Loader'
import type { BasePanelProps } from './BasePanel'

export interface SessionsPanelProps<T extends SessionData = SessionData> extends BasePanelProps {
  sessions: T[] | null
  onSessionClick?: (session: T) => void
}

const SessionsPanel = <T extends SessionData = SessionData>({ sessions, onSessionClick, loader }: SessionsPanelProps<T>) => {
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
        <Session key={index} session={session} onClick={onSessionClick} />
      ))}
    </>
  )
}

export default SessionsPanel
