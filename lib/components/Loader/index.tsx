import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './Loader.module.css'

export interface LoaderProps {
  children?: ReactNode
}

const Loader = ({ children }: LoaderProps) => {
  const { t } = useTranslation()

  return (
    <div role='status' aria-label={t('Loading...')} className={styles.root}>
      {children ?? <div className={styles.spinner} />}
    </div>
  )
}

export default Loader
