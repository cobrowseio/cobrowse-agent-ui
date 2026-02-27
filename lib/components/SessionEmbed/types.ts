import type { ReactElement } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import type { FrameProps } from '@/components/Frame'

export type FilterValue = string | number | boolean
export type SessionState = Session['state']

type SessionEmbedFrameProps = Omit<
  FrameProps,
  'src' | 'onLoad' | 'onEnded' | 'onError' | 'onSessionLoaded' | 'onSessionUpdated' | 'onSessionActivated' | 'onSessionEnded'
>

export type SessionEmbedOverlayState = 'loading' | Exclude<SessionState, 'active'>

export type SessionEmbedOverlay = ReactElement

export interface SessionEmbedProps extends SessionEmbedFrameProps {
  id: string
  token?: string
  filters?: Record<string, FilterValue>
  navigation?: 'none'
  endAction?: 'dashboard' | 'none' | 'code'
  popout?: 'none'
  agentTools?: 'none'
  deviceControls?: 'none'
  sessionDetails?: 'none'
  messages?: 'none'
  onLoaded?: FrameProps['onSessionLoaded']
  onUpdated?: FrameProps['onSessionUpdated']
  onActivated?: FrameProps['onSessionActivated']
  onEnded?: FrameProps['onSessionEnded']
  onError?: FrameProps['onError']
  statusOverlays?: Partial<Record<SessionEmbedOverlayState, SessionEmbedOverlay>>
}
