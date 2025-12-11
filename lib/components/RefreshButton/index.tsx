import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import RefreshIcon from '@/icons/refresh.svg?react'
import styles from './RefreshButton.module.css'

export interface RefreshButtonProps extends ComponentPropsWithoutRef<'button'> {}

const RefreshButton = ({ className, children, ...props }: RefreshButtonProps) => (
  <button className={clsx(styles.root, className)} {...props}>
    {children ?? <RefreshIcon className={styles.icon} />}
  </button>
)

export default RefreshButton
