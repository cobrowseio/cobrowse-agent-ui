import React from 'react'
import { differenceInMilliseconds, intervalToDuration, format } from 'date-fns'

export default function Stopwatch ({ start: startProp, end: endProp, style, className }) {
  const start = startProp || new Date(0)
  const end = endProp || new Date()
  const ms = differenceInMilliseconds(end, start)
  const duration = intervalToDuration({ start, end })

  return (
    <div style={style} className={`Stopwatch ${className || ''}`}>
      {duration.hours > 0 ? <span>{duration.hours}<span>:</span></span> : null}
      <span>{format(new Date(ms), 'mm:ss')}</span>
    </div>
  )
}
