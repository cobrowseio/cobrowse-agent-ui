import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import LoaderIcon from '@/icons/loader.svg?react'
import styles from './Loader.module.css'

export interface LoaderProps {
  children?: ReactNode
}

const Loader = ({ children }: LoaderProps) => {
  const { t } = useTranslation()

  return (
    <div role='status' aria-label={t('Loading...')} className={styles.root}>
      {children ?? <LoaderIcon className={styles.icon} />}
    </div>
  )
}

export default Loader
