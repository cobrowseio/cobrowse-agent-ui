import { useCobrowse } from "@/components/CobrowseProvider"
import { useSDKCollectionQuery } from "./useSDKReadQueries"

export function useAccounts() {
  const cobrowse = useCobrowse()

  return useSDKCollectionQuery(cobrowse.accounts.list)
}
