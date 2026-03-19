import BaseCodeEntry, { type CodeEntryProps as BaseCodeEntryProps } from '@/components/CodeEntry'
import clsx from 'clsx'
import { Trans, useTranslation } from '@/i18n'
import styles from './CodeEntry.module.css'

export interface CodeEntryProps extends BaseCodeEntryProps {
  helpText?: string
}

const CodeEntry = ({ helpText, className, ...props }: CodeEntryProps) => {
  const { t } = useTranslation()

  return (
    <div className={clsx(styles.root, className)}>
      <BaseCodeEntry label={<Trans><span className={styles.supportLabel}>Support </span>Code</Trans>} {...props} />
      <p>{helpText ?? t('Enter a support code, or connect to a device from the list below.')}</p>
    </div>
  )
}

export default CodeEntry
