import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CodeEntry,
  Device,
  PlatformIcon,
  Session,
  SmartConnectButton,
  UserIcon,
  i18n
} from '../lib/main.js'

const deviceSamples = [
  {
    id: 'ios-1',
    name: 'Avery’s iPad Pro',
    location: 'San Francisco • Retail Floor',
    online: true,
    connectable: true,
    last_active: Date.now() - 2 * 60 * 1000,
    device: {
      platform: 'ios',
      device:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    }
  },
  {
    id: 'android-1',
    name: 'Pixel 8 Field Tablet',
    location: 'Berlin • Field Ops',
    online: false,
    connectable: false,
    last_active: Date.now() - 6 * 60 * 60 * 1000,
    device: {
      platform: 'android',
      device:
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Mobile Safari/537.36'
    }
  },
  {
    id: 'web-1',
    name: 'Desk PC - Support',
    location: 'Remote • Browser session',
    online: true,
    connectable: false,
    last_active: Date.now() - 5 * 60 * 1000,
    device: {
      platform: 'web',
      device:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15'
    }
  }
]

const sessionSamples = [
  {
    id: 'session-1',
    state: 'active',
    recorded: false,
    activated: Date.now() - 8 * 60 * 1000,
    device: {
      platform: 'ios',
      device: deviceSamples[0].device.device
    }
  },
  {
    id: 'session-2',
    state: 'ended',
    recorded: true,
    activated: Date.now() - 45 * 60 * 1000,
    ended: Date.now() - 5 * 60 * 1000,
    device: {
      platform: 'android',
      device: deviceSamples[1].device.device
    }
  }
]

const platformList = ['web', 'ios', 'macos', 'android', 'windows', 'unknown']
const users = [
  { id: 'u1', name: 'Alex Johnson', colour: '#d3e4ff' },
  { id: 'u2', name: 'Priya Patel', colour: '#ffe5b4' },
  { id: 'u3', name: '李秀英', colour: '#f0d9ff' },
  { id: 'u4', name: 'Chris', picture: 'https://avatars.githubusercontent.com/u/1?v=4' },
  { id: 'u5', name: 'A B C D', colour: '#e0f7e9' }
]

const Section = ({ title, subtitle, children }) => (
  <section className='demo-section'>
    <h2>{title}</h2>
    {subtitle ? <p>{subtitle}</p> : null}
    <div className='demo-grid'>{children}</div>
  </section>
)

export default function KitchenSink () {
  const [codeStatus, setCodeStatus] = useState('Enter 654321 to simulate a successful validation.')
  const [lastConnection, setLastConnection] = useState('')
  const [recordingInfo, setRecordingInfo] = useState('')
  const [language, setLanguage] = useState(i18n.language || 'en-us')
  const [direction, setDirection] = useState('ltr')

  const languages = useMemo(() => {
    const resources = (i18n.options && i18n.options.resources) || {}
    return Object.keys(resources)
  }, [])

  useEffect(() => {
    const handleLanguageChanged = (lng) => setLanguage(lng)
    i18n.on('languageChanged', handleLanguageChanged)
    return () => i18n.off('languageChanged', handleLanguageChanged)
  }, [])

  useEffect(() => {
    const previousDir = document.documentElement.getAttribute('dir') || 'ltr'
    document.documentElement.setAttribute('dir', direction)
    return () => document.documentElement.setAttribute('dir', previousDir)
  }, [direction])

  const handleCode = useCallback(async (code) => {
    setCodeStatus(`Checking ${code}...`)
    await new Promise((resolve) => setTimeout(resolve, 700))
    const success = code === '654321'
    setCodeStatus(success ? 'Code accepted ✔︎' : 'Code rejected — try 654321 to see the success path.')
    return success
  }, [])

  const handleConnect = useCallback((device) => {
    const timestamp = new Date().toLocaleTimeString()
    setLastConnection(`${timestamp} • Triggered connect(${device.name || device.device.platform})`)
  }, [])

  const handleRecording = useCallback((session) => {
    const timestamp = new Date().toLocaleTimeString()
    setRecordingInfo(`${timestamp} • Open recording for session ${session.id}`)
  }, [])

  const handleLanguageChange = useCallback((event) => {
    const next = event.target.value
    i18n.changeLanguage(next)
    setLanguage(next)
  }, [])

  const toggleDirection = useCallback(() => {
    setDirection((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'))
  }, [])

  return (
    <>
      <header className='page-header'>
        <h1>Cobrowse Agent UI components</h1>
      </header>

      <section className='demo-section'>
        <div className='control-row'>
          <div className='language-picker'>
            <strong>Active language</strong>
            <select value={language} onChange={handleLanguageChange}>
              {languages.map((lng) => (
                <option key={lng} value={lng}>{lng}</option>
              ))}
            </select>
          </div>

          <button
            type='button'
            className='rtl-toggle'
            onClick={toggleDirection}
            aria-pressed={direction === 'rtl'}
          >
            <span className='rtl-toggle-dot' aria-hidden='true' />
            {direction === 'rtl' ? 'RTL layout on' : 'RTL layout off'}
          </button>
        </div>
        <p style={{ marginTop: '12px', color: '#616b83' }}>
          Relative timestamps inside the components update to match the selected locale.
        </p>
      </section>

      <Section
        title='CodeEntry'
        subtitle='Validates 6‑digit inputs, handles paste, and shows the validation animation.'
      >
        <div className='panel code-entry-area'>
          <CodeEntry onCode={handleCode} />
          <div className='code-hint'>{codeStatus}</div>
        </div>
      </Section>

      <Section
        title='PlatformIcon'
        subtitle='Icons adjust automatically based on the platform prop.'
      >
        <div className='platform-grid'>
          {platformList.map((platform) => (
            <div key={platform} className='platform-card'>
              <span>{platform}</span>
              <PlatformIcon platform={platform} />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title='Device + SmartConnectButton'
        subtitle='Devices highlight their online status and accept arbitrary children, such as SmartConnectButton.'
      >
        <div className='device-list'>
          {deviceSamples.map((device) => (
            <div key={device.id} className='device-card'>
              <header>
                <div>
                  <h3 className='device-name'>{device.name}</h3>
                  <div className='device-location'>{device.location}</div>
                </div>
                <span className='status-pill'>{device.online ? 'Online' : 'Offline'}</span>
              </header>
              <Device device={device}>
                <SmartConnectButton
                  device={device}
                  label={device.connectable ? 'Connect' : 'Unavailable'}
                  onClick={handleConnect}
                />
              </Device>
            </div>
          ))}
        </div>
        {lastConnection ? <div className='log'>{lastConnection}</div> : null}
      </Section>

      <Section
        title='Standalone SmartConnectButton states'
        subtitle='Demonstrates disabled vs. connectable styling outside of Device.'
      >
        <div className='button-row'>
          {deviceSamples.map((device) => (
            <SmartConnectButton
              key={`standalone-${device.id}`}
              device={device}
              label={device.connectable ? `Connect ${device.device.platform}` : 'Not connectable'}
              onClick={handleConnect}
            />
          ))}
        </div>
      </Section>

      <Section
        title='Session'
        subtitle='Shows active vs. recorded/ended sessions with Stopwatch durations.'
      >
        <div className='sessions'>
          {sessionSamples.map((session) => (
            <Session
              key={session.id}
              as={session.recorded ? 'button' : 'div'}
              session={session}
              className='panel'
              onClick={session.recorded ? handleRecording : undefined}
            />
          ))}
        </div>
        {recordingInfo ? <div className='log'>{recordingInfo}</div> : null}
      </Section>

      <Section
        title='UserIcon'
        subtitle='Initials fallback, custom colours, and pictures.'
      >
        <div className='user-grid'>
          {users.map((user) => (
            <div key={user.id} className='user-card'>
              <UserIcon user={user} />
              <div className='user-label'>
                <div className='user-name'>{user.name || 'Unnamed'}</div>
                <div className='user-meta'>
                  {user.picture ? 'Picture' : 'Initials'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
