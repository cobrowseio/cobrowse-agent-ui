import React from 'react'
import moment from 'moment'

export default function Stopwatch (props) {
  const start = moment(props.start || 0)
  const end = moment(props.end || Date.now())
  const ms = moment(end).diff(start)
  const delta = moment.duration(ms)
  return (
    <div style={props.style} className={`Stopwatch ${props.className || ''}`}>
      {delta.hours() > 0 ? <span>{delta.hours()}<span>:</span></span> : null}
      <span>{moment.utc(ms).format('mm:ss')}</span>
    </div>
  )
}
