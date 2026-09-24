import { useMutation } from './useMutation'
import type { RESTResource } from 'cobrowse-agent-sdk'

export function useUpdate(entity: RESTResource) {
  return useMutation(entity.update.bind(entity))
}
