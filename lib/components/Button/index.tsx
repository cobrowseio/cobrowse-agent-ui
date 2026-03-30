import clsx from 'clsx'
import type { ComponentPropsWithoutRef, ElementType } from 'react'
import styles from './Button.module.css'

const DEFAULT_TAG = 'button' as const

type PropsOf<T extends ElementType> = ComponentPropsWithoutRef<T>

interface BaseButtonProps {
  className?: string
}

export type ButtonProps<TElement extends ElementType = typeof DEFAULT_TAG> =
  BaseButtonProps &
  PropsOf<TElement> & {
    as?: TElement
  }

const Button = <TElement extends ElementType = typeof DEFAULT_TAG>({
  as,
  className,
  ...props
}: ButtonProps<TElement>) => {
  const Tag: ElementType = as ?? DEFAULT_TAG
  const tagProps = props as PropsOf<ElementType> & { type?: string }

  return (
    <Tag
      type={Tag === DEFAULT_TAG ? 'button' : undefined}
      className={clsx(styles.root, className)}
      {...tagProps}
    />
  )
}

export default Button
