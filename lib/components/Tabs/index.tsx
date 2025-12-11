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
import RefreshIcon from '@/icons/refresh.svg?react'
import styles from './Tabs.module.css'

export interface TabsProps {
  devices: DeviceData[] | null
  sessions: SessionData[] | null
  onSessionClick?: MouseEventHandler
  onRefreshClick?: MouseEventHandler
  smartConnectButtonClassName?: string
  loader?: ReactNode
  className?: string
  headerClassName?: string
  tabListClassName?: string
  tabClassName?: string
  tabHoverClassName?: string
  tabActiveClassName?: string
  tabPanelsClassName?: string
  refreshButtonClassName?: string
}

const Tabs = ({
  devices,
  sessions,
  onSessionClick,
  onRefreshClick,
  smartConnectButtonClassName,
  loader,
  className,
  headerClassName,
  tabListClassName,
  tabClassName,
  tabHoverClassName,
  tabActiveClassName,
  tabPanelsClassName,
  refreshButtonClassName
}: TabsProps) => {
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
          <button
            type='button'
            className={clsx(styles.refreshButton, refreshButtonClassName)}
            onClick={onRefreshClick}
          >
            <RefreshIcon />
          </button>
        )}
      </div>
      <HeadlessTabPanels className={tabPanelsClassName}>
        <HeadlessTabPanel>
          <DevicesPanel devices={devices} smartConnectButtonClassName={smartConnectButtonClassName} loader={loader} />
        </HeadlessTabPanel>
        <HeadlessTabPanel>
          <SessionsPanel sessions={sessions} onClick={onSessionClick} loader={loader} />
        </HeadlessTabPanel>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  )
}

export default Tabs
