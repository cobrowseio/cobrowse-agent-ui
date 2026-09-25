import { useCobrowse } from '@/components/CobrowseProvider'
import { useCollection } from '@/hooks/useCollection'

export function useListAccounts() {
  const cobrowse = useCobrowse()

  return useCollection(cobrowse.accounts.list)
}
