import { useCobrowse } from '@/components/CobrowseProvider'
import { useCollection } from './useCollection'
import { useMutation } from './useMutation'
import { Account } from 'cobrowse-agent-sdk'

export function useListAccounts() {
  const cobrowse = useCobrowse()

  return useCollection(cobrowse.accounts.list)
}

export function useCreateAccount() {
  const cobrowse = useCobrowse()

  return useMutation(cobrowse.accounts.create)
}

export function useDestroyAccount(account: Account) {
  return useMutation(account.destroy)
}

export function useSetOrganisationName(account: Account) {
  return useMutation(account.setOrganisationName)
}
