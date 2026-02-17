import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './BlockingError.module.css'

export interface BlockingErrorProps {
  message?: string
  children?: ReactNode
}

const BlockingError = ({ message, children }: BlockingErrorProps) => {
  const { t } = useTranslation()

  return (
    <div className={styles.root}>
      <p className={styles.heading}>{t('Sorry, something went wrong.')}</p>
      {message && <p className={styles.message}>{message}</p>}
      {children}
    </div>
  )
}

export default BlockingError
