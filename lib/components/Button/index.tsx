import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {}

const Button = ({ type = 'button', className, ...props }: ButtonProps) => (
  <button
    type={type}
    className={clsx(styles.root, className)}
    {...props}
  />
)

export default Button
