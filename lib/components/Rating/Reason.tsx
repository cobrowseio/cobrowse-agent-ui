import type { ReactNode } from 'react'
import clsx from 'clsx'
import { useRatingContext } from './context'
import styles from './Reason.module.css'

export interface RatingReasonProps {
  value: string
  label: ReactNode
  className?: string
}

const Reason = ({ value, label, className }: RatingReasonProps) => {
  const { feedback, toggleReason } = useRatingContext()

  return (
    <label className={clsx(styles.root, className)}>
      <input
        type='checkbox'
        value={value}
        checked={feedback.includes(value)}
        className={styles.checkbox}
        onChange={() => { toggleReason(value) }}
      />
      {label}
    </label>
  )
}

export default Reason
