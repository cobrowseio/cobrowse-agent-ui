import Rating from './index'
import type { RatingResult } from './context'

export type SessionRatingResult = RatingResult

export interface SessionRatingProps {
  onComplete: (result?: SessionRatingResult) => void
  showThankYou?: boolean
  className?: string
}

const SessionRating = ({ onComplete, showThankYou = false, className }: SessionRatingProps) => (
  <Rating onComplete={onComplete} className={className}>
    <Rating.Stars />
    <Rating.Feedback />
    <Rating.Submit />
    {showThankYou && <Rating.ThankYou />}
  </Rating>
)

export default SessionRating
