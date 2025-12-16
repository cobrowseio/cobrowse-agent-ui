import clsx from 'clsx'
import type { MouseEventHandler, ReactNode } from 'react'
import {
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanels as HeadlessTabPanels,
  TabPanel as HeadlessTabPanel
} from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import DevicesPanel from '@/components/Tabs/DevicesPanel'
import SessionsPanel from '@/components/Tabs/SessionsPanel'
import type { DeviceData } from '@/components/Device'
import type { SessionData } from '@/components/Session'
import RefreshButton from '@/components/RefreshButton'
import styles from './Tabs.module.css'

export interface TabsProps<TDevice extends DeviceData = DeviceData, TSession extends SessionData = SessionData> {
  devices: TDevice[] | null
  sessions: TSession[] | null
  onConnectClick?: (device: TDevice) => void
  onSessionClick?: (session: TSession) => void
  onRefreshClick?: MouseEventHandler
  smartConnectButtonClassName?: string
  loader?: ReactNode
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

  return (
    <HeadlessTabGroup className={clsx(styles.root, className)}>
      <div className={clsx(styles.header, headerClassName)}>
        <HeadlessTabList className={clsx(styles.tabList, tabListClassName)}>
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
        </HeadlessTabList>
        {onRefreshClick && (
          <RefreshButton className={clsx(styles.refresh, refreshButtonClassName)} onClick={onRefreshClick}>{refresh}</RefreshButton>
        )}
      </div>
      <HeadlessTabPanels className={tabPanelsClassName}>
        <HeadlessTabPanel>
          <DevicesPanel devices={devices} onConnectClick={onConnectClick} smartConnectButtonClassName={smartConnectButtonClassName} loader={loader} />
        </HeadlessTabPanel>
        <HeadlessTabPanel>
          <SessionsPanel sessions={sessions} onSessionClick={onSessionClick} loader={loader} />
        </HeadlessTabPanel>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  )
}

export default Tabs
