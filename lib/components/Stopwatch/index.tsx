import clsx from 'clsx'
import { differenceInMilliseconds, intervalToDuration, format } from 'date-fns'
import type { CSSProperties } from 'react'

export interface StopwatchProps {
  start?: Date | number | string | null
  end?: Date | number | string | null
  style?: CSSProperties
  className?: string
}

const Stopwatch = ({ start: startProp, end: endProp, style, className }: StopwatchProps) => {
  const start = startProp ? new Date(startProp) : new Date(0)
  const end = endProp ? new Date(endProp) : new Date()
  const ms = differenceInMilliseconds(end, start)
  const duration = intervalToDuration({ start, end })

  return (
    <span style={style} className={clsx('Stopwatch', className)}>
      {duration.hours && duration.hours > 0 ? <span>{duration.hours}<span>:</span></span> : null}
      <span>{format(new Date(ms), 'mm:ss')}</span>
    </span>
  )
}

export default Stopwatch
