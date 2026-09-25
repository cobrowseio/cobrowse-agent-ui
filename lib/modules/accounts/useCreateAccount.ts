import { useCobrowse } from '@/components/CobrowseProvider'
import { useMutation } from '@/hooks/useMutation'

export function useCreateAccount() {
  const cobrowse = useCobrowse()

  return useMutation(cobrowse.accounts.create)
}
