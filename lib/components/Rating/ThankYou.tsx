import type { ReactNode } from 'react'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'
import { useRatingContext } from './context'
import styles from './Rating.module.css'

export interface RatingThankYouProps {
  children?: ReactNode
  className?: string
}

const ThankYou = ({ children, className }: RatingThankYouProps) => {
  const { complete, rating } = useRatingContext()
  const { t } = useTranslation()

  if (!complete || rating === null) return null

  return (
    <div role='status' className={clsx(styles.thankYou, className)}>
      {children ?? t('Thank you for your feedback.')}
    </div>
  )
}

export default ThankYou
