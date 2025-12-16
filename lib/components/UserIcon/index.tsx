import clsx from 'clsx'
import styles from './UserIcon.module.css'

export interface UserIconUser {
  name?: string
  picture?: string
  colour?: string
}

export interface UserIconProps {
  user?: UserIconUser
  className?: string
}

const UserIcon = ({ user, className }: UserIconProps) => {
  const initials = (): string => {
    if (!user?.name || user.picture) return ''

    return user.name
      .trim()
      .split(/\s+/)
      .map(part => part.toUpperCase().charAt(0))
      .join('')
      .slice(0, 2)
  }

  if (!user) return null

  return (
    <div
      className={clsx(styles.root, className)}
      title={user.name}
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
