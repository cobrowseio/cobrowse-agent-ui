import type { ReactNode } from 'react'
import { useTranslation } from '@/i18n'
import styles from './BlockingError.module.css'

export interface BlockingErrorProps {
  heading?: string
  message?: string
  children?: ReactNode
}

const BlockingError = ({ heading, message, children }: BlockingErrorProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.root}>
      <p className={styles.heading}>{heading ?? t('Sorry, something went wrong.')}</p>
      {message && <p className={styles.message}>{message}</p>}
      {children}
    </div>
  )
}

export default BlockingError
