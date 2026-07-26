import CodeEntryComponent from '@/components/CodeEntry'
import ButtonComponent from '@/components/Button'
import ExternalLinkComponent from '@/components/ExternalLink'
import PlatformIconComponent from '@/components/PlatformIcon'
import DeviceComponent from '@/components/Device'
import SessionComponent from '@/components/Session'
import SmartConnectButtonComponent from '@/components/SmartConnectButton'
import UserIconComponent from '@/components/UserIcon'
import RefreshButtonComponent from '@/components/RefreshButton'
import CancelButtonComponent from '@/components/CancelButton'
import BlockingErrorComponent from '@/components/BlockingError'
import LoaderComponent from '@/components/Loader'
import FrameComponent, { useRemoteContext as useRemoteContextHook } from '@/components/Frame'
import SessionEmbedComponent from '@/components/SessionEmbed'
import ConnectDeviceComponent from '@/components/ConnectDevice'
import CobrowseProviderComponent, {
  useCobrowse as useCobrowseHook,
  usePolicy as usePolicyHook
} from '@/components/CobrowseProvider'
import PolicyGateComponent from '@/components/PolicyGate'
import useSessionHook from '@/hooks/useSession'
import useHasPermissionHook from '@/hooks/useHasPermission'
import i18nInstance, { bindI18n as bindI18nHelper } from '@/i18n'

export type { CodeEntryProps } from '@/components/CodeEntry'
export type { ButtonProps } from '@/components/Button'
export type { ExternalLinkProps } from '@/components/ExternalLink'
export type { DeviceData, DeviceProps } from '@/components/Device'
export type { SessionData, SessionProps } from '@/components/Session'
export type { SmartConnectButtonProps } from '@/components/SmartConnectButton'
export type { RefreshButtonProps } from '@/components/RefreshButton'
export type { CancelButtonProps } from '@/components/CancelButton'
export type { BlockingErrorProps } from '@/components/BlockingError'
export type { LoaderProps } from '@/components/Loader'
export type { FrameProps } from '@/components/Frame'
export type { SessionEmbedProps } from '@/components/SessionEmbed'
export type { ConnectDeviceProps } from '@/components/ConnectDevice'
export type { CobrowseProviderProps, PolicyState } from '@/components/CobrowseProvider'
export type { PolicyGateProps } from '@/components/PolicyGate'
export type { PermissionMatch } from '@/hooks/useHasPermission'

export const CodeEntry = CodeEntryComponent
export const Button = ButtonComponent
export const ExternalLink = ExternalLinkComponent
export const PlatformIcon = PlatformIconComponent
export const Device = DeviceComponent
export const Session = SessionComponent
export const SmartConnectButton = SmartConnectButtonComponent
export const UserIcon = UserIconComponent
export const RefreshButton = RefreshButtonComponent
export const CancelButton = CancelButtonComponent
export const BlockingError = BlockingErrorComponent
export const Loader = LoaderComponent
export const Frame = FrameComponent
export const SessionEmbed = SessionEmbedComponent
export const ConnectDevice = ConnectDeviceComponent
export const CobrowseProvider = CobrowseProviderComponent
export const PolicyGate = PolicyGateComponent
export const useCobrowse = useCobrowseHook
export const usePolicy = usePolicyHook
export const useRemoteContext = useRemoteContextHook
export const useSession = useSessionHook
export const useHasPermission = useHasPermissionHook
export const bindI18n = bindI18nHelper
export const i18n = i18nInstance
