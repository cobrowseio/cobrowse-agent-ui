import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import clsx from 'clsx'
import Button from '@/components/Button'
import StarIcon from '@/icons/star.svg?react'
import { useTranslation } from '@/i18n'
import styles from './SessionRating.module.css'

export interface SessionRatingResult {
  rating: number
  feedback: string[]
}

export interface SessionRatingProps {
  onComplete: (result: SessionRatingResult) => void
  showThankYou?: boolean
  className?: string
}

interface FeedbackInputProps {
  label: ReactNode
  value: string
  onReasonSelect: (event: ChangeEvent<HTMLInputElement>) => void
}

const FeedbackInput = ({ label, value, onReasonSelect }: FeedbackInputProps) => (
  <label className={styles.reason}>
    <input
      type='checkbox'
      value={value}
      className={styles.checkbox}
      onChange={onReasonSelect}
    />
    {label}
  </label>
)

const SCORES = [5, 4, 3, 2, 1]

const SessionRating = ({ onComplete, showThankYou = false, className }: SessionRatingProps) => {
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string[]>([])
  const [issues, setIssues] = useState('')
  const [complete, setComplete] = useState(false)
  const { t } = useTranslation()

  const finish = (finalRating: number) => {
    setComplete(true)
    onComplete({ rating: finalRating, feedback: [...feedback, issues].filter(Boolean) })
  }

  const onSelectRating = (score: number) => {
    setRating(score)
    if (score > 3) finish(score)
  }

  const onContinue = () => {
    if (rating !== null) finish(rating)
  }

  const onReasonSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target
    setFeedback(prev => checked ? [...prev, value] : prev.filter(v => v !== value))
  }

  const hasFeedbackVisible = rating !== null && rating <= 3

  if (complete) {
    if (!showThankYou || rating === null) return null
    return <div className={clsx(styles.thankYou, className)}>{t('Thank you for your feedback.')}</div>
  }

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.ratingGroup}>
        <p className={styles.prompt}>{t('Rate your experience')}</p>
        <div className={styles.stars}>
          {SCORES.map(score => (
            <button
              key={score}
              type='button'
              className={clsx(styles.star, rating !== null && rating >= score && styles.starActive)}
              onClick={() => { onSelectRating(score) }}
            >
              <StarIcon />
              <span className={styles.visuallyHidden}>{t('Rate with a score of {{score}}', { score })}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={clsx(styles.feedbackGroup, hasFeedbackVisible && styles.feedbackGroupExpanded)}>
        {hasFeedbackVisible && (
          <div className={styles.feedback}>
            <div className={styles.reasons}>
              <FeedbackInput
                label={t('It was too hard to start the session with the user')}
                value='hard_to_start_session'
                onReasonSelect={onReasonSelect}
              />
              <FeedbackInput
                label={t('The screen was too slow to load or update')}
                value='screen_too_slow'
                onReasonSelect={onReasonSelect}
              />
              <FeedbackInput
                label={t('Parts of the screen did not load correctly')}
                value='screen_broken'
                onReasonSelect={onReasonSelect}
              />
              <FeedbackInput
                label={t('The tools were not helpful or too hard to use')}
                value='tools_not_helpful'
                onReasonSelect={onReasonSelect}
              />
            </div>
            <textarea
              className={styles.issues}
              placeholder={t('Please describe any issues you experienced')}
              value={issues}
              onChange={event => { setIssues(event.target.value) }}
            />
          </div>
        )}
        <Button className={styles.continue} onClick={onContinue}>{t('Continue')}</Button>
      </div>
    </div>
  )
}

export default SessionRating
