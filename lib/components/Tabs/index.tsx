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

export interface TabsProps {
  devices: DeviceData[] | null
  sessions: SessionData[] | null
  onSessionClick?: MouseEventHandler
  onRefreshClick?: MouseEventHandler
  smartConnectButtonClassName?: string
  loader?: ReactNode
}

const Tabs = ({ devices, sessions, onSessionClick, onRefreshClick, smartConnectButtonClassName, loader }: TabsProps) => {
  const { t } = useTranslation()

  return (
    <HeadlessTabGroup>
      {onRefreshClick && (
        <div>
          <button onClick={onRefreshClick}>
            <RefreshIcon />
          </button>
        </div>
      )}
      <HeadlessTabList>
        <HeadlessTab>{t('Devices')}</HeadlessTab>
        <HeadlessTab>{t('Sessions')}</HeadlessTab>
      </HeadlessTabList>
      <HeadlessTabPanels>
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
