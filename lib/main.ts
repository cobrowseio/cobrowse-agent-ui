import CodeEntryComponent from '@/components/CodeEntry'
import PlatformIconComponent from '@/components/PlatformIcon'
import DeviceComponent from '@/components/Device'
import SessionComponent from '@/components/Session'
import SmartConnectButtonComponent from '@/components/SmartConnectButton'
import UserIconComponent from '@/components/UserIcon'
import TabsComponent from '@/components/Tabs'
import i18nInstance from '@/i18n'

export type { CodeEntryProps } from '@/components/CodeEntry'
export type { DeviceData, DeviceProps } from '@/components/Device'
export type { SessionData, SessionProps } from '@/components/Session'
export type { SmartConnectButtonProps } from '@/components/SmartConnectButton'

export const CodeEntry = CodeEntryComponent
export const PlatformIcon = PlatformIconComponent
export const Device = DeviceComponent
export const Session = SessionComponent
export const SmartConnectButton = SmartConnectButtonComponent
export const UserIcon = UserIconComponent
export const Tabs = TabsComponent
export const i18n = i18nInstance
