import { useMemo } from 'react'
import { useCobrowse } from '@/components/CobrowseProvider'
import type { SessionEmbedProps } from './types'

interface UseSessionUrlProps {
  id: string
  token?: string
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
      end_action: endAction,
      popout,
      agent_tools: agentTools,
      device_controls: deviceControls,
      session_details: sessionDetails,
      messages
    }).flatMap(([name, value]) => value === undefined ? [] : [[name, value]])

    const query = new URLSearchParams(paramEntries)

    return `${cobrowse.api}/session/${encodeURIComponent(id)}?${query.toString()}`
  }, [
    cobrowse.api,
    cobrowse.token,
    id,
    token,
    endAction,
    popout,
    agentTools,
    deviceControls,
    sessionDetails,
    messages
  ])
}
