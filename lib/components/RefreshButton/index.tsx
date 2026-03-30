import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import Button from '@/components/Button'
import RefreshIcon from '@/icons/refresh.svg?react'
import styles from './RefreshButton.module.css'

export interface RefreshButtonProps extends ComponentPropsWithoutRef<'button'> {}

const RefreshButton = ({ className, children, ...props }: RefreshButtonProps) => (
  <Button className={clsx(styles.root, className)} {...props}>
    {children ?? <RefreshIcon className={styles.icon} />}
  </Button>
)

export default RefreshButton
