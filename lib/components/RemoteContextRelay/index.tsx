import { useEffect } from 'react'
import type { RemoteContext, RemoteContextRelayOptions } from 'cobrowse-agent-sdk'
import { useRemoteContext } from '@/components/Frame'
import useTrustedEmbeddingOrigins from '@/hooks/useTrustedEmbeddingOrigins'

export interface RemoteContextRelayProps {
  /**
   * When provided, relays to the given context. Otherwise,
   * it's resolved from the RemoteContextProvider.
   */
  remoteContext?: RemoteContext
  /**
   * Origins allowed to communicate with the attached context via the relay.
   * Nothing is relayed to or from any other origin. Defaults to the account's
   * trusted embedding domains (see useTrustedEmbeddingOrigins), which requires
   * the CobrowseProvider instance to be authorized. Pass a reference-stable
   * array, a new identity recreates the relay.
   */
  trustedOrigins?: RemoteContextRelayOptions['trustedOrigins']
  /** The window to relay to. Defaults to the opener or parent of the current window. */
  destination?: Window
}

/**
 * Relays the enclosing Frame's remote context to a host window, so a page
 * embedding this application in an iframe can attach its own context to that
 * iframe and use the full RemoteContext API. Must be rendered inside a Frame.
 *
 * ```tsx
 * <Frame src={sessionUrl}>
 *   <RemoteContextRelay trustedOrigins={['https://host.example.com']} />
 * </Frame>
 * ```
 */
const RemoteContextRelay = (props: RemoteContextRelayProps) => {
  const { remoteContext: providedRemoteContext, trustedOrigins, destination } = props
  const resolvedRemoteContext = useRemoteContext()
  const remoteContext = providedRemoteContext ?? resolvedRemoteContext
  const { origins: accountOrigins, error } = useTrustedEmbeddingOrigins()
  const resolvedOrigins = trustedOrigins ?? accountOrigins

  useEffect(() => {
    if (error && !trustedOrigins) {
      // eslint-disable-next-line no-console -- without this the relay silently never starts; there is no UI to surface the misconfiguration
      console.warn('RemoteContextRelay: failed to load the account trusted embedding domains, nothing will be relayed', error)
    }
  }, [error, trustedOrigins])

  useEffect(() => {
    if (!remoteContext) {
      return
    }

    if (!resolvedOrigins?.length) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- window.opener is typed as any but is a Window or null at runtime
    const opener = window.opener as Window | null
    const resolvedDestination = destination ?? opener ?? window.parent

    if (resolvedDestination === window) {
      return
    }

    const relay = remoteContext.relay(resolvedDestination, {
      trustedOrigins: resolvedOrigins,
    })

    return () => {
      relay.destroy()
    }
  }, [remoteContext, destination, resolvedOrigins])

  return null
}

export default RemoteContextRelay
