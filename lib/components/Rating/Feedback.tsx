import type { ReactNode } from 'react'
import clsx from 'clsx'
import { useTranslation } from '@/i18n'
import { useRatingContext } from './context'
import Reason from './Reason'
import Comment from './Comment'
import styles from './Feedback.module.css'

export interface RatingReasonOption {
  value: string
  label: ReactNode
}

export interface RatingFeedbackProps {
  reasons?: RatingReasonOption[]
  placeholder?: string
  className?: string
  children?: ReactNode
}

const Feedback = ({ reasons, placeholder, className, children }: RatingFeedbackProps) => {
  const { rating, complete, feedbackThreshold } = useRatingContext()
  const { t } = useTranslation()

  if (complete || rating === null || rating > feedbackThreshold) {
    return null
  }

  const defaultReasons: RatingReasonOption[] = [
    { value: 'hard_to_start_session', label: t('It was too hard to start the session with the user') },
    { value: 'screen_too_slow', label: t('The screen was too slow to load or update') },
    { value: 'screen_broken', label: t('Parts of the screen did not load correctly') },
    { value: 'tools_not_helpful', label: t('The tools were not helpful or too hard to use') }
  ]

  return (
    <div className={clsx(styles.root, className)}>
      {children ?? (
        <>
          <div className={styles.reasons}>
            {(reasons ?? defaultReasons).map((reason) => (
              <Reason key={reason.value} value={reason.value} label={reason.label} />
            ))}
          </div>
          <Comment placeholder={placeholder} />
        </>
      )}
    </div>
  )
}

export default Feedback
