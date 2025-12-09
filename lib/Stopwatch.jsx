import React from 'react'
import { differenceInMilliseconds, intervalToDuration, format } from 'date-fns'

export default function Stopwatch (props) {
  const start = props.start || new Date(0)
  const end = props.end || new Date()
  const ms = differenceInMilliseconds(end, start)
  const duration = intervalToDuration({ start, end })

  return (
    <div style={props.style} className={`Stopwatch ${props.className || ''}`}>
      {duration.hours > 0 ? <span>{duration.hours}<span>:</span></span> : null}
      <span>{format(new Date(ms), 'mm:ss')}</span>
    </div>
  )
}
