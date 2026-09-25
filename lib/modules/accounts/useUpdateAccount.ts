import { useMutation } from '@/hooks/useMutation'
import type { Account } from 'cobrowse-agent-sdk'

export function useUpdateAccount(account: Account) {
  return useMutation(account.update.bind(account))
}
