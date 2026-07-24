import type { ReactNode } from 'react'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'
import { useRatingContext } from './context'
import styles from './ThankYou.module.css'

export interface RatingThankYouProps {
  className?: string
  children?: ReactNode
}

const ThankYou = ({ className, children }: RatingThankYouProps) => {
  const { complete, rating } = useRatingContext()
  const { t } = useTranslation()

  if (!complete || rating === null) return null

  return (
    <div role='status' className={clsx(styles.root, className)}>
      {children ?? t('Thank you for your feedback.')}
    </div>
  )
}

export default ThankYou
