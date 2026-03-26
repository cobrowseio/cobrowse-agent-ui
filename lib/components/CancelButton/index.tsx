import type { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import PhoneIcon from '@/icons/phone.svg?react'
import { useTranslation } from '@/i18n'
import styles from './CancelButton.module.css'

export interface CancelButtonProps extends ComponentPropsWithoutRef<'button'> {}

const CancelButton = ({ type = 'button', className, children, ...props }: CancelButtonProps) => {
  const { t } = useTranslation()

  return (
    <button
      type={type}
      aria-label={t('Cancel')}
      className={clsx(styles.root, className)}
      {...props}
    >
      {children ?? <PhoneIcon />}
    </button>
  )
}

export default CancelButton
