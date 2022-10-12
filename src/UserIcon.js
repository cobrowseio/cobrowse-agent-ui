import React from 'react'

import './UserIcon.css'

export default function UserIcon (props) {
  function initials () {
    if (!props.user) return ''
    if (!props.user.name) return ''
    if (props.user.picture) return ''
    return props.user.name.split(' ')
      .map(i => i.toUpperCase().charAt(0))
      .join('').substr(0, 2)
  }

  if (!props.user) return null
  return (
    <div
      className={`UserIcon ${props.className || ''}`}
      title={props.user.name || null}
      style={{
        backgroundImage: props.user.picture ? `url(${props.user.picture || ''})` : undefined,
        backgroundColor: props.user.colour
      }}
    >
      <span>{initials()}</span>
    </div>
  )
}
