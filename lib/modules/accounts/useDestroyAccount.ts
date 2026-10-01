import { useMemo } from 'react'
import { useMutation } from '@/hooks/useMutation'
import type { Account } from 'cobrowse-agent-sdk'

export function useDestroyAccount(account: Account) {
  const destroy = useMemo(() => account.destroy.bind(account), [account])

  return useMutation(destroy)
}
