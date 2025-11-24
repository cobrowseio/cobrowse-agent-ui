import React from 'react'

import './UserIcon.css'

export default function UserIcon ({ user, className }) {
  function initials () {
    if (!user) return ''
    if (!user.name) return ''
    if (user.picture) return ''
    return user.name.split(' ')
      .map(i => i.toUpperCase().charAt(0))
      .join('').substr(0, 2)
  }

  if (!user) return null
  return (
    <div
      className={`UserIcon ${className || ''}`}
      title={user.name || null}
      style={{
        backgroundImage: user.picture ? `url(${user.picture || ''})` : undefined,
        backgroundColor: user.colour
      }}
    >
      <span>{initials()}</span>
    </div>
  )
}
