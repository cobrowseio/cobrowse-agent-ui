import clsx from 'clsx'
import { type ReactNode, useState } from 'react'
import {
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanels as HeadlessTabPanels,
  TabPanel as HeadlessTabPanel
} from '@headlessui/react'
import DevicesPanel, { type DevicesPanelProps } from './DevicesPanel'
import SessionsPanel, { type SessionsPanelProps } from './SessionsPanel'
import type { DeviceData } from '@/components/Device'
import type { SessionData } from '@/components/Session'
import RefreshButton, { type RefreshButtonProps } from '@/components/RefreshButton'
import { useTranslation } from '@/i18n'
import styles from './Tabs.module.css'
import PolicyGate from '@/components/PolicyGate'
import useHasPermission from '@/hooks/useHasPermission'

type TabKey = 'devices' | 'sessions'

interface TabsPanelProps<TDevice extends DeviceData, TSession extends SessionData>
  extends Pick<DevicesPanelProps<TDevice>, 'devices' | 'onConnectClick' | 'smartConnectButtonClassName' | 'loader'>,
    Pick<SessionsPanelProps<TSession>, 'sessions' | 'onSessionClick' | 'sessionButtonClassName' | 'loader'> {}

export interface TabsProps<TDevice extends DeviceData = DeviceData, TSession extends SessionData = SessionData>
  extends TabsPanelProps<TDevice, TSession> {
  onRefreshClick?: RefreshButtonProps['onClick']
  refresh?: ReactNode
  className?: string
  headerClassName?: string
  tabListClassName?: string
  tabClassName?: string
  tabHoverClassName?: string
  tabActiveClassName?: string
  tabPanelsClassName?: string
  refreshButtonClassName?: string
}

const Tabs = <TDevice extends DeviceData = DeviceData, TSession extends SessionData = SessionData>({
  devices,
  sessions,
  onConnectClick,
  onSessionClick,
  onRefreshClick,
  smartConnectButtonClassName,
  sessionButtonClassName,
  loader,
  refresh,
  className,
  headerClassName,
  tabListClassName,
  tabClassName,
  tabHoverClassName,
  tabActiveClassName,
  tabPanelsClassName,
  refreshButtonClassName
}: TabsProps<TDevice, TSession>) => {
  const { t } = useTranslation()
  const canReadDevices = useHasPermission('devices:read')
  const canReadSessions = useHasPermission('sessions:read')
  const [selectedTab, setSelectedTab] = useState<TabKey>('devices')

  const visibleTabs: TabKey[] = []

  if (canReadDevices) {
    visibleTabs.push('devices')
  }

  if (canReadSessions) {
    visibleTabs.push('sessions')
  }

  if (visibleTabs.length === 0) {
    return null
  }

  const selectedIndex = Math.max(visibleTabs.indexOf(selectedTab), 0)

  return (
    <HeadlessTabGroup
      className={clsx(styles.root, className)}
      selectedIndex={selectedIndex}
      onChange={(index) => {
        setSelectedTab(visibleTabs[index] ?? visibleTabs[0])
      }}
    >
      <div className={clsx(styles.header, headerClassName)}>
        <HeadlessTabList className={clsx(styles.tabList, tabListClassName)}>
          <PolicyGate requiredPermissions='devices:read' fallback='remove'>
            <HeadlessTab
              className={({ selected, hover }) =>
                clsx(
                  styles.tab,
                  tabClassName,
                  hover && styles.tabHover,
                  hover && tabHoverClassName,
                  selected && styles.tabActive,
                  selected && tabActiveClassName
                )
              }
            >
              {t('Devices')}
            </HeadlessTab>
          </PolicyGate>
          <PolicyGate requiredPermissions='sessions:read' fallback='remove'>
            <HeadlessTab
              className={({ selected, hover }) =>
                clsx(
                  styles.tab,
                  tabClassName,
                  hover && styles.tabHover,
                  hover && tabHoverClassName,
                  selected && styles.tabActive,
                  selected && tabActiveClassName
                )
              }
            >
              {t('Sessions')}
            </HeadlessTab>
          </PolicyGate>
        </HeadlessTabList>
        {onRefreshClick && (
          <RefreshButton className={clsx(styles.refresh, refreshButtonClassName)} onClick={onRefreshClick}>{refresh}</RefreshButton>
        )}
      </div>
      <HeadlessTabPanels className={clsx(styles.tabPanels, tabPanelsClassName)}>
        <PolicyGate requiredPermissions='devices:read' fallback='remove'>
          <HeadlessTabPanel>
            <DevicesPanel devices={devices} onConnectClick={onConnectClick} smartConnectButtonClassName={smartConnectButtonClassName} loader={loader} />
          </HeadlessTabPanel>
        </PolicyGate>
        <PolicyGate requiredPermissions='sessions:read' fallback='remove'>
          <HeadlessTabPanel>
            <SessionsPanel sessions={sessions} onSessionClick={onSessionClick} sessionButtonClassName={sessionButtonClassName} loader={loader} />
          </HeadlessTabPanel>
        </PolicyGate>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  )
}

export default Tabs
