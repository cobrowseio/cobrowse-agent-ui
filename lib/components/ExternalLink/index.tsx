import type { ReactNode } from 'react'
import IconExternalLink from '@/icons/external-link.svg?react'
import styles from './ExternalLink.module.css'

export interface ExternalLinkProps {
  href: string
  children?: ReactNode
}

const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <a className={styles.root} href={href} target="_blank" rel="noopener noreferrer">
    {children}
    <IconExternalLink />
  </a>
)

export default ExternalLink
