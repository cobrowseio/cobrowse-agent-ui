import type { ReactNode } from 'react'
import clsx from 'clsx'
import type { RatingValue } from 'cobrowse-agent-sdk'
import StarIcon from '@/icons/star.svg?react'
import { useTranslation } from '@/i18n'
import { useRatingContext } from './context'
import styles from './Rating.module.css'

const SCORES: RatingValue[] = [5, 4, 3, 2, 1]

export interface RatingStarsProps {
  label?: ReactNode
  count?: RatingValue
  className?: string
}

const Stars = ({ label, count = 5, className }: RatingStarsProps) => {
  const { rating, setRating, complete } = useRatingContext()
  const { t } = useTranslation()

  if (complete) return null

  const prompt = label === undefined ? t('Rate your experience') : label
  const scores = SCORES.filter(score => score <= count)

  return (
    <div className={clsx(styles.ratingGroup, className)}>
      {prompt && <p className={styles.prompt}>{prompt}</p>}
      <div className={styles.stars}>
        {scores.map((score) => (
          <button
            key={score}
            type='button'
            className={clsx(styles.star, rating !== null && rating >= score && styles.starActive)}
            onClick={() => { setRating(score) }}
          >
            <StarIcon />
            <span className={styles.visuallyHidden}>{t('Rate with a score of {{score}}', { score })}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Stars
