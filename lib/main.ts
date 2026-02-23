import CodeEntryComponent from '@/components/CodeEntry'
import ExternalLinkComponent from '@/components/ExternalLink'
import PlatformIconComponent from '@/components/PlatformIcon'
import DeviceComponent from '@/components/Device'
import SessionComponent from '@/components/Session'
import SmartConnectButtonComponent from '@/components/SmartConnectButton'
import UserIconComponent from '@/components/UserIcon'
import RefreshButtonComponent from '@/components/RefreshButton'
import LoaderComponent from '@/components/Loader'
import FrameComponent from '@/components/Frame'
import ConnectDeviceComponent from '@/components/ConnectDevice'
import i18nInstance from '@/i18n'

export type { CodeEntryProps } from '@/components/CodeEntry'
export type { ExternalLinkProps } from '@/components/ExternalLink'
export type { DeviceData, DeviceProps } from '@/components/Device'
export type { SessionData, SessionProps } from '@/components/Session'
export type { SmartConnectButtonProps } from '@/components/SmartConnectButton'
export type { RefreshButtonProps } from '@/components/RefreshButton'
export type { LoaderProps } from '@/components/Loader'
export type { FrameProps } from '@/components/Frame'
export type { ConnectDeviceProps } from '@/components/ConnectDevice'

export const CodeEntry = CodeEntryComponent
export const ExternalLink = ExternalLinkComponent
export const PlatformIcon = PlatformIconComponent
export const Device = DeviceComponent
export const Session = SessionComponent
export const SmartConnectButton = SmartConnectButtonComponent
export const UserIcon = UserIconComponent
export const RefreshButton = RefreshButtonComponent
export const Loader = LoaderComponent
export const Frame = FrameComponent
export const ConnectDevice = ConnectDeviceComponent
export const i18n = i18nInstance
