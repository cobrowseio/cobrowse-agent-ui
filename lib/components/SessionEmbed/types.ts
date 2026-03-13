import type { ReactElement, ReactNode } from 'react'
import type { Session } from 'cobrowse-agent-sdk'
import type { FrameProps } from '@/components/Frame'

type SessionEmbedFrameProps = Omit<
  FrameProps,
  'src' | 'onLoad' | 'onEnded' | 'onError'
>

export type SessionEmbedOverlayState = 'loading' | Session['state']

export interface SessionEmbedOverlayProps {
  state: SessionEmbedOverlayState
  children: ReactNode
}

export type SessionEmbedOverlay = ReactElement<SessionEmbedOverlayProps>

export interface SessionEmbedProps extends SessionEmbedFrameProps {
  id: string
  endAction?: 'dashboard' | 'none' | 'code'
  popout?: 'none'
  agentTools?: 'none'
  deviceControls?: 'none'
  sessionDetails?: 'none'
  messages?: 'none'
  onLoaded?: (session: Session) => void
  onUpdated?: (session: Session) => void
  onActivated?: (session: Session) => void
  onEnded?: (session: Session) => void
  onError?: FrameProps['onError']
  children?: ReactNode
}
