import clsx from 'clsx'
import { useTranslation } from '@/i18n'
import { useRatingContext } from './context'
import styles from './Rating.module.css'

export interface RatingCommentProps {
  placeholder?: string
  className?: string
}

const Comment = ({ placeholder, className }: RatingCommentProps) => {
  const { comment, setComment } = useRatingContext()
  const { t } = useTranslation()

  return (
    <textarea
      className={clsx(styles.comment, className)}
      placeholder={placeholder ?? t('Please describe any issues you experienced')}
      value={comment}
      onChange={(event) => { setComment(event.target.value) }}
    />
  )
}

export default Comment
