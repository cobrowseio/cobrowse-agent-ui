import { usePolicy } from '@/components/CobrowseProvider'

export type PermissionMatch = 'all' | 'any'

const useHasPermission = (requiredPermissions: string | string[] | null, match: PermissionMatch = 'all') => {
  const {
    loading,
    error,
    policy
  } = usePolicy()

  if (requiredPermissions === null) return true

  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions]

  if (permissions.length === 0) return true
  if (loading) return false
  if (error) return true
  if (!policy) return true

  return match === 'all'
    ? permissions.every((permission) => policy.hasPermission(permission))
    : permissions.some((permission) => policy.hasPermission(permission))
}

export default useHasPermission
