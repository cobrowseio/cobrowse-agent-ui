import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import useHasPermission, { type PermissionMatch } from '@/hooks/useHasPermission'

export interface PolicyGateProps {
  requiredPermissions: string | string[] | null
  match?: PermissionMatch
  fallback?: 'disable' | 'remove' | ReactElement
  fallbackProps?: Record<string, unknown>
  children: ReactElement<Record<string, unknown>> | ((context: { isAllowed: boolean }) => ReactNode)
}

const renderFallback = (
  fallback: PolicyGateProps['fallback'],
  fallbackProps: PolicyGateProps['fallbackProps'],
  children: PolicyGateProps['children'],
  isAllowed: boolean
): ReactNode => {
  if (isValidElement(fallback)) {
    return fallback
  }

  if (typeof children === 'function') {
    return children({ isAllowed })
  }

  if (fallback === 'disable' && isValidElement(children)) {
    return cloneElement(children, { disabled: true, ...fallbackProps })
  }

  if (fallback === 'disable') {
    return children
  }

  return null
}

const PolicyGate = ({
  requiredPermissions,
  match = 'all',
  fallback = 'disable',
  fallbackProps = {},
  children
}: PolicyGateProps): ReactNode => {
  const isAllowed = useHasPermission(requiredPermissions, match)

  if (isAllowed) {
    return typeof children === 'function' ? children({ isAllowed }) : children
  }

  return renderFallback(fallback, fallbackProps, children, isAllowed)
}

export default PolicyGate
