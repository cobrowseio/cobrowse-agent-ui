import type { ReactNode } from 'react'
import clsx from 'clsx'
import Button from '@/components/Button'
import { useTranslation } from '@/i18n'
import { useRatingContext } from './context'
import styles from './Submit.module.css'

export interface RatingSubmitProps {
  className?: string
  children?: ReactNode
}

const Submit = ({ className, children }: RatingSubmitProps) => {
  const { submit, complete } = useRatingContext()
  const { t } = useTranslation()

  if (complete) return null

  return (
    <Button className={clsx(styles.root, className)} onClick={submit}>
      {children ?? t('Continue')}
    </Button>
  )
}

export default Submit
