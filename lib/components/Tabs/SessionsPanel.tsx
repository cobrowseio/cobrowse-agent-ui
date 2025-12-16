import { useTranslation } from 'react-i18next'
import Session, { type SessionProps, type SessionData } from '@/components/Session'
import Loader from '@/components/Loader'
import type { BasePanelProps } from './BasePanel'

export interface SessionsPanelProps extends BasePanelProps {
  sessions: SessionData[] | null
  onSessionClick?: SessionProps['onClick']
}

const SessionsPanel = ({ sessions, onSessionClick, loader }: SessionsPanelProps) => {
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
