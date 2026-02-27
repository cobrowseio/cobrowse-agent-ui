import { useMemo } from 'react'
import { useCobrowse } from '@/components/CobrowseProvider'
import type { FilterValue, SessionEmbedProps } from './types'

interface UseSessionUrlProps {
  id: string
  token?: string
  filters?: Record<string, FilterValue>
  navigation?: SessionEmbedProps['navigation']
  endAction?: SessionEmbedProps['endAction']
  popout?: SessionEmbedProps['popout']
  agentTools?: SessionEmbedProps['agentTools']
  deviceControls?: SessionEmbedProps['deviceControls']
  sessionDetails?: SessionEmbedProps['sessionDetails']
  messages?: SessionEmbedProps['messages']
}

export const useSessionUrl = ({
  id,
  token,
  filters,
  navigation,
  endAction,
  popout,
  agentTools,
  deviceControls,
  sessionDetails,
  messages
}: UseSessionUrlProps) => {
  const cobrowse = useCobrowse()

  return useMemo(() => {
    const paramEntries = Object.entries({
      token: token ?? cobrowse.token,
      navigation,
      end_action: endAction,
      popout,
      agent_tools: agentTools,
      device_controls: deviceControls,
      session_details: sessionDetails,
      messages
    }).flatMap(([name, value]) => value === undefined ? [] : [[name, value]])

    const filterEntries = Object.entries(filters ?? {})
      .flatMap(([name, value]) =>
        name.length > 0 ? [[`filter_${name}`, String(value)]] : []
      )

    const query = new URLSearchParams([...paramEntries, ...filterEntries])

    return `${cobrowse.api}/session/${encodeURIComponent(id)}?${query.toString()}`
  }, [
    agentTools,
    cobrowse.api,
    cobrowse.token,
    deviceControls,
    endAction,
    filters,
    id,
    messages,
    navigation,
    popout,
    sessionDetails,
    token
  ])
}
