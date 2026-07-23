import { useState, type ReactNode } from 'react'
import clsx from 'clsx'
import type { RatingValue } from 'cobrowse-agent-sdk'
import RatingContext, { type RatingContextValue, type RatingResult } from './context'
import Stars, { type RatingStarsProps } from './Stars'
import Feedback, { type RatingFeedbackProps } from './Feedback'
import Reason, { type RatingReasonProps } from './Reason'
import Comment, { type RatingCommentProps } from './Comment'
import Submit, { type RatingSubmitProps } from './Submit'
import ThankYou, { type RatingThankYouProps } from './ThankYou'
import styles from './Rating.module.css'

export type { RatingResult, RatingContextValue } from './context'
export type { RatingStarsProps } from './Stars'
export type { RatingFeedbackProps, RatingReasonOption } from './Feedback'
export type { RatingReasonProps } from './Reason'
export type { RatingCommentProps } from './Comment'
export type { RatingSubmitProps } from './Submit'
export type { RatingThankYouProps } from './ThankYou'
export { useRatingContext } from './context'

const DEFAULT_FEEDBACK_THRESHOLD = 3

export interface RatingProps {
  onComplete: (result?: RatingResult) => void
  feedbackThreshold?: number
  className?: string
  children: ReactNode
}

type RatingComponent = ((props: RatingProps) => ReactNode) & {
  Stars: (props: RatingStarsProps) => ReactNode
  Feedback: (props: RatingFeedbackProps) => ReactNode
  Reason: (props: RatingReasonProps) => ReactNode
  Comment: (props: RatingCommentProps) => ReactNode
  Submit: (props: RatingSubmitProps) => ReactNode
  ThankYou: (props: RatingThankYouProps) => ReactNode
}

const RatingBase = ({ onComplete, feedbackThreshold = DEFAULT_FEEDBACK_THRESHOLD, className, children }: RatingProps) => {
  const [rating, setRatingState] = useState<RatingValue | null>(null)
  const [feedback, setFeedback] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [complete, setComplete] = useState(false)

  const finish = (rating: RatingValue | null, feedback: string[], comment: string) => {
    setComplete(true)
    onComplete(rating === null ? undefined : { rating, feedback: [...feedback, comment].filter(Boolean) })
  }

  const setRating = (score: RatingValue, commit = true) => {
    setRatingState(score)

    // Reset feedback values so that they are not submitted if the agent changes its initial low rating to 4/5 stars
    if (score > feedbackThreshold) {
      setFeedback([])
      setComment('')

      if (commit) finish(score, [], '')
    }
  }

  const toggleReason = (value: string) => {
    setFeedback((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value])
  }

  const submit = () => {
    finish(rating, feedback, comment)
  }

  const value: RatingContextValue = {
    rating,
    feedback,
    comment,
    complete,
    feedbackThreshold,
    setRating,
    toggleReason,
    setComment,
    submit
  }

  return (
    <RatingContext.Provider value={value}>
      <div className={clsx(styles.root, className)}>
        {children}
      </div>
    </RatingContext.Provider>
  )
}

const Rating: RatingComponent = Object.assign(RatingBase, {
  Stars,
  Feedback,
  Reason,
  Comment,
  Submit,
  ThankYou
})

export default Rating
