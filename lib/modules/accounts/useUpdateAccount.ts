import { useMemo } from 'react'
import { useMutation } from '@/hooks/useMutation'
import type { Account } from 'cobrowse-agent-sdk'

export function useUpdateAccount(account: Account) {
  const update = useMemo(() => account.update.bind(account), [account])

  return useMutation(update)
}
