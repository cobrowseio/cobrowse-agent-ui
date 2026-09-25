import { useMutation } from '@/hooks/useMutation'
import type { Account } from 'cobrowse-agent-sdk'

export function useDestroyAccount(account: Account) {
  return useMutation(account.destroy)
}
