import type { SessionData } from '@/components/Session'
import Button, { type ButtonProps } from '@/components/Button'
import { useTranslation } from '@/i18n'
import PlayIcon from '@/icons/play.svg?react'
import styles from './SessionAction.module.css'

export interface SessionActionProps {
  session: SessionData
  className?: string
  onClick: ButtonProps['onClick']
}

const SessionAction = ({ session, className, onClick }: SessionActionProps) => {
  const { t } = useTranslation()

  const isRecorded = session.state === 'ended' && session.recorded
  const isActive = session.state === 'active'

  if (!isRecorded && !isActive) {
    return null
  }

  return (
    <Button onClick={onClick} className={className}>
      {isRecorded && (
        <span className={styles.recorded}>
          <PlayIcon className={styles.recordedIcon} />
          {t('Recording')}
        </span>
      )}
      {isActive && t('Join session')}
    </Button>
  )
}

export default SessionAction
