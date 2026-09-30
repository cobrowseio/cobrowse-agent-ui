import { useCobrowse } from '@/components/CobrowseProvider'
import { useCollection } from '@/hooks/useCollection'
import { type QueryOptions } from '@/hooks/useQuery'

export function useListAccounts(options?: QueryOptions) {
  const cobrowse = useCobrowse()

  return useCollection(cobrowse.accounts.list, options)
}
