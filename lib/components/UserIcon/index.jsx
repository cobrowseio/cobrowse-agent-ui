import React from 'react'
import clsx from 'clsx'
import styles from './UserIcon.module.css'

const UserIcon = ({ user, className }) => {
  const initials = () => {
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
      className={clsx(styles.root, className)}
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

export default UserIcon
