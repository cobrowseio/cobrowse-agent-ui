import { useId, useRef, type ReactNode } from 'react'
import clsx from 'clsx'
import type { RatingValue } from 'cobrowse-agent-sdk'
import StarIcon from '@/icons/star.svg?react'
import { useTranslation } from '@/i18n'
import { useRatingContext } from './context'
import styles from './Rating.module.css'

const SCORES: RatingValue[] = [1, 2, 3, 4, 5]

export interface RatingStarsProps {
  label?: ReactNode
  count?: RatingValue
  className?: string
}

const Stars = ({ label, count = 5, className }: RatingStarsProps) => {
  const { rating, setRating, complete } = useRatingContext()
  const { t } = useTranslation()
  const promptId = useId()
  const groupName = useId()
  const pointer = useRef(false)

  if (complete) return null

  const prompt = label === undefined ? t('Rate your experience') : label
  const scores = SCORES.filter(score => score <= count)

  return (
    <div className={clsx(styles.ratingGroup, className)}>
      {prompt && <p id={promptId} className={styles.prompt}>{prompt}</p>}
      <div
        className={styles.stars}
        role='radiogroup'
        aria-labelledby={prompt ? promptId : undefined}
        aria-label={prompt ? undefined : t('Rate your experience')}
      >
        {scores.map((score) => (
          <label
            key={score}
            className={clsx(styles.star, rating !== null && rating >= score && styles.starActive)}
            onPointerDown={() => { pointer.current = true }}
          >
            <input
              type='radio'
              name={groupName}
              value={score}
              checked={rating === score}
              className={styles.starInput}
              // Prevent submitting the value automatically for keyboard-driven users,
              // otherwise they wouldn't be able to move past the 4th star.
              onKeyDown={() => { pointer.current = false }}
              onChange={() => {
                setRating(score, pointer.current)
                pointer.current = false
              }}
            />
            <StarIcon />
            <span className={styles.visuallyHidden}>{t('Rate with a score of {{score}}', { score })}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default Stars
