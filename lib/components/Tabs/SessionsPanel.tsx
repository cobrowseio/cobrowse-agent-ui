import type { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import Session, { type SessionData } from '@/components/Session'
import Loader from '@/components/Loader'
import type { BasePanelProps } from './BasePanel'

interface SessionsPanelProps extends BasePanelProps {
  sessions: SessionData[] | null
  onClick?: MouseEventHandler
}

const SessionsPanel = ({ sessions, onClick, loader }: SessionsPanelProps) => {
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
        <Session key={index} session={session} onClick={onClick} />
      ))}
    </>
  )
}

export default SessionsPanel
