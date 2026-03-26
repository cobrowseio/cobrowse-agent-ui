import type { ComponentProps } from 'react'
import {
  Trans as ReactI18nextTrans,
  useTranslation as useReactI18nextTranslation
} from 'react-i18next'
import i18n from './instance'

type TransProps = ComponentProps<typeof ReactI18nextTrans>

export const useTranslation = () => useReactI18nextTranslation(undefined, { i18n })

export const Trans = (props: TransProps) => (
  <ReactI18nextTrans i18n={i18n} {...props} />
)
