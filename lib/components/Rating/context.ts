import { createContext, use } from 'react'
import type { RatingUpdate, RatingValue } from 'cobrowse-agent-sdk'

export type RatingResult = RatingUpdate

export interface RatingContextValue {
  rating: RatingValue | null
  feedback: string[]
  comment: string
  complete: boolean
  feedbackThreshold: number
  setRating: (score: RatingValue, commit?: boolean) => void
  toggleReason: (value: string) => void
  setComment: (value: string) => void
  submit: () => void
}

const RatingContext = createContext<RatingContextValue | null>(null)

export const useRatingContext = (): RatingContextValue => {
  const context = use(RatingContext)

  if (!context) {
    throw new Error('Rating.* components must be rendered within a <Rating>.')
  }

  return context
}

export default RatingContext
